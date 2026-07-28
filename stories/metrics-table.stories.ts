import type { Meta, StoryObj } from '@storybook/html';
import { createMetricsTable, type MetricsTableOptions, defaultMetrics } from '../components/metricsTable';

type StoryProps = MetricsTableOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/Metrics Table',
};
export default meta;

type Story = StoryObj<StoryProps>;

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'padding:24px; background:var(--surface-page); width:800px;';
  wrapper.appendChild(createMetricsTable(args));
  return wrapper;
};

export const Default: Story = {
  args: { metrics: defaultMetrics },
  render,
};

export const AllPassing: Story = {
  name: 'All Passing',
  args: {
    metrics: defaultMetrics.map(m => ({ ...m, status: 'pass', value: Math.round((m.goodMin + m.goodMax) / 2) })),
  },
  render,
};
