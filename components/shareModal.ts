// components/shareModal.ts
// Share simulation modal — tabbed pattern: Member Link / Teams / Individual.
// Source: Figma "Sales-trainer-MVP" — Modal-ShareAssignLink
// (https://www.figma.com/design/fCyTvXFmw7f5TKFU0KCtRo/Sales-trainer-MVP?node-id=15643-261920)

import '../styles/share-modal.css';
import { iconEl } from '../icons';

export type ShareTeam = { id: string; label: string; members: number };
export type SharePerson = { id: string; name: string; email: string };
export type ShareModalTab = 'member' | 'team' | 'individual';

export type ShareModalOptions = {
  memberLinkUrl?: string;
  allTeams?: ShareTeam[];
  assignedTeams?: ShareTeam[];
  directory?: SharePerson[];
  assignedIndividuals?: SharePerson[];
  initialTab?: ShareModalTab;
  dismissible?: boolean;
  onClose?: () => void;
};

const DEFAULT_ALL_TEAMS: ShareTeam[] = [
  { id: 'alpha', label: 'Alpha Team', members: 2 },
  { id: 'beta', label: 'Beta', members: 6 },
  { id: 'gamma', label: 'Gamma Team', members: 4 },
  { id: 'sales', label: 'Sales team', members: 12 },
  { id: 'support', label: 'Customer support', members: 8 },
];

const DEFAULT_ASSIGNED_TEAMS: ShareTeam[] = [{ id: 'alpha', label: 'Alpha Team', members: 2 }];

const DEFAULT_DIRECTORY: SharePerson[] = [
  { id: 'john.doe@acme.com', name: 'John Doe', email: 'john.doe@acme.com' },
  { id: 'mila.tan@acme.com', name: 'Mila Tan', email: 'mila.tan@acme.com' },
  { id: 'sarah.connelly@acme.com', name: 'Sarah Connelly', email: 'sarah.connelly@acme.com' },
  { id: 'jamal.okonkwo@acme.com', name: 'Jamal Okonkwo', email: 'jamal.okonkwo@acme.com' },
];

const DEFAULT_ASSIGNED_INDIVIDUALS: SharePerson[] = [
  { id: 'john.doe@acme.com', name: 'John Doe', email: 'john.doe@acme.com' },
  { id: 'mila.tan@acme.com', name: 'Mila Tan', email: 'mila.tan@acme.com' },
];

const AVATAR_PALETTE = ['#6963FC', '#f43f5e', '#34d399', '#fbbf24', '#4f46e5'];
function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function svgClose(): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '2');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.innerHTML = '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>';
  return s;
}

function svgMinusCircle(): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 20 20');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.5');
  s.setAttribute('stroke-linecap', 'round');
  s.innerHTML = '<circle cx="10" cy="10" r="8.5"/><path d="M6.5 10h7"/>';
  return s;
}

function svgSearch(): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 20 20');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.6');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.innerHTML = '<circle cx="8.5" cy="8.5" r="5.5"/><path d="M17 17l-3.8-3.8"/>';
  return s;
}

function svgTeamIcon(): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.8');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.innerHTML =
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>' +
    '<path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>';
  return s;
}

// ---- Row helpers ----

function buildAssignedRow(opts: {
  leading: HTMLElement;
  primary: string;
  secondary: string;
  onRemove: () => void;
  removeLabel: string;
}): HTMLElement {
  const row = document.createElement('div');
  row.className = 'share-modal__row';

  const info = document.createElement('div');
  info.className = 'share-modal__row-info';
  const primary = document.createElement('span');
  primary.className = 'share-modal__row-primary';
  primary.textContent = opts.primary;
  const secondary = document.createElement('span');
  secondary.className = 'share-modal__row-secondary';
  secondary.textContent = opts.secondary;
  info.append(primary, secondary);

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'share-modal__row-remove';
  remove.setAttribute('aria-label', opts.removeLabel);
  remove.appendChild(svgMinusCircle());
  remove.addEventListener('click', opts.onRemove);

  row.append(opts.leading, info, remove);
  return row;
}

function teamIconEl(label: string, size: 'sm' | 'lg' = 'sm'): HTMLElement {
  const icon = document.createElement('span');
  icon.className = 'share-modal__team-icon' + (size === 'lg' ? ' share-modal__team-icon--lg' : '');
  icon.style.background = colorFor(label) + '22';
  icon.style.color = colorFor(label);
  icon.appendChild(svgTeamIcon());
  return icon;
}

function avatarEl(name: string): HTMLElement {
  const avatar = document.createElement('span');
  avatar.className = 'share-modal__avatar';
  avatar.style.background = colorFor(name);
  avatar.textContent = initialsOf(name);
  return avatar;
}

// ---- Main factory ----

export function createShareModal(options: ShareModalOptions = {}): HTMLElement {
  const {
    memberLinkUrl = 'https://app.mizou.com/check-assignment?token=8f3c1a9d4e2b7f50a6d1c3b4e7f9a02b',
    allTeams = DEFAULT_ALL_TEAMS,
    assignedTeams = DEFAULT_ASSIGNED_TEAMS,
    directory = DEFAULT_DIRECTORY,
    assignedIndividuals = DEFAULT_ASSIGNED_INDIVIDUALS,
    initialTab = 'member',
    dismissible = true,
    onClose,
  } = options;

  // ---- Shared state ----
  let activeTab: ShareModalTab = initialTab;
  const teams: ShareTeam[] = [...assignedTeams];
  const individuals: SharePerson[] = [...assignedIndividuals];
  const customPeople: SharePerson[] = [];

  // ---- Shell ----
  const backdrop = document.createElement('div');
  backdrop.className = 'share-modal-backdrop';

  const card = document.createElement('div');
  card.className = 'share-modal';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  card.setAttribute('aria-label', 'Share simulation');
  card.setAttribute('tabindex', '-1');

  function close() {
    document.removeEventListener('keydown', onKeydown);
    backdrop.remove();
    onClose?.();
  }
  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && dismissible) close();
  }
  if (dismissible) {
    backdrop.addEventListener('mousedown', (e) => {
      if (e.target === backdrop) close();
    });
  }
  document.addEventListener('keydown', onKeydown);

  // ---- Toast notifications ----
  const toastStack = document.createElement('div');
  toastStack.className = 'share-modal__toast-stack';
  function showToast(message: string) {
    const toast = document.createElement('div');
    toast.className = 'share-modal__toast';
    toast.appendChild(iconEl('check-circle', 'sb-icon'));
    const span = document.createElement('span');
    span.textContent = message;
    toast.appendChild(span);
    toastStack.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
  }

  // ---- Header ----
  const header = document.createElement('div');
  header.className = 'share-modal__header';

  const title = document.createElement('h2');
  title.className = 'share-modal__title';
  title.textContent = 'Share Simulation';
  header.appendChild(title);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'share-modal__close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.appendChild(svgClose());
  closeBtn.addEventListener('click', close);
  header.appendChild(closeBtn);

  // ---- Persistent intro (shared across all tabs) ----
  const intro = document.createElement('p');
  intro.className = 'share-modal__intro';
  intro.innerHTML =
    'Select your sharing option. Choose a <b>Member link</b> where any organisation member can join. ' +
    'You can also assign to specific teams, or individuals.';

  // ---- Tab bar ----
  const tabsWrap = document.createElement('div');
  tabsWrap.className = 'share-modal__tabs-wrap';

  const tabBar = document.createElement('div');
  tabBar.className = 'share-modal__tabs';
  tabBar.setAttribute('role', 'tablist');
  tabsWrap.appendChild(tabBar);

  const body = document.createElement('div');
  body.className = 'share-modal__body';

  function renderTabBar() {
    tabBar.innerHTML = '';
    const defs: { id: ShareModalTab; label: string; count?: number }[] = [
      { id: 'member', label: 'Member Link' },
      { id: 'team', label: 'Teams', count: teams.length },
      { id: 'individual', label: 'Individual', count: individuals.length },
    ];
    defs.forEach((d) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'share-modal__tab' + (activeTab === d.id ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(activeTab === d.id));
      const label = document.createElement('span');
      label.textContent = d.label;
      btn.appendChild(label);
      if (typeof d.count === 'number' && d.count > 0) {
        const badge = document.createElement('span');
        badge.className = 'share-modal__tab-count';
        badge.textContent = String(d.count);
        btn.appendChild(badge);
      }
      btn.addEventListener('click', () => {
        activeTab = d.id;
        renderTabBar();
        renderBody();
      });
      tabBar.appendChild(btn);
    });
  }

  // ---- Member link panel ----
  function buildMemberPanel(): HTMLElement {
    const wrap = document.createElement('div');

    const urlField = document.createElement('div');
    urlField.className = 'share-modal__url-field';
    const urlText = document.createElement('span');
    urlText.className = 'share-modal__url-text';
    urlText.textContent = memberLinkUrl;
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'share-modal__btn share-modal__btn--primary share-modal__btn--sm share-modal__url-copy';
    copyBtn.appendChild(iconEl('file-text-outline', 'sb-icon'));
    const copyLabel = document.createElement('span');
    copyLabel.textContent = 'Copy link';
    copyBtn.appendChild(copyLabel);
    copyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(memberLinkUrl).catch(() => {});
      copyBtn.innerHTML = '';
      copyBtn.appendChild(iconEl('check-circle', 'sb-icon'));
      const s = document.createElement('span');
      s.textContent = 'Copied!';
      copyBtn.appendChild(s);
      setTimeout(() => {
        copyBtn.innerHTML = '';
        copyBtn.appendChild(iconEl('file-text-outline', 'sb-icon'));
        copyBtn.appendChild(copyLabel);
      }, 2000);
    });
    urlField.append(urlText, copyBtn);
    wrap.appendChild(urlField);

    const embedLink = document.createElement('button');
    embedLink.type = 'button';
    embedLink.className = 'share-modal__embed-link';
    embedLink.appendChild(iconEl('code', 'sb-icon'));
    const embedLabel = document.createElement('span');
    embedLabel.textContent = 'Embed code';
    embedLink.appendChild(embedLabel);
    embedLink.addEventListener('click', () => {
      const embedSnippet = `<iframe src="${memberLinkUrl}" width="100%" height="600" frameborder="0" allow="microphone"></iframe>`;
      navigator.clipboard?.writeText(embedSnippet).catch(() => {});
      showToast('Embed code copied');
    });
    wrap.appendChild(embedLink);

    return wrap;
  }

  // ---- Team panel ----
  function buildTeamPanel(): HTMLElement {
    const wrap = document.createElement('div');

    const heading = document.createElement('div');
    heading.className = 'share-modal__heading';
    heading.textContent = 'All team members get access';
    wrap.appendChild(heading);

    // ---- Multi-select field (button trigger + dropdown with search + checkboxes) ----
    const msWrap = document.createElement('div');
    msWrap.className = 'share-modal__ms';

    const field = document.createElement('button');
    field.type = 'button';
    field.className = 'share-modal__field share-modal__ms-field';
    const fieldText = document.createElement('span');
    fieldText.className = 'share-modal__ms-placeholder';
    fieldText.textContent = 'Select a team';
    field.appendChild(fieldText);
    field.appendChild(iconEl('chevron-down-sm', 'sb-icon share-modal__ms-chev'));

    const dropdown = document.createElement('div');
    dropdown.className = 'share-modal__ms-dropdown';
    dropdown.hidden = true;

    const searchWrap = document.createElement('div');
    searchWrap.className = 'share-modal__ms-search';
    searchWrap.appendChild(svgSearch());
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search teams';
    searchWrap.appendChild(searchInput);

    const optionsList = document.createElement('div');
    optionsList.className = 'share-modal__ms-list';

    const footer = document.createElement('div');
    footer.className = 'share-modal__ms-footer';
    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = 'share-modal__ms-apply';
    applyBtn.textContent = 'Apply';
    footer.appendChild(applyBtn);

    dropdown.append(searchWrap, optionsList, footer);
    msWrap.append(field, dropdown);
    wrap.appendChild(msWrap);

    const sectionLabel = document.createElement('div');
    sectionLabel.className = 'share-modal__section-label';
    sectionLabel.textContent = 'ASSIGNED TEAMS';
    wrap.appendChild(sectionLabel);

    const list = document.createElement('div');
    list.className = 'share-modal__list';
    wrap.appendChild(list);

    let pending = new Set<string>();
    let isOpen = false;

    function openDropdown() {
      isOpen = true;
      pending = new Set(teams.map((t) => t.id));
      searchInput.value = '';
      field.classList.add('is-open');
      dropdown.hidden = false;
      renderOptions();
      searchInput.focus();
    }
    function closeDropdown() {
      isOpen = false;
      field.classList.remove('is-open');
      dropdown.hidden = true;
    }

    field.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen ? closeDropdown() : openDropdown();
    });
    document.addEventListener('mousedown', (e) => {
      if (isOpen && !msWrap.contains(e.target as Node)) closeDropdown();
    });

    function renderOptions() {
      const q = searchInput.value.trim().toLowerCase();
      optionsList.innerHTML = '';
      const filtered = allTeams.filter((t) => t.label.toLowerCase().includes(q));
      if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'share-modal__ms-empty';
        empty.textContent = 'No teams found';
        optionsList.appendChild(empty);
        return;
      }
      filtered.forEach((t) => {
        const optLabel = document.createElement('label');
        optLabel.className = 'share-modal__ms-option';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'share-modal__ms-checkbox';
        checkbox.checked = pending.has(t.id);
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) pending.add(t.id);
          else pending.delete(t.id);
        });
        const text = document.createElement('span');
        text.textContent = t.label;
        optLabel.append(checkbox, text);
        optionsList.appendChild(optLabel);
      });
    }
    searchInput.addEventListener('input', renderOptions);

    applyBtn.addEventListener('click', () => {
      teams.length = 0;
      allTeams.filter((t) => pending.has(t.id)).forEach((t) => teams.push(t));
      closeDropdown();
      renderTabBar();
      renderAssignedTeams();
    });

    function renderAssignedTeams() {
      list.innerHTML = '';
      if (teams.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'share-modal__empty';
        empty.textContent = 'No teams assigned yet.';
        list.appendChild(empty);
        return;
      }
      teams.forEach((t) => {
        const row = buildAssignedRow({
          leading: teamIconEl(t.label, 'lg'),
          primary: t.label,
          secondary: `${t.members} ${t.members === 1 ? 'member' : 'members'}`,
          removeLabel: `Remove ${t.label}`,
          onRemove: () => {
            const idx = teams.findIndex((x) => x.id === t.id);
            if (idx >= 0) teams.splice(idx, 1);
            renderTabBar();
            renderAssignedTeams();
          },
        });
        list.appendChild(row);
      });
    }

    renderAssignedTeams();

    return wrap;
  }

  // ---- Individual panel ----
  function buildIndividualPanel(): HTMLElement {
    const wrap = document.createElement('div');

    const heading = document.createElement('div');
    heading.className = 'share-modal__heading';
    heading.textContent = 'Assign to specific people by name or email.';
    wrap.appendChild(heading);

    const msWrap = document.createElement('div');
    msWrap.className = 'share-modal__ms';

    const fieldWrap = document.createElement('div');
    fieldWrap.className = 'share-modal__field share-modal__ms-field share-modal__ms-field--input';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'share-modal__ms-input';
    input.placeholder = 'Name or email address';
    fieldWrap.appendChild(input);
    const chevWrap = document.createElement('span');
    chevWrap.appendChild(iconEl('chevron-down-sm', 'sb-icon share-modal__ms-chev'));
    fieldWrap.appendChild(chevWrap);

    const dropdown = document.createElement('div');
    dropdown.className = 'share-modal__ms-dropdown';
    dropdown.hidden = true;

    const optionsList = document.createElement('div');
    optionsList.className = 'share-modal__ms-list';

    const footer = document.createElement('div');
    footer.className = 'share-modal__ms-footer';
    const applyBtn = document.createElement('button');
    applyBtn.type = 'button';
    applyBtn.className = 'share-modal__ms-apply';
    applyBtn.textContent = 'Apply';
    footer.appendChild(applyBtn);

    dropdown.append(optionsList, footer);
    msWrap.append(fieldWrap, dropdown);
    wrap.appendChild(msWrap);

    const divider = document.createElement('div');
    divider.className = 'share-modal__divider';
    wrap.appendChild(divider);

    const sectionLabel = document.createElement('div');
    sectionLabel.className = 'share-modal__section-label';
    sectionLabel.textContent = 'ASSIGNED MEMBERS';
    wrap.appendChild(sectionLabel);

    const list = document.createElement('div');
    list.className = 'share-modal__list';
    wrap.appendChild(list);

    let pending = new Set<string>();
    let isOpen = false;

    function allPeople(): SharePerson[] {
      return [...directory, ...customPeople];
    }

    function draftFromQuery(v: string): SharePerson {
      if (isEmail(v)) {
        const local = v.split('@')[0];
        const name =
          local
            .split(/[._-]/)
            .filter(Boolean)
            .map((p) => p[0].toUpperCase() + p.slice(1))
            .join(' ') || v;
        return { id: v.toLowerCase(), name, email: v };
      }
      const email = v.toLowerCase().replace(/\s+/g, '.') + '@invite.mizou.com';
      return { id: email, name: v, email };
    }

    function openDropdown() {
      isOpen = true;
      pending = new Set(individuals.map((p) => p.id));
      fieldWrap.classList.add('is-open');
      dropdown.hidden = false;
      renderOptions();
    }
    function closeDropdown() {
      isOpen = false;
      fieldWrap.classList.remove('is-open');
      dropdown.hidden = true;
    }

    input.addEventListener('focus', () => {
      if (!isOpen) openDropdown();
    });
    chevWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen ? closeDropdown() : openDropdown();
      if (isOpen) input.focus();
    });
    document.addEventListener('mousedown', (e) => {
      if (isOpen && !msWrap.contains(e.target as Node)) closeDropdown();
    });

    function renderOptions() {
      const q = input.value.trim().toLowerCase();
      optionsList.innerHTML = '';

      const filtered = allPeople().filter(
        (p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q),
      );

      const exactMatch = q && allPeople().some((p) => p.email.toLowerCase() === q || p.name.toLowerCase() === q);
      if (q && !exactMatch) {
        const addRow = document.createElement('button');
        addRow.type = 'button';
        addRow.className = 'share-modal__ms-add-custom';
        addRow.textContent = `Add "${input.value.trim()}"`;
        addRow.addEventListener('click', () => {
          const draft = draftFromQuery(input.value.trim());
          if (!allPeople().find((p) => p.id === draft.id)) customPeople.push(draft);
          pending.add(draft.id);
          input.value = '';
          renderOptions();
        });
        optionsList.appendChild(addRow);
      }

      if (filtered.length === 0 && !q) {
        const empty = document.createElement('div');
        empty.className = 'share-modal__ms-empty';
        empty.textContent = 'No people found';
        optionsList.appendChild(empty);
        return;
      }

      filtered.forEach((p) => {
        const optLabel = document.createElement('label');
        optLabel.className = 'share-modal__ms-option';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'share-modal__ms-checkbox';
        checkbox.checked = pending.has(p.id);
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) pending.add(p.id);
          else pending.delete(p.id);
        });
        const text = document.createElement('span');
        text.textContent = p.name;
        optLabel.append(checkbox, text);
        optionsList.appendChild(optLabel);
      });
    }
    input.addEventListener('input', renderOptions);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const v = input.value.trim();
        if (!v) return;
        const draft = draftFromQuery(v);
        if (!allPeople().find((p) => p.id === draft.id)) customPeople.push(draft);
        pending.add(draft.id);
        input.value = '';
        renderOptions();
      }
    });

    applyBtn.addEventListener('click', () => {
      individuals.length = 0;
      allPeople().filter((p) => pending.has(p.id)).forEach((p) => individuals.push(p));
      closeDropdown();
      input.value = '';
      renderTabBar();
      renderAssignedIndividuals();
    });

    function renderAssignedIndividuals() {
      list.innerHTML = '';
      if (individuals.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'share-modal__empty';
        empty.textContent = 'No individuals assigned yet.';
        list.appendChild(empty);
        return;
      }
      individuals.forEach((p) => {
        const row = buildAssignedRow({
          leading: avatarEl(p.name),
          primary: p.name,
          secondary: p.email,
          removeLabel: `Remove ${p.name}`,
          onRemove: () => {
            const idx = individuals.findIndex((x) => x.id === p.id);
            if (idx >= 0) individuals.splice(idx, 1);
            renderTabBar();
            renderAssignedIndividuals();
          },
        });
        list.appendChild(row);
      });
    }

    renderAssignedIndividuals();

    return wrap;
  }

  function renderBody() {
    body.innerHTML = '';
    if (activeTab === 'member') body.appendChild(buildMemberPanel());
    if (activeTab === 'team') body.appendChild(buildTeamPanel());
    if (activeTab === 'individual') body.appendChild(buildIndividualPanel());
  }

  renderTabBar();
  renderBody();

  card.append(header, intro, tabsWrap, body, toastStack);
  backdrop.appendChild(card);

  queueMicrotask(() => card.focus());

  return backdrop;
}
