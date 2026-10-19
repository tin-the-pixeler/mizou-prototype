import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AnnotatedFlow, type FlowStep } from './annotated-flow';

/**
 * Flow: Create Flashcards.
 * Annotations for the Flashcards builder; the engine lives in ./annotated-flow.
 */

const FLOW_TITLE = 'Create Flashcards';

/** Storybook story rendered in the frame — the whole flow runs inside it. */
const FRAME_STORY = 'pages-flashcards-builder--create-flashcards';

/** Current stage of the prototype: "home" | "building" | "ready". */
function stage(doc: Document): string {
  return doc.querySelector('.flashcards-builder')?.getAttribute('data-stage') ?? '';
}

function formatMenuOpen(doc: Document): boolean {
  return !!doc.querySelector('[data-id="format-menu"]:not([hidden])');
}

function flashcardsPicked(doc: Document): boolean {
  return doc.querySelector('[data-id="format-pill"]')?.textContent?.trim() === 'Flashcards';
}

function cardFlipped(doc: Document): boolean {
  return !!doc.querySelector('.fc-card.is-flipped');
}

/** Steps follow what's on screen: interact inside the frame and the
 *  description + annotations switch to match. The LAST matching step wins. */
const STEPS: FlowStep[] = [
  {
    id: 'home',
    description: 'Home - pick a format, describe the flashcards, then send.',
    annotations: [
      {
        id: 'A',
        title: 'Format',
        body: 'Choose what to create. Flashcards is the new option, next to Chatbot, Voice, Video role play and Slides.',
        target: '[data-id="format-pill"]',
      },
      {
        id: 'B',
        title: 'Describe it',
        body: 'Say what the set should cover: topic, audience, difficulty. The AI writes the questions and answers in one go.',
        target: '.input-field-landing__textarea',
      },
      {
        id: 'C',
        title: 'Send',
        body: 'Starts the build and opens the chat editor. Needs a format and a prompt.',
        target: '.input-field-landing__send-btn',
      },
    ],
  },
  {
    id: 'prompt-ready',
    description: 'Home [Flashcards selected] - review the prompt and click send.',
    when: (doc) => stage(doc) === 'home' && flashcardsPicked(doc) && !formatMenuOpen(doc),
    annotations: [
      {
        id: 'A',
        title: 'Selected format',
        body: 'The pill turns dark and shows the format. Open it again to switch.',
        target: '[data-id="format-pill"]',
      },
      {
        id: 'B',
        title: 'Prompt',
        body: 'Free text. Edit it, or write your own. Users can also attach source material with +.',
        target: '.input-field-landing__textarea',
      },
      {
        id: 'C',
        title: 'Send',
        body: 'Now enabled. Sends the prompt and opens the chat editor.',
        target: '.input-field-landing__send-btn',
      },
    ],
  },
  {
    id: 'format-menu',
    description: 'Home [Format menu] - choose Flashcards.',
    when: (doc) => stage(doc) === 'home' && formatMenuOpen(doc),
    annotations: [
      {
        id: 'A',
        title: 'Flashcards (new)',
        body: 'Builds a flashcard set through chat. Sits at the end of the list, below Slides.',
        target: '.slides-format__option[data-format="flashcards"]',
      },
      {
        id: 'B',
        title: 'Existing formats',
        body: 'Text Chatbot, Voice and Video role play, and Slides. Same options and copy as today.',
        target: '.slides-format__option[data-format="text"]',
      },
    ],
  },
  {
    id: 'building',
    description: 'Chat editor - the AI is building the flashcard set.',
    when: (doc) => stage(doc) === 'building',
    annotations: [
      {
        id: 'A',
        title: 'Progress',
        body: 'Thinking, then building. The chat stays usable while the set is generated.',
        target: '.slides-ws__thought',
      },
      {
        id: 'B',
        title: 'Building in progress',
        body: 'The artifact panel holds a placeholder until the set is ready. Show previous version is for later edits.',
        target: '[data-id="building-state"]',
      },
    ],
  },
  {
    id: 'ready',
    description: 'Chat editor - flashcards ready. Review the set in the artifact panel.',
    when: (doc) => stage(doc) === 'ready',
    annotations: [
      {
        id: 'A',
        title: 'Version card',
        body: 'Every change creates a new version. Click a card to reopen that version in the panel.',
        target: '.mizou-message__artifact',
        routeAround: '.mizou-message',
      },
      {
        id: 'B',
        title: 'Card list',
        body: 'All cards in order, showing each question. Click one to preview it; the selected card is outlined.',
        target: '.fc-deck__item.is-active',
        routeAround: '.fc-deck',
      },
      {
        id: 'C',
        title: 'Card preview',
        body: 'Shows the question first. Click the card to flip it and see the answer.',
        target: '[data-id="flashcard"]',
        routeAround: '.fc-deck',
      },
      {
        id: 'D',
        title: 'Navigate',
        body: 'Step through the set with the arrows. The counter shows where you are.',
        target: '[data-id="card-nav"]',
        routeAround: '.fc-deck',
      },
      {
        id: 'E',
        title: 'Edit card',
        body: 'Change the front or back text. The preview and the card list update as you type.',
        target: '[data-id="card-edit"]',
        routeAround: '.fc-deck',
      },
      {
        id: 'F',
        title: 'Publish',
        body: 'Next step: share the set with learners or export it.',
        target: '[data-id="publish-button"]',
      },
    ],
  },
  {
    id: 'flipped',
    description: 'Chat editor - card flipped to show the answer.',
    when: (doc) => stage(doc) === 'ready' && cardFlipped(doc),
    annotations: [
      {
        id: 'A',
        title: 'Answer side',
        body: 'The back of the card is tinted so it is clear which side you are on. Click again to flip back.',
        target: '[data-id="flashcard"]',
        routeAround: '.fc-deck',
      },
      {
        id: 'B',
        title: 'Edit answer',
        body: 'The Back field edits what you see here.',
        target: '[data-id="edit-back"]',
        routeAround: '.fc-deck',
      },
      {
        id: 'C',
        title: 'Next card',
        body: 'Moving to another card resets it to the question side.',
        target: '[data-id="card-nav"]',
        routeAround: '.fc-deck',
      },
    ],
  },
];

const meta: Meta = {
  title: 'Flows/Create Flashcards',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Flow: Story = {
  name: 'Flow',
  render: () => <AnnotatedFlow title={FLOW_TITLE} steps={STEPS} frameStory={FRAME_STORY} />,
};
