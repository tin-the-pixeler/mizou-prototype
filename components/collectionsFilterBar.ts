// components/collectionsFilterBar.ts
// Collections Filter Bar — true-filters-only bar for the My Collections page.
// Format pills (multi-toggle, same behavior/UI as the Sessions Filter Bar)
// · dropdown triggers (Categories / Level / Status) · search input
// · "Clear filters" link.
//
// Naming: "Status" here is the simulation lifecycle (Draft / Published) — see
// the naming note in sessionsFilterBar.ts, which reserves "Progress" for the
// learner journey on the Sessions page.
//
// Selection models (same as the Sessions Filter Bar):
// - Categories (multi-select) STAGES checkbox changes in a draft and commits
//   on Apply; closing the menu without Apply discards the draft.
// - Level and Status (single-select radios) apply instantly.

import {
  formatIconEl,
  FORMAT_LABEL,
  STAND_IN_ICONS,
  type SessionFormat,
} from './sessionsFilterBar';
import { iconEl } from '../icons';

function standInIconEl(name: keyof typeof STAND_IN_ICONS, className = 'sfb__icon'): HTMLElement {
  const span = document.createElement('span');
  span.className = className;
  span.innerHTML = STAND_IN_ICONS[name];
  return span;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export type CollectionFormat = SessionFormat;
export type CollectionLevel = 'easy' | 'intermediate' | 'advanced';
export type CollectionStatus = 'draft' | 'published';

export type FilterOption = { id: string; label: string };

export type CollectionsFilterState = {
  /** Active format pills. Empty = no format filter (all formats shown). */
  formats: CollectionFormat[];
  /** Selected category ids (OR within the group). */
  categories: string[];
  /** Single-select level; null = all. */
  level: CollectionLevel | null;
  /** Single-select status; null = all. */
  status: CollectionStatus | null;
  search: string;
};

export type CollectionsFilterBarOptions = {
  categories: FilterOption[];
  initialState?: Partial<CollectionsFilterState>;
  /** Open a dropdown menu on mount (for demos/docs). */
  openMenu?: 'categories' | 'level' | 'status' | null;
  onChange?: (state: CollectionsFilterState) => void;
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const LEVEL_LABEL: Record<CollectionLevel, string> = {
  easy: 'Easy',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const STATUS_LABEL: Record<CollectionStatus, string> = {
  draft: 'Draft',
  published: 'Published',
};

const LEVEL_OPTIONS: (CollectionLevel | null)[] = [null, 'easy', 'intermediate', 'advanced'];
const STATUS_OPTIONS: (CollectionStatus | null)[] = [null, 'draft', 'published'];

export const DEFAULT_CATEGORY_OPTIONS: FilterOption[] = [
  { id: 'recruitment', label: 'Recruitment' },
  { id: 'customer-service', label: 'Customer Service' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'management', label: 'Management' },
];

// ─── Filter predicate ────────────────────────────────────────────────────────
// Encodes the locked behavior rules: groups AND together; options within the
// multi-select Categories group OR together.

export type FilterableCollectionItem = {
  format: CollectionFormat;
  categoryId: string;
  level: CollectionLevel;
  status: CollectionStatus;
  /** Text the bar's search input matches against (e.g. title). */
  searchText?: string;
};

export function collectionsFilterPredicate(state: CollectionsFilterState) {
  const query = state.search.trim().toLowerCase();
  return (item: FilterableCollectionItem): boolean => {
    if (state.formats.length > 0 && !state.formats.includes(item.format)) return false;
    if (state.categories.length > 0 && !state.categories.includes(item.categoryId)) return false;
    if (state.level && item.level !== state.level) return false;
    if (state.status && item.status !== state.status) return false;
    if (query && !(item.searchText ?? '').toLowerCase().includes(query)) return false;
    return true;
  };
}

// ─── Factory ─────────────────────────────────────────────────────────────────

type MenuKey = 'categories' | 'level' | 'status';

export function createCollectionsFilterBar(options: CollectionsFilterBarOptions): HTMLElement {
  const state: CollectionsFilterState = {
    formats: [],
    categories: [],
    level: null,
    status: null,
    search: '',
    ...options.initialState,
  };

  const root = h('div', 'sfb-root');
  const bar = h('div', 'sfb');
  root.appendChild(bar);

  const emit = () => options.onChange?.({ ...state, formats: [...state.formats], categories: [...state.categories] });

  // ── Format pills ──
  const formatGroup = h('div', 'sfb__formats');
  formatGroup.setAttribute('role', 'group');
  formatGroup.setAttribute('aria-label', 'Filter by format');
  const formatPills = new Map<CollectionFormat, HTMLButtonElement>();
  (Object.keys(FORMAT_LABEL) as CollectionFormat[]).forEach((format) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'sfb__pill';
    pill.append(formatIconEl(format), textSpan('sfb__pill-label', FORMAT_LABEL[format]));
    pill.addEventListener('click', () => {
      const idx = state.formats.indexOf(format);
      if (idx === -1) state.formats.push(format);
      else state.formats.splice(idx, 1);
      sync();
      emit();
    });
    formatPills.set(format, pill);
    formatGroup.appendChild(pill);
  });
  bar.appendChild(formatGroup);

  bar.appendChild(h('div', 'sfb__divider'));

  // ── Dropdown triggers ──
  const triggerGroup = h('div', 'sfb__triggers');
  bar.appendChild(triggerGroup);

  let openMenu: MenuKey | null = null;
  const dropdowns = new Map<MenuKey, { wrap: HTMLElement; trigger: HTMLButtonElement }>();

  // Closing without Apply discards any multi-select draft — the draft only
  // lives inside the menu DOM, so removing it is the discard.
  const closeMenus = () => {
    if (openMenu === null) return;
    openMenu = null;
    dropdowns.forEach(({ wrap, trigger }) => {
      wrap.querySelector('.sfb__menu')?.remove();
      trigger.classList.remove('sfb__trigger--open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  };

  const toggleMenu = (key: MenuKey) => {
    const wasOpen = openMenu === key;
    closeMenus();
    if (wasOpen) return;
    openMenu = key;
    const { wrap, trigger } = dropdowns.get(key)!;
    trigger.classList.add('sfb__trigger--open');
    trigger.setAttribute('aria-expanded', 'true');
    wrap.appendChild(buildMenu(key));
  };

  const buildMenu = (key: MenuKey): HTMLElement => {
    if (key === 'categories') return buildCategoriesMenu();
    if (key === 'level') return buildLevelMenu();
    return buildStatusMenu();
  };

  // Categories menu: staged draft, committed on Apply (same model as
  // Learners/Simulations on the Sessions Filter Bar).
  const buildCategoriesMenu = (): HTMLElement => {
    const menu = h('div', 'sfb__menu');
    const draft = [...state.categories];

    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = 'sfb__apply sfb__menu-apply';
    applyBtn.textContent = 'Apply';
    const syncApply = () => {
      applyBtn.disabled = sameSelection(draft, state.categories);
    };

    const list = h('div', 'sfb__menu-list');
    options.categories.forEach((opt) => list.appendChild(checkboxRow(opt, draft, syncApply)));
    menu.appendChild(list);

    applyBtn.addEventListener('click', () => {
      state.categories = [...draft];
      closeMenus();
      sync();
      emit();
    });
    syncApply();

    const foot = h('div', 'sfb__menu-foot');
    foot.appendChild(applyBtn);
    menu.appendChild(foot);
    return menu;
  };

  // Level menu: radios apply instantly, menu stays open.
  const buildLevelMenu = (): HTMLElement => {
    const menu = h('div', 'sfb__menu');
    const list = h('div', 'sfb__menu-list');
    LEVEL_OPTIONS.forEach((value) => {
      const row = document.createElement('label');
      row.className = 'sfb__option';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'cfb-level';
      radio.className = 'sfb__radio';
      radio.checked = state.level === value;
      radio.addEventListener('change', () => {
        state.level = value;
        sync();
        emit();
      });
      row.append(radio, textSpan('sfb__option-label', value ? LEVEL_LABEL[value] : 'All'));
      list.appendChild(row);
    });
    menu.appendChild(list);
    return menu;
  };

  // Status menu: radios apply instantly, menu stays open.
  const buildStatusMenu = (): HTMLElement => {
    const menu = h('div', 'sfb__menu');
    const list = h('div', 'sfb__menu-list');
    STATUS_OPTIONS.forEach((value) => {
      const row = document.createElement('label');
      row.className = 'sfb__option';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'cfb-status';
      radio.className = 'sfb__radio';
      radio.checked = state.status === value;
      radio.addEventListener('change', () => {
        state.status = value;
        sync();
        emit();
      });
      row.append(radio, textSpan('sfb__option-label', value ? STATUS_LABEL[value] : 'All'));
      list.appendChild(row);
    });
    menu.appendChild(list);
    return menu;
  };

  const TRIGGERS: { key: MenuKey; label: string }[] = [
    { key: 'categories', label: 'Categories' },
    { key: 'level', label: 'Level' },
    { key: 'status', label: 'Status' },
  ];
  TRIGGERS.forEach(({ key, label }) => {
    const wrap = h('div', 'sfb__dropdown');
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'sfb__trigger';
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.append(
      textSpan('sfb__trigger-label', label),
      textSpan('sfb__trigger-count', ''),
      iconEl('chevron-down-sm', 'sfb__icon sfb__trigger-chevron'),
    );
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu(key);
    });
    wrap.appendChild(trigger);
    triggerGroup.appendChild(wrap);
    dropdowns.set(key, { wrap, trigger });
  });

  // ── Clear filters link ──
  const clearLink = document.createElement('button');
  clearLink.type = 'button';
  clearLink.className = 'sfb__clear';
  clearLink.textContent = 'Clear filters';
  clearLink.addEventListener('click', () => {
    resetFilters();
    sync();
    emit();
  });
  triggerGroup.appendChild(clearLink);

  const resetFilters = () => {
    state.formats = [];
    state.categories = [];
    state.level = null;
    state.status = null;
  };

  // ── Search input ──
  const searchWrap = h('div', 'sfb__search');
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'sfb__search-input';
  searchInput.placeholder = 'Search simulations';
  searchInput.value = state.search;
  searchInput.addEventListener('input', () => {
    state.search = searchInput.value;
    emit();
  });
  searchWrap.append(searchInput, standInIconEl('search', 'sfb__icon sfb__search-icon'));
  bar.appendChild(searchWrap);

  // ── Sync dynamic bits to state ──
  const sync = () => {
    formatPills.forEach((pill, format) => {
      const active = state.formats.includes(format);
      pill.classList.toggle('sfb__pill--active', active);
      pill.setAttribute('aria-pressed', String(active));
    });

    // Categories trigger shows a count: "Categories · 2".
    const categoriesTrigger = dropdowns.get('categories')!.trigger;
    const count = state.categories.length;
    categoriesTrigger.classList.toggle('sfb__trigger--applied', count > 0);
    categoriesTrigger.querySelector('.sfb__trigger-count')!.textContent = count > 0 ? `· ${count}` : '';

    // Single-select Level/Status triggers show the selected value, never a
    // count: "Easy", "Draft". Default label when nothing is selected.
    const levelTrigger = dropdowns.get('level')!.trigger;
    levelTrigger.classList.toggle('sfb__trigger--applied', state.level !== null);
    levelTrigger.querySelector('.sfb__trigger-label')!.textContent = state.level ? LEVEL_LABEL[state.level] : 'Level';
    levelTrigger.querySelector('.sfb__trigger-count')!.textContent = '';

    const statusTrigger = dropdowns.get('status')!.trigger;
    statusTrigger.classList.toggle('sfb__trigger--applied', state.status !== null);
    statusTrigger.querySelector('.sfb__trigger-label')!.textContent = state.status ? STATUS_LABEL[state.status] : 'Status';
    statusTrigger.querySelector('.sfb__trigger-count')!.textContent = '';

    const anyActive =
      state.formats.length > 0 || count > 0 || state.level !== null || state.status !== null;
    clearLink.style.display = anyActive ? '' : 'none';
  };

  // Outside click closes the open menu (one menu at a time is enforced in toggleMenu).
  const onDocClick = (e: MouseEvent) => {
    if (!root.isConnected) {
      document.removeEventListener('mousedown', onDocClick);
      return;
    }
    if (!root.contains(e.target as Node)) closeMenus();
  };
  document.addEventListener('mousedown', onDocClick);

  sync();
  if (options.openMenu) toggleMenu(options.openMenu);

  return root;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Checkbox option row that mutates `draft` in place. */
function checkboxRow(opt: FilterOption, draft: string[], onToggle?: () => void): HTMLElement {
  const row = document.createElement('label');
  row.className = 'sfb__option';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'sfb__checkbox';
  checkbox.checked = draft.includes(opt.id);
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) draft.push(opt.id);
    else draft.splice(draft.indexOf(opt.id), 1);
    onToggle?.();
  });
  row.append(checkbox, textSpan('sfb__option-label', opt.label));
  return row;
}

/** Order-insensitive equality of two id selections. */
function sameSelection(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((id) => b.includes(id));
}

function h(tag: string, className: string): HTMLElement {
  const el = document.createElement(tag);
  el.className = className;
  return el;
}

function textSpan(className: string, text: string): HTMLElement {
  const span = h('span', className);
  span.textContent = text;
  return span;
}
