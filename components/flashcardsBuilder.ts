// components/flashcardsBuilder.ts
// Interactive prototype: create a flashcard set through chat. Mirrors the Slides builder.
//   home      Format picker (Flashcards) + prompt, ready to send
//   building  Chat shows "Thinking...", artifact panel shows "Building in progress"
//   ready     Assistant reply + flashcard set in the artifact panel (card list, flip preview, edit)
// The AI is scripted: whatever is sent, the demo set comes back.
// `data-stage` on the root reflects the current stage (used by Flows/ annotations).

import { iconEl } from '../icons';
import { createChatPanelHeader } from './chatPanelHeader';
import { createInputFieldChatThread } from './inputFieldChatThread';
import { createUserMessage } from './userMessage';
import { createMizouMessage } from './mizouMessage';
import { createButton } from './button';
import { createButtonIcon } from './buttonIcon';
import { createHome, createBuildingView, bulbLine, div, DEMO_PROMPTS } from './slidesBuilder';
import { FLASHCARDS, FLASHCARD_SET_TITLE, type Flashcard } from './flashcardDeck';

export type FlashcardsBuilderStage = 'home' | 'building' | 'ready';

export type FlashcardsBuilderOptions = {
  /** Where the prototype starts (default: home) */
  stage?: FlashcardsBuilderStage;
};

const DEMO_PROMPT = DEMO_PROMPTS.flashcards!;
const THINK_MS = 2800;
const BUILD_MS = 4200;

const REPLY_HTML = `
<p>Got it! I've created a set of ${FLASHCARDS.length} flashcards on ${FLASHCARD_SET_TITLE}.</p>
<p><strong>Cards 1–2:</strong> Channels – async vs. real-time and how to pick the right one</p>
<p><strong>Cards 3–4:</strong> Clarity – writing with BLUF and the cost of miscommunication</p>
<p><strong>Cards 5–8:</strong> Habits – constructive feedback, confirming understanding, clear writing and active listening</p>
<p>Each card has a question on the front and a short answer on the back. Click a card to flip it, or edit the text right below the preview. If you'd like more cards, a different difficulty or a different tone, just tell me and I'll update the set!</p>`;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function createCardFace(side: 'front' | 'back', text: string): HTMLElement {
  const face = div(`fc-card__face fc-card__face--${side}`);
  face.append(el('span', 'fc-card__side', side === 'front' ? 'Question' : 'Answer'), el('p', 'fc-card__text', text));
  return face;
}

function createField(label: string, value: string, onInput: (v: string) => void, dataId: string): { wrap: HTMLElement; input: HTMLTextAreaElement } {
  const wrap = div('fc-deck__field');
  wrap.dataset.id = dataId;
  wrap.appendChild(el('label', 'fc-deck__field-label', label));
  const input = document.createElement('textarea');
  input.className = 'fc-deck__field-input';
  input.rows = 2;
  input.value = value;
  input.addEventListener('input', () => onInput(input.value));
  wrap.appendChild(input);
  return { wrap, input };
}

function createDeckView(): HTMLElement {
  const cards: Flashcard[] = FLASHCARDS.map((c) => ({ ...c }));
  let active = 0;
  let flipped = false;

  const deck = div('fc-deck');
  deck.dataset.id = 'deck';

  // ----- Card list -----
  const list = div('fc-deck__list');
  list.dataset.id = 'card-list';
  const items: HTMLButtonElement[] = [];

  // ----- Main -----
  const main = div('fc-deck__main');
  const head = div('fc-deck__head');
  const heading = el('h3', 'fc-deck__title', FLASHCARD_SET_TITLE);
  const count = el('span', 'fc-deck__count', `${cards.length} cards`);
  const titleWrap = div('fc-deck__title-wrap');
  titleWrap.append(heading, count);
  const actions = div('fc-deck__actions');
  const linkBtn = createButtonIcon({ icon: 'link' as never, action: 'tertiary', size: 'xs', label: 'Copy flashcards URL' });
  const exportBtn = createButtonIcon({ icon: 'external-link' as never, action: 'tertiary', size: 'xs', label: 'Export' });
  linkBtn.dataset.id = 'url-button';
  exportBtn.dataset.id = 'export-button';
  actions.append(linkBtn, exportBtn);
  head.append(titleWrap, actions);

  const stage = div('fc-deck__stage');
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'fc-card';
  card.dataset.id = 'flashcard';
  card.setAttribute('aria-label', 'Flip card');
  const cardInner = div('fc-card__inner');
  card.appendChild(cardInner);
  stage.appendChild(card);

  const nav = div('fc-deck__nav');
  nav.dataset.id = 'card-nav';
  const prev = createButtonIcon({ icon: 'chevron-left-sm' as never, action: 'tertiary', size: 'xs', label: 'Previous card' });
  const next = createButtonIcon({ icon: 'chevron-right-sm' as never, action: 'tertiary', size: 'xs', label: 'Next card' });
  const progress = el('span', 'fc-deck__progress');
  const hint = el('span', 'fc-deck__hint', 'Click the card to flip');
  nav.append(prev, progress, next, hint);

  const edit = div('fc-deck__edit');
  edit.dataset.id = 'card-edit';
  const front = createField('Front', '', (v) => {
    cards[active].front = v;
    renderCard();
    renderItem(active);
  }, 'edit-front');
  const back = createField('Back', '', (v) => {
    cards[active].back = v;
    renderCard();
  }, 'edit-back');
  edit.append(front.wrap, back.wrap);

  const renderCard = () => {
    cardInner.replaceChildren(createCardFace('front', cards[active].front), createCardFace('back', cards[active].back));
    card.classList.toggle('is-flipped', flipped);
  };
  const renderItem = (i: number) => {
    const num = el('span', 'fc-deck__item-num', String(i + 1));
    const text = el('span', 'fc-deck__item-text', cards[i].front);
    items[i].replaceChildren(num, text);
  };
  const select = (index: number) => {
    active = Math.max(0, Math.min(cards.length - 1, index));
    flipped = false;
    items.forEach((b, i) => b.classList.toggle('is-active', i === active));
    items[active].scrollIntoView({ block: 'nearest' });
    front.input.value = cards[active].front;
    back.input.value = cards[active].back;
    progress.textContent = `${active + 1} / ${cards.length}`;
    prev.toggleAttribute('disabled', active === 0);
    next.toggleAttribute('disabled', active === cards.length - 1);
    renderCard();
  };

  cards.forEach((_, i) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'fc-deck__item';
    item.dataset.index = String(i);
    item.addEventListener('click', () => select(i));
    list.appendChild(item);
    items.push(item);
    renderItem(i);
  });

  card.addEventListener('click', () => {
    flipped = !flipped;
    card.classList.toggle('is-flipped', flipped);
  });
  prev.addEventListener('click', () => select(active - 1));
  next.addEventListener('click', () => select(active + 1));

  main.append(head, stage, nav, edit);
  deck.append(list, main);
  select(0);
  return deck;
}

function createWorkspace(stage: FlashcardsBuilderStage, setStage: (s: FlashcardsBuilderStage) => void): HTMLElement {
  const page = div('sim-builder sim-workspace slides-ws fc-ws');
  page.appendChild(div('sim-builder__bg'));
  const layout = div('sim-builder__layout');

  // ----- Chat column -----
  const chat = div('slides-ws__chat');
  const header = createChatPanelHeader({ type: 'Flashcards', title: '' });
  header.querySelector('.chat-panel-header__badge-icon')?.replaceWith(iconEl('format-flashcards' as never, 'chat-panel-header__badge-icon'));
  const titleEl = header.querySelector<HTMLElement>('.chat-panel-header__title')!;
  const thread = div('chat-thread slides-ws__thread');
  const input = createInputFieldChatThread({ placeholder: 'Type your message', mode: 'create' });
  // Format is already chosen (Flashcards), so the chat input drops the format pill.
  input.querySelector('.input-field-chat-thread__left')?.children[1]?.remove();
  chat.append(header, thread, input);

  // ----- Artifact column -----
  const artifact = div('slides-ws__artifact');
  artifact.dataset.id = 'artifact-panel';
  const bar = div('slides-ws__bar');
  const fullscreen = createButtonIcon({ icon: 'fullscreen' as never, action: 'tertiary', size: 'xs', label: 'Fullscreen' });
  fullscreen.classList.add('slides-ws__fullscreen');
  const publish = createButton({ label: 'Publish', variant: 'primary', size: 'sm' });
  publish.dataset.id = 'publish-button';
  bar.append(fullscreen, publish);
  const body = div('slides-ws__body');
  artifact.append(bar, body);

  layout.append(chat, artifact);
  page.appendChild(layout);

  const showReady = (animate: boolean) => {
    thread.querySelector('.slides-ws__thought')?.replaceWith(bulbLine('Thought for 8 seconds'));
    titleEl.textContent = FLASHCARD_SET_TITLE;
    const reply = createMizouMessage({
      content: REPLY_HTML,
      artifact: { title: FLASHCARD_SET_TITLE, subtitle: 'Version 1' },
    });
    if (animate) reply.classList.add('slides-ws__reveal');
    thread.appendChild(reply);
    body.replaceChildren(createDeckView());
    setStage('ready');
    thread.scrollTop = thread.scrollHeight;
  };

  thread.append(createUserMessage({ content: DEMO_PROMPT }), bulbLine('Thinking...'));
  if (stage === 'ready') {
    showReady(false);
  } else {
    body.appendChild(createBuildingView());
    window.setTimeout(() => {
      thread.querySelector('.slides-ws__thought')?.replaceWith(bulbLine('Building your flashcards...'));
    }, THINK_MS);
    window.setTimeout(() => showReady(true), BUILD_MS);
  }
  return page;
}

/* ============================== ROOT ============================== */

export function createFlashcardsBuilder({ stage = 'home' }: FlashcardsBuilderOptions = {}): HTMLElement {
  const root = div('slides-builder flashcards-builder');
  const setStage = (s: FlashcardsBuilderStage) => (root.dataset.stage = s);

  const startWorkspace = (from: FlashcardsBuilderStage) => {
    setStage('building');
    root.replaceChildren(createWorkspace(from, setStage));
  };

  if (stage === 'home') {
    setStage('home');
    root.appendChild(createHome(() => startWorkspace('building'), ['flashcards']));
  } else {
    startWorkspace(stage);
  }
  return root;
}
