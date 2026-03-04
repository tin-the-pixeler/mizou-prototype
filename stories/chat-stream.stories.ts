import type { Meta, StoryObj } from '@storybook/html';
import { createChatStream } from '../components/chatStream';

const meta: Meta = {
  title: 'Chat/Stream',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () =>
    createChatStream({
      events: [
        { variant: 'thinking', description: 'Analyzing the user request to understand the intent behind the question.' },
        { variant: 'scanning', label: 'Scanning codebase...', description: 'Looking through project files to find relevant components and patterns.' },
        { variant: 'decision', label: 'Decided on approach', description: 'Will use the factory function pattern to match existing component conventions.' },
        { variant: 'building', label: 'Generating component...', description: 'Creating the TypeScript component file with proper types and exports.' },
        { variant: 'complete', label: 'Done' },
      ],
    }),
};

export const WithBullets: Story = {
  name: 'With Bullet Items',
  render: () =>
    createChatStream({
      events: [
        { variant: 'scanning', label: 'Scanning project structure...', bullets: ['components/', 'styles/', 'stories/', 'icons/'] },
        { variant: 'thinking', description: 'The project uses vanilla TypeScript with DOM factory functions.' },
        { variant: 'building', label: 'Creating files...', bullets: ['chatEventLabel.ts', 'chatEvent.ts', 'chatStream.ts'] },
        { variant: 'complete', label: 'All files created' },
      ],
    }),
};

export const TwoSteps: Story = {
  name: 'Short (2 Steps)',
  render: () =>
    createChatStream({
      events: [
        { variant: 'thinking', description: 'Reviewing the design tokens file to verify color mappings.' },
        { variant: 'complete', label: 'Verification complete' },
      ],
    }),
};
