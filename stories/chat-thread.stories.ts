import type { Meta, StoryObj } from '@storybook/html';
import { createChatThread } from '../components/chatThread';

const meta: Meta = {
  title: 'Chat/Chat Thread',
  argTypes: {
    messages: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    messages: [
      {
        role: 'user',
        content: 'Hello! Can you help me understand how to use this component?',
        timestamp: '10:30 AM',
      },
      {
        role: 'assistant',
        content: 'Of course! I\'d be happy to help you understand this component. What specific aspect would you like to know more about?',
        timestamp: '10:30 AM',
      },
    ],
  },
  render: (args) => createChatThread(args),
};

export const LongConversation: Story = {
  name: 'Long Conversation',
  args: {
    messages: [
      {
        role: 'user',
        content: 'What are design tokens?',
        timestamp: '9:15 AM',
      },
      {
        role: 'assistant',
        content: 'Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. They help maintain consistency across your product.',
        timestamp: '9:15 AM',
      },
      {
        role: 'user',
        content: 'Can you give me an example?',
        timestamp: '9:16 AM',
      },
      {
        role: 'assistant',
        content: 'Sure! Examples include colors (like --color-brand: #4f46e5), spacing values (--spacing-md: 16px), and typography (--font-size-lg: 19px). These tokens make it easy to update your entire design system by changing values in one place.',
        timestamp: '9:16 AM',
      },
      {
        role: 'user',
        content: 'That makes sense. Thanks!',
        timestamp: '9:17 AM',
      },
      {
        role: 'assistant',
        content: 'You\'re welcome! Let me know if you have any other questions.',
        timestamp: '9:17 AM',
      },
    ],
  },
  render: (args) => createChatThread(args),
};

export const WithoutTimestamps: Story = {
  name: 'Without Timestamps',
  args: {
    messages: [
      {
        role: 'user',
        content: 'How do I get started?',
      },
      {
        role: 'assistant',
        content: 'Great question! First, make sure you have all the dependencies installed. Then you can start exploring the components in Storybook.',
      },
    ],
  },
  render: (args) => createChatThread(args),
};

export const SingleMessage: Story = {
  name: 'Single Message',
  args: {
    messages: [
      {
        role: 'user',
        content: 'This is a single user message.',
        timestamp: '2:45 PM',
      },
    ],
  },
  render: (args) => createChatThread(args),
};
