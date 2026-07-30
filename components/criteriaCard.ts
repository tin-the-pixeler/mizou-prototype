// components/criteriaCard.ts
// A single evaluation criterion row (audio/video simulations) — shown inside
// a Skill Card's body. Each passed criterion can cite up to a few transcript
// excerpts; timestamp chips act as tabs switching which excerpt is quoted,
// and the active chip's play control plays that excerpt's audio.

import { iconEl } from '../icons';
import { createTimestampChip } from './timestampChip';

export type CriteriaCardVariant = 'positive' | 'negative';

export type CriteriaExcerpt = {
  /** Timestamp label, e.g. "01:03" */
  time: string;
  /** Quoted transcript text for this timestamp */
  text: string;
};

export type CriteriaCardOptions = {
  /** Criteria title, e.g. "Evaluation Criteria" */
  title?: string;
  variant?: CriteriaCardVariant;
  /** Transcript excerpts that qualify this criterion (positive variant only). Max 3. */
  excerpts?: CriteriaExcerpt[];
  /** Index into excerpts that starts active. Defaults to the last excerpt. */
  activeIndex?: number;
  /** Label shown next to the active timestamp, e.g. "View in transcript" */
  activeLabel?: string;
  /** Fired when a timestamp is selected, whether or not it changes the active excerpt */
  onActiveChange?: (excerpt: CriteriaExcerpt, index: number) => void;
  /** Fired when the active timestamp's play control is clicked */
  onPlayClick?: (excerpt: CriteriaExcerpt, index: number) => void;
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
    excerpts = [
      { time: '01:03', text: 'Can you tell me a bit more about how this shows up day to day for your team?' },
    ],
    activeIndex = excerpts.length - 1,
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

  if (variant === 'positive' && excerpts.length > 0) {
    const excerpt = document.createElement('div');
    excerpt.className = 'criteria-card__excerpt';

    // Timestamp chips act as tabs selecting the quoted excerpt, so they sit at
    // the top of the excerpt, above the quote they control.
    const timestampRow = document.createElement('div');
    timestampRow.className = 'criteria-card__timestamps';
    excerpt.appendChild(timestampRow);

    const excerptHeader = document.createElement('div');
    excerptHeader.className = 'criteria-card__excerpt-header';
    // The whole quote is clickable — it jumps the transcript to the active
    // excerpt, same as selecting its timestamp chip.
    excerptHeader.setAttribute('role', 'button');
    excerptHeader.setAttribute('tabindex', '0');
    excerptHeader.setAttribute('aria-label', 'View this excerpt in the transcript');

    const quoteBar = document.createElement('span');
    quoteBar.className = 'criteria-card__quote-bar';
    excerptHeader.appendChild(quoteBar);

    const quoteText = document.createElement('p');
    quoteText.className = 'criteria-card__quote';
    excerptHeader.appendChild(quoteText);

    excerpt.appendChild(excerptHeader);

    let activeIdx = Math.min(Math.max(activeIndex, 0), excerpts.length - 1);

    const selectActive = () => onActiveChange?.(excerpts[activeIdx], activeIdx);
    excerptHeader.addEventListener('click', selectActive);
    excerptHeader.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectActive();
      }
    });

    const render = () => {
      quoteText.textContent = excerpts[activeIdx].text;
      timestampRow.innerHTML = '';
      excerpts.forEach((item, index) => {
        timestampRow.appendChild(
          createTimestampChip({
            time: item.time,
            variant: index === activeIdx ? 'active' : 'default',
            label: activeLabel,
            onSelect: () => {
              if (activeIdx !== index) {
                activeIdx = index;
                render();
              }
              onActiveChange?.(item, index);
            },
            onPlay: () => onPlayClick?.(item, index),
          }),
        );
      });
    };

    render();
    content.appendChild(excerpt);
  }

  return card;
}
