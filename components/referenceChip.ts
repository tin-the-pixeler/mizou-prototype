// components/referenceChip.ts

export type ReferenceChipVariant = 'default' | 'active';

export type ReferenceChipOptions = {
  /** 1-based occurrence number, rendered as "[n]" */
  index: number;
  /** 'default' = plain "[n]". 'active' = highlighted with a leading "View in transcript" label. */
  variant?: ReferenceChipVariant;
  /** Label shown before the number when variant is 'active' */
  label?: string;
  onClick?: (index: number) => void;
};

export function createReferenceChip(options: ReferenceChipOptions): HTMLElement {
  const { index, variant = 'default', label = 'View in transcript', onClick } = options;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `reference-chip reference-chip--${variant}`;
  btn.addEventListener('click', () => onClick?.(index));

  if (variant === 'active') {
    const labelEl = document.createElement('span');
    labelEl.className = 'reference-chip__label';
    labelEl.textContent = label;
    btn.appendChild(labelEl);
  }

  const num = document.createElement('span');
  num.className = 'reference-chip__index';
  num.textContent = `[${index}]`;
  btn.appendChild(num);

  return btn;
}
