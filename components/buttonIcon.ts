// components/buttonIcon.ts
// Circular icon-only button with action variants and sizes.

import { iconEl, type IconName } from '../icons';

export type ButtonIconAction = 'primary' | 'secondary' | 'tertiary' | 'destructive';
export type ButtonIconSize = 'xs' | 'sm' | 'md';

export type ButtonIconOptions = {
  icon: IconName;
  action?: ButtonIconAction;
  size?: ButtonIconSize;
  disabled?: boolean;
  /** aria-label for accessibility */
  label?: string;
};

export const buttonIconActions: ButtonIconAction[] = ['primary', 'secondary', 'tertiary', 'destructive'];
export const buttonIconSizes: ButtonIconSize[] = ['xs', 'sm', 'md'];

export function createButtonIcon({
  icon,
  action = 'primary',
  size = 'xs',
  disabled = false,
  label,
}: ButtonIconOptions): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `sb-btn-icon sb-btn-icon--${action} sb-btn-icon--${size}`;
  btn.disabled = disabled;
  if (label) btn.setAttribute('aria-label', label);

  const iconSpan = iconEl(icon, 'sb-btn-icon__icon');
  btn.appendChild(iconSpan);

  return btn;
}
