import type { Meta, StoryObj } from '@storybook/html';
import { createInstructionField, type InstructionFieldOptions } from '../components/instructionField';

type StoryProps = InstructionFieldOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/Instruction Field',
  argTypes: {
    header: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

const sampleItems = [
  {
    title: 'Strategic Alignment',
    body: 'Leveraging cross-functional synergies to optimise key deliverables and ensure stakeholder buy-in across all verticals.',
  },
  {
    title: 'Operational Efficiency',
    body: 'Streamlining workflow pipelines to maximise bandwidth and facilitate scalable outcomes within the current roadmap.',
  },
  {
    title: 'Value Proposition',
    body: 'Driving actionable insights to elevate key performance indicators and reinforce core mission-critical objectives.',
  },
  {
    title: 'Digital Transformation',
    body: 'Harnessing disruptive technologies to future-proof enterprise architecture and accelerate go-to-market strategies.',
  },
];

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.maxWidth = '600px';
  wrapper.style.background = 'var(--surface-page)';
  wrapper.appendChild(createInstructionField(args));
  return wrapper;
};

export const Default: Story = {
  name: 'Default (with content)',
  args: {
    header: 'Read instructions',
    items: sampleItems,
  },
  render,
};

export const Empty: Story = {
  name: 'Active (empty / editing)',
  args: {
    header: 'Read instructions',
    items: [],
  },
  render,
};

export const AllStates: Story = {
  name: 'All States',
  render: () => {
    const col = document.createElement('div');
    col.style.cssText = 'display:flex; flex-direction:column; gap:32px; padding:24px; max-width:600px; background:var(--surface-page);';

    // Default
    const label1 = document.createElement('h3');
    label1.textContent = 'Default';
    label1.style.cssText = 'margin:0; font-family:var(--font-sans); font-size:14px; color:var(--text-secondary);';
    col.appendChild(label1);
    col.appendChild(createInstructionField({ header: 'Read instructions', items: sampleItems }));

    // Hover
    const label2 = document.createElement('h3');
    label2.textContent = 'Hover (hover over the body area)';
    label2.style.cssText = 'margin:0; font-family:var(--font-sans); font-size:14px; color:var(--text-secondary);';
    col.appendChild(label2);
    col.appendChild(createInstructionField({ header: 'Read instructions', items: sampleItems }));

    // Active / Editing
    const label3 = document.createElement('h3');
    label3.textContent = 'Active (click into the body to edit)';
    label3.style.cssText = 'margin:0; font-family:var(--font-sans); font-size:14px; color:var(--text-secondary);';
    col.appendChild(label3);
    col.appendChild(createInstructionField({ header: 'Read instructions', items: [] }));

    return col;
  },
};
