import type { Meta, StoryObj } from '@storybook/html';
import { createChatEvent } from '../components/chatEvent';
import { eventLabelVariants, type EventLabelVariant } from '../components/chatEventLabel';

type EventArgs = {
  variant: EventLabelVariant;
  label: string;
  description: string;
  bullets: string;
};

const meta: Meta<EventArgs> = {
  title: 'Chat/Event',
  argTypes: {
    variant:     { control: 'select', options: eventLabelVariants },
    label:       { control: 'text' },
    description: { control: 'text' },
    bullets:     { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<EventArgs>;

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    variant: 'thinking',
    label: '',
    description: 'Analyzing the user request to determine the best approach for generating the component structure.',
    bullets: '',
  },
  render: (args) =>
    createChatEvent({
      variant: args.variant,
      label: args.label || undefined,
      description: args.description || undefined,
      bullets: args.bullets ? args.bullets.split(',').map((s) => s.trim()) : undefined,
    }),
};

export const WithBullets: Story = {
  name: 'With Bullet List',
  args: {
    variant: 'building',
    label: 'Building component files',
    description: '',
    bullets: 'Created chatEventLabel.ts, Created chatEvent.ts, Created chatStream.ts',
  },
  render: (args) =>
    createChatEvent({
      variant: args.variant,
      label: args.label || undefined,
      description: args.description || undefined,
      bullets: args.bullets ? args.bullets.split(',').map((s) => s.trim()) : undefined,
    }),
};

export const LabelOnly: Story = {
  name: 'Label Only',
  args: {
    variant: 'scanning',
    label: 'Scanning project files...',
    description: '',
    bullets: '',
  },
  render: (args) =>
    createChatEvent({
      variant: args.variant,
      label: args.label || undefined,
      description: args.description || undefined,
    }),
};
