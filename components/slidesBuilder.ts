// components/slidesBuilder.ts
// Interactive prototype: create a presentation through chat.
//   home      Format picker + prompt, ready to send
//   building  Chat shows "Thinking...", artifact panel shows "Building in progress"
//   ready     Assistant reply + deck in the artifact panel (thumbnails, preview, speaker notes)
// The AI is scripted: whatever is sent, the demo deck comes back.
// `data-stage` on the root reflects the current stage (used by Flows/ annotations).

import { iconEl } from '../icons';
import { createSidebar } from './sidebar';
import { createModeToggle } from './modeToggle';
import { createPromptCard } from './promptCard';
import { createInputFieldLandingPage } from './inputFieldLandingPage';
import { createInputFieldChatThread } from './inputFieldChatThread';
import { createChatPanelHeader } from './chatPanelHeader';
import { createUserMessage } from './userMessage';
import { createMizouMessage } from './mizouMessage';
import { createButton } from './button';
import { createButtonIcon } from './buttonIcon';
import { CREATE_PROMPTS } from './simulationBuilderPage';
import { DECK, DECK_TITLE } from './slideDeck';

export type SlidesBuilderStage = 'home' | 'building' | 'ready';

export type SlidesBuilderOptions = {
  /** Where the prototype starts (default: home) */
  stage?: SlidesBuilderStage;
};

const DEMO_PROMPT = 'Make a presentation about effective communication in Tech Teams';
type Format = { id: string; name: string; title: string; description: string; icon: string };
/** Same options, order and copy as production's ChatFormat dropdown, plus Slides. */
const FORMATS: Format[] = [
  { id: 'text', name: 'Chatbot', title: 'Text Chatbot', description: 'Master concepts through interactive text-based practice', icon: 'format-chatbot' },
  { id: 'audio', name: 'Voice Role Play', title: 'Voice role play', description: 'Build speaking confidence with realistic voice simulations', icon: 'format-voice' },
  { id: 'video', name: 'Video Role Play', title: 'Video role play', description: 'Hone face-to-face interaction skills via video call with an AI avatar', icon: 'format-video' },
  { id: 'slides', name: 'Slides', title: 'Slides', description: 'Build a presentation through chat, ready to share', icon: 'format-slides' },
];
const CHECK_SVG = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="url(#slides-format-grad)"/><path d="M4.6 8.2l2.2 2.2 4.6-4.8" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const GRAD_DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="slides-format-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34D399"/><stop offset="1" stop-color="#4F46E5"/></linearGradient></defs></svg>';
const THINK_MS = 2800;
const BUILD_MS = 4200;

const REPLY_HTML = `
<p>Got it! I've created your presentation on ${DECK_TITLE}.</p>
<p><strong>Slide 1:</strong> Title slide with the topic and your name</p>
<p><strong>Slide 2:</strong> Communication tools &amp; channels – the key platforms and practices that keep tech teams in sync</p>
<p><strong>Slide 3:</strong> The cost of miscommunication – the real impact on productivity and team dynamics</p>
<p><strong>Slide 4:</strong> Best practices &amp; action items – concrete strategies teams can implement to improve clarity and efficiency</p>
<p>The presentation is ready to go with a clean, professional design. If you'd like to tweak anything – swap out content, adjust the flow, change the styling, or add more slides – just let me know what you're thinking and I'll make those changes for you!</p>`;

function div(className: string): HTMLDivElement {
  const node = document.createElement('div');
  node.className = className;
  return node;
}

/* ============================== HOME ============================== */

function createHome(onSend: () => void): HTMLElement {
  const page = div('sim-builder slides-home');
  page.appendChild(div('sim-builder__bg'));

  const layout = div('sim-builder__layout');
  layout.appendChild(createSidebar({ variant: 'free' }));

  const main = div('sim-builder__main');
  const topbar = div('sim-builder__topbar');
  const right = div('sim-builder__topbar-right');
  const avatar = div('sim-builder__user-avatar');
  avatar.textContent = 'A';
  right.appendChild(avatar);
  topbar.appendChild(right);
  main.appendChild(topbar);

  const wrapper = div('sim-builder__panel-wrapper');
  const contentWrapper = div('sim-builder__content-wrapper');
  const content = div('sim-builder__content');

  const inputSection = div('sim-builder__input-section');
  const heading = div('sim-builder__heading');
  heading.appendChild(createModeToggle({ activeMode: 'create' }));
  const title = document.createElement('h2');
  title.className = 'sim-builder__title';
  title.textContent = 'Describe your role play scenario';
  heading.appendChild(title);
  inputSection.appendChild(heading);

  const inputContainer = div('sim-builder__input-container');
  const input = createInputFieldLandingPage({
    placeholder:
      'Describe your scenario and create it right away. e.g. A product demo where a sales rep must highlight key features and handle tough questions from a skeptical buyer.',
    onSend,
  });
  inputContainer.appendChild(input);
  inputSection.appendChild(inputContainer);
  content.appendChild(inputSection);

  // Sample prompts (unchanged from the Create mode page)
  const templates = div('sim-builder__template-section');
  const sectionTitle = document.createElement('p');
  sectionTitle.className = 'sim-builder__section-title';
  sectionTitle.textContent = 'Sample prompts';
  templates.appendChild(sectionTitle);
  const grid = div('sim-builder__card-grid');
  const rows = [div('sim-builder__card-row'), div('sim-builder__card-row')];
  CREATE_PROMPTS.forEach((p, i) => rows[i < 2 ? 0 : 1].appendChild(createPromptCard({ title: p.title, text: p.text })));
  grid.append(...rows);
  templates.appendChild(grid);
  content.appendChild(templates);

  contentWrapper.appendChild(content);
  wrapper.appendChild(contentWrapper);
  main.appendChild(wrapper);
  layout.appendChild(main);
  page.appendChild(layout);

  wireFormatPicker(input, onSend);
  return page;
}

/** Format pill opens production's format menu; picking Slides fills the demo prompt. Send needs Slides. */
function wireFormatPicker(input: HTMLElement, onSend: () => void): void {
  const left = input.querySelector<HTMLElement>('.input-field-landing__left')!;
  const pill = left.querySelector<HTMLButtonElement>('.sb-button')!;
  const pillLabel = pill.querySelector('span')!;
  const textarea = input.querySelector<HTMLElement>('.input-field-landing__textarea')!;
  const sendBtn = input.querySelector<HTMLButtonElement>('.input-field-landing__send-btn')!;
  pill.dataset.id = 'format-pill';
  left.classList.add('slides-format');
  let selected: Format | null = null;

  const menu = div('slides-format__menu');
  menu.dataset.id = 'format-menu';
  menu.hidden = true;
  menu.insertAdjacentHTML('afterbegin', GRAD_DEFS);

  const options = FORMATS.map((format) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'slides-format__option';
    option.dataset.format = format.id;

    const tile = div('slides-format__tile');
    tile.appendChild(iconEl(format.icon as never, 'slides-format__tile-icon'));
    const text = div('slides-format__text');
    const title = document.createElement('strong');
    title.className = 'slides-format__title';
    title.textContent = format.title;
    const desc = document.createElement('span');
    desc.className = 'slides-format__desc';
    desc.textContent = format.description;
    text.append(title, desc);
    const check = document.createElement('span');
    check.className = 'slides-format__check';
    check.innerHTML = CHECK_SVG;
    option.append(tile, text, check);

    option.addEventListener('click', () => {
      selected = format;
      options.forEach((o) => o.classList.toggle('is-selected', o === option));
      pill.classList.add('slides-format__pill--selected');
      pill.querySelector('.slides-format__pill-icon')?.remove();
      pill.insertBefore(iconEl(format.icon as never, 'slides-format__pill-icon'), pillLabel);
      pillLabel.textContent = format.name;
      menu.hidden = true;
      if (format.id === 'slides' && !textarea.textContent?.trim()) {
        textarea.textContent = DEMO_PROMPT;
        input.classList.remove('input-field-landing--default');
        input.classList.add('input-field-landing--populated');
        sendBtn.disabled = false;
      }
    });
    menu.appendChild(option);
    return option;
  });

  left.appendChild(menu);
  pill.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
  });
  document.addEventListener('click', () => (menu.hidden = true));

  // Only Slides is prototyped: sending with another (or no) format nudges the picker open.
  sendBtn.addEventListener(
    'click',
    (e) => {
      if (selected?.id !== 'slides') {
        e.stopImmediatePropagation();
        menu.hidden = false;
      }
    },
    true,
  );
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendBtn.click();
    }
  });
  void onSend;
}

/* ============================ WORKSPACE =========================== */

function bulbLine(text: string): HTMLElement {
  const line = div('slides-ws__thought');
  line.append(iconEl('light-bulb-fill' as never, 'slides-ws__thought-icon'));
  const label = document.createElement('span');
  label.textContent = text;
  line.appendChild(label);
  return line;
}

function createBuildingView(): HTMLElement {
  const view = div('slides-building');
  view.dataset.id = 'building-state';
  const badge = div('slides-building__badge');
  badge.appendChild(iconEl('ai-sparkle' as never, 'slides-building__icon'));
  const title = document.createElement('p');
  title.className = 'slides-building__title';
  title.textContent = 'Building in progress';
  const sub = document.createElement('p');
  sub.className = 'slides-building__sub';
  sub.textContent = 'This might take a few minutes, it’ll show up here once it’s ready...';
  view.append(badge, title, sub, createButton({ label: 'Show previous version', variant: 'tertiary', size: 'md' }));
  return view;
}

function createDeckView(): HTMLElement {
  const notes = DECK.map(() => '');
  let active = 0;
  let typing = false;

  const deck = div('slides-deck');
  deck.dataset.id = 'deck';

  const thumbs = div('slides-deck__thumbs');
  const main = div('slides-deck__main');

  const head = div('slides-deck__head');
  const heading = document.createElement('h3');
  heading.className = 'slides-deck__title';
  heading.textContent = DECK_TITLE;
  const actions = div('slides-deck__actions');
  const linkBtn = createButtonIcon({ icon: 'link' as never, action: 'tertiary', size: 'xs', label: 'Copy presentation URL' });
  const exportBtn = createButtonIcon({ icon: 'external-link' as never, action: 'tertiary', size: 'xs', label: 'Export' });
  linkBtn.dataset.id = 'url-button';
  exportBtn.dataset.id = 'export-button';
  actions.append(linkBtn, exportBtn);
  head.append(heading, actions);

  const stage = div('slides-deck__stage');
  const notesBox = div('slides-deck__notes');
  notesBox.dataset.id = 'speaker-notes';
  const textarea = document.createElement('textarea');
  textarea.className = 'slides-deck__notes-input';
  textarea.placeholder = 'Enter your speaker notes here';
  textarea.rows = 2;
  textarea.addEventListener('input', () => (notes[active] = textarea.value));
  const generate = createButton({ label: 'Generate', variant: 'tertiary', size: 'xs', rightIcon: 'ai-sparkle' as never });
  generate.dataset.id = 'generate-notes';
  generate.classList.add('slides-deck__generate');
  notesBox.append(textarea, generate);

  const thumbButtons: HTMLButtonElement[] = [];
  const select = (index: number) => {
    active = index;
    thumbButtons.forEach((b, i) => b.classList.toggle('is-active', i === index));
    const slide = DECK[index].render();
    slide.classList.add('slides-deck__slide');
    stage.replaceChildren(slide);
    textarea.value = notes[index];
  };

  DECK.forEach((slide, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'slides-deck__thumb';
    button.dataset.index = String(i);
    const frame = div('slides-deck__thumb-frame');
    frame.appendChild(slide.render());
    const num = document.createElement('span');
    num.className = 'slides-deck__thumb-num';
    num.textContent = String(i + 1);
    button.append(frame, num);
    button.addEventListener('click', () => select(i));
    thumbs.appendChild(button);
    thumbButtons.push(button);
  });

  generate.addEventListener('click', () => {
    if (typing) return;
    typing = true;
    const target = DECK[active].generatedNotes;
    const index = active;
    textarea.value = '';
    let n = 0;
    const timer = window.setInterval(() => {
      n = Math.min(target.length, n + 3);
      notes[index] = target.slice(0, n);
      if (index === active) textarea.value = notes[index];
      if (n >= target.length) {
        window.clearInterval(timer);
        typing = false;
      }
    }, 18);
  });

  main.append(head, stage, notesBox);
  deck.append(thumbs, main);
  select(0);
  return deck;
}

function createWorkspace(stage: SlidesBuilderStage, setStage: (s: SlidesBuilderStage) => void): HTMLElement {
  const page = div('sim-builder sim-workspace slides-ws');
  page.appendChild(div('sim-builder__bg'));
  const layout = div('sim-builder__layout');

  // ----- Chat column -----
  const chat = div('slides-ws__chat');
  const header = createChatPanelHeader({ type: 'Slides', title: '' });
  header.querySelector('.chat-panel-header__badge-icon')?.replaceWith(iconEl('presentation' as never, 'chat-panel-header__badge-icon'));
  const titleEl = header.querySelector<HTMLElement>('.chat-panel-header__title')!;
  const thread = div('chat-thread slides-ws__thread');
  const input = createInputFieldChatThread({ placeholder: 'Type your message', mode: 'create' });
  // Format is already chosen (Slides), so the chat input drops the format pill.
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
    titleEl.textContent = DECK_TITLE;
    const reply = createMizouMessage({
      content: REPLY_HTML,
      artifact: { title: DECK_TITLE, subtitle: 'Version 1' },
    });
    if (animate) reply.classList.add('slides-ws__reveal');
    thread.appendChild(reply);
    body.replaceChildren(createDeckView());
    setStage('ready');
    thread.scrollTop = thread.scrollHeight;
  };

  if (stage === 'ready') {
    thread.append(createUserMessage({ content: DEMO_PROMPT }), bulbLine('Thinking...'));
    showReady(false);
  } else {
    thread.append(createUserMessage({ content: DEMO_PROMPT }), bulbLine('Thinking...'));
    body.appendChild(createBuildingView());
    window.setTimeout(() => {
      thread.querySelector('.slides-ws__thought')?.replaceWith(bulbLine('Building your slides...'));
    }, THINK_MS);
    window.setTimeout(() => showReady(true), BUILD_MS);
  }
  return page;
}

/* ============================== ROOT ============================== */

export function createSlidesBuilder({ stage = 'home' }: SlidesBuilderOptions = {}): HTMLElement {
  const root = div('slides-builder');
  const setStage = (s: SlidesBuilderStage) => (root.dataset.stage = s);

  const startWorkspace = (from: SlidesBuilderStage) => {
    setStage('building');
    root.replaceChildren(createWorkspace(from, setStage));
  };

  if (stage === 'home') {
    setStage('home');
    root.appendChild(createHome(() => startWorkspace('building')));
  } else {
    startWorkspace(stage);
  }
  return root;
}
