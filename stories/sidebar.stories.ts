import type { Meta, StoryObj } from '@storybook/html';
import { createSidebar } from '../components/sidebar';

const meta: Meta = { title: 'Navigation/Sidebar (Expand)' };
export default meta;

type Story = StoryObj;

export const Free: Story = {
  render: () => createSidebar({ variant: 'free' }),
};

export const Enterprise: Story = {
  render: () => createSidebar({ variant: 'enterprise' }),
};

export const FreeCollapsed: Story = {
  name: 'Free (Collapsed)',
  render: () => createSidebar({ variant: 'free', collapsed: true }),
};

export const EnterpriseCollapsed: Story = {
  name: 'Enterprise (Collapsed)',
  render: () => createSidebar({ variant: 'enterprise', collapsed: true }),
};
