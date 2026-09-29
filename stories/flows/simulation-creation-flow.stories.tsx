import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

/**
 * Annotated user flow: Create a simulation.
 *
 * Every screen is a live embed of an existing story, so the flow can't drift
 * from the real UI. To add or change a step, edit the STEPS array below —
 * nothing else needs to change. Pin positions are % of the screen (x, y),
 * measured against the 1280x800 render.
 */

type NoteKind = 'note' | 'question' | 'risk';

type Note = {
  kind: NoteKind;
  text: string;
  /** Pin position on the screen, as % of width / height (centre of the pin). */
  pin: { x: number; y: number };
};

type Step = {
  id: string;
  label: string;
  goal: string;
  /** Storybook story id, e.g. "pages-sessions--sessions-page". */
  storyId: string;
  /** Label on the arrow leading to the next step. Ignored on the last step. */
  action?: string;
  notes: Note[];
};

const STEPS: Step[] = [
  {
    id: 'landing',
    label: 'Landing prompt',
    goal: 'Visitor describes the simulation they want.',
    storyId: 'components-input-field-landing-page--populated',
    action: 'Submit prompt',
    notes: [
      {
        kind: 'risk',
        text: 'The prompt and any URL params must survive signup / login, or the visitor loses their work.',
        pin: { x: 67.5, y: 5 },
      },
      {
        kind: 'note',
        text: 'File upload can start here, before the builder opens.',
        pin: { x: 3.4, y: 19 },
      },
    ],
  },
  {
    id: 'builder-plan',
    label: 'Builder: plan',
    goal: 'Review the proposed plan before anything is generated.',
    storyId: 'pages-simulation-builder--plan-overview',
    action: 'Confirm and generate',
    notes: [
      {
        kind: 'note',
        text: 'Speed to AHA: fill the plan with smart assumptions instead of asking the user questions first.',
        pin: { x: 34.6, y: 37 },
      },
      {
        kind: 'question',
        text: 'Is there a validation gate before generation? What blocks a low-quality prompt?',
        pin: { x: 82.6, y: 59 },
      },
    ],
  },
  {
    id: 'builder-create',
    label: 'Builder: create',
    goal: 'Inspect and refine the generated simulation.',
    storyId: 'pages-simulation-builder--create-artifact',
    action: 'Open sessions',
    notes: [
      {
        kind: 'note',
        text: 'Artifact tabs. Today: Preview, Persona, Scorecard, Sources. Target: Scenario, Persona, Scorecard, Listing Details.',
        pin: { x: 66.3, y: 10.3 },
      },
      {
        kind: 'note',
        text: 'Edits made through chat skip validation.',
        pin: { x: 49.5, y: 87.5 },
      },
    ],
  },
  {
    id: 'sessions',
    label: 'Sessions',
    goal: 'See how learners are doing on the simulation.',
    storyId: 'pages-sessions--sessions-page',
    notes: [
      {
        kind: 'note',
        text: 'Filters: type, learner, simulation and progress, plus search.',
        pin: { x: 66.2, y: 14.8 },
      },
      {
        kind: 'question',
        text: 'Clicking a row opens the feedback drawer. Should the drawer deep-link to a session?',
        pin: { x: 47.5, y: 26.6 },
      },
    ],
  },
];

const KIND_LABEL: Record<NoteKind, string> = {
  note: 'Note',
  question: 'Question',
  risk: 'Risk',
};

const SCREEN_W = 1280;
const SCREEN_H = 800;
const SCALE = 0.36;
const VIEW_W = Math.round(SCREEN_W * SCALE);
const VIEW_H = Math.round(SCREEN_H * SCALE);

const CSS = `
.flow { --flow-note: var(--primitive-indigo-base); --flow-question: var(--primitive-amber-dark); --flow-risk: var(--primitive-rose-base);
  min-height: 100vh; box-sizing: border-box; padding: 32px 0 48px; background: var(--surface-page); color: var(--text-primary); font-family: var(--font-sans); }
.flow__head { padding: 0 32px 24px; }
.flow__title { margin: 0 0 12px; font-size: var(--fs-2xl); font-weight: var(--fw-bold); }
.flow__legend { display: flex; flex-wrap: wrap; gap: 16px; font-size: var(--fs-sm); color: var(--text-secondary); }
.flow__legend-item { display: inline-flex; align-items: center; gap: 6px; }
.flow__row { display: flex; align-items: flex-start; gap: 0; overflow-x: auto; padding: 8px 32px 24px; }
.flow__row::after { content: ''; flex: 0 0 32px; }
.flow__step { flex: 0 0 ${VIEW_W}px; width: ${VIEW_W}px; }
.flow__step-head { display: flex; align-items: center; gap: 8px; font-weight: var(--fw-bold); font-size: var(--fs-md); }
.flow__step-num { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: var(--text-primary); color: var(--text-inverse); font-size: var(--fs-sm); }
.flow__goal { margin: 4px 0 12px; font-size: var(--fs-sm); color: var(--text-secondary); }
.flow__screen { position: relative; width: ${VIEW_W}px; height: ${VIEW_H}px; border: 1px solid var(--border-divider); border-radius: 8px; overflow: hidden; background: var(--surface-raised); }
.flow__frame { position: absolute; top: 0; left: 0; width: ${SCREEN_W}px; height: ${SCREEN_H}px; border: 0; transform: scale(${SCALE}); transform-origin: 0 0; pointer-events: none; }
.flow__pin { position: absolute; transform: translate(-50%, -50%); display: grid; place-items: center; width: 20px; height: 20px; padding: 0; border: 2px solid var(--primitive-white); border-radius: 50%; color: var(--primitive-white); font: var(--fw-bold) 11px/1 var(--font-sans); cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.35); transition: transform .12s ease, box-shadow .12s ease; }
.flow__pin--active { transform: translate(-50%, -50%) scale(1.35); box-shadow: 0 0 0 4px rgba(79,70,229,.25), 0 1px 4px rgba(0,0,0,.35); z-index: 2; }
.flow__notes { margin: 12px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.flow__note { display: flex; gap: 8px; align-items: flex-start; width: 100%; box-sizing: border-box; padding: 8px 10px; text-align: left; font: inherit; font-size: var(--fs-sm); line-height: 18px; color: var(--text-primary); background: var(--surface-emphasis); border: 1px solid var(--border-default); border-left-width: 4px; border-radius: 6px; cursor: pointer; }
.flow__note--active { background: var(--surface-overlay); box-shadow: 0 0 0 2px var(--primitive-slate-12); }
.flow__note-kind { display: block; font-size: var(--fs-xs); font-weight: var(--fw-bold); text-transform: uppercase; letter-spacing: .04em; }
.flow__note-num { flex: 0 0 auto; display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; color: var(--primitive-white); font-size: var(--fs-xs); font-weight: var(--fw-bold); }
.flow__arrow { flex: 0 0 120px; align-self: flex-start; margin-top: ${Math.round(VIEW_H / 2) + 60}px; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 0 8px; box-sizing: border-box; font-size: var(--fs-xs); font-weight: var(--fw-medium); color: var(--text-secondary); text-align: center; }
.flow__arrow-line { position: relative; width: 100%; height: 2px; background: var(--primitive-slate-8); }
.flow__arrow-line::after { content: ''; position: absolute; right: -1px; top: -4px; border-left: 8px solid var(--primitive-slate-8); border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
`;

const kindVar = (kind: NoteKind) => `var(--flow-${kind})`;

function Legend() {
  return (
    <div className="flow__legend">
      {(Object.keys(KIND_LABEL) as NoteKind[]).map((kind) => (
        <span key={kind} className="flow__legend-item">
          <span className="flow__note-num" style={{ background: kindVar(kind), width: 12, height: 12 }} />
          {KIND_LABEL[kind]}
        </span>
      ))}
    </div>
  );
}

function AnnotatedFlow() {
  const [active, setActive] = useState<string | null>(null);
  const toggle = (key: string) => setActive((cur) => (cur === key ? null : key));

  return (
    <div className="flow">
      <style>{CSS}</style>
      <header className="flow__head">
        <h1 className="flow__title">Create a simulation</h1>
        <Legend />
      </header>
      <div className="flow__row">
        {STEPS.map((step, si) => (
          <React.Fragment key={step.id}>
            <section className="flow__step" aria-label={step.label}>
              <div className="flow__step-head">
                <span className="flow__step-num">{si + 1}</span>
                {step.label}
              </div>
              <p className="flow__goal">{step.goal}</p>
              <div className="flow__screen">
                <iframe
                  className="flow__frame"
                  title={step.label}
                  src={`iframe.html?id=${step.storyId}&viewMode=story`}
                  tabIndex={-1}
                />
                {step.notes.map((note, ni) => {
                  const key = `${step.id}:${ni}`;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-label={`Note ${ni + 1}`}
                      className={`flow__pin${active === key ? ' flow__pin--active' : ''}`}
                      style={{ left: `${note.pin.x}%`, top: `${note.pin.y}%`, background: kindVar(note.kind) }}
                      onClick={() => toggle(key)}
                    >
                      {ni + 1}
                    </button>
                  );
                })}
              </div>
              <ul className="flow__notes">
                {step.notes.map((note, ni) => {
                  const key = `${step.id}:${ni}`;
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        className={`flow__note${active === key ? ' flow__note--active' : ''}`}
                        style={{ borderLeftColor: kindVar(note.kind) }}
                        onClick={() => toggle(key)}
                      >
                        <span className="flow__note-num" style={{ background: kindVar(note.kind) }}>{ni + 1}</span>
                        <span>
                          <span className="flow__note-kind" style={{ color: kindVar(note.kind) }}>{KIND_LABEL[note.kind]}</span>
                          {note.text}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
            {si < STEPS.length - 1 && (
              <div className="flow__arrow" aria-hidden="true">
                <span>{step.action}</span>
                <span className="flow__arrow-line" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Flows/Create a simulation',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Annotated: Story = {
  name: 'Annotated',
  render: () => <AnnotatedFlow />,
};
