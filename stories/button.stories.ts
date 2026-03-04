import type { Meta, StoryObj } from '@storybook/html';
import {
  createButton,
  buttonVariants,
  buttonSizes,
  type ButtonVariant,
  type ButtonSize,
} from '../components/button';
import { iconNames, type IconName } from '../icons';

type ButtonProps = {
  label: string;
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  leftIcon: IconName | '';
  rightIcon: IconName | '';
};

const iconOptions = ['', ...iconNames];

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  argTypes: {
    label:     { control: 'text' },
    variant:   { control: 'select', options: buttonVariants },
    size:      { control: 'select', options: buttonSizes },
    disabled:  { control: 'boolean' },
    leftIcon:  { control: 'select', options: iconOptions },
    rightIcon: { control: 'select', options: iconOptions },
  },
};
export default meta;

type Story = StoryObj<ButtonProps>;

const render = (args: ButtonProps) =>
  createButton({
    ...args,
    leftIcon: args.leftIcon || undefined,
    rightIcon: args.rightIcon || undefined,
  });

/* ---------- Individual variant stories ---------- */

export const Primary: Story = {
  args: { label: 'Label', variant: 'primary', size: 'md', disabled: false, leftIcon: '', rightIcon: '' },
  render,
};

export const Secondary: Story = {
  args: { label: 'Label', variant: 'secondary', size: 'md', disabled: false, leftIcon: '', rightIcon: '' },
  render,
};

export const Tertiary: Story = {
  args: { label: 'Label', variant: 'tertiary', size: 'md', disabled: false, leftIcon: '', rightIcon: '' },
  render,
};

export const Special: Story = {
  args: { label: 'Label', variant: 'special', size: 'md', disabled: false, leftIcon: '', rightIcon: '' },
  render,
};

export const Disabled: Story = {
  args: { label: 'Label', variant: 'primary', size: 'md', disabled: true, leftIcon: '', rightIcon: '' },
  render,
};

export const WithIcons: Story = {
  name: 'With Icons',
  args: { label: 'Label', variant: 'primary', size: 'md', disabled: false, leftIcon: 'new-simulation', rightIcon: '' },
  render,
};

/* ---------- Grid: all variants x sizes x states ---------- */

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const grid = document.createElement('div');
    grid.style.cssText = 'display:flex; gap:48px; flex-wrap:wrap; padding:24px;';

    for (const variant of buttonVariants) {
      const col = document.createElement('div');
      col.style.cssText = 'display:flex; flex-direction:column; gap:24px;';

      const heading = document.createElement('h3');
      heading.textContent = variant.charAt(0).toUpperCase() + variant.slice(1);
      heading.style.cssText =
        'margin:0; font-size:13px; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em;';
      col.appendChild(heading);

      for (const size of buttonSizes) {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; gap:12px; align-items:center;';

        row.appendChild(createButton({ label: 'Label', variant, size }));
        row.appendChild(createButton({ label: 'Label', variant, size, disabled: true }));

        col.appendChild(row);
      }

      grid.appendChild(col);
    }

    return grid;
  },
};
