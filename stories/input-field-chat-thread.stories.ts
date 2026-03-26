import type { Meta, StoryObj } from '@storybook/html';
import {
  createInputFieldChatThread,
  type InputFieldChatThreadOptions,
} from '../components/inputFieldChatThread';

const meta: Meta<InputFieldChatThreadOptions> = {
  title: 'Components/Input Field Chat Thread',
  render: (args) => createInputFieldChatThread(args),
  argTypes: {
    placeholder: { control: 'text' },
    value: { control: 'text' },
    state: {
      control: 'select',
      options: ['default', 'populated'],
    },
    formatLabel: { control: 'text' },
    formatSelected: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<InputFieldChatThreadOptions>;

export const Default: Story = {
  args: {
    state: 'default',
  },
};

export const Populated: Story = {
  args: {
    value:
      "Cold-call simulation with the goal to schedule a meeting with a decision-maker at a mid-sized tech company. Practice handling objections like 'we've used the same supplier for years' or 'we're not looking to switch right now.",
    state: 'populated',
  },
};

export const FormatSelected: Story = {
  name: 'Format Selected',
  args: {
    value: 'Build a chatbot for onboarding new employees',
    state: 'populated',
    formatLabel: 'Chatbot',
    formatSelected: true,
  },
};
