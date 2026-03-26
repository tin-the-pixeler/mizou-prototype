// components/promptCard.ts
// Clickable sample-prompt card with bold title and description text.
// Default: translucent white bg. Hover: indigo tint bg + arrow-up icon.

import { iconEl, type IconName } from '../icons';

export type PromptCardOptions = {
  /** Bold title text */
  title: string;
  /** Description/body text */
  text: string;
  /** Callback when card is clicked */
  onClick?: (title: string, text: string) => void;
  /** Callback when mouse enters the card */
  onHover?: (title: string, text: string) => void;
  /** Callback when mouse leaves the card */
  onHoverEnd?: () => void;
};

export function createPromptCard({
  title,
  text,
  onClick,
  onHover,
  onHoverEnd,
}: PromptCardOptions): HTMLElement {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'prompt-card';

  // Title row: title text + arrow icon (icon visible on hover via CSS)
  const titleRow = document.createElement('div');
  titleRow.className = 'prompt-card__title';

  const titleEl = document.createElement('span');
  titleEl.className = 'prompt-card__title-text';
  titleEl.textContent = title;

  const arrowEl = document.createElement('span');
  arrowEl.className = 'prompt-card__arrow';
  arrowEl.appendChild(iconEl('arrow-up' as IconName, 'prompt-card__arrow-icon'));

  titleRow.append(titleEl, arrowEl);

  // Body text
  const textEl = document.createElement('p');
  textEl.className = 'prompt-card__text';
  textEl.textContent = text;

  card.append(titleRow, textEl);

  if (onClick) {
    card.addEventListener('click', () => onClick(title, text));
  }

  if (onHover) {
    card.addEventListener('mouseenter', () => onHover(title, text));
  }

  if (onHoverEnd) {
    card.addEventListener('mouseleave', () => onHoverEnd());
  }

  return card;
}
