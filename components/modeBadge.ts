// components/modeBadge.ts
// Compact pill badge showing the current mode (Create / Plan).
// Hover shows a tooltip; click switches to the opposite mode.

import { iconEl } from '../icons';
import { createTooltip } from './tooltip';

export type ModeBadgeMode = 'create' | 'plan';

export type ModeBadgeOptions = {
  /** Initial active mode */
  mode?: ModeBadgeMode;
  /** Called after the mode is switched, with the new mode */
  onChange?: (mode: ModeBadgeMode) => void;
};

const TOOLTIP_TEXT: Record<ModeBadgeMode, string> = {
  create:
    'Create Mode - Edit and generate with the AI. Click here to switch to Plan mode to discuss with the AI.',
  plan:
    'Discuss with the AI without generating or editing the artefact. Click here to switch to Create Mode to edit or generate.',
};

export function createModeBadge({
  mode: initialMode = 'create',
  onChange,
}: ModeBadgeOptions = {}): HTMLElement {
  let currentMode: ModeBadgeMode = initialMode;

  // Wrapper — tooltip is positioned relative to this
  const wrapper = document.createElement('div');
  wrapper.className = 'mode-badge-wrapper';

  // Tooltip — outer div handles absolute positioning, inner .tooltip keeps position:relative for arrow
  const tooltipContainer = document.createElement('div');
  tooltipContainer.className = 'mode-badge-wrapper__tooltip';
  const tooltip = createTooltip({ text: TOOLTIP_TEXT[currentMode] });
  tooltipContainer.appendChild(tooltip);

  // Badge button
  const badge = document.createElement('button');
  badge.type = 'button';
  badge.className = `mode-badge mode-badge--${currentMode}`;

  const root = document.createElement('span');
  root.className = 'mode-badge__root';

  const label = document.createElement('span');
  label.className = 'mode-badge__label';
  label.textContent = currentMode === 'create' ? 'Create' : 'Plan';
  root.appendChild(label);

  const chevron = iconEl('chevron-down-sm', 'mode-badge__chevron');

  badge.append(root, chevron);

  // Click → switch mode
  badge.addEventListener('click', () => {
    currentMode = currentMode === 'create' ? 'plan' : 'create';

    // Update badge appearance
    badge.className = `mode-badge mode-badge--${currentMode}`;
    label.textContent = currentMode === 'create' ? 'Create' : 'Plan';

    // Update tooltip text
    const textEl = tooltipContainer.querySelector('.tooltip__text');
    if (textEl) textEl.textContent = TOOLTIP_TEXT[currentMode];

    onChange?.(currentMode);
  });

  wrapper.append(tooltipContainer, badge);
  return wrapper;
}
