// components/topbarPrimary.ts
// Reusable app topbar: page/team title (with dropdown chevron) on the left,
// plan badge + user avatar on the right. When `dropdownItems` is provided,
// the title becomes a switcher — clicking it opens a menu of other items.
// Figma: topbar-primary (node 15321:162078)

import { iconEl, type IconName } from '../icons';

export type TopbarDropdownItem = {
  label: string;
  onClick: () => void;
  initials?: string;
  color?: string;
};

export type TopbarPrimaryOptions = {
  title: string;
  onTitleClick?: () => void;
  /** Other items shown in a dropdown when the title is clicked (e.g. other teams to switch to) */
  dropdownItems?: TopbarDropdownItem[];
  /** Plan badge label, e.g. "Enterprise" */
  planLabel?: string;
  userInitial?: string;
  userColor?: string;
};

export function createTopbarPrimary({
  title,
  onTitleClick,
  dropdownItems = [],
  planLabel = 'Enterprise',
  userInitial = 'A',
  userColor = '#6963FC',
}: TopbarPrimaryOptions): HTMLElement {
  const bar = document.createElement('div');
  bar.className = 'tbp-topbar';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'tbp-title-wrap';

  const titleBtn = document.createElement('button');
  titleBtn.type = 'button';
  titleBtn.className = 'tbp-title-btn';
  titleBtn.title = dropdownItems.length > 0 ? 'Switch team' : title;

  const titleText = document.createElement('span');
  titleText.className = 'tbp-title-text';
  titleText.textContent = title;
  titleBtn.appendChild(titleText);

  const chevron = iconEl('chevron-down-sm' as IconName, 'sb-icon tbp-title-chevron');
  titleBtn.appendChild(chevron);
  titleWrap.appendChild(titleBtn);

  let menuEl: HTMLElement | null = null;

  const closeMenu = () => {
    menuEl?.remove();
    menuEl = null;
    chevron.classList.remove('tbp-title-chevron--open');
    titleBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', onDocClick);
  };

  const onDocClick = (e: MouseEvent) => {
    if (!titleWrap.contains(e.target as Node)) closeMenu();
  };

  const openMenu = () => {
    menuEl = document.createElement('div');
    menuEl.className = 'tbp-dropdown';
    menuEl.setAttribute('role', 'menu');

    dropdownItems.forEach((item) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'tbp-dropdown__item';
      row.setAttribute('role', 'menuitem');

      if (item.initials) {
        const avatar = document.createElement('span');
        avatar.className = 'tbp-dropdown__avatar';
        avatar.textContent = item.initials.toUpperCase();
        avatar.style.background = item.color ?? 'var(--interactive-primary)';
        row.appendChild(avatar);
      }

      const label = document.createElement('span');
      label.className = 'tbp-dropdown__label';
      label.textContent = item.label;
      row.appendChild(label);

      row.addEventListener('click', () => {
        closeMenu();
        item.onClick();
      });
      menuEl!.appendChild(row);
    });

    titleWrap.appendChild(menuEl);
    chevron.classList.add('tbp-title-chevron--open');
    titleBtn.setAttribute('aria-expanded', 'true');
    document.addEventListener('mousedown', onDocClick);
  };

  if (dropdownItems.length > 0) {
    titleBtn.setAttribute('aria-haspopup', 'menu');
    titleBtn.setAttribute('aria-expanded', 'false');
    titleBtn.addEventListener('click', () => {
      onTitleClick?.();
      if (menuEl) closeMenu();
      else openMenu();
    });
  } else if (onTitleClick) {
    titleBtn.addEventListener('click', onTitleClick);
  }

  bar.appendChild(titleWrap);

  const right = document.createElement('div');
  right.className = 'tbp-right';

  const badge = document.createElement('span');
  badge.className = 'tbp-plan-badge';
  badge.textContent = planLabel;
  right.appendChild(badge);

  const avatar = document.createElement('span');
  avatar.className = 'tbp-avatar';
  avatar.textContent = userInitial.toUpperCase();
  avatar.style.background = userColor;
  right.appendChild(avatar);

  bar.appendChild(right);
  return bar;
}
