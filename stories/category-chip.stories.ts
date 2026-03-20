import type { Meta, StoryObj } from '@storybook/html';
import {
  createCategoryChip,
  type CategoryChipOptions,
  type CategoryType,
  categoryTypes,
} from '../components/categoryChip';

type StoryProps = CategoryChipOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/Category Chip',
  argTypes: {
    category: { control: 'select', options: categoryTypes },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.background = 'var(--surface-page)';
  wrapper.appendChild(createCategoryChip(args));
  return wrapper;
};

export const Default: Story = {
  args: { category: 'Management' },
  render,
};

export const AllCategories: Story = {
  name: 'All Categories',
  render: () => {
    const col = document.createElement('div');
    col.style.cssText = 'display:flex; flex-direction:column; gap:8px; padding:24px; background:var(--surface-page); align-items:flex-start;';

    for (const category of categoryTypes) {
      col.appendChild(createCategoryChip({ category }));
    }
    return col;
  },
};
