import type { Meta, StoryObj } from '@storybook/html';
import {
  createButtonXs,
  buttonXsThemes,
  type ButtonXsOptions,
} from '../components/buttonXs';
import type { IconName } from '../icons';

const meta: Meta<ButtonXsOptions> = {
  title: 'Components/Button XS',
  render: (args) => createButtonXs(args),
  argTypes: {
    label: { control: 'text' },
    theme: { control: 'select', options: buttonXsThemes },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ButtonXsOptions>;

export const Default: Story = {
  args: {
    label: 'Chat',
    theme: 'default',
    rightIcon: 'chevron-down-sm' as IconName,
  },
};

export const Ocean: Story = {
  args: {
    label: '5,000',
    theme: 'ocean',
    rightIcon: 'skills' as IconName,
  },
};

export const WithLeftIcon: Story = {
  name: 'With Left Icon',
  args: {
    label: 'Chat',
    theme: 'default',
    leftIcon: 'chevron-down-sm' as IconName,
    rightIcon: 'chevron-down-sm' as IconName,
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '16px';

    // Default theme row
    const defaultRow = document.createElement('div');
    defaultRow.style.display = 'flex';
    defaultRow.style.alignItems = 'center';
    defaultRow.style.gap = '12px';

    const defaultLabel = document.createElement('span');
    defaultLabel.textContent = 'Default';
    defaultLabel.style.width = '80px';
    defaultLabel.style.fontFamily = 'var(--font-sans)';
    defaultLabel.style.fontSize = '13px';
    defaultLabel.style.color = 'var(--text-secondary)';
    defaultRow.appendChild(defaultLabel);

    defaultRow.appendChild(createButtonXs({ label: 'Chat', theme: 'default', rightIcon: 'chevron-down-sm' as IconName }));
    defaultRow.appendChild(createButtonXs({ label: 'Chat', theme: 'default', rightIcon: 'chevron-down-sm' as IconName, disabled: true }));
    wrapper.appendChild(defaultRow);

    // Ocean theme row
    const oceanRow = document.createElement('div');
    oceanRow.style.display = 'flex';
    oceanRow.style.alignItems = 'center';
    oceanRow.style.gap = '12px';

    const oceanLabel = document.createElement('span');
    oceanLabel.textContent = 'Ocean';
    oceanLabel.style.width = '80px';
    oceanLabel.style.fontFamily = 'var(--font-sans)';
    oceanLabel.style.fontSize = '13px';
    oceanLabel.style.color = 'var(--text-secondary)';
    oceanRow.appendChild(oceanLabel);

    oceanRow.appendChild(createButtonXs({ label: '5,000', theme: 'ocean', rightIcon: 'skills' as IconName }));
    oceanRow.appendChild(createButtonXs({ label: '5,000', theme: 'ocean', rightIcon: 'skills' as IconName, disabled: true }));
    wrapper.appendChild(oceanRow);

    return wrapper;
  },
};
