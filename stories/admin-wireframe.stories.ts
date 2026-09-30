import type { Meta, StoryObj } from '@storybook/html';
import { createAdminWireframe, type AdminWireframeOptions } from '../components/adminWireframe';

const meta: Meta<AdminWireframeOptions> = {
  title: 'Pages/Admin Wireframe',
  render: (args) => createAdminWireframe(args),
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    userInitial: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<AdminWireframeOptions>;

export const Default: Story = {
  name: 'Admin Wireframe',
  args: {
    userInitial: 'JD',
  },
};
