// components/shareModal.ts
// Share simulation modal — auto-assign pattern (Pattern B).
// Two tabs: "Share simulation" and "Simulation published", both sharing
// the same member-selection state.

import '../styles/share-modal.css';
import { iconEl } from '../icons';

export type ShareMember = {
  id: string;
  name: string;
  initials: string;
  avatarColor?: 'indigo' | 'rose' | 'emerald' | 'amber' | 'slate';
};

export type ShareModalTab = 'share' | 'published';

export type ShareModalOptions = {
  simulationUrl?: string;
  publishedUrl?: string;
  teamName?: string;
  members?: ShareMember[];
  initialSelected?: string[];
  initialTab?: ShareModalTab;
  onClose?: () => void;
};

const DEFAULT_MEMBERS: ShareMember[] = [
  { id: 'm1', name: 'tintestermail@atomicmail.io', initials: 'T',  avatarColor: 'slate' },
  { id: 'm2', name: 'Sarah Connelly',              initials: 'SC', avatarColor: 'indigo' },
  { id: 'm3', name: 'Jamal Okonkwo',               initials: 'JO', avatarColor: 'rose' },
  { id: 'm4', name: 'Priya Raman',                 initials: 'PR', avatarColor: 'emerald' },
  { id: 'm5', name: 'Diego Alvarez',               initials: 'DA', avatarColor: 'amber' },
  { id: 'm6', name: 'Mei Tanaka',                  initials: 'MT', avatarColor: 'indigo' },
  { id: 'm7', name: 'Wesley Brooks',               initials: 'WB', avatarColor: 'rose' },
  { id: 'm8', name: 'Elena Voss',                  initials: 'EV', avatarColor: 'emerald' },
];

// ---- SVG helpers (inline, not in the icon set) ----

function svgClose(): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 16 16');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.5');
  s.setAttribute('stroke-linecap', 'round');
  s.innerHTML = '<path d="M3 3l10 10M13 3L3 13"/>';
  return s;
}

function svgLink(): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 16 16');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.5');
  s.setAttribute('stroke-linecap', 'round');
  s.innerHTML =
    '<path d="M7 9.5a3 3 0 004.24 0l2.12-2.12a3 3 0 00-4.24-4.24l-.7.7"/>' +
    '<path d="M9 6.5a3 3 0 00-4.24 0L2.64 8.62a3 3 0 004.24 4.24l.7-.7"/>';
  return s;
}

function svgCheck(strokeWidth = '2.5'): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 16 16');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', strokeWidth);
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.innerHTML = '<path d="M3 8.5L6.5 12 13 4.5"/>';
  return s;
}

function svgCode(): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 16 16');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.5');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.innerHTML =
    '<path d="M5 4l-3 4 3 4"/>' +
    '<path d="M11 4l3 4-3 4"/>' +
    '<path d="M9 3l-2 10"/>';
  return s;
}

function svgInfo(): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 16 16');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.5');
  s.setAttribute('stroke-linecap', 'round');
  s.innerHTML = '<circle cx="8" cy="8" r="6.5"/><path d="M8 5v3.5M8 11v.01"/>';
  return s;
}

function svgX(size: '10' | '12' = '12'): SVGElement {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', `0 0 ${size} ${size}`);
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '2');
  s.setAttribute('stroke-linecap', 'round');
  const n = Number(size);
  // Endpoints 2px inset from each edge so stroke-linecap:round isn't clipped
  s.innerHTML = `<path d="M2 2l${n - 4} ${n - 4}M${n - 2} 2l-${n - 4} ${n - 4}"/>`;
  return s;
}

// ---- Main factory ----

export function createShareModal(options: ShareModalOptions = {}): HTMLElement {
  const {
    simulationUrl = 'https://staging.app.mizou.com/call-check?ID=sim-2LgKN',
    publishedUrl = 'https://app.mizou.com/check-assignment?tok…',
    teamName = 'Default Team',
    members = DEFAULT_MEMBERS,
    initialSelected = ['m1', 'm3'],
    initialTab = 'share',
    onClose,
  } = options;

  // ---- Shared state ----
  const selected = new Set<string>(initialSelected);
  let activeTab: ShareModalTab = initialTab;

  // References populated during DOM construction, used by re-render functions
  const dropdownInstances: Array<{
    field: HTMLButtonElement;
    dropdown: HTMLElement;
    fieldContent: HTMLElement;
    memberListEl: HTMLElement;
    teamBtn: HTMLButtonElement;
    teamLabelEl: HTMLElement;
    placeholder: string;
    isOpen: boolean;
  }> = [];

  // ---- Root ----
  const root = document.createElement('div');

  // ---- Tabs ----
  const tabsEl = document.createElement('div');
  tabsEl.className = 'share-modal__tabs';
  tabsEl.setAttribute('role', 'tablist');

  const tabShare = document.createElement('button');
  tabShare.type = 'button';
  tabShare.className = 'share-modal__tab' + (activeTab === 'share' ? ' is-active' : '');
  tabShare.textContent = 'Share simulation';

  const tabPublished = document.createElement('button');
  tabPublished.type = 'button';
  tabPublished.className = 'share-modal__tab' + (activeTab === 'published' ? ' is-active' : '');
  tabPublished.textContent = 'Simulation published';

  tabsEl.append(tabShare, tabPublished);

  // ---- Stage (holds both modal cards + toast stack) ----
  const stage = document.createElement('div');
  stage.style.cssText = 'position:relative; overflow:visible;';

  // ---- Toast stack ----
  const toastStack = document.createElement('div');
  toastStack.className = 'share-modal__toast-stack';
  stage.appendChild(toastStack);

  function showToast(message: string) {
    const t = document.createElement('div');
    t.className = 'share-modal__toast';
    const icon = document.createElement('span');
    icon.className = 'share-modal__toast-icon';
    icon.appendChild(svgCheck());
    t.appendChild(icon);
    const span = document.createElement('span');
    span.textContent = message;
    t.appendChild(span);
    toastStack.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }

  // ---- Re-render helpers (called on every state change) ----

  function renderAll() {
    dropdownInstances.forEach(inst => {
      renderField(inst);
      renderMemberList(inst);
    });
  }

  function renderField(inst: typeof dropdownInstances[number]) {
    const ids = [...selected];
    inst.fieldContent.innerHTML = '';
    if (ids.length === 0) {
      const ph = document.createElement('span');
      ph.className = 'share-modal__placeholder';
      ph.textContent = inst.placeholder;
      inst.fieldContent.appendChild(ph);
    } else {
      ids.forEach(id => {
        const m = members.find(x => x.id === id);
        if (!m) return;
        const chip = document.createElement('span');
        chip.className = 'share-modal__chip';

        const nameEl = document.createElement('span');
        nameEl.className = 'share-modal__chip-name';
        nameEl.textContent = m.name;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'share-modal__chip-remove';
        removeBtn.setAttribute('aria-label', `Remove ${m.name}`);
        removeBtn.dataset.removeId = m.id;
        removeBtn.appendChild(svgX('10'));

        chip.append(nameEl, removeBtn);
        inst.fieldContent.appendChild(chip);
      });
    }
  }

  function renderMemberList(inst: typeof dropdownInstances[number]) {
    // Update team button
    const allSelected = members.every(m => selected.has(m.id));
    if (allSelected) {
      inst.teamLabelEl.innerHTML = `Remove team assignment: <b>${teamName}</b>`;
      inst.teamBtn.classList.add('is-remove');
    } else {
      inst.teamLabelEl.innerHTML = `Assign to all members of team: <b>${teamName}</b>`;
      inst.teamBtn.classList.remove('is-remove');
    }

    // Rebuild member rows
    inst.memberListEl.innerHTML = '';
    members.forEach(m => {
      const sel = selected.has(m.id);

      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'share-modal__dd-row' + (sel ? ' is-selected' : '');
      row.dataset.memberId = m.id;

      const avatar = document.createElement('span');
      const colorMod = m.avatarColor && m.avatarColor !== 'indigo'
        ? ` share-modal__avatar--${m.avatarColor}`
        : '';
      avatar.className = `share-modal__avatar${colorMod}`;
      avatar.textContent = m.initials;

      const nameEl = document.createElement('span');
      nameEl.className = 'share-modal__member-name';
      nameEl.textContent = m.name;

      row.append(avatar, nameEl);

      if (sel) {
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'share-modal__member-remove';
        removeBtn.setAttribute('aria-label', `Remove ${m.name}`);
        removeBtn.dataset.removeId = m.id;
        removeBtn.appendChild(svgX('12'));
        row.appendChild(removeBtn);
      }

      inst.memberListEl.appendChild(row);
    });
  }

  // ---- Build a dropdown assign widget ----

  function buildAssignWidget(placeholder: string): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'share-modal__field-wrap';

    // Trigger button
    const field = document.createElement('button');
    field.type = 'button';
    field.className = 'share-modal__field';

    const fieldContent = document.createElement('span');
    field.appendChild(fieldContent);

    // Chevron
    const chev = document.createElement('span');
    chev.className = 'share-modal__chev';
    chev.appendChild(iconEl('chevron-down-sm', 'sb-icon'));

    // Dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'share-modal__dropdown';

    // Scrollable area
    const scroll = document.createElement('div');
    scroll.className = 'share-modal__dd-scroll';

    // Team section
    const teamSection = document.createElement('div');
    teamSection.className = 'share-modal__dd-team';

    const teamLabel = document.createElement('div');
    teamLabel.className = 'share-modal__section-label';
    teamLabel.textContent = 'Team';

    const teamBtn = document.createElement('button');
    teamBtn.type = 'button';
    teamBtn.className = 'share-modal__team-btn';

    const teamLabelEl = document.createElement('span');
    teamBtn.appendChild(teamLabelEl);
    teamSection.append(teamLabel, teamBtn);

    // Members section
    const membersLabel = document.createElement('div');
    membersLabel.className = 'share-modal__section-label';
    membersLabel.textContent = 'Members';

    const memberListEl = document.createElement('div');

    scroll.append(teamSection, membersLabel, memberListEl);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'share-modal__dd-footer';
    footer.appendChild(svgInfo());
    const footerText = document.createElement('span');
    footerText.className = 'share-modal__dd-footer-text';
    footerText.textContent = 'Click names to assign or remove instantly';
    const doneBtn = document.createElement('button');
    doneBtn.type = 'button';
    doneBtn.className = 'share-modal__dd-done';
    doneBtn.textContent = 'Done';
    footer.append(footerText, doneBtn);

    dropdown.append(scroll, footer);
    wrap.append(field, chev, dropdown);

    // Register instance
    const inst = {
      field, dropdown, fieldContent, memberListEl,
      teamBtn, teamLabelEl, placeholder, isOpen: false,
    };
    dropdownInstances.push(inst);

    // ---- Event wiring ----

    function openDD() {
      inst.isOpen = true;
      field.classList.add('is-open');
      dropdown.classList.add('is-open');
    }
    function closeDD() {
      inst.isOpen = false;
      field.classList.remove('is-open');
      dropdown.classList.remove('is-open');
    }

    field.addEventListener('click', e => {
      e.stopPropagation();
      inst.isOpen ? closeDD() : openDD();
    });

    memberListEl.addEventListener('click', e => {
      const target = e.target as HTMLElement;

      // Click on remove button inside a row
      const removeBtn = target.closest<HTMLElement>('[data-remove-id]');
      if (removeBtn && removeBtn.classList.contains('share-modal__member-remove')) {
        e.stopPropagation();
        selected.delete(removeBtn.dataset.removeId!);
        renderAll();
        showToast('Member removed!');
        return;
      }

      // Click on the row itself
      const row = target.closest<HTMLElement>('.share-modal__dd-row');
      if (!row) return;
      const id = row.dataset.memberId!;
      if (selected.has(id)) {
        selected.delete(id);
        showToast('Member removed!');
      } else {
        selected.add(id);
        showToast('Member assigned!');
      }
      renderAll();
    });

    teamBtn.addEventListener('click', () => {
      const allSel = members.every(m => selected.has(m.id));
      if (allSel) {
        selected.clear();
        showToast('Team assignment removed!');
      } else {
        members.forEach(m => selected.add(m.id));
        showToast('Team assigned!');
      }
      renderAll();
    });

    // Chip remove inside field
    fieldContent.addEventListener('click', e => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-remove-id]');
      if (!btn) return;
      e.stopPropagation();
      selected.delete(btn.dataset.removeId!);
      renderAll();
      showToast('Member removed!');
    });

    doneBtn.addEventListener('click', e => {
      e.stopPropagation();
      closeDD();
    });

    document.addEventListener('mousedown', e => {
      if (inst.isOpen && !wrap.contains(e.target as Node)) closeDD();
    });

    return wrap;
  }

  // ---- Share modal card ----

  function buildShareCard(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'share-modal__card';

    // Close
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'share-modal__close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.appendChild(svgClose());
    closeBtn.addEventListener('click', () => onClose?.());

    // Title
    const title = document.createElement('h2');
    title.className = 'share-modal__title';
    title.textContent = 'Share';

    // Desc
    const desc = document.createElement('p');
    desc.className = 'share-modal__desc';
    desc.innerHTML =
      'Select your sharing option. Choose a <b>Public</b> link where anyone can join or assign / invite specific team members.';

    // Public link section
    const linkTitle = document.createElement('h3');
    linkTitle.className = 'share-modal__section-title';
    linkTitle.textContent = 'Public link — anyone with the link can join';

    const urlRow = document.createElement('div');
    urlRow.className = 'share-modal__url-row';
    const urlText = document.createElement('div');
    urlText.className = 'share-modal__url';
    urlText.textContent = simulationUrl;
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'share-modal__copy-btn';
    copyBtn.appendChild(svgLink());
    const copyLabel = document.createElement('span');
    copyLabel.textContent = 'Copy link';
    copyBtn.appendChild(copyLabel);
    copyBtn.addEventListener('click', e => { e.stopPropagation(); showToast('Link copied!'); });
    urlRow.append(urlText, copyBtn);

    // Divider
    const divider = document.createElement('div');
    divider.className = 'share-modal__divider';

    // Invite section
    const inviteTitle = document.createElement('h3');
    inviteTitle.className = 'share-modal__section-title';
    inviteTitle.textContent = 'Invite team members';

    const assignWidget = buildAssignWidget("Select or enter member's name");

    // Embed button
    const embedBtn = document.createElement('button');
    embedBtn.type = 'button';
    embedBtn.className = 'share-modal__embed';
    embedBtn.appendChild(svgCode());
    embedBtn.appendChild(Object.assign(document.createElement('span'), { textContent: 'Embed code' }));
    embedBtn.addEventListener('click', e => { e.stopPropagation(); showToast('Embed code copied!'); });

    card.append(closeBtn, title, desc, linkTitle, urlRow, divider, inviteTitle, assignWidget, embedBtn);
    return card;
  }

  // ---- Published modal card ----

  function buildPublishedCard(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'share-modal__card share-modal__card--published';

    // Close
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'share-modal__close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.appendChild(svgClose());
    closeBtn.addEventListener('click', () => onClose?.());

    // Success block
    const success = document.createElement('div');
    success.className = 'share-modal__success';
    const halo = document.createElement('div');
    halo.className = 'share-modal__success-halo';
    const circle = document.createElement('div');
    circle.className = 'share-modal__success-circle';
    circle.appendChild(svgCheck());
    halo.appendChild(circle);
    const pubTitle = document.createElement('h2');
    pubTitle.className = 'share-modal__pub-title';
    pubTitle.textContent = 'Simulation Published!';
    const pubSub = document.createElement('p');
    pubSub.className = 'share-modal__pub-sub';
    pubSub.textContent = 'Ready to share with learners';
    success.append(halo, pubTitle, pubSub);

    // URL row
    const urlRow = document.createElement('div');
    urlRow.className = 'share-modal__url-row';
    urlRow.style.marginTop = '18px';
    const urlText = document.createElement('div');
    urlText.className = 'share-modal__url';
    urlText.textContent = publishedUrl;
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'share-modal__copy-btn';
    copyBtn.appendChild(svgLink());
    copyBtn.appendChild(Object.assign(document.createElement('span'), { textContent: 'Copy' }));
    copyBtn.addEventListener('click', e => { e.stopPropagation(); showToast('Link copied!'); });
    urlRow.append(urlText, copyBtn);

    // Invite section
    const inviteTitle = document.createElement('h3');
    inviteTitle.className = 'share-modal__section-title';
    inviteTitle.style.marginTop = '22px';
    inviteTitle.textContent = 'Invite team members';

    const assignWidget = buildAssignWidget('Select or enter a member to assign content');

    // Embed button (centered)
    const embedWrap = document.createElement('div');
    embedWrap.style.cssText = 'text-align:center; margin-top:18px;';
    const embedBtn = document.createElement('button');
    embedBtn.type = 'button';
    embedBtn.className = 'share-modal__embed';
    embedBtn.appendChild(svgCode());
    embedBtn.appendChild(Object.assign(document.createElement('span'), { textContent: 'Embed code' }));
    embedBtn.addEventListener('click', e => { e.stopPropagation(); showToast('Embed code copied!'); });
    embedWrap.appendChild(embedBtn);

    // Divider + back link
    const divider = document.createElement('div');
    divider.className = 'share-modal__divider';
    const backWrap = document.createElement('div');
    backWrap.style.textAlign = 'center';
    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'share-modal__back-btn';
    backBtn.textContent = 'Back to My Collections Page';
    backWrap.appendChild(backBtn);

    card.append(closeBtn, success, urlRow, inviteTitle, assignWidget, embedWrap, divider, backWrap);
    return card;
  }

  // ---- Build both cards ----
  const shareCard = buildShareCard();
  const publishedCard = buildPublishedCard();
  publishedCard.hidden = activeTab !== 'published';
  shareCard.hidden = activeTab !== 'share';

  stage.append(shareCard, publishedCard);

  // ---- Tab switching ----
  tabShare.addEventListener('click', () => {
    activeTab = 'share';
    tabShare.classList.add('is-active');
    tabPublished.classList.remove('is-active');
    shareCard.hidden = false;
    publishedCard.hidden = true;
  });
  tabPublished.addEventListener('click', () => {
    activeTab = 'published';
    tabPublished.classList.add('is-active');
    tabShare.classList.remove('is-active');
    publishedCard.hidden = false;
    shareCard.hidden = true;
  });

  // ---- Initial render ----
  renderAll();

  // Auto-open first dropdown after mount
  requestAnimationFrame(() => {
    if (dropdownInstances[0]) {
      dropdownInstances[0].isOpen = true;
      dropdownInstances[0].field.classList.add('is-open');
      dropdownInstances[0].dropdown.classList.add('is-open');
    }
  });

  root.append(tabsEl, stage);
  return root;
}
