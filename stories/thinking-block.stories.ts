import type { Meta, StoryObj } from '@storybook/html';
import {
  createThinkingBlock,
  thinkingBlockStates,
  type ThinkingBlockState,
} from '../components/chatThinkingBlock';

const meta: Meta<{ state: ThinkingBlockState; expanded: boolean }> = {
  title: 'Chat/Thinking Block',
  argTypes: {
    state:    { control: 'select', options: thinkingBlockStates },
    expanded: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<{ state: ThinkingBlockState; expanded: boolean }>;

const sampleEvents = [
  { variant: 'thinking' as const, description: 'Analyzing the user request to understand what component is needed.' },
  { variant: 'scanning' as const, label: 'Reading tokens.css...', description: 'Checking existing design tokens to find the correct color values.' },
  { variant: 'decision' as const, label: 'Decided on approach', description: 'Will create a factory function matching the existing pattern.' },
  { variant: 'building' as const, label: 'Generating code...', description: 'Writing the component TypeScript and CSS files.' },
  { variant: 'complete' as const, label: 'Done' },
];

export const Expanded: Story = {
  args: { state: 'populated', expanded: true },
  render: (args) =>
    createThinkingBlock({ state: args.state, expanded: args.expanded, events: sampleEvents }),
};

export const Collapsed: Story = {
  args: { state: 'populated', expanded: false },
  render: (args) =>
    createThinkingBlock({ state: args.state, expanded: args.expanded, events: sampleEvents }),
};

export const ThinkingState: Story = {
  name: 'Thinking (Loading)',
  args: { state: 'thinking', expanded: true },
  render: (args) => createThinkingBlock({ state: args.state }),
};
