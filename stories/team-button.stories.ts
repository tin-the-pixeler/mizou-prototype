import type { Meta, StoryObj } from '@storybook/html';
import { createTeamButton } from '../components/teamButton';

const meta: Meta<{ name: string; initials: string; color: string; open: boolean }> = {
  title: 'Navigation/Team Button',
  argTypes: {
    name: { control: 'text' },
    initials: { control: 'text' },
    color: { control: 'color' },
    open: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<{ name: string; initials: string; color: string; open: boolean }>;

export const Default: Story = {
  args: { name: 'Team Name', initials: 'TN', color: '#b17979', open: false },
  render: (args) => createTeamButton(args),
};

export const CustomColor: Story = {
  args: { name: 'Research Team', initials: 'RT', color: '#6f8ccf', open: false },
  render: (args) => createTeamButton(args),
};
