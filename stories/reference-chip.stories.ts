import type { Meta, StoryObj } from '@storybook/html';
import { createReferenceChip, type ReferenceChipOptions } from '../components/referenceChip';

type StoryProps = ReferenceChipOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/Reference Chip',
  argTypes: {
    index: { control: 'number' },
    active: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.background = 'var(--surface-page)';
  wrapper.appendChild(createReferenceChip(args));
  return wrapper;
};

export const Default: Story = {
  args: { index: 1, active: false },
  render,
};

export const Active: Story = {
  args: { index: 2, active: true },
  render,
};

export const Row: Story = {
  render: () => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; padding:24px; background:var(--surface-page);';
    row.appendChild(createReferenceChip({ index: 1, active: false }));
    row.appendChild(createReferenceChip({ index: 2, active: true }));
    row.appendChild(createReferenceChip({ index: 3, active: false }));
    return row;
  },
};
