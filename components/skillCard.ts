// components/skillCard.ts
// Collapsible group for a single skill/competency — shows the skill name and
// aggregate score in the header, and its list of criteria cards (from
// createCriteriaCard / createTextCriteriaCard) in the body when expanded.

import { iconEl } from '../icons';

export type SkillCardOptions = {
  /** Skill/competency name, e.g. "Building Trust & Rapport" */
  title: string;
  /** Aggregate score for this skill, e.g. 33 */
  score: number;
  /** Criteria card elements shown in the body when expanded */
  children?: HTMLElement[];
  expanded?: boolean;
};

/** Score band drives the score color and card stroke: red 0-50, yellow 51-69, green 70-100. */
function scoreBand(score: number): 'low' | 'mid' | 'high' {
  if (score <= 50) return 'low';
  if (score <= 69) return 'mid';
  return 'high';
}

export function createSkillCard(options: SkillCardOptions): HTMLElement {
  const { title, score, children = [], expanded = true } = options;

  const root = document.createElement('div');
  root.className = `skill-card skill-card--score-${scoreBand(score)}${expanded ? '' : ' skill-card--collapsed'}`;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'skill-card__toggle';
  toggle.setAttribute('aria-expanded', String(expanded));

  toggle.appendChild(iconEl('chevron-down-sm', 'skill-card__chevron'));

  const titleEl = document.createElement('span');
  titleEl.className = 'skill-card__title';
  titleEl.textContent = title;
  toggle.appendChild(titleEl);

  const scoreEl = document.createElement('span');
  scoreEl.className = 'skill-card__score';
  scoreEl.textContent = String(score);
  toggle.appendChild(scoreEl);

  root.appendChild(toggle);

  const body = document.createElement('div');
  body.className = 'skill-card__body';
  children.forEach(child => body.appendChild(child));
  root.appendChild(body);

  toggle.addEventListener('click', () => {
    const nowExpanded = root.classList.toggle('skill-card--collapsed') === false;
    toggle.setAttribute('aria-expanded', String(nowExpanded));
  });

  return root;
}
