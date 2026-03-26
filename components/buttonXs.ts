// components/buttonXs.ts
// XS pill button with optional left/right icons. Supports default and ocean themes.

import { iconEl, type IconName } from '../icons';

export type ButtonXsTheme = 'default' | 'ocean';

export type ButtonXsOptions = {
  label: string;
  theme?: ButtonXsTheme;
  leftIcon?: IconName;
  rightIcon?: IconName;
  disabled?: boolean;
};

export const buttonXsThemes: ButtonXsTheme[] = ['default', 'ocean'];

export function createButtonXs({
  label,
  theme = 'default',
  leftIcon,
  rightIcon,
  disabled = false,
}: ButtonXsOptions): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `sb-btn-xs sb-btn-xs--${theme}`;
  btn.disabled = disabled;

  // Left icon
  if (leftIcon) {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'sb-btn-xs__icon';
    iconWrap.appendChild(iconEl(leftIcon, 'sb-icon'));
    btn.appendChild(iconWrap);
  }

  // Label
  const text = document.createElement('span');
  text.className = 'sb-btn-xs__label';
  text.textContent = label;
  btn.appendChild(text);

  // Right icon
  if (rightIcon) {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'sb-btn-xs__icon';
    iconWrap.appendChild(iconEl(rightIcon, 'sb-icon'));
    btn.appendChild(iconWrap);
  }

  return btn;
}
