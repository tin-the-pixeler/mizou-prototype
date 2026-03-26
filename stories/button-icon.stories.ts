import type { Meta, StoryObj } from '@storybook/html';
import {
  createButtonIcon,
  buttonIconActions,
  buttonIconSizes,
  type ButtonIconOptions,
} from '../components/buttonIcon';
import type { IconName } from '../icons';

const meta: Meta<ButtonIconOptions> = {
  title: 'Components/Button Icon',
  render: (args) => createButtonIcon(args),
  argTypes: {
    icon: { control: 'text' },
    action: { control: 'select', options: buttonIconActions },
    size: { control: 'select', options: buttonIconSizes },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ButtonIconOptions>;

/* ===== Individual stories ===== */

export const Primary: Story = {
  args: { icon: 'plus-sm' as IconName, action: 'primary', size: 'xs' },
};

export const Secondary: Story = {
  args: { icon: 'plus-sm' as IconName, action: 'secondary', size: 'xs' },
};

export const Tertiary: Story = {
  args: { icon: 'plus-sm' as IconName, action: 'tertiary', size: 'xs' },
};

export const Destructive: Story = {
  args: { icon: 'plus-sm' as IconName, action: 'destructive', size: 'xs' },
};

/* ===== Grid: all action × size combinations ===== */

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '24px';

    for (const action of buttonIconActions) {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '16px';

      const label = document.createElement('span');
      label.textContent = action;
      label.style.width = '100px';
      label.style.fontFamily = 'var(--font-sans)';
      label.style.fontSize = '13px';
      label.style.color = 'var(--text-secondary)';
      label.style.textTransform = 'capitalize';
      row.appendChild(label);

      for (const size of buttonIconSizes) {
        row.appendChild(
          createButtonIcon({ icon: 'plus-sm' as IconName, action, size }),
        );
        // Also show disabled
        row.appendChild(
          createButtonIcon({ icon: 'plus-sm' as IconName, action, size, disabled: true }),
        );
      }

      wrapper.appendChild(row);
    }

    return wrapper;
  },
};
