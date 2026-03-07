import type { Meta, StoryObj } from '@storybook/html';
import { createChatThread, type ChatThreadOptions } from '../components/chatThread';

const meta: Meta<ChatThreadOptions> = {
  title: 'Chat/Chat Thread',
  render: (args) => createChatThread(args),
  argTypes: {
    messages: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<ChatThreadOptions>;

export const Default: Story = {
  args: {
    messages: [
      {
        role: 'user',
        content: 'Hello! Can you help me understand how to use this component?',
      },
      {
        role: 'assistant',
        content:
          '<p>Of course! I\'d be happy to help you understand this component. What specific aspect would you like to know more about?</p>',
      },
    ],
  },
};

export const LongConversation: Story = {
  name: 'Long Conversation',
  args: {
    messages: [
      {
        role: 'user',
        content: 'What are design tokens?',
      },
      {
        role: 'assistant',
        content:
          '<p>Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. They help maintain consistency across your product.</p>',
      },
      {
        role: 'user',
        content: 'Can you give me an example?',
      },
      {
        role: 'assistant',
        content:
          '<p>Sure! Examples include colors (like <code>--color-brand: #4f46e5</code>), spacing values (<code>--spacing-md: 16px</code>), and typography (<code>--font-size-lg: 19px</code>). These tokens make it easy to update your entire design system by changing values in one place.</p>',
      },
      {
        role: 'user',
        content: 'That makes sense. Thanks!',
      },
      {
        role: 'assistant',
        content: "<p>You're welcome! Let me know if you have any other questions.</p>",
      },
    ],
  },
};

export const WithArtifact: Story = {
  name: 'With Artifact',
  args: {
    messages: [
      {
        role: 'user',
        content: 'Cybersecurity crisis management',
      },
      {
        role: 'assistant',
        content: `<p>I've created a cybersecurity incident response simulation with the following learning objectives:</p>
<ol>
  <li><strong>Crisis Decision-Making Under Pressure:</strong> Demonstrate the ability to make sound cybersecurity decisions while managing competing stakeholder demands, regulatory deadlines, and business continuity requirements in a high-stress environment.</li>
  <li><strong>Stakeholder Communication and Management:</strong> Effectively communicate complex technical incidents to non-technical stakeholders using clear language while managing their concerns, expectations, and potentially problematic suggestions.</li>
  <li><strong>Incident Response Framework Application:</strong> Apply structured incident response protocols to a financial services breach scenario, including proper evidence preservation, regulatory compliance, and coordinated response planning within banking industry constraints.</li>
</ol>
<p><strong>Scenario Overview:</strong><br>This simulation places the learner as the cybersecurity incident coordinator at MidState Community Bank responding to a data breach affecting 85,000 customer records. The AI will roleplay as Patricia Chen, the Operations Manager who's been awakened at 3:15 AM about the incident. She's panicked, has limited technical knowledge, but understands business implications and needs immediate guidance from the learner.</p>
<p><strong>Key Elements I've Included:</strong></p>
<p><strong>Character Background:</strong> Patricia is anxious and overwhelmed, seeking reassurance while creating realistic pressure through her concerns about the 9 AM board meeting, regulatory deadlines, and potential media exposure.</p>
<p><strong>Information Reveals:</strong> The AI will gradually share critical details like the scope of the breach, that online banking is still operational, that there have been similar regional attacks, and that backups are 48 hours old.</p>
<p><strong>Testing Scenarios:</strong> Patricia will make several problematic suggestions to test the learner's expertise - like delaying regulatory notification, wiping systems immediately, or minimising the incident scope.</p>
<p><strong>Communication Style:</strong> She'll interrupt technical explanations asking for "plain English," push back on business-disrupting recommendations, and express new concerns as they occur to her.</p>
<p><strong>Pressure Points:</strong> Time constraints (board meeting), business continuity (payroll processing at 6 AM), regulatory requirements, and reputation management.</p>
<p>The simulation is designed to create an authentic crisis atmosphere while giving the learner opportunities to demonstrate proper incident response protocols, stakeholder management, and decision-making under pressure.</p>`,
        artifact: {
          title:
            'Time-Critical Financial Services Incident: Coordinating Technical Response with Business Stakeholder Demands',
          subtitle: 'Version 1',
        },
      },
    ],
  },
};

export const SingleMessage: Story = {
  name: 'Single Message',
  args: {
    messages: [
      {
        role: 'user',
        content: 'This is a single user message.',
      },
    ],
  },
};
