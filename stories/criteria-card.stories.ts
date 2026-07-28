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
    excerptLabel: { control: 'text' },
    activeIndex: { control: 'number' },
    activeLabel: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

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
    excerptLabel: 'Transcript excerpt',
    timestamps: ['01:03', '00:23', '01:19', '01:32'],
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

    col.appendChild(createCriteriaCard());
    col.appendChild(createCriteriaCard({ variant: 'negative' }));
    col.appendChild(createCriteriaCard({ variant: 'negative' }));
    col.appendChild(createCriteriaCard({ variant: 'negative' }));

    return col;
  },
};
