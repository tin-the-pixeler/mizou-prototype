import type { Meta, StoryObj } from '@storybook/html';
import {
  createCriteriaCard,
  type CriteriaCardOptions,
  criteriaCardVariants,
} from '../components/criteriaCard';

type StoryProps = CriteriaCardOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/Criteria Card',
  argTypes: {
    title: { control: 'text' },
    variant: { control: 'select', options: criteriaCardVariants },
    activeIndex: { control: 'number' },
    activeLabel: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

const EXCERPTS = [
  { time: '01:03', text: 'Can you tell me a bit more about how this shows up day to day for your team?' },
  { time: '00:23', text: "That's helpful context. One thing our platform does well is give full visibility across teams in real time." },
  { time: '01:19', text: 'Our platform gives full visibility across teams in real time.' },
];

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'padding:24px; background:var(--surface-page); width:704px;';
  wrapper.appendChild(createCriteriaCard(args));
  return wrapper;
};

export const Positive: Story = {
  args: {
    title: 'Evaluation Criteria',
    variant: 'positive',
    excerpts: EXCERPTS,
    activeLabel: 'View in transcript',
  },
  render,
};

export const Negative: Story = {
  args: {
    title: 'Evaluation Criteria',
    variant: 'negative',
  },
  render,
};

export const List: Story = {
  name: 'List',
  render: () => {
    const col = document.createElement('div');
    col.style.cssText = 'display:flex; flex-direction:column; gap:12px; padding:24px; background:var(--surface-page); width:704px;';

    col.appendChild(createCriteriaCard({ excerpts: EXCERPTS }));
    col.appendChild(createCriteriaCard({ variant: 'negative' }));
    col.appendChild(createCriteriaCard({ variant: 'negative' }));
    col.appendChild(createCriteriaCard({ variant: 'negative' }));

    return col;
  },
};
