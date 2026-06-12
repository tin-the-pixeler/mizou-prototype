// components/sessionsFilterBar.ts
// Sessions Filter Bar — true-filters-only bar for the Sessions page ("Option A").
// Format pills (multi-toggle) · dropdown triggers (Learners / Simulations / Progress)
// · search input · "Clear filters" link. Sorting NEVER lives here — see
// sessionsTable.ts for the companion Sortable Table Header pattern.
//
// Naming: the learner journey on Sessions is "Progress" (Completed / Ongoing /
// Not started). "Status" is reserved for simulation lifecycle (Draft,
// Published) on the Collections page.
//
// Selection models:
// - Multi-select menus (Learners / Simulations) STAGE checkbox changes in a
//   draft and commit on Apply; closing the menu without Apply discards the
//   draft. The tablet drawer uses the same draft/commit model.
// - The Progress radio list and the "Show archived" toggle apply instantly.
//
// Tablet (768–1024px): the three dropdown triggers collapse into one
// "Filters · N" pill that opens a right slide-in drawer; active filters render
// as removable chips under the bar. Apply the tablet layout via the
// `layout: 'tablet'` option (in app code, toggle it with matchMedia).

import { iconEl } from '../icons';

// ─── Types ──────────────────────────────────────────────────────────────────

export type SessionFormat = 'chatbot' | 'voice-role-play' | 'video-role-play';
export type SessionProgress = 'completed' | 'ongoing' | 'not-started';

export type FilterOption = { id: string; label: string };

export type SessionsFilterState = {
  /** Active format pills. Empty = no format filter (all formats shown). */
  formats: SessionFormat[];
  /** Selected learner ids (OR within the group). */
  learners: string[];
  /** Selected simulation ids (OR within the group). */
  simulations: string[];
  /** Single-select progress; null = all. */
  progress: SessionProgress | null;
  /** Archived sessions are hidden unless true. */
  showArchived: boolean;
  search: string;
};

export type SessionsFilterBarOptions = {
  learners: FilterOption[];
  simulations: FilterOption[];
  initialState?: Partial<SessionsFilterState>;
  /** 'tablet' collapses triggers into a "Filters · N" pill + drawer + chips row. */
  layout?: 'desktop' | 'tablet';
  /** Open a dropdown menu on mount (for demos/docs). */
  openMenu?: 'learners' | 'simulations' | 'progress' | null;
  /** Open the tablet drawer on mount (for demos/docs). */
  drawerOpen?: boolean;
  onChange?: (state: SessionsFilterState) => void;
};

// ─── Stand-in icons ──────────────────────────────────────────────────────────
// MISSING FROM assets/icons/ — hand-drawn stand-ins matching the 1.5px-stroke
// convention. Request from the library owner: `search`, `video-camera`,
// `close-x` (chip remove). See also sort glyphs in sessionsTable.ts.

export const STAND_IN_ICONS = {
  search:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7.25" cy="7.25" r="4.5" stroke="currentColor" stroke-width="1.5"/><path d="M10.75 10.75L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  'video-camera':
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.75" y="4.25" width="8.5" height="7.5" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M10.25 7.25L13.75 5.25v5.5l-3.5-2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  'close-x':
    '<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
};

function standInIconEl(name: keyof typeof STAND_IN_ICONS, className = 'sfb__icon'): HTMLElement {
  const span = document.createElement('span');
  span.className = className;
  span.innerHTML = STAND_IN_ICONS[name];
  return span;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const FORMAT_LABEL: Record<SessionFormat, string> = {
  chatbot: 'Chatbot',
  'voice-role-play': 'Voice Role Play',
  'video-role-play': 'Video Role Play',
};

export const PROGRESS_LABEL: Record<SessionProgress, string> = {
  completed: 'Completed',
  ongoing: 'Ongoing',
  'not-started': 'Not started',
};

const PROGRESS_OPTIONS: (SessionProgress | null)[] = [null, 'completed', 'ongoing', 'not-started'];

/** Format pill icon — video-role-play is a stand-in until the icon ships. */
export function formatIconEl(format: SessionFormat, className = 'sfb__icon'): HTMLElement {
  if (format === 'video-role-play') return standInIconEl('video-camera', className);
  return iconEl(format === 'chatbot' ? 'chat-ai' : 'mic-fill', className);
}

// ─── Filter predicate ────────────────────────────────────────────────────────
// Encodes the locked behavior rules: groups AND together; options within a
// multi-select group OR together; archived hidden unless showArchived.

export type FilterableSession = {
  format: SessionFormat;
  learnerId: string;
  simulationId: string;
  progress: SessionProgress;
  archived?: boolean;
  /** Text the bar's search input matches against (e.g. learner + title). */
  searchText?: string;
};

export function sessionFilterPredicate(state: SessionsFilterState) {
  const query = state.search.trim().toLowerCase();
  return (s: FilterableSession): boolean => {
    if (s.archived && !state.showArchived) return false;
    if (state.formats.length > 0 && !state.formats.includes(s.format)) return false;
    if (state.learners.length > 0 && !state.learners.includes(s.learnerId)) return false;
    if (state.simulations.length > 0 && !state.simulations.includes(s.simulationId)) return false;
    if (state.progress && s.progress !== state.progress) return false;
    if (query && !(s.searchText ?? '').toLowerCase().includes(query)) return false;
    return true;
  };
}

// ─── Factory ─────────────────────────────────────────────────────────────────

type MenuKey = 'learners' | 'simulations' | 'progress';
type MultiKey = 'learners' | 'simulations';

export function createSessionsFilterBar(options: SessionsFilterBarOptions): HTMLElement {
  const state: SessionsFilterState = {
    formats: [],
    learners: [],
    simulations: [],
    progress: null,
    showArchived: false,
    search: '',
    ...options.initialState,
  };
  const tablet = options.layout === 'tablet';

  const root = h('div', `sfb-root${tablet ? ' sfb-root--tablet' : ''}`);
  const bar = h('div', 'sfb');
  root.appendChild(bar);

  const emit = () => options.onChange?.({ ...state, formats: [...state.formats], learners: [...state.learners], simulations: [...state.simulations] });

  // ── Format pills ──
  const formatGroup = h('div', 'sfb__formats');
  formatGroup.setAttribute('role', 'group');
  formatGroup.setAttribute('aria-label', 'Filter by format');
  const formatPills = new Map<SessionFormat, HTMLButtonElement>();
  (Object.keys(FORMAT_LABEL) as SessionFormat[]).forEach((format) => {
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

  // ── Dropdown triggers (desktop) ──
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
    if (key === 'progress') return buildProgressMenu();
    return buildMultiSelectMenu(key, key === 'learners' ? options.learners : options.simulations);
  };

  // Multi-select menu: staged draft, committed on Apply (same model as the
  // tablet drawer). The in-menu search filters the option list live.
  const buildMultiSelectMenu = (key: MultiKey, opts: FilterOption[]): HTMLElement => {
    const menu = h('div', 'sfb__menu');
    const searchWrap = h('div', 'sfb__menu-search');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'sfb__menu-search-input';
    input.placeholder = `Search ${key}`;
    searchWrap.append(input, standInIconEl('search', 'sfb__icon sfb__menu-search-icon'));
    menu.appendChild(searchWrap);

    const draft = [...state[key]];

    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = 'sfb__apply sfb__menu-apply';
    applyBtn.textContent = 'Apply';
    const syncApply = () => {
      applyBtn.disabled = sameSelection(draft, state[key]);
    };

    const list = h('div', 'sfb__menu-list');
    opts.forEach((opt) => list.appendChild(checkboxRow(opt, draft, syncApply)));
    menu.appendChild(list);

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      list.querySelectorAll<HTMLElement>('.sfb__option').forEach((row) => {
        const label = row.querySelector('.sfb__option-label')?.textContent ?? '';
        row.style.display = label.toLowerCase().includes(q) ? '' : 'none';
      });
    });

    applyBtn.addEventListener('click', () => {
      state[key] = [...draft];
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

  // Progress menu: radios + archived toggle apply instantly, menu stays open.
  const buildProgressMenu = (): HTMLElement => {
    const menu = h('div', 'sfb__menu');
    const list = h('div', 'sfb__menu-list');
    PROGRESS_OPTIONS.forEach((value) => {
      const row = document.createElement('label');
      row.className = 'sfb__option';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'sfb-progress';
      radio.className = 'sfb__radio';
      radio.checked = state.progress === value;
      radio.addEventListener('change', () => {
        state.progress = value;
        sync();
        emit();
      });
      row.append(radio, textSpan('sfb__option-label', value ? PROGRESS_LABEL[value] : 'All'));
      list.appendChild(row);
    });
    menu.appendChild(list);
    menu.appendChild(h('div', 'sfb__menu-divider'));
    menu.appendChild(buildArchivedToggle(() => {
      sync();
      emit();
    }));
    return menu;
  };

  const buildArchivedToggle = (onToggle: () => void): HTMLElement => {
    const row = document.createElement('label');
    row.className = 'sfb__option sfb__option--toggle';
    row.append(textSpan('sfb__option-label', 'Show archived'));
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'sfb__toggle';
    toggle.setAttribute('role', 'switch');
    const syncToggle = () => {
      toggle.classList.toggle('sfb__toggle--on', state.showArchived);
      toggle.setAttribute('aria-checked', String(state.showArchived));
    };
    syncToggle();
    toggle.appendChild(h('span', 'sfb__toggle-knob'));
    toggle.addEventListener('click', () => {
      state.showArchived = !state.showArchived;
      syncToggle();
      onToggle();
    });
    row.appendChild(toggle);
    return row;
  };

  const TRIGGERS: { key: MenuKey; label: string }[] = [
    { key: 'learners', label: 'Learners' },
    { key: 'simulations', label: 'Simulations' },
    { key: 'progress', label: 'Progress' },
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
    state.learners = [];
    state.simulations = [];
    state.progress = null;
    state.showArchived = false;
  };

  // ── Collapsed "Filters · N" pill (tablet) ──
  const collapsedTrigger = document.createElement('button');
  collapsedTrigger.type = 'button';
  collapsedTrigger.className = 'sfb__trigger sfb__trigger--collapsed';
  collapsedTrigger.append(
    textSpan('sfb__trigger-label', 'Filters'),
    textSpan('sfb__trigger-count', ''),
    iconEl('chevron-down-sm', 'sfb__icon sfb__trigger-chevron'),
  );
  collapsedTrigger.addEventListener('click', () => openDrawer());
  bar.appendChild(collapsedTrigger);

  // ── Search input ──
  const searchWrap = h('div', 'sfb__search');
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'sfb__search-input';
  searchInput.placeholder = 'Search';
  searchInput.value = state.search;
  searchInput.addEventListener('input', () => {
    state.search = searchInput.value;
    emit();
  });
  searchWrap.append(searchInput, standInIconEl('search', 'sfb__icon sfb__search-icon'));
  bar.appendChild(searchWrap);

  // ── Chips row (tablet) ──
  const chipsRow = h('div', 'sfb__chips');
  root.appendChild(chipsRow);

  type Chip = { label: string; remove: () => void };
  const activeChips = (): Chip[] => {
    const chips: Chip[] = [];
    state.learners.forEach((id) => {
      const opt = options.learners.find((o) => o.id === id);
      if (opt) chips.push({ label: opt.label, remove: () => state.learners.splice(state.learners.indexOf(id), 1) });
    });
    state.simulations.forEach((id) => {
      const opt = options.simulations.find((o) => o.id === id);
      if (opt) chips.push({ label: opt.label, remove: () => state.simulations.splice(state.simulations.indexOf(id), 1) });
    });
    if (state.progress) chips.push({ label: PROGRESS_LABEL[state.progress], remove: () => { state.progress = null; } });
    if (state.showArchived) chips.push({ label: 'Archived shown', remove: () => { state.showArchived = false; } });
    return chips;
  };

  const renderChips = () => {
    chipsRow.replaceChildren();
    const chips = activeChips();
    chipsRow.style.display = tablet && chips.length > 0 ? '' : 'none';
    chips.forEach((chip) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'sfb__chip';
      el.setAttribute('aria-label', `Remove filter: ${chip.label}`);
      el.append(textSpan('sfb__chip-label', chip.label), standInIconEl('close-x', 'sfb__icon sfb__chip-x'));
      el.addEventListener('click', () => {
        chip.remove();
        sync();
        emit();
      });
      chipsRow.appendChild(el);
    });
    const clearAll = document.createElement('button');
    clearAll.type = 'button';
    clearAll.className = 'sfb__clear sfb__chips-clear';
    clearAll.textContent = 'Clear all';
    clearAll.addEventListener('click', () => {
      resetFilters();
      sync();
      emit();
    });
    chipsRow.appendChild(clearAll);
  };

  // ── Drawer (tablet) ──
  let drawerEl: HTMLElement | null = null;
  let scrimEl: HTMLElement | null = null;

  const openDrawer = () => {
    if (drawerEl) return;
    // Drawer edits a draft; "Apply" commits, "Clear all" resets the draft.
    const draft: SessionsFilterState = {
      ...state,
      formats: [...state.formats],
      learners: [...state.learners],
      simulations: [...state.simulations],
    };

    scrimEl = h('div', 'sfb__scrim');
    scrimEl.addEventListener('click', closeDrawer);
    drawerEl = h('aside', 'sfb__drawer');
    drawerEl.setAttribute('role', 'dialog');
    drawerEl.setAttribute('aria-label', 'Filters');

    const head = h('div', 'sfb__drawer-head');
    head.appendChild(textSpan('sfb__drawer-title', 'Filters'));
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'sfb__drawer-close';
    closeBtn.setAttribute('aria-label', 'Close filters');
    closeBtn.appendChild(standInIconEl('close-x', 'sfb__icon'));
    closeBtn.addEventListener('click', closeDrawer);
    head.appendChild(closeBtn);
    drawerEl.appendChild(head);

    const body = h('div', 'sfb__drawer-body');
    const buildGroup = (title: string, key: MultiKey, opts: FilterOption[]) => {
      const group = h('div', 'sfb__drawer-group');
      group.appendChild(textSpan('sfb__drawer-group-title', title));
      opts.forEach((opt) => group.appendChild(checkboxRow(opt, draft[key])));
      return group;
    };
    body.appendChild(buildGroup('Learners', 'learners', options.learners));
    body.appendChild(buildGroup('Simulations', 'simulations', options.simulations));

    const progressGroup = h('div', 'sfb__drawer-group');
    progressGroup.appendChild(textSpan('sfb__drawer-group-title', 'Progress'));
    PROGRESS_OPTIONS.forEach((value) => {
      const row = document.createElement('label');
      row.className = 'sfb__option';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'sfb-drawer-progress';
      radio.className = 'sfb__radio';
      radio.checked = draft.progress === value;
      radio.addEventListener('change', () => { draft.progress = value; });
      row.append(radio, textSpan('sfb__option-label', value ? PROGRESS_LABEL[value] : 'All'));
      progressGroup.appendChild(row);
    });
    progressGroup.appendChild(h('div', 'sfb__menu-divider'));
    const archivedRow = document.createElement('label');
    archivedRow.className = 'sfb__option sfb__option--toggle';
    archivedRow.append(textSpan('sfb__option-label', 'Show archived'));
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'sfb__toggle';
    toggle.setAttribute('role', 'switch');
    toggle.classList.toggle('sfb__toggle--on', draft.showArchived);
    toggle.setAttribute('aria-checked', String(draft.showArchived));
    toggle.appendChild(h('span', 'sfb__toggle-knob'));
    toggle.addEventListener('click', () => {
      draft.showArchived = !draft.showArchived;
      toggle.classList.toggle('sfb__toggle--on', draft.showArchived);
      toggle.setAttribute('aria-checked', String(draft.showArchived));
    });
    archivedRow.appendChild(toggle);
    progressGroup.appendChild(archivedRow);
    body.appendChild(progressGroup);
    drawerEl.appendChild(body);

    const foot = h('div', 'sfb__drawer-foot');
    const clearAllBtn = document.createElement('button');
    clearAllBtn.type = 'button';
    clearAllBtn.className = 'sfb__clear';
    clearAllBtn.textContent = 'Clear all';
    clearAllBtn.addEventListener('click', () => {
      // Empty in place — the checkbox rows hold references to these arrays.
      draft.learners.splice(0);
      draft.simulations.splice(0);
      draft.progress = null;
      draft.showArchived = false;
      body.querySelectorAll<HTMLInputElement>('.sfb__checkbox').forEach((cb) => { cb.checked = false; });
      body.querySelectorAll<HTMLInputElement>('.sfb__radio').forEach((radio, i) => { radio.checked = i === 0; });
      const tgl = body.querySelector('.sfb__toggle');
      tgl?.classList.remove('sfb__toggle--on');
      tgl?.setAttribute('aria-checked', 'false');
    });
    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = 'sfb__apply';
    applyBtn.textContent = 'Apply';
    applyBtn.addEventListener('click', () => {
      state.learners = draft.learners;
      state.simulations = draft.simulations;
      state.progress = draft.progress;
      state.showArchived = draft.showArchived;
      closeDrawer();
      sync();
      emit();
    });
    foot.append(clearAllBtn, applyBtn);
    drawerEl.appendChild(foot);

    root.append(scrimEl, drawerEl);
    requestAnimationFrame(() => drawerEl?.classList.add('sfb__drawer--open'));
  };

  const closeDrawer = () => {
    drawerEl?.remove();
    scrimEl?.remove();
    drawerEl = null;
    scrimEl = null;
  };

  // ── Sync dynamic bits to state ──
  const sync = () => {
    formatPills.forEach((pill, format) => {
      const active = state.formats.includes(format);
      pill.classList.toggle('sfb__pill--active', active);
      pill.setAttribute('aria-pressed', String(active));
    });

    // Multi-select triggers show a count: "Learners · 2".
    const counts: Record<MultiKey, number> = {
      learners: state.learners.length,
      simulations: state.simulations.length,
    };
    (['learners', 'simulations'] as MultiKey[]).forEach((key) => {
      const { trigger } = dropdowns.get(key)!;
      const count = counts[key];
      trigger.classList.toggle('sfb__trigger--applied', count > 0);
      trigger.querySelector('.sfb__trigger-count')!.textContent = count > 0 ? `· ${count}` : '';
    });

    // Single-select Progress trigger shows the selected value, never a count:
    // "Completed", "Archived", or "Completed, Archived".
    const progressTrigger = dropdowns.get('progress')!.trigger;
    const progressParts: string[] = [];
    if (state.progress) progressParts.push(PROGRESS_LABEL[state.progress]);
    if (state.showArchived) progressParts.push('Archived');
    progressTrigger.classList.toggle('sfb__trigger--applied', progressParts.length > 0);
    progressTrigger.querySelector('.sfb__trigger-label')!.textContent =
      progressParts.length > 0 ? progressParts.join(', ') : 'Progress';
    progressTrigger.querySelector('.sfb__trigger-count')!.textContent = '';

    const progressCount = (state.progress ? 1 : 0) + (state.showArchived ? 1 : 0);
    const nonFormatCount = counts.learners + counts.simulations + progressCount;
    const collapsedCount = collapsedTrigger.querySelector('.sfb__trigger-count')!;
    collapsedCount.textContent = nonFormatCount > 0 ? `· ${nonFormatCount}` : '';
    collapsedTrigger.classList.toggle('sfb__trigger--applied', nonFormatCount > 0);

    const anyActive = state.formats.length > 0 || nonFormatCount > 0;
    clearLink.style.display = anyActive ? '' : 'none';

    renderChips();
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
  if (options.drawerOpen && tablet) openDrawer();

  return root;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Checkbox option row that mutates `draft` in place — shared by the desktop
 *  multi-select menus and the tablet drawer (one draft/commit implementation). */
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
