import type { Meta, StoryObj } from '@storybook/html';
import { createUserMessage } from '../components/userMessage';

const meta: Meta = {
  title: 'Chat/User Message',
  argTypes: {
    content: { control: 'text' },
    timestamp: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    content: 'Hello! Can you help me understand how to use this component?',
    timestamp: '10:30 AM',
  },
  render: (args) => createUserMessage(args),
};

export const WithoutTimestamp: Story = {
  name: 'Without Timestamp',
  args: {
    content: 'This is a user message without a timestamp.',
  },
  render: (args) => createUserMessage(args),
};

export const LongMessage: Story = {
  name: 'Long Message',
  args: {
    content: 'This is a much longer user message to test how the component handles text wrapping and multiple lines. It should wrap nicely within the message bubble and maintain proper spacing and readability.',
    timestamp: '2:45 PM',
  },
  render: (args) => createUserMessage(args),
};

export const ShortMessage: Story = {
  name: 'Short Message',
  args: {
    content: 'Hi!',
    timestamp: '9:00 AM',
  },
  render: (args) => createUserMessage(args),
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
    timestamp: '3:15 PM',
  },
  render: (args) => createUserMessage(args),
};