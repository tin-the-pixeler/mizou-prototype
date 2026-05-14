// components/simulationCard.ts
// Simulation card with thumbnail, badge, status chip, and action variants.
// Supports 6 display states: published, ended, unpublished, draft, new, with-sessions.

import { iconEl } from '../icons';

// ─── Types ──────────────────────────────────────────────────────────────────

export type SimulationCardStatus =
  | 'published'     // No chip, 2 action buttons
  | 'ended'         // Gray "Ended" chip, 2 action buttons
  | 'unpublished'   // Gray "Ended" chip + amber banner, 2 action buttons
  | 'draft'         // Amber "Draft" chip, 1 full-width button
  | 'new'           // No simulation badge, teal "Plan" chip, 1 full-width button
  | 'with-sessions'; // No chip, sessions text-link

export type SimulationType = 'voice-role-play' | 'chatbot';

export type SimulationCardOptions = {
  title: string;
  status: SimulationCardStatus;
  simulationType?: SimulationType;
  /** Thumbnail image URL — falls back to gradient if omitted */
  thumbnailUrl?: string;
  /** e.g. "Commercial" */
  category?: string;
  /** e.g. "Medium" */
  difficulty?: 'easy' | 'medium' | 'hard';
  /** Label for the primary action button */
  primaryActionLabel?: string;
  /** Label for the secondary action button */
  secondaryActionLabel?: string;
  /** Number of sessions (for with-sessions variant) */
  sessionsCount?: number;
  /** Number of new sessions */
  newSessionsCount?: number;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onMenuClick?: () => void;
  onSessionsClick?: () => void;
  onPreviewClick?: () => void;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const SIMULATION_TYPE_LABEL: Record<SimulationType, string> = {
  'voice-role-play': 'Voice Role Play',
  chatbot: 'AI Chatbot',
};

const SIMULATION_TYPE_ICON: Record<SimulationType, string> = {
  'voice-role-play': 'mic-fill',
  chatbot: 'chat-ai',
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createSimulationCard({
  title,
  status,
  simulationType = 'voice-role-play',
  thumbnailUrl,
  category,
  difficulty,
  primaryActionLabel,
  secondaryActionLabel,
  sessionsCount,
  newSessionsCount,
  onPrimaryAction,
  onSecondaryAction,
  onMenuClick,
  onSessionsClick,
  onPreviewClick,
}: SimulationCardOptions): HTMLElement {
  const card = document.createElement('div');
  card.className = `sim-card sim-card--${status}`;

  card.append(
    buildThumbnail({ thumbnailUrl, status, simulationType, onMenuClick, onPreviewClick }),
  );

  if (status === 'unpublished') {
    card.append(buildInfoBanner('Unpublished changes'));
  }

  card.append(
    buildDetails({
      status,
      title,
      category,
      difficulty,
      primaryActionLabel,
      secondaryActionLabel,
      sessionsCount,
      newSessionsCount,
      onPrimaryAction,
      onSecondaryAction,
      onSessionsClick,
    }),
  );

  return card;
}

// ─── Thumbnail ───────────────────────────────────────────────────────────────

function buildThumbnail({
  thumbnailUrl,
  status,
  simulationType,
  onMenuClick,
  onPreviewClick,
}: Pick<SimulationCardOptions, 'thumbnailUrl' | 'status' | 'simulationType' | 'onMenuClick' | 'onPreviewClick'>): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'sim-card__thumbnail';

  if (thumbnailUrl) {
    const img = document.createElement('img');
    img.className = 'sim-card__thumbnail-img';
    img.src = thumbnailUrl;
    img.alt = '';
    wrap.appendChild(img);
  }

  // Top liner: badge + chip + menu
  const topLiner = document.createElement('div');
  topLiner.className = 'sim-card__top-liner';

  const badgeGroup = document.createElement('div');
  badgeGroup.className = 'sim-card__badge-group';

  // Simulation type badge (hidden for 'new' / plan-only variant)
  const showBadge = status !== 'new';
  if (showBadge && simulationType) {
    const badge = document.createElement('div');
    badge.className = 'sim-card__badge';

    const iconWrap = iconEl(SIMULATION_TYPE_ICON[simulationType] as any, 'sim-card__badge-icon');
    const label = document.createElement('span');
    label.className = 'sim-card__badge-label';
    label.textContent = SIMULATION_TYPE_LABEL[simulationType];

    badge.append(iconWrap, label);
    badgeGroup.appendChild(badge);
  }

  // Status chip
  const chipLabel = resolveChipLabel(status);
  if (chipLabel) {
    const chip = document.createElement('span');
    chip.className = `sim-card__chip sim-card__chip--${status}`;
    chip.textContent = chipLabel;
    badgeGroup.appendChild(chip);
  }

  topLiner.appendChild(badgeGroup);

  // Menu button
  const menuBtn = document.createElement('button');
  menuBtn.type = 'button';
  menuBtn.className = 'sim-card__menu-btn';
  menuBtn.setAttribute('aria-label', 'More options');
  menuBtn.appendChild(iconEl('dots-horizontal' as any, 'sim-card__menu-icon'));
  if (onMenuClick) menuBtn.addEventListener('click', onMenuClick);
  topLiner.appendChild(menuBtn);

  wrap.appendChild(topLiner);

  // Hover overlay with preview button
  const hoverLayer = document.createElement('div');
  hoverLayer.className = 'sim-card__hover-layer';
  const previewBtn = document.createElement('button');
  previewBtn.type = 'button';
  previewBtn.className = 'sim-card__preview-btn';
  previewBtn.textContent = 'Launch';
  if (onPreviewClick) previewBtn.addEventListener('click', onPreviewClick);
  hoverLayer.appendChild(previewBtn);
  wrap.appendChild(hoverLayer);

  return wrap;
}

function resolveChipLabel(status: SimulationCardStatus): string | null {
  switch (status) {
    case 'ended':
    case 'unpublished': return 'Ended';
    case 'draft': return 'Draft';
    case 'new': return 'Plan';
    default: return null;
  }
}

// ─── Info Banner ─────────────────────────────────────────────────────────────

function buildInfoBanner(message: string): HTMLElement {
  const banner = document.createElement('div');
  banner.className = 'sim-card__info-banner';
  const text = document.createElement('span');
  text.className = 'sim-card__info-banner-text';
  text.textContent = message;
  banner.appendChild(text);
  return banner;
}

// ─── Details Section ─────────────────────────────────────────────────────────

function buildDetails({
  status,
  title,
  category,
  difficulty,
  primaryActionLabel,
  secondaryActionLabel,
  sessionsCount,
  newSessionsCount,
  onPrimaryAction,
  onSecondaryAction,
  onSessionsClick,
}: Pick<SimulationCardOptions,
  | 'status' | 'title' | 'category' | 'difficulty'
  | 'primaryActionLabel' | 'secondaryActionLabel'
  | 'sessionsCount' | 'newSessionsCount'
  | 'onPrimaryAction' | 'onSecondaryAction' | 'onSessionsClick'
>): HTMLElement {
  const section = document.createElement('div');
  section.className = 'sim-card__details';

  const body = document.createElement('div');
  body.className = 'sim-card__body';

  // Category / Difficulty liner (hidden for 'new')
  const showLiner = status !== 'new' && (category || difficulty);
  if (showLiner) {
    const liner = document.createElement('div');
    liner.className = 'sim-card__liner';

    if (category) {
      const cat = document.createElement('span');
      cat.className = 'sim-card__liner-category';
      cat.textContent = category;
      liner.appendChild(cat);
    }

    if (category && difficulty) {
      const divider = document.createElement('span');
      divider.className = 'sim-card__liner-divider';
      liner.appendChild(divider);
    }

    if (difficulty) {
      const diff = document.createElement('span');
      diff.className = `sim-card__liner-difficulty sim-card__liner-difficulty--${difficulty}`;
      diff.textContent = DIFFICULTY_LABEL[difficulty];
      liner.appendChild(diff);
    }

    body.appendChild(liner);
  }

  const titleEl = document.createElement('h3');
  titleEl.className = 'sim-card__title';
  titleEl.textContent = title;
  body.appendChild(titleEl);

  section.appendChild(body);

  // Actions
  if (status === 'with-sessions' && sessionsCount !== undefined) {
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'sim-card__sessions-link';
    const newBadge = newSessionsCount ? ` (${newSessionsCount} new)` : '';
    link.textContent = `${sessionsCount} Sessions${newBadge}`;
    if (onSessionsClick) link.addEventListener('click', onSessionsClick);
    section.appendChild(link);
  } else {
    const actions = document.createElement('div');
    actions.className = 'sim-card__actions';

    const isSingleAction = status === 'draft' || status === 'new';

    if (!isSingleAction && secondaryActionLabel) {
      const secBtn = document.createElement('button');
      secBtn.type = 'button';
      secBtn.className = 'sim-card__action-btn sim-card__action-btn--secondary';
      secBtn.textContent = secondaryActionLabel;
      if (onSecondaryAction) secBtn.addEventListener('click', onSecondaryAction);
      actions.appendChild(secBtn);
    }

    const primLabel = primaryActionLabel ?? (isSingleAction ? 'Continue editing' : 'Share');
    const primBtn = document.createElement('button');
    primBtn.type = 'button';
    primBtn.className = `sim-card__action-btn sim-card__action-btn--primary${isSingleAction ? ' sim-card__action-btn--full' : ''}`;
    primBtn.textContent = primLabel;
    if (onPrimaryAction) primBtn.addEventListener('click', onPrimaryAction);
    actions.appendChild(primBtn);

    section.appendChild(actions);
  }

  return section;
}
