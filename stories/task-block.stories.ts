import type { Meta, StoryObj } from '@storybook/html';
import {
  createTaskBlock,
  taskBlockStates,
  type TaskBlockState,
} from '../components/chatTaskBlock';

const meta: Meta<{ state: TaskBlockState; title: string; expanded: boolean }> = {
  title: 'Chat/Task Block',
  argTypes: {
    state:    { control: 'select', options: taskBlockStates },
    title:    { control: 'text' },
    expanded: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<{ state: TaskBlockState; title: string; expanded: boolean }>;

const sampleEvents = [
  { variant: 'scanning' as const, label: 'Analyzing project structure', bullets: ['Read package.json', 'Found Storybook config', 'Identified component patterns'] },
  { variant: 'building' as const, label: 'Creating component files', bullets: ['chatEventLabel.ts', 'chatEvent.ts', 'chatStream.ts', 'chatThinkingBlock.ts'] },
  { variant: 'editing' as const, label: 'Updating styles', bullets: ['Added chat-components.css', 'Updated preview.ts imports'] },
];

export const InProgress: Story = {
  name: 'In Progress',
  args: { state: 'in-progress', title: 'Building chat components...', expanded: true },
  render: (args) =>
    createTaskBlock({ state: args.state, title: args.title, expanded: args.expanded, events: sampleEvents }),
};

export const Finished: Story = {
  args: { state: 'finished', title: 'Chat components created', expanded: true },
  render: (args) =>
    createTaskBlock({ state: args.state, title: args.title, expanded: args.expanded, events: sampleEvents }),
};

export const CollapsedInProgress: Story = {
  name: 'Collapsed (In Progress)',
  args: { state: 'in-progress', title: 'Working on task...', expanded: false },
  render: (args) =>
    createTaskBlock({ state: args.state, title: args.title, expanded: args.expanded, events: sampleEvents }),
};

export const CollapsedFinished: Story = {
  name: 'Collapsed (Finished)',
  args: { state: 'finished', title: 'Task complete', expanded: false },
  render: (args) =>
    createTaskBlock({ state: args.state, title: args.title, expanded: args.expanded, events: sampleEvents }),
};
