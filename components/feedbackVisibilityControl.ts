// components/feedbackVisibilityControl.ts
// Per-feedback visibility control. Toggles between "Visible to manager" and
// "Hidden from manager".
//   badge — pill with eye icon + state label (default; sits next to a header)
//   icon  — compact icon-only button for tight spaces (label via aria-label/title)

import { iconEl } from '../icons';

export type FeedbackVisibility = 'visible' | 'hidden';
export type FeedbackVisibilityControlVariant = 'badge' | 'icon';

export type FeedbackVisibilityControlOptions = {
  /** Initial state */
  visibility?: FeedbackVisibility;
  variant?: FeedbackVisibilityControlVariant;
  disabled?: boolean;
  /** Called after the control is toggled, with the new state */
  onChange?: (visibility: FeedbackVisibility) => void;
};

export const feedbackVisibilityLabels: Record<FeedbackVisibility, string> = {
  visible: 'Visible to manager',
  hidden: 'Hidden from manager',
};

export function createFeedbackVisibilityControl({
  visibility: initial = 'hidden',
  variant = 'badge',
  disabled = false,
  onChange,
}: FeedbackVisibilityControlOptions = {}): HTMLButtonElement {
  let current: FeedbackVisibility = initial;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.disabled = disabled;
  btn.setAttribute('role', 'switch');

  const label = document.createElement('span');
  label.className = 'fb-visibility__label';

  let icon = iconEl('eye', 'fb-visibility__icon');

  const render = () => {
    btn.className = `fb-visibility fb-visibility--${variant} fb-visibility--${current}`;
    btn.setAttribute('aria-checked', String(current === 'visible'));
    btn.setAttribute('aria-label', feedbackVisibilityLabels[current]);
    btn.title = feedbackVisibilityLabels[current];
    label.textContent = feedbackVisibilityLabels[current];
    const next = iconEl(current === 'visible' ? 'eye' : 'eye-off', 'fb-visibility__icon');
    icon.replaceWith(next);
    icon = next;
  };

  btn.appendChild(icon);
  if (variant === 'badge') btn.appendChild(label);
  render();

  btn.addEventListener('click', () => {
    current = current === 'visible' ? 'hidden' : 'visible';
    render();
    onChange?.(current);
  });

  return btn;
}
