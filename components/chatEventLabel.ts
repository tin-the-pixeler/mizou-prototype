// components/chatEventLabel.ts
import { iconEl, type IconName } from '../icons';

export type EventLabelVariant =
  | 'thinking'
  | 'decision'
  | 'scanning'
  | 'initialising'
  | 'building'
  | 'editing'
  | 'complete';

export const eventLabelVariants: EventLabelVariant[] = [
  'thinking',
  'decision',
  'scanning',
  'initialising',
  'building',
  'editing',
  'complete',
];

const VARIANT_ICON_MAP: Record<EventLabelVariant, IconName> = {
  thinking: 'signpost',
  decision: 'ai-sparkle',
  scanning: 'file-scan',
  initialising: 'hourglass',
  building: 'code',
  editing: 'edit',
  complete: 'check-circle',
};

const VARIANT_LABEL_MAP: Record<EventLabelVariant, string> = {
  thinking: 'Thinking...',
  decision: 'Made a decision',
  scanning: 'Scanning...',
  initialising: 'Initialising...',
  building: 'Building...',
  editing: 'Editing...',
  complete: 'Complete',
};

export type EventLabelOptions = {
  variant: EventLabelVariant;
  label?: string; // override default label text
};

export function createEventLabel({
  variant,
  label,
}: EventLabelOptions): HTMLElement {
  const el = document.createElement('div');
  el.className = `chat-event-label chat-event-label--${variant}`;

  const icon = iconEl(VARIANT_ICON_MAP[variant], 'chat-event-label__icon');
  const text = document.createElement('span');
  text.className = 'chat-event-label__text';
  text.textContent = label ?? VARIANT_LABEL_MAP[variant];

  el.append(icon, text);
  return el;
}
