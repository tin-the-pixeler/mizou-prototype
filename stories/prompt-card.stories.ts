import type { Meta, StoryObj } from '@storybook/html';
import { createPromptCard, type PromptCardOptions } from '../components/promptCard';

const meta: Meta<PromptCardOptions> = {
  title: 'Components/Card Prompt',
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.maxWidth = '290px';
    wrapper.appendChild(createPromptCard(args));
    return wrapper;
  },
  argTypes: {
    title: { control: 'text' },
    text: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<PromptCardOptions>;

export const Default: Story = {
  args: {
    title: 'Leadership Scenario',
    text: 'Give constructive feedback to an employee missing deadlines. Objective: motivate improvement without damaging trust.',
  },
};

export const LongText: Story = {
  name: 'Long Text (Clamped)',
  args: {
    title: 'Sales Scenario',
    text: "Convince a skeptical client to switch from a competitor's SaaS platform to yours. Objective: use discovery techniques and value-based selling to overcome objections and close the deal.",
  },
};
