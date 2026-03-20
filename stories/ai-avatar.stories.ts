import type { Meta, StoryObj } from '@storybook/html';
import { createAiAvatar, type AiAvatarOptions, type AiAvatarSize } from '../components/aiAvatar';

type StoryProps = AiAvatarOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/AI Avatar',
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] as AiAvatarSize[] },
    alt: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.background = 'var(--surface-page)';
  wrapper.appendChild(createAiAvatar(args));
  return wrapper;
};

export const Default: Story = {
  args: { size: 'lg', alt: 'AI Avatar' },
  render,
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; gap:24px; align-items:center; padding:24px; background:var(--surface-page)';

    for (const size of ['sm', 'md', 'lg'] as AiAvatarSize[]) {
      const col = document.createElement('div');
      col.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:8px;';

      col.appendChild(createAiAvatar({ size }));

      const label = document.createElement('span');
      label.textContent = size.toUpperCase();
      label.style.cssText = 'font-size:13px; font-weight:600; color:var(--text-secondary); text-transform:uppercase;';
      col.appendChild(label);

      row.appendChild(col);
    }
    return row;
  },
};
