import type { Meta, StoryObj } from '@storybook/html';
import { createModeBadge, type ModeBadgeOptions } from '../components/modeBadge';

const meta: Meta<ModeBadgeOptions> = {
  title: 'Components/Mode Badge',
  render: (args) => createModeBadge(args),
  argTypes: {
    mode: {
      control: 'select',
      options: ['create', 'plan'],
    },
  },
};

export default meta;
type Story = StoryObj<ModeBadgeOptions>;

export const Create: Story = {
  args: {
    mode: 'create',
  },
};

export const Plan: Story = {
  args: {
    mode: 'plan',
  },
};
