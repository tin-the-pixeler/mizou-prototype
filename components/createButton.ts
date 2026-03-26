// components/createButton.ts
// Create button with two states:
//   - expanded: full-width pill with gradient bg, sparkle icon + "Create" label
//   - minimized: circular icon-only button with gradient bg, sparkle icon only

import { iconEl, type IconName } from '../icons';

export type CreateButtonState = 'expanded' | 'minimized';

export type CreateButtonOptions = {
  state?: CreateButtonState;
};

export function createCreateButton({
  state = 'expanded',
}: CreateButtonOptions = {}): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `sb-create-btn sb-create-btn--${state}`;

  const icon = iconEl('ai-sparkle' as IconName, 'sb-create-btn__icon');
  btn.appendChild(icon);

  if (state === 'expanded') {
    const label = document.createElement('span');
    label.className = 'sb-create-btn__label';
    label.textContent = 'Create';
    btn.appendChild(label);
  }

  return btn;
}
