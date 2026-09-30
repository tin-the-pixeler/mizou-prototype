// components/shareModal.ts
// Share / assign simulation modal — tabbed pattern: Member Link / Teams / Individual.
// Copy and rules follow production (mizou-business AssignSimulation.modal):
// title "Assign Simulation", link access Public / Organization / Restricted,
// Individual tab only accepts existing organisation members.
// Team + individual assignments are independent: removing a team does not
// remove a member who is also assigned individually.
// Source: Figma "Sales-trainer-MVP" — Modal-ShareAssignLink
// (https://www.figma.com/design/fCyTvXFmw7f5TKFU0KCtRo/Sales-trainer-MVP?node-id=15643-261920)

import '../styles/share-modal.css';
import { iconEl } from '../icons';

export type ShareTeam = { id: string; label: string; members: number };
export type SharePerson = { id: string; name: string; email: string };
export type ShareModalTab = 'member' | 'team' | 'individual';
export type LinkAccess = 'public' | 'organisation' | 'restricted';

export type ShareModalOptions = {
  memberLinkUrl?: string;
  allTeams?: ShareTeam[];
  assignedTeams?: ShareTeam[];
  directory?: SharePerson[];
  assignedIndividuals?: SharePerson[];
  initialTab?: ShareModalTab;
  /** Starting link access (production default comes from Organization Settings). */
  defaultLinkAccess?: LinkAccess;
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

const ACCESS_COPY: Record<LinkAccess, { title: string; desc: string }> = {
  public: {
    title: 'Public Access',
    desc: 'Any user with the link can access the simulation',
  },
  organisation: {
    title: 'Organization Access',
    desc: 'Any member of the organization with the link can access the simulation',
  },
  restricted: {
    title: 'Restricted Access',
    desc: 'Only assigned individuals or teams can access the simulation',
  },
};

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

function svgLockFill(): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 20 20');
  s.setAttribute('fill', 'currentColor');
  s.innerHTML =
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M10 2a4 4 0 0 0-4 4v2H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1V6a4 4 0 0 0-4-4Zm2 6V6a2 2 0 1 0-4 0v2h4Z"/>';
  return s;
}

function svgCheckCircleFill(): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 20 20');
  s.setAttribute('fill', 'currentColor');
  s.innerHTML =
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.59l-1.3-1.3a1 1 0 0 0-1.4 1.42l2 2a1 1 0 0 0 1.4 0l4-4Z"/>';
  return s;
}

function svgGlobe(): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.8');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.innerHTML =
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>';
  return s;
}

function accessIcon(kind: LinkAccess): SVGElement {
  return kind === 'public' ? svgGlobe() : kind === 'organisation' ? svgTeamIcon() : svgLockFill();
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
    defaultLinkAccess = 'organisation',
    dismissible = true,
    onClose,
  } = options;

  // ---- Shared state ----
  let activeTab: ShareModalTab = initialTab;
  let linkAccess: LinkAccess = defaultLinkAccess;
  const teams: ShareTeam[] = [...assignedTeams];
  const individuals: SharePerson[] = [...assignedIndividuals];

  // ---- Shell ----
  const backdrop = document.createElement('div');
  backdrop.className = 'share-modal-backdrop';

  const card = document.createElement('div');
  card.className = 'share-modal';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  card.setAttribute('aria-label', 'Assign simulation');
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
  title.textContent = 'Assign Simulation';
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
    'Select your sharing option. Choose a <strong>Member link</strong> where any organisation member can join. ' +
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

  // ---- Share link panel (link-access-control) ----
  function buildLinkPanel(): HTMLElement {
    const wrap = document.createElement('div');

    let isOpen = false;

    const accessWrap = document.createElement('div');
    accessWrap.className = 'share-modal__access-wrap';

    const control = document.createElement('div');
    control.className = 'share-modal__access';

    const info = document.createElement('div');
    info.className = 'share-modal__access-info';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'share-modal__access-trigger';
    trigger.setAttribute('aria-label', 'Change link access');
    trigger.setAttribute('aria-expanded', 'false');
    const iconWrap = document.createElement('span');
    iconWrap.className = 'share-modal__access-icon';
    const titleEl = document.createElement('span');
    titleEl.className = 'share-modal__access-title';
    const chevronWrap = document.createElement('span');
    chevronWrap.className = 'share-modal__access-chev';
    chevronWrap.appendChild(iconEl('chevron-down-sm', 'sb-icon'));
    trigger.append(iconWrap, titleEl, chevronWrap);

    const descEl = document.createElement('p');
    descEl.className = 'share-modal__access-desc';

    info.append(trigger, descEl);

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'share-modal__btn share-modal__btn--secondary share-modal__btn--sm';
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

    control.append(info, copyBtn);

    const dropdown = document.createElement('div');
    dropdown.className = 'share-modal__access-dropdown';
    dropdown.setAttribute('role', 'listbox');
    dropdown.hidden = true;

    function renderControl() {
      const copy = ACCESS_COPY[linkAccess];
      iconWrap.innerHTML = '';
      iconWrap.appendChild(accessIcon(linkAccess));
      titleEl.textContent = copy.title;
      descEl.textContent = copy.desc;
    }

    function buildOption(kind: LinkAccess): HTMLElement {
      const isSelected = linkAccess === kind;
      const opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'share-modal__access-option' + (isSelected ? ' is-selected' : '');
      opt.setAttribute('role', 'option');
      opt.setAttribute('aria-selected', String(isSelected));

      const optIcon = document.createElement('span');
      optIcon.className = `share-modal__access-option-icon share-modal__access-option-icon--${kind}`;
      optIcon.appendChild(accessIcon(kind));

      const optInfo = document.createElement('span');
      optInfo.className = 'share-modal__access-option-info';
      const optTitle = document.createElement('span');
      optTitle.className = 'share-modal__access-option-title';
      optTitle.textContent = ACCESS_COPY[kind].title;
      const optDesc = document.createElement('span');
      optDesc.className = 'share-modal__access-option-desc';
      optDesc.textContent = ACCESS_COPY[kind].desc;
      optInfo.append(optTitle, optDesc);

      opt.append(optIcon, optInfo);
      if (isSelected) {
        const check = document.createElement('span');
        check.className = 'share-modal__access-option-check';
        check.appendChild(svgCheckCircleFill());
        opt.appendChild(check);
      }

      opt.addEventListener('click', () => {
        linkAccess = kind;
        renderControl();
        renderOptions();
        closeDropdown();
      });

      return opt;
    }

    function renderOptions() {
      dropdown.innerHTML = '';
      dropdown.appendChild(buildOption('public'));
      dropdown.appendChild(buildOption('organisation'));
      dropdown.appendChild(buildOption('restricted'));
    }

    function openDropdown() {
      isOpen = true;
      trigger.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      dropdown.hidden = false;
      renderOptions();
    }
    function closeDropdown() {
      isOpen = false;
      trigger.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      dropdown.hidden = true;
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen ? closeDropdown() : openDropdown();
    });
    document.addEventListener('mousedown', (e) => {
      if (isOpen && !accessWrap.contains(e.target as Node)) closeDropdown();
    });

    renderControl();

    accessWrap.append(control, dropdown);
    wrap.appendChild(accessWrap);

    const divider = document.createElement('div');
    divider.className = 'share-modal__divider';
    wrap.appendChild(divider);

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
      const before = teams.length;
      teams.length = 0;
      allTeams.filter((t) => pending.has(t.id)).forEach((t) => teams.push(t));
      if (teams.length > before) showToast('Team assigned!');
      else if (teams.length < before) showToast('Team assignment removed!');
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
            showToast('Team assignment removed!');
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
    heading.textContent = 'Assign to specific members by name or email.';
    wrap.appendChild(heading);

    const msWrap = document.createElement('div');
    msWrap.className = 'share-modal__ms';

    const fieldWrap = document.createElement('div');
    fieldWrap.className = 'share-modal__field share-modal__ms-field share-modal__ms-field--input';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'share-modal__ms-input';
    input.placeholder = 'Enter name or email address';
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

    // Production: only existing organisation members can be assigned.
    function allPeople(): SharePerson[] {
      return directory;
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

      if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'share-modal__ms-empty';
        empty.textContent = q
          ? 'This account is not part of the organisation yet. Invite them to the organisation first.'
          : 'No members found';
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
        const v = input.value.trim().toLowerCase();
        if (!v) return;
        // Enter selects an exact organisation match; anything else shows the not-in-org message
        const match = allPeople().find((p) => p.email.toLowerCase() === v || p.name.toLowerCase() === v);
        if (match) {
          pending.add(match.id);
          input.value = '';
        }
        renderOptions();
      }
    });

    applyBtn.addEventListener('click', () => {
      const before = individuals.length;
      individuals.length = 0;
      allPeople().filter((p) => pending.has(p.id)).forEach((p) => individuals.push(p));
      if (individuals.length > before) showToast('Member assigned!');
      else if (individuals.length < before) showToast('Member removed!');
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
        empty.textContent = 'No members assigned yet.';
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
            showToast('Member removed!');
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
    if (activeTab === 'member') body.appendChild(buildLinkPanel());
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
