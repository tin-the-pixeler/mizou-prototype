import type { Meta, StoryObj } from '@storybook/html';
import { createSkillCard, type SkillCardOptions } from '../components/skillCard';
import { createCriteriaCard } from '../components/criteriaCard';
import { createTextCriteriaCard } from '../components/textCriteriaCard';

type StoryProps = SkillCardOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/Skill Card',
  argTypes: {
    title: { control: 'text' },
    score: { control: 'number' },
    expanded: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'padding:24px; background:var(--surface-page); width:704px;';
  wrapper.appendChild(
    createSkillCard({
      ...args,
      children: [
        createCriteriaCard({ timestamps: ['01:03', '00:23', '01:19', '01:32'] }),
        createCriteriaCard({ variant: 'negative' }),
      ],
    }),
  );
  return wrapper;
};

export const Collapsed: Story = {
  args: { title: 'Building Trust & Rapport', score: 33, expanded: false },
  render,
};

export const Expanded: Story = {
  args: { title: 'Product Knowledge & Positioning', score: 100, expanded: true },
  render,
};

export const TextSimulation: Story = {
  name: 'Text Simulation',
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding:24px; background:var(--surface-page); width:704px;';
    wrapper.appendChild(
      createSkillCard({
        title: 'Product Knowledge & Positioning',
        score: 100,
        expanded: true,
        children: [
          createTextCriteriaCard({
            title: 'Maintained a science-based approach when discussing the product',
            excerpts: [
              "I hear you, Dr. Miller, and I want to make sure we're addressing your concerns properly before moving forward.",
              'Based on the phase III trial data, efficacy was demonstrated across the full patient population we discussed.',
            ],
          }),
          createTextCriteriaCard({
            variant: 'negative',
            title: 'Avoided criticizing current protocols or existing treatment approaches',
          }),
        ],
      }),
    );
    return wrapper;
  },
};

export const List: Story = {
  name: 'List',
  render: () => {
    const col = document.createElement('div');
    col.style.cssText = 'display:flex; flex-direction:column; gap:16px; padding:24px; background:var(--surface-page); width:704px;';

    col.appendChild(
      createSkillCard({
        title: 'Building Trust & Rapport',
        score: 33,
        expanded: false,
        children: [
          createCriteriaCard({ variant: 'negative' }),
          createCriteriaCard({ variant: 'negative' }),
        ],
      }),
    );

    col.appendChild(
      createSkillCard({
        title: 'Product Knowledge & Positioning',
        score: 100,
        expanded: true,
        children: [
          createCriteriaCard({
            title: 'Maintained a science-based approach when discussing the product',
            timestamps: ['01:03', '00:23'],
          }),
          createCriteriaCard({
            title: 'Avoided criticizing current protocols or existing treatment approaches',
            timestamps: ['01:03'],
          }),
        ],
      }),
    );

    return col;
  },
};
