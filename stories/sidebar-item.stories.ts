import type { Meta, StoryObj } from '@storybook/html';
import { createSidebarItem } from '../components/sidebarItem';
import { iconNames, type IconName } from '../icons';

const meta: Meta<{ label: string; active: boolean; icon: IconName }> = {
  title: 'Navigation/Sidebar Item',
  argTypes: {
    label: { control: 'text' },
    active: { control: 'boolean' },
    icon:   { control: 'select', options: iconNames },
  },
};
export default meta;

type Story = StoryObj<{ label: string; active: boolean; icon: IconName }>;

export const Default: Story = {
  args: { label: 'Simulations', active: false, icon: 'simulations' },
  render: (args) => createSidebarItem(args),
};

export const Active: Story = {
  name: 'Active / Focused',
  args: { label: 'Simulations', active: true, icon: 'simulations' },
  render: (args) => createSidebarItem(args),
};
