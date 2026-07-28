import type { Meta, StoryObj } from '@storybook/html';
import {
  createTextCriteriaCard,
  type TextCriteriaCardOptions,
  textCriteriaCardVariants,
} from '../components/textCriteriaCard';

type StoryProps = TextCriteriaCardOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/Text Criteria Card',
  argTypes: {
    title: { control: 'text' },
    variant: { control: 'select', options: textCriteriaCardVariants },
    viewInTranscriptLabel: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'padding:24px; background:var(--surface-page); width:404px;';
  wrapper.appendChild(createTextCriteriaCard(args));
  return wrapper;
};

export const Positive: Story = {
  args: {
    title: 'Maintained a science-based approach when discussing the product',
    variant: 'positive',
    excerpts: [
      "I hear you, Dr. Miller, and I want to make sure we're addressing your concerns properly before moving forward.",
      'Based on the phase III trial data, efficacy was demonstrated across the full patient population we discussed.',
    ],
  },
  render,
};

export const SingleExcerpt: Story = {
  name: 'Single Excerpt',
  args: {
    title: 'Maintained a science-based approach when discussing the product',
    variant: 'positive',
    excerpts: [
      "I hear you, Dr. Miller, and I want to make sure we're addressing your concerns properly before moving forward.",
    ],
  },
  render,
};

export const Negative: Story = {
  args: {
    title: 'Maintained a science-based approach when discussing the product',
    variant: 'negative',
  },
  render,
};
