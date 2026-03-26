import type { Meta, StoryObj } from '@storybook/html';
import { createModeToggle, type ModeToggleOptions } from '../components/modeToggle';

const meta: Meta<ModeToggleOptions> = {
  title: 'Components/Mode Toggle',
  render: (args) => createModeToggle(args),
  argTypes: {
    activeMode: {
      control: 'select',
      options: ['create', 'plan'],
    },
  },
};

export default meta;
type Story = StoryObj<ModeToggleOptions>;

export const CreateActive: Story = {
  name: 'Create Active',
  args: {
    activeMode: 'create',
  },
};

export const PlanActive: Story = {
  name: 'Plan Active',
  args: {
    activeMode: 'plan',
  },
};
