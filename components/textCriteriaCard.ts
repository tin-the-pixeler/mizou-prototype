// components/textCriteriaCard.ts
// A single evaluation criterion row for text-based simulations: no audio, so
// excerpts are quoted directly and multiple occurrences are navigated via
// [1] [2] … reference chips instead of timestamps.

import { createCriteriaCardHeader, type CriteriaCardVariant, criteriaCardVariants } from './criteriaCard';
import { createReferenceChip } from './referenceChip';

export { criteriaCardVariants as textCriteriaCardVariants };
export type { CriteriaCardVariant as TextCriteriaCardVariant };

export type TextCriteriaCardOptions = {
  /** Criteria title, e.g. "Evaluation Criteria" */
  title?: string;
  variant?: CriteriaCardVariant;
  /** Quoted transcript excerpts. More than one renders as [1] [2] … reference tabs. */
  excerpts?: string[];
  /** Index into excerpts that starts active. Defaults to the last excerpt. */
  activeIndex?: number;
  viewInTranscriptLabel?: string;
  /** Fired when a reference is selected, whether or not it changes the active excerpt */
  onActiveChange?: (excerpt: string, index: number) => void;
};

export function createTextCriteriaCard(options: TextCriteriaCardOptions = {}): HTMLElement {
  const {
    title = 'Evaluation Criteria',
    variant = 'positive',
    excerpts = [
      "I hear you, Dr. Miller, and I want to make sure we're addressing your concerns properly before moving forward.",
    ],
    activeIndex = excerpts.length - 1,
    viewInTranscriptLabel = 'View in transcript',
    onActiveChange,
  } = options;

  const card = document.createElement('div');
  card.className = `criteria-card text-criteria-card criteria-card--${variant}`;

  const content = document.createElement('div');
  content.className = 'criteria-card__content';
  card.appendChild(content);

  content.appendChild(createCriteriaCardHeader(title, variant));

  if (variant === 'positive' && excerpts.length > 0) {
    const excerpt = document.createElement('div');
    excerpt.className = 'criteria-card__excerpt';

    const excerptHeader = document.createElement('div');
    excerptHeader.className = 'criteria-card__excerpt-header';

    const quoteBar = document.createElement('span');
    quoteBar.className = 'criteria-card__quote-bar';
    excerptHeader.appendChild(quoteBar);

    const quoteText = document.createElement('p');
    quoteText.className = 'criteria-card__quote';
    excerptHeader.appendChild(quoteText);

    excerpt.appendChild(excerptHeader);

    const refRow = document.createElement('div');
    refRow.className = 'text-criteria-card__references';
    excerpt.appendChild(refRow);

    let activeIdx = Math.min(Math.max(activeIndex, 0), excerpts.length - 1);

    const render = () => {
      quoteText.textContent = excerpts[activeIdx];
      refRow.innerHTML = '';

      if (excerpts.length > 1) {
        excerpts.forEach((text, index) => {
          refRow.appendChild(
            createReferenceChip({
              index: index + 1,
              variant: index === activeIdx ? 'active' : 'default',
              label: viewInTranscriptLabel,
              onClick: () => {
                if (activeIdx !== index) {
                  activeIdx = index;
                  render();
                }
                onActiveChange?.(text, index);
              },
            }),
          );
        });
      } else {
        const link = document.createElement('button');
        link.type = 'button';
        link.className = 'text-criteria-card__references-link';
        link.textContent = viewInTranscriptLabel;
        link.addEventListener('click', () => onActiveChange?.(excerpts[0], 0));
        refRow.appendChild(link);
      }
    };

    render();
    content.appendChild(excerpt);
  }

  return card;
}
