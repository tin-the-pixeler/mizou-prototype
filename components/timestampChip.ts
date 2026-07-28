// components/timestampChip.ts

import { iconEl } from '../icons';

export type TimestampChipVariant = 'default' | 'active';

export type TimestampChipOptions = {
  /** Timestamp label, e.g. "01:03" */
  time: string;
  /** 'default' = plain time chip, no play control. 'active' = highlighted chip with a "View in transcript" label and a separately clickable play control. */
  variant?: TimestampChipVariant;
  /** Label shown before the time when variant is 'active' */
  label?: string;
  /** Selects this timestamp (switches the active tab / jumps to its transcript position) */
  onSelect?: (time: string) => void;
  /** Plays the excerpt's audio. Only reachable when variant is 'active'. */
  onPlay?: (time: string) => void;
};

export const timestampChipVariants: TimestampChipVariant[] = ['default', 'active'];

export function createTimestampChip(options: TimestampChipOptions): HTMLElement {
  const { time, variant = 'default', label = 'View in transcript', onSelect, onPlay } = options;

  const root = document.createElement('div');
  root.className = `timestamp-chip timestamp-chip--${variant}`;

  const selectBtn = document.createElement('button');
  selectBtn.type = 'button';
  selectBtn.className = 'timestamp-chip__select';
  selectBtn.addEventListener('click', () => onSelect?.(time));
  root.appendChild(selectBtn);

  if (variant === 'active') {
    const labelEl = document.createElement('span');
    labelEl.className = 'timestamp-chip__label';
    labelEl.textContent = label;
    selectBtn.appendChild(labelEl);

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'timestamp-chip__play';
    playBtn.setAttribute('aria-label', `Play excerpt at ${time}`);
    playBtn.addEventListener('click', e => {
      e.stopPropagation();
      onPlay?.(time);
    });

    const timeText = document.createElement('span');
    timeText.className = 'timestamp-chip__time-text';
    timeText.textContent = time;
    playBtn.appendChild(timeText);

    playBtn.appendChild(iconEl('play-circle', 'timestamp-chip__icon'));

    root.appendChild(playBtn);
  } else {
    const timeText = document.createElement('span');
    timeText.className = 'timestamp-chip__time-text';
    timeText.textContent = time;
    selectBtn.appendChild(timeText);
  }

  return root;
}
