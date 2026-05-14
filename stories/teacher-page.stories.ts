import type { Meta, StoryObj } from '@storybook/html';
import { createTeacherPage, type TeacherPageOptions } from '../components/teacherPage';

const meta: Meta<TeacherPageOptions> = {
  title: 'Pages/Teacher',
  render: (args) => createTeacherPage(args),
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    userInitial: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<TeacherPageOptions>;

export const Default: Story = {
  name: 'Teacher Page',
  args: {
    userInitial: 'JD',
  },
};
