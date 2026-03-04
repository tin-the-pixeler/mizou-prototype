// components/button.ts
import { iconEl, type IconName } from '../icons';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'special';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonOptions = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
};

export const buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'special'];
export const buttonSizes: ButtonSize[] = ['sm', 'md', 'lg'];

export function createButton({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  leftIcon,
  rightIcon,
}: ButtonOptions): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `sb-button sb-button--${variant} sb-button--${size}`;
  btn.disabled = disabled;

  if (leftIcon) {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'sb-button__icon';
    iconWrap.appendChild(iconEl(leftIcon, 'sb-icon'));
    btn.appendChild(iconWrap);
  }

  const text = document.createElement('span');
  text.textContent = label;
  btn.appendChild(text);

  if (rightIcon) {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'sb-button__icon';
    iconWrap.appendChild(iconEl(rightIcon, 'sb-icon'));
    btn.appendChild(iconWrap);
  }

  return btn;
}
