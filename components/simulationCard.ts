// components/simulationCard.ts
// Simulation card with thumbnail, badge, status chip, and action variants.
// Display states: published, ended, unpublished, draft, new, with-sessions, template.
//
// Production reference (mizou-business SimulationCard.tsx):
// - "Unpublished changes" is independent of "Ended": a published simulation
//   with edits shows the amber banner and NO status chip. Use
//   `hasUnpublishedChanges` to combine it with any status (e.g. ended + edits).
// - Ended simulations have no hover Launch button and no Assign action.
// - Templates (Collections → Templates Library) have no "…" menu, show
//   "Preview" on hover, a full-width "Copy" action, and open preview on click.

import { iconEl } from '../icons';
import { formatIconEl } from './sessionsFilterBar';

// ─── Types ──────────────────────────────────────────────────────────────────

export type SimulationCardStatus =
  | 'published'     // No chip, 2 action buttons
  | 'ended'         // Gray "Ended" chip, Sessions button only, no hover Launch
  | 'unpublished'   // Published + amber "Unpublished changes" banner, no chip
  | 'draft'         // Amber "Draft" chip, 1 full-width button
  | 'new'           // No simulation badge, teal "Plan" chip, 1 full-width button
  | 'with-sessions' // No chip, sessions text-link
  | 'template';     // No menu, hover "Preview", full-width "Copy"

export type SimulationType = 'voice-role-play' | 'chatbot' | 'video-role-play';

/** Production levels are Easy / Intermediate / Advanced.
 *  `medium` and `hard` are legacy aliases kept so older stories still render. */
export type SimulationDifficulty = 'easy' | 'intermediate' | 'advanced' | 'medium' | 'hard';

export type SimulationCardMenuItem = {
  label: string;
  /** Inline SVG markup or a name from SIM_CARD_MENU_ICONS */
  icon?: keyof typeof SIM_CARD_MENU_ICONS;
  /** Red destructive styling (e.g. Delete) */
  danger?: boolean;
  onClick?: () => void;
};

export type SimulationCardOptions = {
  title: string;
  status: SimulationCardStatus;
  simulationType?: SimulationType;
  /** Thumbnail image URL — falls back to gradient if omitted */
  thumbnailUrl?: string;
  /** Country code for the language chip, e.g. "US", "FR" */
  language?: string;
  /** e.g. "Commercial" */
  category?: string;
  difficulty?: SimulationDifficulty;
  /** Show the amber "Unpublished changes" banner (implied by status 'unpublished') */
  hasUnpublishedChanges?: boolean;
  /** Label for the primary action button */
  primaryActionLabel?: string;
  /** Label for the secondary action button */
  secondaryActionLabel?: string;
  /** Number of sessions (for with-sessions variant) */
  sessionsCount?: number;
  /** Number of new sessions */
  newSessionsCount?: number;
  /** Items for the "…" menu. When provided, the button opens a dropdown. */
  menuItems?: SimulationCardMenuItem[];
  /** Hide the "…" menu button entirely */
  hideMenu?: boolean;
  /** Label for the hover button on the thumbnail (default "Launch", "Preview" for templates) */
  hoverActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onMenuClick?: () => void;
  onSessionsClick?: () => void;
  onPreviewClick?: () => void;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const SIMULATION_TYPE_LABEL: Record<SimulationType, string> = {
  'voice-role-play': 'Voice Role Play',
  chatbot: 'Chatbot',
  'video-role-play': 'Video Role Play',
};

/** Normalise legacy values to production levels. */
const DIFFICULTY_NORMALISED: Record<SimulationDifficulty, 'easy' | 'intermediate' | 'advanced'> = {
  easy: 'easy',
  intermediate: 'intermediate',
  advanced: 'advanced',
  medium: 'intermediate',
  hard: 'advanced',
};

const DIFFICULTY_LABEL: Record<'easy' | 'intermediate' | 'advanced', string> = {
  easy: 'Easy',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

/** Bootstrap-icon stand-ins for menu items (same icons production uses). */
export const SIM_CARD_MENU_ICONS = {
  edit: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/></svg>',
  remix: '<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>',
  sessions: '<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"/><path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/><path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"/></svg>',
  link: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/></svg>',
  publish: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>',
  delete: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>',
} as const;

/** Turn a country code into its flag emoji ("US" → 🇺🇸). */
function flagEmoji(code: string): string {
  const cc = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return '';
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createSimulationCard({
  title,
  status,
  simulationType = 'voice-role-play',
  thumbnailUrl,
  language,
  category,
  difficulty,
  hasUnpublishedChanges,
  primaryActionLabel,
  secondaryActionLabel,
  sessionsCount,
  newSessionsCount,
  menuItems,
  hideMenu,
  hoverActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  onMenuClick,
  onSessionsClick,
  onPreviewClick,
}: SimulationCardOptions): HTMLElement {
  const card = document.createElement('div');
  card.className = `sim-card sim-card--${status}`;

  const showBanner = status === 'unpublished' || !!hasUnpublishedChanges;
  if (showBanner) card.classList.add('sim-card--has-banner');

  const isTemplate = status === 'template';
  if (isTemplate && onPreviewClick) {
    card.classList.add('sim-card--clickable');
    card.addEventListener('click', (e) => {
      // Buttons inside the card handle their own clicks
      if ((e.target as HTMLElement).closest('button')) return;
      onPreviewClick();
    });
  }

  card.append(
    buildThumbnail({
      thumbnailUrl,
      status,
      simulationType,
      menuItems,
      hideMenu: hideMenu || isTemplate,
      hoverActionLabel: hoverActionLabel ?? (isTemplate ? 'Preview' : 'Launch'),
      onMenuClick,
      onPreviewClick,
    }),
  );

  if (showBanner) {
    card.append(buildInfoBanner('Unpublished changes'));
  }

  card.append(
    buildDetails({
      status,
      title,
      language,
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
  menuItems,
  hideMenu,
  hoverActionLabel,
  onMenuClick,
  onPreviewClick,
}: Pick<SimulationCardOptions,
  'thumbnailUrl' | 'status' | 'simulationType' | 'menuItems' | 'hideMenu'
  | 'hoverActionLabel' | 'onMenuClick' | 'onPreviewClick'
>): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'sim-card__thumbnail';

  if (thumbnailUrl) {
    const img = document.createElement('img');
    img.className = 'sim-card__thumbnail-img';
    img.src = thumbnailUrl;
    img.alt = '';
    // Unreachable image → drop it so the gradient fallback shows cleanly
    img.addEventListener('error', () => img.remove(), { once: true });
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

    const iconWrap = formatIconEl(simulationType, 'sim-card__badge-icon');
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

  // Menu button (+ optional dropdown)
  if (!hideMenu) {
    const menuWrap = document.createElement('div');
    menuWrap.className = 'sim-card__menu';

    const menuBtn = document.createElement('button');
    menuBtn.type = 'button';
    menuBtn.className = 'sim-card__menu-btn';
    menuBtn.setAttribute('aria-label', 'More options');
    menuBtn.setAttribute('aria-haspopup', 'menu');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.appendChild(iconEl('dots-horizontal' as any, 'sim-card__menu-icon'));
    menuWrap.appendChild(menuBtn);

    if (menuItems && menuItems.length) {
      // The dropdown is portalled to <body> (position: fixed) so the card's
      // overflow:hidden (needed for its rounded thumbnail) can't clip it.
      const dropdown = buildMenuDropdown(menuItems, () => setOpen(false));

      const place = () => {
        const r = menuBtn.getBoundingClientRect();
        dropdown.style.top = `${r.bottom + 6}px`;
        // Right-align to the button, but keep it on screen
        const width = dropdown.offsetWidth || 220;
        dropdown.style.left = `${Math.max(8, r.right - width)}px`;
      };
      const onDocClick = (e: MouseEvent) => {
        const t = e.target as Node;
        if (!menuWrap.contains(t) && !dropdown.contains(t)) setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      const onScroll = () => setOpen(false);
      function setOpen(open: boolean) {
        menuWrap.classList.toggle('sim-card__menu--open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        if (open) {
          document.body.appendChild(dropdown);
          place();
          document.addEventListener('mousedown', onDocClick);
          document.addEventListener('keydown', onKey);
          window.addEventListener('scroll', onScroll, true);
          window.addEventListener('resize', onScroll);
        } else {
          dropdown.remove();
          document.removeEventListener('mousedown', onDocClick);
          document.removeEventListener('keydown', onKey);
          window.removeEventListener('scroll', onScroll, true);
          window.removeEventListener('resize', onScroll);
        }
      }
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(!menuWrap.classList.contains('sim-card__menu--open'));
        onMenuClick?.();
      });
    } else if (onMenuClick) {
      menuBtn.addEventListener('click', onMenuClick);
    }

    topLiner.appendChild(menuWrap);
  }

  wrap.appendChild(topLiner);

  // Hover overlay (none for ended simulations — production disables hover when terminated)
  if (status !== 'ended') {
    const hoverLayer = document.createElement('div');
    hoverLayer.className = 'sim-card__hover-layer';
    const previewBtn = document.createElement('button');
    previewBtn.type = 'button';
    previewBtn.className = 'sim-card__preview-btn';
    previewBtn.textContent = hoverActionLabel ?? 'Launch';
    if (onPreviewClick) previewBtn.addEventListener('click', onPreviewClick);
    hoverLayer.appendChild(previewBtn);
    wrap.appendChild(hoverLayer);
  }

  return wrap;
}

function buildMenuDropdown(items: SimulationCardMenuItem[], close: () => void): HTMLElement {
  const list = document.createElement('div');
  list.className = 'sim-card__menu-list';
  list.setAttribute('role', 'menu');

  for (const item of items) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'menuitem');
    btn.className = `sim-card__menu-item${item.danger ? ' sim-card__menu-item--danger' : ''}`;
    if (item.icon) {
      const ic = document.createElement('span');
      ic.className = 'sim-card__menu-item-icon';
      ic.innerHTML = SIM_CARD_MENU_ICONS[item.icon];
      btn.appendChild(ic);
    }
    const label = document.createElement('span');
    label.textContent = item.label;
    btn.appendChild(label);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      close();
      item.onClick?.();
    });
    list.appendChild(btn);
  }
  return list;
}

function resolveChipLabel(status: SimulationCardStatus): string | null {
  switch (status) {
    case 'ended': return 'Ended';
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
  language,
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
  | 'status' | 'title' | 'language' | 'category' | 'difficulty'
  | 'primaryActionLabel' | 'secondaryActionLabel'
  | 'sessionsCount' | 'newSessionsCount'
  | 'onPrimaryAction' | 'onSecondaryAction' | 'onSessionsClick'
>): HTMLElement {
  const section = document.createElement('div');
  section.className = 'sim-card__details';

  const body = document.createElement('div');
  body.className = 'sim-card__body';

  // Language · Category | Difficulty liner (hidden for 'new')
  const showLiner = status !== 'new' && (language || category || difficulty);
  if (showLiner) {
    const liner = document.createElement('div');
    liner.className = 'sim-card__liner';

    if (language) {
      const lang = document.createElement('span');
      lang.className = 'sim-card__language';
      const flag = document.createElement('span');
      flag.className = 'sim-card__language-flag';
      flag.setAttribute('aria-hidden', 'true');
      flag.textContent = flagEmoji(language);
      const code = document.createElement('span');
      code.textContent = language.toUpperCase();
      lang.append(flag, code);
      liner.appendChild(lang);
    }

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
      const level = DIFFICULTY_NORMALISED[difficulty];
      const diff = document.createElement('span');
      diff.className = `sim-card__liner-difficulty sim-card__liner-difficulty--${level}`;
      diff.textContent = DIFFICULTY_LABEL[level];
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
    link.textContent = `${sessionsCount} ${sessionsCount === 1 ? 'Session' : 'Sessions'}${newBadge}`;
    if (onSessionsClick) link.addEventListener('click', onSessionsClick);
    section.appendChild(link);
  } else {
    const actions = document.createElement('div');
    actions.className = 'sim-card__actions';

    const isSingleAction = status === 'draft' || status === 'new' || status === 'template';
    // Ended: production hides Assign/Share, only the secondary (Sessions) remains.
    const hidePrimary = status === 'ended' && !!secondaryActionLabel;

    if (!isSingleAction && secondaryActionLabel) {
      const secBtn = document.createElement('button');
      secBtn.type = 'button';
      secBtn.className = 'sim-card__action-btn sim-card__action-btn--secondary';
      secBtn.textContent = secondaryActionLabel;
      if (onSecondaryAction) secBtn.addEventListener('click', onSecondaryAction);
      actions.appendChild(secBtn);
    }

    if (!hidePrimary) {
      const primLabel = primaryActionLabel
        ?? (status === 'template' ? 'Copy' : isSingleAction ? 'Continue editing' : 'Share');
      const primBtn = document.createElement('button');
      primBtn.type = 'button';
      primBtn.className = `sim-card__action-btn sim-card__action-btn--primary${isSingleAction ? ' sim-card__action-btn--full' : ''}`;
      primBtn.textContent = primLabel;
      if (onPrimaryAction) primBtn.addEventListener('click', onPrimaryAction);
      actions.appendChild(primBtn);
    }

    section.appendChild(actions);
  }

  return section;
}
