import type { Meta, StoryObj } from '@storybook/html';
import {
  createTimestampChip,
  type TimestampChipOptions,
  timestampChipVariants,
} from '../components/timestampChip';

type StoryProps = TimestampChipOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/Timestamp Chip',
  argTypes: {
    time: { control: 'text' },
    variant: { control: 'select', options: timestampChipVariants },
    label: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.background = 'var(--surface-page)';
  wrapper.appendChild(createTimestampChip(args));
  return wrapper;
};

export const Default: Story = {
  args: { time: '01:03', variant: 'default' },
  render,
};

export const Active: Story = {
  args: { time: '01:32', variant: 'active', label: 'View in transcript' },
  render: (args: StoryProps) => {
    const wrapper = document.createElement('div');
    wrapper.style.padding = '24px';
    wrapper.style.background = 'var(--surface-page)';
    wrapper.appendChild(
      createTimestampChip({
        ...args,
        onSelect: time => console.log('select', time),
        onPlay: time => console.log('play', time),
      }),
    );
    return wrapper;
  },
};

export const Row: Story = {
  render: () => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; flex-wrap:wrap; padding:24px; background:var(--surface-page);';
    ['01:03', '00:23', '01:19'].forEach(time => {
      row.appendChild(createTimestampChip({ time, variant: 'default' }));
    });
    row.appendChild(
      createTimestampChip({
        time: '01:32',
        variant: 'active',
        onPlay: time => console.log('play', time),
      }),
    );
    return row;
  },
};
