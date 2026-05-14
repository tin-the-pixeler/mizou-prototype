import type { Meta, StoryObj } from '@storybook/html';
import { createAdminPage, type AdminPageOptions } from '../components/adminPage';

const meta: Meta<AdminPageOptions> = {
  title: 'Pages/Admin',
  render: (args) => createAdminPage(args),
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    userInitial: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<AdminPageOptions>;

export const Default: Story = {
  name: 'Admin Page',
  args: {
    userInitial: 'JD',
  },
};
