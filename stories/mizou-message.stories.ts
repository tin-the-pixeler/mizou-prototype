import type { Meta, StoryObj } from '@storybook/html';
import { createMizouMessage, type MizouMessageOptions } from '../components/mizouMessage';

const meta: Meta<MizouMessageOptions> = {
  title: 'Chat/MizouMessage',
  render: (args) => createMizouMessage(args),
  argTypes: {
    content: { control: 'text' },
    footer: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<MizouMessageOptions>;

export const PlainText: Story = {
  args: {
    content: 'Sure! I can help you practice objection handling. Let me set up a scenario for you.',
  },
};

export const WithMarkdown: Story = {
  args: {
    content: `
      <h2>Objection Handling Tips</h2>
      <p>Here are a few techniques to keep in mind:</p>
      <ul>
        <li><strong>Acknowledge</strong> the concern before responding</li>
        <li><strong>Ask clarifying questions</strong> to understand the root issue</li>
        <li><strong>Reframe</strong> the objection as an opportunity</li>
      </ul>
      <p>Let's try a practice round. I'll play the customer.</p>
    `,
  },
};

export const WithArtifact: Story = {
  args: {
    content: 'message',
    artifact: {
      title: 'Objection handling, building rapport and prospecting a possible lead for a paper company',
      subtitle: 'Version 1',
    },
  },
};

export const WithFooter: Story = {
  args: {
    content: 'That was a great session! Here are your results.',
    footer: 'Session ended · 12 min',
  },
};

export const FullMessage: Story = {
  args: {
    content: 'message',
    artifact: {
      title: 'Objection handling, building rapport and prospecting a possible lead for a paper company',
      subtitle: 'Version 1',
    },
    footer: 'Simulation ready · Click to begin',
  },
};
