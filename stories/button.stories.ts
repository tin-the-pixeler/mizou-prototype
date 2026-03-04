import type { Meta, StoryObj } from '@storybook/html';
import {
  createButton,
  buttonVariants,
  buttonSizes,
  type ButtonVariant,
  type ButtonSize,
} from '../components/button';

const meta: Meta<{
  label: string;
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  pill: boolean;
}> = {
  title: 'Components/Button',
  argTypes: {
    label:    { control: 'text' },
    variant:  { control: 'select', options: buttonVariants },
    size:     { control: 'select', options: buttonSizes },
    disabled: { control: 'boolean' },
    pill:     { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<{
  label: string;
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  pill: boolean;
}>;

/* ---------- Interactive single-button stories ---------- */

export const Primary: Story = {
  args: { label: 'Label', variant: 'primary', size: 'md', disabled: false, pill: false },
  render: (args) => createButton(args),
};

export const Secondary: Story = {
  args: { label: 'Label', variant: 'secondary', size: 'md', disabled: false, pill: false },
  render: (args) => createButton(args),
};

export const Ghost: Story = {
  args: { label: 'Label', variant: 'ghost', size: 'md', disabled: false, pill: false },
  render: (args) => createButton(args),
};

export const Tonal: Story = {
  args: { label: 'Label', variant: 'tonal', size: 'md', disabled: false, pill: false },
  render: (args) => createButton(args),
};

export const Dark: Story = {
  args: { label: 'Label', variant: 'dark', size: 'md', disabled: false, pill: false },
  render: (args) => createButton(args),
};

export const Pill: Story = {
  name: 'Pill Shape',
  args: { label: 'Label', variant: 'dark', size: 'md', disabled: false, pill: true },
  render: (args) => createButton(args),
};

export const Disabled: Story = {
  args: { label: 'Label', variant: 'primary', size: 'md', disabled: true, pill: false },
  render: (args) => createButton(args),
};

/* ---------- Grid: all variants x sizes x states ---------- */

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const grid = document.createElement('div');
    grid.style.cssText = 'display:flex; gap:48px; flex-wrap:wrap; padding:24px;';

    for (const variant of buttonVariants) {
      const col = document.createElement('div');
      col.style.cssText = 'display:flex; flex-direction:column; gap:32px;';

      // Section heading
      const heading = document.createElement('h3');
      heading.textContent = variant.charAt(0).toUpperCase() + variant.slice(1);
      heading.style.cssText =
        'margin:0; font-size:13px; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em;';
      col.appendChild(heading);

      for (const size of buttonSizes) {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; gap:12px; align-items:center;';

        // Default
        row.appendChild(createButton({ label: 'Label', variant, size }));

        // Disabled
        row.appendChild(createButton({ label: 'Label', variant, size, disabled: true }));

        col.appendChild(row);
      }

      // Pill row
      const pillRow = document.createElement('div');
      pillRow.style.cssText = 'display:flex; gap:12px; align-items:center; margin-top:8px;';
      for (const size of buttonSizes) {
        pillRow.appendChild(createButton({ label: 'Label', variant, size, pill: true }));
      }
      col.appendChild(pillRow);

      grid.appendChild(col);
    }

    return grid;
  },
};
