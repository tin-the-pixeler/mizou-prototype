import type { Meta, StoryObj } from '@storybook/html';
import {
  createEventLabel,
  eventLabelVariants,
  type EventLabelVariant,
} from '../components/chatEventLabel';

const meta: Meta<{ variant: EventLabelVariant; label: string }> = {
  title: 'Chat/Event Label',
  argTypes: {
    variant: { control: 'select', options: eventLabelVariants },
    label:   { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<{ variant: EventLabelVariant; label: string }>;

export const Thinking: Story = {
  args: { variant: 'thinking', label: '' },
  render: (args) => createEventLabel({ variant: args.variant, label: args.label || undefined }),
};

export const Decision: Story = {
  args: { variant: 'decision', label: '' },
  render: (args) => createEventLabel({ variant: args.variant, label: args.label || undefined }),
};

export const Scanning: Story = {
  args: { variant: 'scanning', label: '' },
  render: (args) => createEventLabel({ variant: args.variant, label: args.label || undefined }),
};

export const Initialising: Story = {
  args: { variant: 'initialising', label: '' },
  render: (args) => createEventLabel({ variant: args.variant, label: args.label || undefined }),
};

export const Building: Story = {
  args: { variant: 'building', label: '' },
  render: (args) => createEventLabel({ variant: args.variant, label: args.label || undefined }),
};

export const Editing: Story = {
  args: { variant: 'editing', label: '' },
  render: (args) => createEventLabel({ variant: args.variant, label: args.label || undefined }),
};

export const Complete: Story = {
  args: { variant: 'complete', label: '' },
  render: (args) => createEventLabel({ variant: args.variant, label: args.label || undefined }),
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const grid = document.createElement('div');
    grid.style.cssText = 'display:flex; flex-direction:column; gap:12px; padding:24px;';
    for (const variant of eventLabelVariants) {
      grid.appendChild(createEventLabel({ variant }));
    }
    return grid;
  },
};
