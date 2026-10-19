import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Shared engine for the annotated Flows/ stories.
 *
 * A live, fully interactive embed of a prototype story sits in a frame on the
 * left; annotations live in a panel on the right, each joined to the element it
 * describes by a dotted connector.
 *
 * The frame is the real story (same origin), so connectors are measured from
 * the actual DOM inside it and follow the element when the page scrolls or the
 * window resizes. To annotate another element, add an entry to a step's
 * `annotations` with a CSS selector for its target — nothing else changes.
 */

export type Annotation = {
  /** Letter shown on the badge, e.g. "A" */
  id: string;
  title: string;
  body: string;
  /** CSS selector of the element inside the frame this note points at */
  target: string;
  /** Optional ancestor of the target whose right edge the connector turns at,
   *  so the line runs through the gutter instead of across neighbouring content. */
  routeAround?: string;
};

export type FlowStep = {
  id: string;
  /** Path shown under the title: where the user is and what they do */
  description: string;
  /** Active when this returns true for the frame's document. The LAST matching
   *  step wins; a step without `when` is the starting state. */
  when?: (doc: Document) => boolean;
  annotations: Annotation[];
};

// The page renders at a desktop size, then scales down to fit the frame.
const SCREEN_W = 1440;
const SCREEN_H = 900;
const PANEL_W = 220;
const GAP = 16;

type Link = { box: { x: number; y: number; w: number; h: number }; path: string };

const CSS = `
.saf { min-height: 100vh; box-sizing: border-box; padding: 32px 32px 48px; background: var(--primitive-white, #fff); color: var(--text-primary); font-family: var(--font-sans); }
.saf__title { margin: 0 0 12px; font-size: 22px; line-height: 30px; font-weight: var(--fw-medium, 500); letter-spacing: 0.1px; }
.saf__desc { margin: 0 0 16px; font-size: var(--fs-sm); line-height: 20px; color: var(--text-primary); }
.saf__stage { position: relative; display: flex; align-items: flex-start; gap: ${GAP}px; }
.saf__frame-wrap { position: relative; flex: 0 0 auto; border-radius: 10px; overflow: hidden; background: var(--primitive-slate-3, #f0f0f3); box-shadow: 0 0 0 1px var(--border-default, #dcdce2), 0 8px 24px rgba(0,0,0,0.06); }
.saf__frame { position: absolute; top: 0; left: 0; width: ${SCREEN_W}px; height: ${SCREEN_H}px; border: 0; transform-origin: 0 0; background: var(--surface-page); }
.saf__panel { flex: 0 0 ${PANEL_W}px; width: ${PANEL_W}px; display: flex; flex-direction: column; gap: 12px; }
.saf__toggle { align-self: flex-start; padding: 0; border: 0; background: none; font: inherit; font-size: var(--fs-sm); font-weight: var(--fw-bold); color: var(--text-primary); cursor: pointer; }
.saf__toggle:hover { text-decoration: underline; text-underline-offset: 2px; }
.saf__note { position: relative; padding: 20px 20px 22px 24px; border-radius: 14px; background: var(--primitive-slate-4, #e8e8ec); cursor: default; transition: box-shadow .15s ease; }
.saf__note--active { box-shadow: 0 0 0 2px var(--primitive-slate-12, #1c2024); }
.saf__note-head { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: var(--fs-sm); font-weight: var(--fw-bold); }
.saf__badge { display: grid; place-items: center; flex: 0 0 auto; width: 18px; height: 18px; border-radius: 50%; background: var(--primitive-slate-12, #1c2024); color: #fff; font-size: 11px; font-weight: var(--fw-bold); line-height: 1; }
.saf__note-body { margin: 0; font-size: var(--fs-xs, 12px); line-height: 17px; color: var(--text-primary); }
.saf__overlay { position: absolute; inset: 0; pointer-events: none; overflow: visible; }
.saf__target { fill: none; stroke: var(--primitive-slate-12, #1c2024); stroke-width: 1.5; stroke-dasharray: 4 3; }
.saf__halo { fill: none; stroke: #fff; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; opacity: .75; }
.saf__line { fill: none; stroke: var(--primitive-slate-12, #1c2024); stroke-width: 1.25; stroke-dasharray: 1.5 2.5; stroke-linecap: round; }
.saf__overlay--active .saf__line { stroke-width: 2; }
.saf__dot { fill: var(--primitive-slate-12, #1c2024); }
`;

export function AnnotatedFlow({ title, steps, frameStory }: { title: string; steps: FlowStep[]; frameStory: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameWrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const noteRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [showNotes, setShowNotes] = useState(true);
  const [scale, setScale] = useState(0.7);
  const [links, setLinks] = useState<Record<string, Link>>({});
  const [active, setActive] = useState<string | null>(null);
  const [stepId, setStepId] = useState(steps[0].id);
  const step = steps.find((s) => s.id === stepId) ?? steps[0];

  // Fit the frame to the space left of the annotations panel.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      const available = stage.clientWidth - PANEL_W - GAP;
      setScale(Math.max(0.3, Math.min(1, available / SCREEN_W)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // Measure each target inside the frame and route a connector to its note.
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!stage || !frame || !doc || !doc.body) return;

    // Which step is the frame showing? (last match wins)
    let current = steps[0];
    for (const s of steps) if (!s.when || s.when(doc)) current = s;
    if (current.id !== stepId) {
      setStepId(current.id);
      return; // re-measure once the new step's notes have rendered
    }

    const stageRect = stage.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    const frameRight = frameRect.left - stageRect.left + SCREEN_W * scale;
    const frameBottom = frameRect.top - stageRect.top + SCREEN_H * scale;
    const next: Record<string, Link> = {};
    type Pending = { id: string; box: Link['box']; startX: number; startY: number; endX: number; endY: number; aroundRight: number | null };
    const pending: Pending[] = [];
    const frameTop = frameRect.top - stageRect.top;
    const pad = 3;

    for (const a of step.annotations) {
      const target = doc.querySelector<HTMLElement>(a.target);
      const note = noteRefs.current[a.id];
      if (!target || !note) continue;
      const r = target.getBoundingClientRect();
      if (r.width === 0) continue;
      // Hide the connector while something (e.g. a modal or dropdown) covers the target
      const hit = doc.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (!hit || !(target === hit || target.contains(hit))) continue;

      const box = {
        x: frameRect.left - stageRect.left + r.left * scale,
        y: frameRect.top - stageRect.top + r.top * scale,
        w: r.width * scale,
        h: r.height * scale,
      };
      // Skip targets scrolled out of the visible frame
      if (box.y + box.h < frameTop || box.y > frameBottom) continue;

      const n = note.getBoundingClientRect();
      const around = a.routeAround ? target.closest<HTMLElement>(a.routeAround) : null;
      pending.push({
        id: a.id,
        box: { x: box.x - pad, y: box.y - pad, w: box.w + pad * 2, h: box.h + pad * 2 },
        startX: box.x + box.w + pad,
        startY: box.y + box.h / 2,
        endX: n.left - stageRect.left,
        endY: n.top - stageRect.top + 30, // level with the badge row
        aroundRight: around ? frameRect.left - stageRect.left + around.getBoundingClientRect().right * scale : null,
      });
    }

    // Free-standing targets share one vertical lane just right of the widest
    // one, stepped per note so parallel connectors never overlap.
    const free = pending.filter((p) => p.aroundRight === null);
    const laneBase = free.length ? Math.max(...free.map((p) => p.startX)) : 0;
    const single = free.length === 1;

    pending.forEach((p) => {
      let elbowX: number;
      if (p.aroundRight !== null) {
        // Turn in the gutter just right of the target's container (e.g. its card)
        elbowX = Math.min(frameRight - 8, Math.max(p.startX + 12, p.aroundRight + 8 * scale));
      } else if (single) {
        elbowX = p.startX + Math.max(12, (frameRight - p.startX) * 0.5); // midway, as in the mockup
      } else {
        const i = free.indexOf(p);
        elbowX = Math.min(frameRight - 6, laneBase + 16 + i * 12);
      }
      next[p.id] = {
        box: p.box,
        path: `M ${p.startX} ${p.startY} H ${elbowX} V ${p.endY} H ${p.endX}`,
      };
    });

    setLinks((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [scale, step.annotations, steps, stepId]);

  // Keep connectors attached while the page inside the frame scrolls, resizes
  // or re-renders (e.g. filters, deleting a card).
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      measure();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [measure]);

  const frameH = Math.round(SCREEN_H * scale);
  const frameW = Math.round(SCREEN_W * scale);

  return (
    <div className="saf">
      <style>{CSS}</style>
      <h1 className="saf__title">{title}</h1>
      <p className="saf__desc" aria-live="polite">{step.description}</p>

      <div className="saf__stage" ref={stageRef}>
        <div className="saf__frame-wrap" ref={frameWrapRef} style={{ width: frameW, height: frameH }}>
          <iframe
            ref={frameRef}
            className="saf__frame"
            title={title}
            src={`iframe.html?id=${frameStory}&viewMode=story`}
            style={{ transform: `scale(${scale})` }}
          />
        </div>

        <aside className="saf__panel" aria-label="Annotations">
          <button type="button" className="saf__toggle" onClick={() => setShowNotes((v) => !v)} aria-pressed={!showNotes}>
            {showNotes ? 'Hide Annotations' : 'Show Annotations'}
          </button>
          {showNotes &&
            step.annotations.map((a) => (
              <div
                key={`${step.id}-${a.id}`}
                ref={(el) => { noteRefs.current[a.id] = el; }}
                className={`saf__note${active === a.id ? ' saf__note--active' : ''}`}
                onMouseEnter={() => setActive(a.id)}
                onMouseLeave={() => setActive(null)}
              >
                <div className="saf__note-head">
                  <span className="saf__badge">{a.id}</span>
                  {a.title}
                </div>
                <p className="saf__note-body">{a.body}</p>
              </div>
            ))}
        </aside>

        {showNotes && (
          <svg className="saf__overlay" aria-hidden="true">
            {step.annotations.map((a) => {
              const link = links[a.id];
              if (!link) return null;
              return (
                <g key={`${step.id}-${a.id}`} className={active === a.id ? 'saf__overlay--active' : undefined}>
                  <rect className="saf__target" x={link.box.x} y={link.box.y} width={link.box.w} height={link.box.h} rx={6} />
                  <path className="saf__halo" d={link.path} />
                  <path className="saf__line" d={link.path} />
                  <circle className="saf__dot" cx={link.box.x + link.box.w} cy={link.box.y + link.box.h / 2} r={2.5} />
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
