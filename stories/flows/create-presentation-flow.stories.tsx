import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AnnotatedFlow, type FlowStep } from './annotated-flow';

/**
 * Flow: Create a Presentation.
 * Annotations for the Slides builder; the engine lives in ./annotated-flow.
 */

const FLOW_TITLE = 'Create a Presentation';

/** Storybook story rendered in the frame — the whole flow runs inside it. */
const FRAME_STORY = 'pages-slides-builder--create-presentation';

/** Current stage of the prototype: "home" | "building" | "ready". */
function stage(doc: Document): string {
  return doc.querySelector('.slides-builder')?.getAttribute('data-stage') ?? '';
}

function formatMenuOpen(doc: Document): boolean {
  return !!doc.querySelector('[data-id="format-menu"]:not([hidden])');
}

function slidesPicked(doc: Document): boolean {
  return doc.querySelector('[data-id="format-pill"]')?.textContent?.trim() === 'Slides';
}

/** Steps follow what's on screen: interact inside the frame and the
 *  description + annotations switch to match. The LAST matching step wins. */
const STEPS: FlowStep[] = [
  {
    id: 'home',
    description: 'Home - pick a format, describe the presentation, then send.',
    annotations: [
      {
        id: 'A',
        title: 'Format',
        body: 'Choose what to create. Slides is the new option, next to Chatbot, Voice and Video role play.',
        target: '[data-id="format-pill"]',
      },
      {
        id: 'B',
        title: 'Describe it',
        body: 'Say what the presentation is about: topic, audience, tone. The AI writes the outline and designs the slides in one go.',
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
    description: 'Home [Slides selected] - review the prompt and click send.',
    when: (doc) => stage(doc) === 'home' && slidesPicked(doc) && !formatMenuOpen(doc),
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
        body: 'Free text. Edit it, or write your own. Users can also attach files with +.',
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
    description: 'Home [Format menu] - choose Slides.',
    when: (doc) => stage(doc) === 'home' && formatMenuOpen(doc),
    annotations: [
      {
        id: 'A',
        title: 'Slides (new)',
        body: 'Builds a presentation through chat. Sits below the existing formats.',
        target: '.slides-format__option[data-format="slides"]',
      },
      {
        id: 'B',
        title: 'Existing formats',
        body: 'Text Chatbot, Voice and Video role play. Same options and copy as today.',
        target: '.slides-format__option[data-format="text"]',
      },
    ],
  },
  {
    id: 'building',
    description: 'Chat editor - the AI is building the deck.',
    when: (doc) => stage(doc) === 'building',
    annotations: [
      {
        id: 'A',
        title: 'Progress',
        body: 'Thinking, then building. The chat stays usable while the deck is generated.',
        target: '.slides-ws__thought',
      },
      {
        id: 'B',
        title: 'Building in progress',
        body: 'The artifact panel holds a placeholder until the deck is ready. Show previous version is for later edits.',
        target: '[data-id="building-state"]',
      },
    ],
  },
  {
    id: 'ready',
    description: 'Chat editor - deck ready. Review the slides in the artifact panel.',
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
        title: 'Slide list',
        body: 'All slides in order. Click one to preview it; the selected slide is outlined.',
        target: '.slides-deck__thumb.is-active',
        routeAround: '.slides-deck',
      },
      {
        id: 'C',
        title: 'Preview',
        body: 'The selected slide at full width.',
        target: '.slides-deck__slide',
        routeAround: '.slides-deck',
      },
      {
        id: 'D',
        title: 'Speaker notes',
        body: 'Editable per slide and only visible in presenter view. Generate drafts them with AI.',
        target: '[data-id="speaker-notes"]',
        routeAround: '.slides-deck',
      },
      {
        id: 'E',
        title: 'Publish',
        body: 'Next step: present the deck, export it, or share it with a link.',
        target: '[data-id="publish-button"]',
      },
    ],
  },
];

const meta: Meta = {
  title: 'Flows/Create a Presentation',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Flow: Story = {
  name: 'Flow',
  render: () => <AnnotatedFlow title={FLOW_TITLE} steps={STEPS} frameStory={FRAME_STORY} />,
};
