// components/slideDeck.ts
// Demo deck for the Slides feature ("Effective Communication in Tech Teams").
// Slides are authored in container-query units (cqw), so one slide renders
// crisply at any size: thumbnail, preview, or fullscreen.

export const DECK_TITLE = 'Effective Communication in Tech Teams';

export type DeckSlide = {
  id: string;
  /** Builds a fresh slide element (call once per place it is shown) */
  render: () => HTMLElement;
  /** Notes the "Generate" button writes into the speaker-notes field */
  generatedNotes: string;
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function shell(variant: string): { slide: HTMLElement; inner: HTMLElement } {
  const slide = el('div', `slide slide--${variant}`);
  const inner = el('div', 'slide__inner');
  slide.appendChild(inner);
  return { slide, inner };
}

function header(label: string): HTMLElement {
  const wrap = el('div', 'slide__header');
  wrap.append(el('span', 'slide__label', label), el('span', 'slide__rule'));
  return wrap;
}

function footer(): HTMLElement {
  const wrap = el('div', 'slide__footer');
  wrap.append(el('span', 'slide__footer-pill slide__footer-pill--solid', 'Next'), el('span', 'slide__footer-pill', 'Notes'));
  return wrap;
}

function titleSlide(): HTMLElement {
  const { slide, inner } = shell('title');
  const display = el('h2', 'slide__display');
  for (const line of ['Effective', 'Communication', 'in Tech Teams']) {
    display.appendChild(el('span', 'slide__display-line', line));
  }
  inner.append(el('span', 'slide__pill', 'DIV - MAY 2025'), display, el('span', 'slide__tag', 'Derrick Tsorme'));
  return slide;
}

function toolsSlide(): HTMLElement {
  const { slide, inner } = shell('tools');
  inner.appendChild(header('TOOLS & CHANNELS'));
  const center = el('div', 'slide__center');
  center.append(
    el('h3', 'slide__heading slide__heading--center', 'Where the conversation happens'),
    el('p', 'slide__sub', 'Pick the right channel for the message, not the one that is open.'),
  );
  const chips = el('div', 'slide__chips');
  for (const [label, tone] of [
    ['Slack', 'yellow'],
    ['Zoom', 'outline'],
    ['Email', 'outline'],
    ['Notion', 'dark'],
    ['Linear', 'yellow'],
    ['1:1s', 'outline'],
  ]) {
    chips.appendChild(el('span', `slide__chip slide__chip--${tone}`, label));
  }
  center.appendChild(chips);
  inner.append(center, footer());
  return slide;
}

function costSlide(): HTMLElement {
  const { slide, inner } = shell('cost');
  inner.append(header('THE PROBLEM'), el('h3', 'slide__heading', 'The Cost of Miscommunication.'), footer());
  return slide;
}

function goalsSlide(): HTMLElement {
  const { slide, inner } = shell('goals');
  inner.append(header('BEST PRACTICES'), el('h3', 'slide__heading', 'By the end of the session, we should:'));
  const track = el('div', 'slide__track');
  const goals = [
    'Understand key principles of clear written and digital communication',
    'Learn strategies for effective asynchronous communication',
    'Develop skills in giving and receiving constructive feedback',
    'Participate in practical exercises to apply these skills',
  ];
  for (const goal of goals) {
    const item = el('div', 'slide__goal');
    item.append(el('span', 'slide__goal-dot'), el('p', 'slide__goal-card', goal));
    track.appendChild(item);
  }
  inner.append(track, footer());
  return slide;
}

export const DECK: DeckSlide[] = [
  {
    id: 'title',
    render: titleSlide,
    generatedNotes:
      'Welcome everyone. This session is about communicating with clarity inside your team, so we spend less time re-explaining and more time shipping.',
  },
  {
    id: 'tools',
    render: toolsSlide,
    generatedNotes:
      'Walk through each channel and when to use it. Rule of thumb: Slack for quick questions, Notion for decisions, a call when it is getting emotional.',
  },
  {
    id: 'cost',
    render: costSlide,
    generatedNotes:
      'Ask the room for a time a vague message cost them a day. Then connect it to the cost: rework, missed deadlines, and lower trust in the team.',
  },
  {
    id: 'goals',
    render: goalsSlide,
    generatedNotes:
      'Read the four goals aloud. Tell people the last one is the point: we will practice, not just listen.',
  },
];
