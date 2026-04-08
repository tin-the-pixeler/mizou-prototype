// components/tooltip.ts
// Compact tooltip bubble with a downward-pointing arrow.

export type TooltipOptions = {
  /** Tooltip body text */
  text: string;
};

export function createTooltip({ text }: TooltipOptions): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'tooltip';

  const textEl = document.createElement('p');
  textEl.className = 'tooltip__text';
  textEl.textContent = text;

  const arrow = document.createElement('div');
  arrow.className = 'tooltip__arrow';

  wrapper.append(textEl, arrow);
  return wrapper;
}
