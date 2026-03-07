import type { Meta, StoryObj } from '@storybook/html';
import { createChatPage, type ChatPageOptions } from '../components/chatPage';

const meta: Meta<ChatPageOptions> = {
  title: 'Pages/Chat Page',
  render: (args) => createChatPage(args),
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<ChatPageOptions>;

export const Default: Story = {
  args: {
    header: {
      type: 'Chatbot',
      title: 'Draft',
    },
    messages: [
      {
        role: 'user',
        content: 'To teach effective communication to senior management',
      },
      {
        role: 'thinking',
        state: 'populated',
        expanded: false,
        events: [
          {
            variant: 'thinking',
            description: 'Analyzing the user request to understand the learning objective.',
          },
          {
            variant: 'decision',
            label: 'Decided on approach',
            description:
              'Will create a leadership roleplay focused on effective communication skills.',
          },
        ],
      },
      {
        role: 'assistant',
        content:
          "<p>Got it — I'll build a leadership roleplay focused on effective communication. Just need to clarify three things.</p>",
      },
    ],
    input: {
      placeholder: 'Type your message',
      state: 'default',
      formatLabel: 'Chatbot',
      formatSelected: true,
    },
  },
};
