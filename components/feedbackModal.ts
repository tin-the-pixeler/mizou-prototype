// components/feedbackModal.ts
// Feedback page redesign — transcript panel + score overview + hard/soft skill
// breakdown. Supports two simulation formats:
//   'audiovideo' — three tabs (Overview / Hard / Soft) + compact audio player
//   'text'       — merged overview + skill breakdown, transcript has no player
//
// Timestamp links navigate the transcript to the matching message; if the
// transcript panel is hidden, clicking a timestamp opens it first, then scrolls.

import { iconEl } from '../icons';

// ---------- data model ----------

export interface TranscriptMessage {
  speaker: string;
  time: string;      // "00:01"
  seconds: number;   // used to match a timestamp
  text: string;
  learner?: boolean; // learner (evaluated) side — tinted bubble
}

export interface Topic { label: string; color: string; weight: number; }

export interface Criterion {
  title: string;
  passed: boolean;
  excerpt?: string;      // transcript quote (positive criteria only)
  time?: string;         // "01:03"
  seconds?: number;
}

export interface SkillGroup {
  name: string;
  score: number;
  open?: boolean;
  criteria: Criterion[];
}

export interface SoftMetric {
  title: string;
  desc: string;
  value: string;         // "30%", "181mpm"
  grade: 'good' | 'warn' | 'bad';
}

export type Grade = 'strong' | 'pass' | 'warn' | 'bad';

export interface FeedbackData {
  format: 'audiovideo' | 'text';
  title: string;
  submitted: string;
  status: string;
  learner: string;
  meta: { id: string; date: string; duration: string };
  overall: { score: number; grade: Grade; label: string; summary: string };
  hard: { score: number; grade: Grade; summary: string; groups: SkillGroup[] };
  soft: { score: number; grade: Grade; summary: string; metrics: SoftMetric[] };
  topics: Topic[];
  transcript: TranscriptMessage[];
}

type Tab = 'overview' | 'hard' | 'soft';

// ---------- helpers ----------

function el(tag: string, className?: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
}

const GRADE_STROKE: Record<Grade, string> = {
  strong: '#065f46',
  pass: 'var(--feedback-success)',
  warn: 'var(--feedback-warning)',
  bad: 'var(--feedback-error)',
};
const GRADE_TEXT: Record<Grade, string> = {
  strong: 'fbk-c-strong',
  pass: 'fbk-c-pass',
  warn: 'fbk-c-warn',
  bad: 'fbk-c-bad',
};
const GRADE_BADGE_BG: Record<Grade, string> = {
  strong: 'fbk-bg-pass',
  pass: 'fbk-bg-pass',
  warn: 'fbk-bg-warn',
  bad: 'fbk-bg-bad',
};

// donut chart — score arc over a track ring, value centered
function pie(score: number, grade: Grade, size = 148): HTMLElement {
  const wrap = el('div', 'fbk-pie');
  wrap.style.setProperty('--pie-size', `${size}px`);
  const stroke = GRADE_STROKE[grade];
  wrap.style.background =
    `conic-gradient(${stroke} ${score}%, var(--surface-sunken) ${score}% 100%)`;

  const inner = el('div', 'fbk-pie__inner');
  const val = el('div', 'fbk-pie__score', String(score));
  val.classList.add(GRADE_TEXT[grade]);
  inner.appendChild(val);
  inner.appendChild(el('div', 'fbk-pie__max', '/ 100'));
  wrap.appendChild(inner);
  return wrap;
}

function scoreBadge(score: number, grade: Grade, big = true): HTMLElement {
  const b = el('div', `fbk-score-badge ${GRADE_BADGE_BG[grade]}`, String(score));
  if (!big) b.style.fontSize = '22px';
  return b;
}

// ---------- transcript panel ----------

function buildTranscript(
  data: FeedbackData,
  onHide: () => void,
): { root: HTMLElement; scrollTo: (seconds: number) => void } {
  const root = el('aside', 'fbk-transcript');

  // header: "Transcript" label + hide toggle
  const head = el('div', 'fbk-transcript__head');
  head.appendChild(el('span', 'fbk-transcript__label', 'Transcript'));
  const hideBtn = el('button', 'fbk-toggle-btn');
  hideBtn.appendChild(iconEl('chevron-bar-left', 'sb-icon'));
  hideBtn.appendChild(el('span', undefined, 'Hide'));
  hideBtn.addEventListener('click', onHide);
  head.appendChild(hideBtn);
  root.appendChild(head);

  // compact audio player — audio/video sims only
  if (data.format === 'audiovideo') {
    const audio = el('div', 'fbk-audio');
    const speed = el('span', 'fbk-audio__speed', '1X');
    const speeds = ['1X', '1.5X', '2X', '0.5X'];
    let si = 0;
    speed.addEventListener('click', () => { si = (si + 1) % speeds.length; speed.textContent = speeds[si]; });
    const play = el('button', 'fbk-audio__play');
    play.appendChild(iconEl('play', 'sb-icon'));
    play.addEventListener('click', () => {
      const playing = play.classList.toggle('is-playing');
      play.innerHTML = '';
      play.appendChild(iconEl(playing ? 'stop' : 'play', 'sb-icon'));
    });
    const vol = el('span', 'fbk-audio__vol');
    vol.appendChild(iconEl('mic-fill', 'sb-icon'));
    const track = el('div', 'fbk-audio__track');
    track.appendChild(el('div', 'fbk-audio__fill'));
    audio.append(speed, play, vol, track);
    root.appendChild(audio);
  }

  // topics discussed legend
  const topics = el('div', 'fbk-topics');
  topics.appendChild(el('div', 'fbk-topics__label', 'Topics Discussed'));
  const bar = el('div', 'fbk-topics__bar');
  data.topics.forEach((t) => {
    const seg = el('div', 'fbk-topics__seg');
    seg.style.flex = String(t.weight);
    seg.style.background = t.color;
    bar.appendChild(seg);
  });
  topics.appendChild(bar);
  const legend = el('div', 'fbk-topics__legend');
  data.topics.forEach((t) => {
    const item = el('div', 'fbk-topics__item');
    const sw = el('span', 'fbk-topics__swatch');
    sw.style.background = t.color;
    item.appendChild(sw);
    item.appendChild(el('span', undefined, t.label));
    legend.appendChild(item);
  });
  topics.appendChild(legend);
  root.appendChild(topics);

  // messages
  const list = el('div', 'fbk-messages');
  const byTime: Record<number, HTMLElement> = {};
  data.transcript.forEach((m) => {
    const msg = el('div', `fbk-msg${m.learner ? ' fbk-msg--learner' : ''}`);
    const mhead = el('div', 'fbk-msg__head');
    mhead.appendChild(el('span', 'fbk-msg__name', m.speaker));
    mhead.appendChild(el('span', 'fbk-msg__time', m.time));
    msg.appendChild(mhead);
    msg.appendChild(el('div', 'fbk-msg__text', m.text));
    list.appendChild(msg);
    byTime[m.seconds] = msg;
  });
  root.appendChild(list);

  // scroll+highlight the message nearest a given time
  const scrollTo = (seconds: number) => {
    let best: HTMLElement | null = null;
    let bestDelta = Infinity;
    data.transcript.forEach((m) => {
      const d = Math.abs(m.seconds - seconds);
      if (m.seconds <= seconds + 1 && d < bestDelta) { bestDelta = d; best = byTime[m.seconds]; }
    });
    if (!best) return;
    const target = best as HTMLElement;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('is-highlight');
    setTimeout(() => target.classList.remove('is-highlight'), 1600);
  };

  return { root, scrollTo };
}

// ---------- criterion card ----------

function critCard(c: Criterion, onSeek: (s: number) => void): HTMLElement {
  const card = el('div', `fbk-crit ${c.passed ? 'fbk-crit--pass' : 'fbk-crit--fail'}`);
  const main = el('div', 'fbk-crit__main');
  main.appendChild(el('div', 'fbk-crit__title', c.title));

  if (c.passed && c.excerpt) {
    main.appendChild(el('div', 'fbk-crit__excerpt', c.excerpt));
  }
  if (c.passed && c.time != null) {
    const link = el('div', 'fbk-crit__viewlink');
    link.appendChild(el('span', undefined, 'View in transcript'));
    const ts = el('span', 'fbk-timestamp');
    ts.appendChild(el('span', undefined, c.time));
    ts.appendChild(iconEl('play', 'sb-icon'));
    link.appendChild(ts);
    link.addEventListener('click', () => onSeek(c.seconds ?? 0));
    main.appendChild(link);
  }

  card.appendChild(main);
  const status = el('div', 'fbk-crit__status');
  status.appendChild(el('span', 'fbk-crit__badge', c.passed ? '✓' : '✕'));
  card.appendChild(status);
  return card;
}

// ---------- skill breakdown (hard skills / text merged) ----------

function skillBreakdown(
  groups: SkillGroup[],
  onSeek: (s: number) => void,
): HTMLElement {
  const wrap = el('div', 'fbk-skill-groups');
  groups.forEach((g) => {
    const group = el('div', `fbk-skill-group${g.open ? ' is-open' : ''}`);
    const headBtn = el('button', 'fbk-skill-group__head');
    const chev = el('span', 'fbk-skill-group__chevron');
    chev.appendChild(iconEl('chevron-down-sm', 'sb-icon'));
    headBtn.appendChild(chev);
    headBtn.appendChild(el('span', 'fbk-skill-group__name', g.name));
    const score = el('span', `fbk-skill-group__score ${GRADE_TEXT[gradeFor(g.score)]}`, String(g.score));
    headBtn.appendChild(score);
    headBtn.addEventListener('click', () => group.classList.toggle('is-open'));
    group.appendChild(headBtn);

    const body = el('div', 'fbk-skill-group__body');
    g.criteria.forEach((c) => body.appendChild(critCard(c, onSeek)));
    group.appendChild(body);
    wrap.appendChild(group);
  });
  return wrap;
}

function gradeFor(score: number): Grade {
  if (score >= 85) return 'strong';
  if (score >= 70) return 'pass';
  if (score >= 50) return 'warn';
  return 'bad';
}

// ---------- tab panels ----------

function overviewPanel(
  data: FeedbackData,
  goTo: (t: Tab) => void,
): HTMLElement {
  const panel = el('div', 'fbk-overview');
  panel.appendChild(el('div', 'fbk-overview__grade', data.overall.label));
  panel.appendChild(pie(data.overall.score, data.overall.grade));
  panel.appendChild(el('p', 'fbk-summary', data.overall.summary));

  const cards = el('div', 'fbk-score-cards');
  const mk = (title: string, score: number, grade: Grade, tab: Tab) => {
    const card = el('button', 'fbk-score-card');
    const left = el('div');
    left.appendChild(el('div', 'fbk-score-card__title', title));
    const link = el('div', 'fbk-score-card__link');
    link.appendChild(el('span', undefined, 'View more'));
    link.appendChild(iconEl('chevron-right-sm', 'sb-icon'));
    left.appendChild(link);
    card.appendChild(left);
    card.appendChild(scoreBadge(score, grade));
    card.addEventListener('click', () => goTo(tab));
    return card;
  };
  cards.appendChild(mk('Hard Skills', data.hard.score, data.hard.grade, 'hard'));
  cards.appendChild(mk('Soft Skills', data.soft.score, data.soft.grade, 'soft'));
  panel.appendChild(cards);
  return panel;
}

function hardPanel(data: FeedbackData, onSeek: (s: number) => void): HTMLElement {
  const panel = el('div', 'fbk-hard');
  const header = el('div', 'fbk-skill-header');
  const body = el('div', 'fbk-skill-header__body');
  body.appendChild(el('h2', 'fbk-skill-header__title', 'Hard Skills'));
  body.appendChild(el('p', 'fbk-skill-header__summary', data.hard.summary));
  header.appendChild(body);
  header.appendChild(scoreBadge(data.hard.score, data.hard.grade));
  panel.appendChild(header);

  panel.appendChild(el('div', 'fbk-section-label', 'Skill Breakdown'));
  panel.appendChild(skillBreakdown(data.hard.groups, onSeek));
  return panel;
}

function softPanel(data: FeedbackData): HTMLElement {
  const panel = el('div', 'fbk-soft');
  const header = el('div', 'fbk-skill-header');
  const body = el('div', 'fbk-skill-header__body');
  body.appendChild(el('h2', 'fbk-skill-header__title', 'Soft Skills'));
  body.appendChild(el('p', 'fbk-skill-header__summary', data.soft.summary));
  header.appendChild(body);
  header.appendChild(scoreBadge(data.soft.score, data.soft.grade));
  panel.appendChild(header);

  // criteria rendered directly — no enclosing container card
  const list = el('div', 'fbk-soft-list');
  data.soft.metrics.forEach((m) => {
    const row = el('div', `fbk-metric fbk-metric--${m.grade}`);
    const main = el('div', 'fbk-metric__main');
    main.appendChild(el('div', 'fbk-metric__title', m.title));
    main.appendChild(el('div', 'fbk-metric__desc', m.desc));
    row.appendChild(main);
    row.appendChild(el('div', 'fbk-metric__value', m.value));
    list.appendChild(row);
  });
  panel.appendChild(list);
  return panel;
}

// merged overview + skill breakdown (text chatbot)
function mergedPanel(data: FeedbackData, onSeek: (s: number) => void): HTMLElement {
  const panel = el('div', 'fbk-merged');
  const ov = el('div', 'fbk-overview');
  ov.appendChild(el('div', 'fbk-overview__grade', data.overall.label));
  ov.appendChild(pie(data.overall.score, data.overall.grade));
  ov.appendChild(el('p', 'fbk-summary', data.overall.summary));
  panel.appendChild(ov);

  panel.appendChild(el('div', 'fbk-section-label', 'Skill Breakdown'));
  panel.appendChild(skillBreakdown(data.hard.groups, onSeek));
  return panel;
}

// ---------- root factory ----------

export function createFeedbackModal(data: FeedbackData): HTMLElement {
  const overlay = el('div', 'fbk-overlay');
  const modal = el('div', 'fbk-modal');

  // --- top bar ---
  const topbar = el('div', 'fbk-topbar');
  topbar.appendChild(el('h1', 'fbk-topbar__title', data.title));
  topbar.appendChild(el('div', 'fbk-topbar__spacer'));
  topbar.appendChild(el('span', 'fbk-topbar__submitted', data.submitted));
  const chip = el('span', 'fbk-status-chip');
  chip.appendChild(el('span', undefined, data.status));
  chip.appendChild(el('span', 'fbk-status-chip__dot', '✓'));
  topbar.appendChild(chip);
  const close = el('button', 'fbk-close-btn', '✕');
  topbar.appendChild(close);
  modal.appendChild(topbar);

  // --- meta bar ---
  const metabar = el('div', 'fbk-metabar');
  metabar.appendChild(el('span', 'fbk-metabar__avatar', data.learner.charAt(0)));
  metabar.appendChild(el('span', 'fbk-metabar__name', data.learner));
  metabar.appendChild(el('span', 'fbk-metabar__divider'));
  const meta = el('div', 'fbk-metabar__meta');
  const metaItem = (icon: Parameters<typeof iconEl>[0], text: string, link = false) => {
    const it = el('span', `fbk-meta-item${link ? ' fbk-meta-item--link' : ''}`);
    it.appendChild(iconEl(icon, 'sb-icon'));
    it.appendChild(el('span', undefined, text));
    return it;
  };
  meta.appendChild(metaItem('feedback', data.meta.id));
  meta.appendChild(metaItem('session-list', data.meta.date));
  meta.appendChild(metaItem('hourglass', data.meta.duration));
  meta.appendChild(metaItem('arrow-up', 'Export', true));
  metabar.appendChild(meta);
  const nav = el('div', 'fbk-nav-group');
  const prev = el('button', 'fbk-nav-btn');
  prev.appendChild(iconEl('chevron-left-sm', 'sb-icon'));
  prev.appendChild(el('span', undefined, 'Prev'));
  const next = el('button', 'fbk-nav-btn');
  next.appendChild(el('span', undefined, 'Next'));
  next.appendChild(iconEl('chevron-right-sm', 'sb-icon'));
  nav.append(prev, next);
  metabar.appendChild(nav);
  modal.appendChild(metabar);

  // --- body: transcript + content ---
  const body = el('div', 'fbk-body');
  const content = el('div', 'fbk-body__content');

  let transcriptVisible = true;
  let transcript = buildTranscript(data, () => setTranscript(false));
  let activeTab: Tab = 'overview';

  const onSeek = (seconds: number) => {
    // Opening the panel rebuilds + inserts the transcript synchronously, so we
    // can scroll straight away — no need to wait for a frame.
    if (!transcriptVisible) setTranscript(true);
    transcript.scrollTo(seconds);
  };

  function setTranscript(visible: boolean) {
    transcriptVisible = visible;
    if (visible) {
      transcript = buildTranscript(data, () => setTranscript(false));
      body.prepend(transcript.root);
    } else if (transcript.root.parentElement) {
      transcript.root.remove();
    }
    renderContent();
  }

  function renderContent() {
    content.innerHTML = '';

    // "Show transcript" pill when hidden
    if (!transcriptVisible) {
      const showBtn = el('button', 'fbk-show-transcript');
      showBtn.appendChild(iconEl('chevron-bar-right', 'sb-icon'));
      showBtn.appendChild(el('span', undefined, 'Transcript'));
      showBtn.addEventListener('click', () => setTranscript(true));
      content.appendChild(showBtn);
    }

    if (data.format === 'text') {
      // merged overview + breakdown, no tabs
      content.appendChild(mergedPanel(data, onSeek));
      return;
    }

    // tabs
    const tabs = el('div', 'fbk-tabs');
    const defs: { key: Tab; label: string }[] = [
      { key: 'overview', label: 'Overview' },
      { key: 'hard', label: 'Hard Skills' },
      { key: 'soft', label: 'Soft Skills' },
    ];
    defs.forEach((d) => {
      const t = el('button', `fbk-tab${activeTab === d.key ? ' is-active' : ''}`, d.label);
      t.addEventListener('click', () => { activeTab = d.key; renderContent(); });
      tabs.appendChild(t);
    });
    content.appendChild(tabs);

    if (activeTab === 'overview') {
      content.appendChild(overviewPanel(data, (tab) => { activeTab = tab; renderContent(); }));
    } else if (activeTab === 'hard') {
      content.appendChild(hardPanel(data, onSeek));
    } else {
      content.appendChild(softPanel(data));
    }
  }

  body.appendChild(transcript.root);
  body.appendChild(content);
  renderContent();
  modal.appendChild(body);

  overlay.appendChild(modal);
  return overlay;
}
