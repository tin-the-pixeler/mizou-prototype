// components/simulationBuilderPage.ts
// Full-page Simulation Builder with sidebar, topbar, mode toggle,
// landing-page input field, and sample prompt cards.
// Supports two modes: Create and Plan.

import { createSidebar } from './sidebar';
import { createModeToggle, type ModeToggleMode } from './modeToggle';
import { createInputFieldLandingPage, type InputFieldLandingPageOptions } from './inputFieldLandingPage';
import { createPromptCard, type PromptCardOptions } from './promptCard';

export type SimBuilderMode = 'create' | 'plan';

export type SimBuilderPrompt = {
  title: string;
  text: string;
  /** Text that populates the main input field on hover */
  hoverText?: string;
};

export type SimBuilderOptions = {
  /** Active mode: 'create' or 'plan' */
  mode?: SimBuilderMode;
  /** User initial for account avatar */
  userInitial?: string;
  /** Heading text (overrides per-mode defaults) */
  heading?: string;
  /** Input placeholder (overrides per-mode defaults) */
  placeholder?: string;
  /** Sample prompt cards */
  prompts?: SimBuilderPrompt[];
  /** Input field options */
  input?: InputFieldLandingPageOptions;
  /** Callback when mode changes */
  onModeChange?: (mode: SimBuilderMode) => void;
  /** Callback when a prompt card is clicked */
  onPromptClick?: (title: string, text: string) => void;
};

// Default prompts per mode
const CREATE_PROMPTS: SimBuilderPrompt[] = [
  {
    title: 'Leadership Scenario',
    text: 'Give constructive feedback to an employee missing deadlines. Objective: motivate improvement without damaging trust.',
    hoverText: "A one-on-one meeting where the learner plays the role of a manager giving constructive feedback to an underperforming employee who's been missing deadlines. The AI persona plays the employee, who feels overwhelmed and unrecognized. The manager needs to practice motivating improvement without damaging trust.",
  },
  {
    title: 'Sales Scenario',
    text: "Convince a skeptical client to switch from a competitor's SaaS. Objective: use discovery techniques and value-based selling.",
    hoverText: "A sales meeting where the learner plays the role of a sales rep trying to convince a potential client to switch from a competitor's SaaS solution. The AI persona plays the client, who is polite but skeptical, concerned about price and loyalty, and expects the rep to understand their business challenges before suggesting changes. The rep needs to use discovery and value-based selling to show clear ROI and differentiation.",
  },
  {
    title: 'Customer Support Scenario',
    text: 'Handle an angry customer whose delivery was delayed twice. Objective: de-escalate the situation and restore their trust.',
    hoverText: 'A support call where the learner plays the role of a customer support agent handling an angry customer whose delivery has been delayed twice. The AI persona plays the customer, who feels ignored, frustrated, and ready to cancel unless they get a proper explanation and compensation. The agent needs to stay calm, acknowledge their frustration, and restore trust through empathy and clear next steps.',
  },
  {
    title: 'Recruiting Scenario',
    text: 'Interview a qualified but nervous candidate who undersells themselves. Objective: build rapport and encourage them to shine.',
    hoverText: "A job interview where the learner plays the role of a recruiter meeting a nervous but qualified candidate who hesitates when answering and struggles to highlight their strengths despite having a solid r\u00E9sum\u00E9. The AI persona plays the candidate. The recruiter needs to build rapport, ask the right questions, and create a supportive atmosphere that helps the candidate express their potential confidently.",
  },
];

const PLAN_PROMPTS: SimBuilderPrompt[] = [
  { title: 'Leadership Scenario', text: 'My managers avoid difficult conversations. Help me brainstorm a realistic scenario that gets them to practice.' },
  { title: 'Sales Scenario', text: 'I want to train my reps on objection handling. Help me figure out the right scenario and format.' },
  { title: 'Customer Support Scenario', text: 'My support agents struggle when calls escalate. Help me flesh out the best scenario to train them.' },
  { title: 'Recruiting Scenario', text: "My recruiters need interview practice but I'm not sure what to focus on. Help me define the right challenge." },
];

const MODE_HEADINGS: Record<SimBuilderMode, string> = {
  create: 'Describe your role play scenario',
  plan: "What's your learning objective?",
};

const MODE_PLACEHOLDERS: Record<SimBuilderMode, string> = {
  create: 'Describe your scenario and create it right away. e.g. A product demo where a sales rep must highlight key features and handle tough questions from a skeptical buyer.',
  plan: "Not sure where to start? Describe your training challenge and we'll figure out the right scenario together. e.g. My team doesn't take compliance conversations seriously. Help me design a simulation that changes that.",
};

export function createSimulationBuilderPage(options: SimBuilderOptions = {}): HTMLElement {
  const {
    mode = 'create',
    userInitial = 'H',
    onModeChange,
    onPromptClick,
  } = options;

  let currentMode = mode;

  const page = document.createElement('div');
  page.className = 'sim-builder';

  // ===== Gradient background =====
  const bg = document.createElement('div');
  bg.className = 'sim-builder__bg';
  page.appendChild(bg);

  // ===== Layout container =====
  const layout = document.createElement('div');
  layout.className = 'sim-builder__layout';

  // ----- Sidebar (Free variant) -----
  const sidebar = createSidebar({ variant: 'free' });
  layout.appendChild(sidebar);

  // ----- Main area -----
  const main = document.createElement('div');
  main.className = 'sim-builder__main';

  // Topbar
  const topbar = createTopbar(userInitial);
  main.appendChild(topbar);

  // Panel wrapper (centers content)
  const panelWrapper = document.createElement('div');
  panelWrapper.className = 'sim-builder__panel-wrapper';

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'sim-builder__content-wrapper';

  const content = document.createElement('div');
  content.className = 'sim-builder__content';

  // --- Input section ---
  const inputSection = document.createElement('div');
  inputSection.className = 'sim-builder__input-section';

  // Heading block
  const headingBlock = document.createElement('div');
  headingBlock.className = 'sim-builder__heading';

  // Mode toggle
  const modeToggle = createModeToggle({
    activeMode: currentMode,
    onChange: (newMode) => {
      currentMode = newMode;
      updateContent();
      onModeChange?.(newMode);
    },
  });
  headingBlock.appendChild(modeToggle);

  // Heading text
  const headingText = document.createElement('h2');
  headingText.className = 'sim-builder__title';
  headingBlock.appendChild(headingText);

  inputSection.appendChild(headingBlock);

  // Input field container (will be replaced on mode change)
  const inputContainer = document.createElement('div');
  inputContainer.className = 'sim-builder__input-container';
  inputSection.appendChild(inputContainer);

  content.appendChild(inputSection);

  // --- Template section ---
  const templateSection = document.createElement('div');
  templateSection.className = 'sim-builder__template-section';

  const sectionTitle = document.createElement('p');
  sectionTitle.className = 'sim-builder__section-title';
  sectionTitle.textContent = 'Sample prompts';
  templateSection.appendChild(sectionTitle);

  const cardGrid = document.createElement('div');
  cardGrid.className = 'sim-builder__card-grid';
  templateSection.appendChild(cardGrid);

  content.appendChild(templateSection);
  contentWrapper.appendChild(content);
  panelWrapper.appendChild(contentWrapper);
  main.appendChild(panelWrapper);
  layout.appendChild(main);
  page.appendChild(layout);

  // Initial render
  updateContent();

  function updateContent() {
    const heading = options.heading ?? MODE_HEADINGS[currentMode];
    const placeholder = options.placeholder ?? MODE_PLACEHOLDERS[currentMode];
    const prompts = options.prompts ?? (currentMode === 'create' ? CREATE_PROMPTS : PLAN_PROMPTS);

    headingText.textContent = heading;

    // Replace input field
    inputContainer.innerHTML = '';
    const inputEl = createInputFieldLandingPage({
      ...options.input,
      placeholder,
      state: 'default',
    });
    inputContainer.appendChild(inputEl);

    // Replace prompt cards
    cardGrid.innerHTML = '';
    const row1 = document.createElement('div');
    row1.className = 'sim-builder__card-row';
    const row2 = document.createElement('div');
    row2.className = 'sim-builder__card-row';

    // Track whether a card click has locked the input text
    let inputLocked = false;

    prompts.forEach((p, i) => {
      // Use hoverText if available (Create mode), otherwise fall back to card body text (Plan mode)
      const populateText = p.hoverText ?? p.text;

      const card = createPromptCard({
        title: p.title,
        text: p.text,
        onClick: () => {
          const textarea = inputEl.querySelector('.input-field-landing__textarea') as HTMLElement | null;
          if (textarea) {
            textarea.textContent = populateText;
            inputEl.classList.remove('input-field-landing--default');
            inputEl.classList.add('input-field-landing--populated');
          }
          inputLocked = true;
          onPromptClick?.(p.title, p.text);
        },
        onHover: () => {
          if (inputLocked) return;
          const textarea = inputEl.querySelector('.input-field-landing__textarea') as HTMLElement | null;
          if (textarea) {
            textarea.textContent = populateText;
            inputEl.classList.remove('input-field-landing--default');
            inputEl.classList.add('input-field-landing--populated');
          }
        },
        onHoverEnd: () => {
          if (inputLocked) return;
          const textarea = inputEl.querySelector('.input-field-landing__textarea') as HTMLElement | null;
          if (textarea) {
            textarea.textContent = '';
            inputEl.classList.remove('input-field-landing--populated');
            inputEl.classList.add('input-field-landing--default');
          }
        },
      });
      if (i < 2) row1.appendChild(card);
      else row2.appendChild(card);
    });

    cardGrid.append(row1, row2);
  }

  return page;
}

// ===== TOPBAR BUILDER =====
function createTopbar(userInitial: string): HTMLElement {
  const topbar = document.createElement('div');
  topbar.className = 'sim-builder__topbar';

  const rightSide = document.createElement('div');
  rightSide.className = 'sim-builder__topbar-right';

  const userAvatar = document.createElement('div');
  userAvatar.className = 'sim-builder__user-avatar';
  userAvatar.textContent = userInitial;

  rightSide.appendChild(userAvatar);
  topbar.appendChild(rightSide);

  return topbar;
}

