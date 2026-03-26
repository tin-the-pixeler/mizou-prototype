import type { Meta, StoryObj } from '@storybook/html';
import {
  createInputFieldLandingPage,
  type InputFieldLandingPageOptions,
} from '../components/inputFieldLandingPage';

const meta: Meta<InputFieldLandingPageOptions> = {
  title: 'Components/Input Field Landing Page',
  render: (args) => createInputFieldLandingPage(args),
  argTypes: {
    placeholder: { control: 'text' },
    value: { control: 'text' },
    state: {
      control: 'select',
      options: ['default', 'populated'],
    },
    formatLabel: { control: 'text' },
    formatSelected: { control: 'boolean' },
    showFileUpload: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<InputFieldLandingPageOptions>;

export const Default: Story = {
  args: {
    state: 'default',
  },
};

export const Populated: Story = {
  args: {
    value: "Ask or describe what you'd like to do...",
    state: 'populated',
  },
};

export const WithFiles: Story = {
  name: 'With Files',
  args: {
    value:
      'Cold-call simulation with the goal to schedule a meeting with a decision-maker at a mid-sized tech company.',
    state: 'populated',
    showFileUpload: true,
  },
};
