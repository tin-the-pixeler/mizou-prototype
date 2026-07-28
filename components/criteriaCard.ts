// components/criteriaCard.ts
// A single evaluation criterion row (audio simulations) — shown inside a Skill Card's body.

import { iconEl } from '../icons';
import { createTimestampChip } from './timestampChip';

export type CriteriaCardVariant = 'positive' | 'negative';

export type CriteriaCardOptions = {
  /** Criteria title, e.g. "Evaluation Criteria" */
  title?: string;
  variant?: CriteriaCardVariant;
  /** Label above the transcript excerpt timestamps (positive variant only) */
  excerptLabel?: string;
  /** Timestamp chips shown in the excerpt, acting as tabs through the excerpt occurrences (positive variant only) */
  timestamps?: string[];
  /** Index into timestamps that starts active. Defaults to the last timestamp. */
  activeIndex?: number;
  /** Label shown next to the active timestamp, e.g. "View in transcript" */
  activeLabel?: string;
  /** Fired when a timestamp chip is selected, whether or not it changes the active tab */
  onActiveChange?: (time: string, index: number) => void;
  /** Fired when the active timestamp's play control is clicked */
  onPlayClick?: (time: string) => void;
};

export const criteriaCardVariants: CriteriaCardVariant[] = ['positive', 'negative'];

/** Header row shared with other criteria-card flavors (e.g. the text-simulation version) */
export function createCriteriaCardHeader(title: string, variant: CriteriaCardVariant): HTMLElement {
  const header = document.createElement('div');
  header.className = 'criteria-card__header';

  const titleEl = document.createElement('span');
  titleEl.className = 'criteria-card__title';
  titleEl.textContent = title;
  header.appendChild(titleEl);

  header.appendChild(
    iconEl(
      variant === 'positive' ? 'check-circle' : 'x-circle',
      `criteria-card__status-icon criteria-card__status-icon--${variant}`,
    ),
  );

  return header;
}

export function createCriteriaCard(options: CriteriaCardOptions = {}): HTMLElement {
  const {
    title = 'Evaluation Criteria',
    variant = 'positive',
    excerptLabel = 'Transcript excerpt',
    timestamps = ['01:03', '00:23', '01:19', '01:32'],
    activeIndex = timestamps.length - 1,
    activeLabel = 'View in transcript',
    onActiveChange,
    onPlayClick,
  } = options;

  const card = document.createElement('div');
  card.className = `criteria-card criteria-card--${variant}`;

  const content = document.createElement('div');
  content.className = 'criteria-card__content';
  card.appendChild(content);

  content.appendChild(createCriteriaCardHeader(title, variant));

  if (variant === 'positive') {
    const excerpt = document.createElement('div');
    excerpt.className = 'criteria-card__excerpt';

    const excerptHeader = document.createElement('div');
    excerptHeader.className = 'criteria-card__excerpt-header';

    const quoteBar = document.createElement('span');
    quoteBar.className = 'criteria-card__quote-bar';
    excerptHeader.appendChild(quoteBar);

    const excerptLabelEl = document.createElement('span');
    excerptLabelEl.className = 'criteria-card__excerpt-label';
    excerptLabelEl.textContent = excerptLabel;
    excerptHeader.appendChild(excerptLabelEl);

    excerpt.appendChild(excerptHeader);

    const timestampRow = document.createElement('div');
    timestampRow.className = 'criteria-card__timestamps';
    excerpt.appendChild(timestampRow);

    let activeIdx = Math.min(Math.max(activeIndex, 0), Math.max(timestamps.length - 1, 0));

    const renderTimestamps = () => {
      timestampRow.innerHTML = '';
      timestamps.forEach((time, index) => {
        timestampRow.appendChild(
          createTimestampChip({
            time,
            variant: index === activeIdx ? 'active' : 'default',
            label: activeLabel,
            onSelect: () => {
              if (activeIdx !== index) {
                activeIdx = index;
                renderTimestamps();
              }
              onActiveChange?.(time, index);
            },
            onPlay: onPlayClick,
          }),
        );
      });
    };

    renderTimestamps();
    content.appendChild(excerpt);
  }

  return card;
}
