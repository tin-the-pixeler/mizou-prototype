import type { Meta, StoryObj } from '@storybook/html';
import {
  createChatInputField,
  type ChatInputFieldOptions,
} from '../components/chatInputField';

const meta: Meta<ChatInputFieldOptions> = {
  title: 'Chat/Input Field',
  render: (args) => createChatInputField(args),
  argTypes: {
    placeholder: { control: 'text' },
    value: { control: 'text' },
    state: {
      control: 'select',
      options: ['default', 'populated'],
    },
  },
};

export default meta;
type Story = StoryObj<ChatInputFieldOptions>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message',
    state: 'default',
  },
};

export const Populated: Story = {
  args: {
    placeholder: 'Type your message',
    value: 'Type your message',
    state: 'populated',
  },
};
