// components/button.ts

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'tonal' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonOptions = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  pill?: boolean;
};

export const buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'tonal', 'dark'];
export const buttonSizes: ButtonSize[] = ['sm', 'md', 'lg'];

export function createButton({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  pill = false,
}: ButtonOptions): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';

  const classes = ['sb-button', `sb-button--${variant}`, `sb-button--${size}`];
  if (pill) classes.push('sb-button--pill');
  btn.className = classes.join(' ');

  btn.disabled = disabled;
  btn.textContent = label;

  return btn;
}
