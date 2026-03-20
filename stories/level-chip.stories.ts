import type { Meta, StoryObj } from '@storybook/html';
import {
  createLevelChip,
  type LevelChipOptions,
  type LevelChipTheme,
  levelChipThemes,
  levelNames,
  levelConfigs,
} from '../components/levelChip';

type StoryProps = LevelChipOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/Level Chip',
  argTypes: {
    label: { control: 'text' },
    theme: { control: 'select', options: levelChipThemes },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.background = 'var(--surface-page)';
  wrapper.appendChild(createLevelChip(args));
  return wrapper;
};

export const Default: Story = {
  args: {
    label: 'Dismissive',
    theme: 'yellow',
  },
  render,
};

export const AllLevels: Story = {
  name: 'All Levels',
  render: () => {
    const col = document.createElement('div');
    col.style.cssText = 'display:flex; flex-direction:column; gap:16px; padding:24px; background:var(--surface-page); align-items:flex-start;';

    for (const name of levelNames) {
      const cfg = levelConfigs[name];
      col.appendChild(createLevelChip({ label: name, theme: cfg.theme }));
    }
    return col;
  },
};
