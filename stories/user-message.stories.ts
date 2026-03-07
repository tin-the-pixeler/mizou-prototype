import type { Meta, StoryObj } from '@storybook/html';
import { createUserMessage, type UserMessageOptions } from '../components/userMessage';

const meta: Meta<UserMessageOptions> = {
  title: 'Chat/User Message',
  render: (args) => createUserMessage(args),
  argTypes: {
    content: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<UserMessageOptions>;

export const Default: Story = {
  args: {
    content: 'Hello! Can you help me understand how to use this component?',
  },
};

export const LongMessage: Story = {
  name: 'Long Message',
  args: {
    content:
      'This is a much longer user message to test how the component handles text wrapping and multiple lines. It should wrap nicely within the message bubble and maintain proper spacing and readability.',
  },
};

export const ShortMessage: Story = {
  name: 'Short Message',
  args: {
    content: 'Hi!',
  },
};

export const WithMarkdown: Story = {
  name: 'With Markdown',
  args: {
    content: `Here's my question with **bold text** and *italic text*.

I can also include \`code\` inline and even lists:
- First point
- Second point
- Third point

What do you think?`,
  },
};
