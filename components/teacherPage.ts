import '../styles/teacher-page.css';
import '../styles/sidebar.css';
import '../styles/create-button.css';
import '../styles/simulation-card.css';
import '../styles/button-xs.css';
import '../styles/level-chip.css';

export type TeacherPageOptions = {
  userInitial?: string;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const INIT_DRAFTS = [
  { id: 'd1', mode: 'plan', title: 'Sales Pitch Planning Session', date: 'May 8, 2026' },
  { id: 'd2', mode: 'plan', title: 'New Employee Onboarding Scenario', date: 'May 5, 2026' },
  { id: 'd3', mode: 'draft', title: 'Handling Objections in a Product Demo', category: 'Sales', date: 'May 7, 2026' },
  { id: 'd4', mode: 'draft', title: 'De-escalating an Angry Customer', category: 'Customer Support', date: 'May 3, 2026' },
  { id: 'd5', mode: 'draft', title: 'Giving Constructive Feedback to a Direct Report', category: 'Management', date: 'Apr 28, 2026' },
];

const INIT_CREATIONS = [
  { id: 'c1', title: 'Planning for Brief', category: 'Sales', difficulty: 'easy', date: 'Apr 20, 2026' },
  { id: 'c2', title: 'Training Effective Communication and Problem Resolution', category: 'Customer Support', difficulty: 'medium', date: 'Apr 15, 2026' },
  { id: 'c3', title: 'Disciplinary Talk with a GO Over Inappropriate Remarks at the Marrakesh Village', category: 'Management', difficulty: 'hard', date: 'Apr 10, 2026' },
  { id: 'c4', title: 'Final Interview for Culture Fit', category: 'Recruitment', difficulty: 'medium', date: 'Apr 5, 2026' },
  { id: 'c5', title: 'Addressing Tax Concerns to Close a Real Estate Deal', category: 'Customer Support', difficulty: 'hard', date: 'Mar 28, 2026' },
  { id: 'c6', title: 'Upselling Premium Services to an Existing Client', category: 'Sales', difficulty: 'easy', date: 'Mar 21, 2026' },
];

const CLASS_NAMES = ['Morning Cohort 2026', 'Evening Group A', 'Pilot Group', 'Spring Term 2026'];

const CLASSES_DATA = [
  { id: 1, name: 'Morning Cohort 2026', sessions: 12, dateCreated: 'May 1, 2026', status: 'active' },
  { id: 2, name: 'Evening Group A', sessions: 8, dateCreated: 'Apr 15, 2026', status: 'active' },
  { id: 3, name: 'Pilot Group', sessions: 5, dateCreated: 'Mar 1, 2026', status: 'closed' },
];

const SESSIONS_DATA = [
  { id: 1, learner: 'Alex Martin', score: '87%', duration: '12 min', date: 'May 8, 2026', status: 'completed' },
  { id: 2, learner: 'Sam Chen', score: '72%', duration: '18 min', date: 'May 7, 2026', status: 'completed' },
  { id: 3, learner: 'Jordan Lee', score: '—', duration: '—', date: 'May 5, 2026', status: 'inprogress' },
  { id: 4, learner: 'Morgan Ellis', score: '91%', duration: '9 min', date: 'May 4, 2026', status: 'completed' },
  { id: 5, learner: 'Riley Park', score: '—', duration: '—', date: 'May 3, 2026', status: 'notstarted' },
  { id: 6, learner: 'Casey Quinn', score: '65%', duration: '22 min', date: 'May 2, 2026', status: 'completed' },
];

const QR_PATTERN = [
  [1,1,1,0,1,1,1],
  [1,0,1,0,1,0,1],
  [1,1,1,1,1,1,1],
  [0,0,1,0,1,0,0],
  [1,1,1,1,1,1,1],
  [1,0,1,0,1,0,1],
  [1,1,1,0,1,1,1],
];

// ─── SVGs ────────────────────────────────────────────────────────────────────

const COLLAPSE_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CHEVRON_DOWN_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SPARKLE_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" fill="currentColor"/></svg>`;
const PENCIL_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.29 2.29a1 1 0 0 1 1.42 0l4 4a1 1 0 0 1 0 1.42l-13 13A1 1 0 0 1 8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .29-.71l13-13ZM5 16.41V19h2.59L19.59 7 17 4.41 5 16.41Z" stroke="none"/></svg>`;
const GRID4_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>`;
const SESSIONS_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const FEEDBACK_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SEARCH_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const GRID_VIEW_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/></svg>`;
const LIST_VIEW_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const CHAT_AI_SVG = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="10" r="1" fill="white"/><circle cx="12" cy="10" r="1" fill="white"/><circle cx="15" cy="10" r="1" fill="white"/></svg>`;
const DOTS_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>`;
const ROLEPLAY_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const PLUS_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`;
const PLUS_CIRCLE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const BACK_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const INFO_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="flex-shrink:0"><circle cx="12" cy="12" r="9" stroke="#8b8d98" stroke-width="1.5"/><path d="M12 8v4M12 16h.01" stroke="#8b8d98" stroke-width="2" stroke-linecap="round"/></svg>`;
const FILE_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#60646c" stroke-width="1.5"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#60646c" stroke-width="1.5" stroke-linecap="round"/></svg>`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function h(tag: string, className?: string, innerHTML?: string): HTMLElement {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

function btn(label: string, cls: string): HTMLButtonElement {
  const el = document.createElement('button');
  el.className = cls;
  el.textContent = label;
  return el;
}

function viewToggle(gridActive = true): HTMLElement {
  const toggle = h('div', 'tp-view-toggle');
  const gridBtn = h('button', `tp-vt-btn${gridActive ? ' act' : ''}`);
  gridBtn.innerHTML = GRID_VIEW_SVG;
  gridBtn.dataset.view = 'grid';
  gridBtn.title = 'Grid view';
  const listBtn = h('button', `tp-vt-btn${!gridActive ? ' act' : ''}`);
  listBtn.innerHTML = LIST_VIEW_SVG;
  listBtn.dataset.view = 'list';
  listBtn.title = 'List view';
  toggle.appendChild(gridBtn);
  toggle.appendChild(listBtn);
  return toggle;
}

function buildQR(): HTMLElement {
  const wrap = h('div', 'tp-qr-wrap');
  const grid = h('div', 'tp-qr-grid');
  for (const row of QR_PATTERN) {
    for (const cell of row) {
      grid.appendChild(h('div', cell ? 'tp-qr-d' : 'tp-qr-l'));
    }
  }
  const label = h('span', 'tp-qr-label');
  label.textContent = 'QR code';
  wrap.appendChild(grid);
  wrap.appendChild(label);
  return wrap;
}

function filterChip(label: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = 'sb-btn-xs sb-btn-xs--default';
  b.innerHTML = `<span class="sb-btn-xs__label">${label}</span><span class="sb-btn-xs__icon">${CHEVRON_DOWN_SVG}</span>`;
  return b;
}

// ─── Card builders ────────────────────────────────────────────────────────────

type DraftItem = { id: string; mode: string; title: string; category?: string; date: string };
type CreationItem = { id: string; title: string; category: string; difficulty: string; date: string };

function difficultyClass(d: string): string {
  if (d === 'easy') return 'sim-card__liner-difficulty--easy';
  if (d === 'hard') return 'sim-card__liner-difficulty--hard';
  return 'sim-card__liner-difficulty--medium';
}

function buildPlanCard(d: DraftItem): HTMLElement {
  const card = h('div', 'sim-card');
  card.dataset.draftId = d.id;

  const thumb = h('div', 'sim-card__thumbnail');
  const center = h('div', 'tp-plan-thumb-center');
  center.innerHTML = CHAT_AI_SVG;
  thumb.appendChild(center);

  const liner = h('div', 'sim-card__top-liner');
  const chipWrap = h('div', 'sim-card__badge-group');
  const chip = h('div', 'sim-card__chip sim-card__chip--new');
  chip.textContent = 'Plan mode';
  chipWrap.appendChild(chip);
  liner.appendChild(chipWrap);
  thumb.appendChild(liner);
  card.appendChild(thumb);

  const details = h('div', 'sim-card__details');
  const body = h('div', 'sim-card__body');
  const title = h('p', 'sim-card__title');
  title.textContent = d.title;
  const dateEl = h('span', 'sim-card__liner-category');
  dateEl.textContent = `Created ${d.date}`;
  body.appendChild(title);
  body.appendChild(dateEl);
  details.appendChild(body);

  const actions = h('div', 'sim-card__actions');
  const continueBtn = btn('Continue', 'sim-card__action-btn sim-card__action-btn--primary sim-card__action-btn--full');
  actions.appendChild(continueBtn);
  details.appendChild(actions);
  card.appendChild(details);
  return card;
}

function buildDraftCard(d: DraftItem): HTMLElement {
  const card = h('div', 'sim-card');
  card.dataset.draftId = d.id;

  const thumb = h('div', 'sim-card__thumbnail sim-card__thumbnail--draft');
  const icon = h('div', 'tp-draft-thumb-icon');
  icon.innerHTML = PLUS_CIRCLE_SVG;
  thumb.appendChild(icon);

  const liner = h('div', 'sim-card__top-liner');
  const chipWrap = h('div', 'sim-card__badge-group');
  const chip = h('div', 'sim-card__chip sim-card__chip--draft');
  chip.textContent = 'Draft';
  chipWrap.appendChild(chip);
  liner.appendChild(chipWrap);
  const menuBtn = h('button', 'sim-card__menu-btn');
  menuBtn.innerHTML = `<span class="sim-card__menu-icon">${DOTS_SVG}</span>`;
  liner.appendChild(menuBtn);
  thumb.appendChild(liner);
  card.appendChild(thumb);

  const details = h('div', 'sim-card__details');
  const body = h('div', 'sim-card__body');
  const lineEl = h('div', 'sim-card__liner');
  if (d.category) {
    const cat = h('span', 'sim-card__liner-category');
    cat.textContent = d.category;
    lineEl.appendChild(cat);
  }
  body.appendChild(lineEl);
  const title = h('p', 'sim-card__title');
  title.textContent = d.title;
  body.appendChild(title);
  const dateEl = h('span', 'sim-card__liner-category');
  dateEl.style.fontSize = '12px';
  dateEl.textContent = d.date;
  body.appendChild(dateEl);
  details.appendChild(body);

  const actions = h('div', 'sim-card__actions');
  actions.appendChild(btn('Edit', 'sim-card__action-btn sim-card__action-btn--secondary'));
  const pubBtn = btn('Publish', 'sim-card__action-btn sim-card__action-btn--primary tp-publish-btn');
  pubBtn.dataset.draftId = d.id;
  pubBtn.dataset.title = d.title;
  pubBtn.dataset.cat = d.category || 'General';
  actions.appendChild(pubBtn);
  details.appendChild(actions);
  card.appendChild(details);
  return card;
}

function buildCreationCard(c: CreationItem): HTMLElement {
  const card = h('div', 'sim-card');
  card.dataset.creationId = c.id;
  card.dataset.creationTitle = c.title;

  const thumb = h('div', 'sim-card__thumbnail');
  const liner = h('div', 'sim-card__top-liner');
  const badgeGroup = h('div', 'sim-card__badge-group');
  const badge = h('div', 'sim-card__badge');
  badge.innerHTML = `<span class="sim-card__badge-icon">${ROLEPLAY_SVG}</span><span class="sim-card__badge-label">Roleplay</span>`;
  badgeGroup.appendChild(badge);
  liner.appendChild(badgeGroup);
  const menuBtn = h('button', 'sim-card__menu-btn');
  menuBtn.innerHTML = `<span class="sim-card__menu-icon">${DOTS_SVG}</span>`;
  liner.appendChild(menuBtn);
  thumb.appendChild(liner);
  const hoverLayer = h('div', 'sim-card__hover-layer');
  const prevBtn = btn('Preview', 'sim-card__preview-btn');
  hoverLayer.appendChild(prevBtn);
  thumb.appendChild(hoverLayer);
  card.appendChild(thumb);

  const details = h('div', 'sim-card__details');
  const body = h('div', 'sim-card__body');
  const lineEl = h('div', 'sim-card__liner');
  const cat = h('span', 'sim-card__liner-category');
  cat.textContent = c.category;
  const divider = h('div', 'sim-card__liner-divider');
  const diff = h('span', `sim-card__liner-difficulty ${difficultyClass(c.difficulty)}`);
  diff.textContent = c.difficulty.charAt(0).toUpperCase() + c.difficulty.slice(1);
  lineEl.appendChild(cat);
  lineEl.appendChild(divider);
  lineEl.appendChild(diff);
  body.appendChild(lineEl);
  const title = h('p', 'sim-card__title');
  title.textContent = c.title;
  body.appendChild(title);
  details.appendChild(body);

  const actions = h('div', 'sim-card__actions');
  const viewBtn = btn('View sessions', 'sim-card__action-btn sim-card__action-btn--secondary tp-view-teams-btn');
  viewBtn.dataset.creationId = c.id;
  viewBtn.dataset.creationTitle = c.title;
  const shareBtn = btn('Share', 'sim-card__action-btn sim-card__action-btn--primary tp-share-trigger');
  shareBtn.dataset.creationId = c.id;
  shareBtn.dataset.creationTitle = c.title;
  actions.appendChild(viewBtn);
  actions.appendChild(shareBtn);
  details.appendChild(actions);
  card.appendChild(details);
  return card;
}

// ─── List row builders ────────────────────────────────────────────────────────

function buildPlanListRow(d: DraftItem): HTMLElement {
  const row = h('div', 'tp-list-row');
  row.dataset.draftId = d.id;
  const thumb = h('div', 'tp-list-thumb-plan');
  thumb.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  row.appendChild(thumb);
  const info = h('div', 'tp-list-info');
  const chip = h('span', 'tp-plan-mode-chip');
  chip.textContent = 'Plan mode';
  info.appendChild(chip);
  const name = h('span', 'tp-list-name');
  name.textContent = d.title;
  info.appendChild(name);
  row.appendChild(info);
  const date = h('span', 'tp-list-date');
  date.textContent = `Created ${d.date}`;
  row.appendChild(date);
  const actions = h('div', 'tp-list-actions');
  actions.appendChild(btn('Continue', 'tp-btn-sm tp-btn-publish'));
  row.appendChild(actions);
  return row;
}

function buildDraftListRow(d: DraftItem): HTMLElement {
  const row = h('div', 'tp-list-row');
  row.dataset.draftId = d.id;
  const thumb = h('div', 'tp-list-thumb-draft');
  thumb.innerHTML = PLUS_CIRCLE_SVG;
  row.appendChild(thumb);
  const info = h('div', 'tp-list-info');
  if (d.category) {
    const catBadge = h('span', 'tp-badge');
    catBadge.textContent = d.category;
    info.appendChild(catBadge);
  }
  const draftBadge = h('span', 'tp-draft-badge');
  draftBadge.textContent = 'Draft';
  info.appendChild(draftBadge);
  const name = h('span', 'tp-list-name');
  name.textContent = d.title;
  info.appendChild(name);
  row.appendChild(info);
  const date = h('span', 'tp-list-date');
  date.textContent = d.date;
  row.appendChild(date);
  const actions = h('div', 'tp-list-actions');
  actions.appendChild(btn('Edit', 'tp-btn-sm tp-btn-s'));
  const pubBtn = btn('Publish', 'tp-btn-sm tp-btn-publish tp-publish-btn');
  pubBtn.dataset.draftId = d.id;
  pubBtn.dataset.title = d.title;
  pubBtn.dataset.cat = d.category || 'General';
  actions.appendChild(pubBtn);
  row.appendChild(actions);
  return row;
}

function buildCreationListRow(c: CreationItem): HTMLElement {
  const row = h('div', 'tp-list-row');
  row.dataset.creationId = c.id;
  row.dataset.creationTitle = c.title;
  row.appendChild(h('div', 'tp-list-thumb'));
  const info = h('div', 'tp-list-info');
  const catBadge = h('span', 'tp-badge');
  catBadge.textContent = c.category;
  info.appendChild(catBadge);
  const name = h('span', 'tp-list-name');
  name.textContent = c.title;
  info.appendChild(name);
  row.appendChild(info);
  const date = h('span', 'tp-list-date');
  date.textContent = c.date;
  row.appendChild(date);
  const actions = h('div', 'tp-list-actions');
  const viewBtn = btn('View sessions', 'tp-btn-sm tp-btn-s tp-view-teams-btn');
  viewBtn.dataset.creationId = c.id;
  viewBtn.dataset.creationTitle = c.title;
  const shareBtn = btn('Share', 'tp-btn-sm tp-btn-publish tp-share-trigger');
  shareBtn.dataset.creationId = c.id;
  shareBtn.dataset.creationTitle = c.title;
  actions.appendChild(viewBtn);
  actions.appendChild(shareBtn);
  row.appendChild(actions);
  return row;
}

// ─── Main factory ─────────────────────────────────────────────────────────────

export function createTeacherPage({ userInitial = 'JD' }: TeacherPageOptions = {}): HTMLElement {
  const root = h('div', 'tp-root');

  // ═══ SIDEBAR ═══════════════════════════════════════════════════════════════
  const sidebar = h('aside', 'sb-sidebar');
  sidebar.style.cssText = 'display:flex;flex-direction:column;gap:6px;padding:12px 16px;';

  // Header: workspace button + collapse toggle
  const sbHeader = h('div', 'sb-sidebar-header');
  const headerRow = h('div', 'sb-header-row');

  const orgBtn = h('button', 'sb-org-button');
  const wsLogo = h('div', 'tp-ws-logo');
  wsLogo.textContent = 'M';
  const orgName = h('span', 'sb-org-button__name');
  orgName.textContent = 'My Space';
  const orgChev = h('span', 'sb-org-button__chevron');
  orgChev.innerHTML = CHEVRON_DOWN_SVG;
  orgBtn.appendChild(wsLogo);
  orgBtn.appendChild(orgName);
  orgBtn.appendChild(orgChev);

  const spacer = h('div', 'sb-header-spacer');

  const collapseBtn = h('button', 'sb-top-toggle');
  collapseBtn.id = 'tp-collapse-btn';
  collapseBtn.innerHTML = COLLAPSE_SVG;
  collapseBtn.title = 'Collapse sidebar';

  headerRow.appendChild(orgBtn);
  headerRow.appendChild(spacer);
  headerRow.appendChild(collapseBtn);
  sbHeader.appendChild(headerRow);
  sidebar.appendChild(sbHeader);

  // Create button
  const createWrap = h('div', 'sb-sidebar__create-wrap');
  const createBtn = h('button', 'sb-create-btn sb-create-btn--expanded');
  const createIcon = h('span', 'sb-create-btn__icon');
  createIcon.innerHTML = SPARKLE_SVG;
  const createLbl = h('span', 'sb-create-btn__label');
  createLbl.textContent = 'Create';
  createBtn.appendChild(createIcon);
  createBtn.appendChild(createLbl);
  createWrap.appendChild(createBtn);
  sidebar.appendChild(createWrap);

  // Nav section
  const navSection = h('div', 'sb-sidebar-section');

  // My Drafts
  const niDrafts = h('div', 'sb-sidebar-item sb-sidebar-item--active');
  niDrafts.id = 'tp-nav-drafts';
  niDrafts.innerHTML = `<div class="sb-sidebar-item__icon-wrap"><span class="sb-sidebar-item__icon">${PENCIL_SVG}</span></div><span>My Drafts</span>`;
  navSection.appendChild(niDrafts);

  // Collections
  const niCol = h('div', 'sb-sidebar-item');
  niCol.id = 'tp-nav-col';
  niCol.innerHTML = `<div class="sb-sidebar-item__icon-wrap"><span class="sb-sidebar-item__icon">${GRID4_SVG}</span></div><span>Collections</span>`;
  const niColChev = h('span', 'tp-ni-chev open');
  niColChev.id = 'tp-col-chev';
  niColChev.innerHTML = CHEVRON_DOWN_SVG;
  niCol.appendChild(niColChev);
  navSection.appendChild(niCol);

  // Sub-nav
  const nsWrap = h('div', 'tp-ns-wrap');
  nsWrap.id = 'tp-col-subnav';
  const nsCreations = h('div', 'tp-ns-item');
  nsCreations.id = 'tp-ns-creations';
  nsCreations.textContent = 'My Creations';
  const nsTemplates = h('div', 'tp-ns-item');
  nsTemplates.id = 'tp-ns-templates';
  nsTemplates.textContent = 'Templates';
  nsWrap.appendChild(nsCreations);
  nsWrap.appendChild(nsTemplates);
  navSection.appendChild(nsWrap);

  // All Sessions
  const niSessions = h('div', 'sb-sidebar-item');
  niSessions.id = 'tp-nav-sessions';
  niSessions.innerHTML = `<div class="sb-sidebar-item__icon-wrap"><span class="sb-sidebar-item__icon">${SESSIONS_SVG}</span></div><span>All Sessions</span>`;
  navSection.appendChild(niSessions);

  sidebar.appendChild(navSection);

  // Feedback (bottom)
  const fbWrap = h('div', '');
  fbWrap.style.marginTop = 'auto';
  const fbBtn = h('button', 'sb-sidebar__feedback-btn');
  fbBtn.innerHTML = `${FEEDBACK_SVG}<span>Feedback</span>`;
  fbWrap.appendChild(fbBtn);
  sidebar.appendChild(fbWrap);

  root.appendChild(sidebar);

  // ═══ MAIN ══════════════════════════════════════════════════════════════════
  const main = h('div', 'tp-main');
  const panel = h('div', 'tp-panel');

  // Topbar
  const topbar = h('div', 'tp-topbar');
  const topbarTitle = h('h2', 'tp-topbar-title');
  topbarTitle.id = 'tp-topbar-title';
  topbarTitle.textContent = 'My Drafts';
  const av = h('div', 'tp-av');
  av.textContent = userInitial;
  topbar.appendChild(topbarTitle);
  topbar.appendChild(av);
  panel.appendChild(topbar);

  // ── PAGE: My Drafts ────────────────────────────────────────────────────────
  const pageDrafts = h('div', 'tp-page active');
  pageDrafts.id = 'tp-page-drafts';

  const draftsFilterBar = h('div', 'tp-col-fbar');
  const dSearch = h('div', 'tp-col-search');
  dSearch.innerHTML = `<span class="tp-col-search-ico">${SEARCH_SVG}</span>`;
  const dSearchInp = document.createElement('input');
  dSearchInp.placeholder = 'Search drafts...';
  dSearch.appendChild(dSearchInp);
  draftsFilterBar.appendChild(dSearch);
  const dDiv = h('div', 'tp-filter-divider');
  draftsFilterBar.appendChild(dDiv);
  const dChips = h('div', 'tp-filter-chips');
  dChips.appendChild(filterChip('All categories'));
  dChips.appendChild(filterChip('All dates'));
  draftsFilterBar.appendChild(dChips);
  const dToggleWrap = h('div', 'tp-col-fbar-right');
  const dToggle = viewToggle(true);
  dToggle.id = 'tp-drafts-toggle';
  dToggleWrap.appendChild(dToggle);
  draftsFilterBar.appendChild(dToggleWrap);
  pageDrafts.appendChild(draftsFilterBar);

  const draftsGrid = h('div', 'tp-grid tp-grid-3');
  draftsGrid.id = 'tp-drafts-grid';
  for (const d of INIT_DRAFTS) {
    draftsGrid.appendChild(d.mode === 'plan' ? buildPlanCard(d) : buildDraftCard(d));
  }
  pageDrafts.appendChild(draftsGrid);

  const draftsList = h('div', 'tp-list-rows');
  draftsList.id = 'tp-drafts-list';
  draftsList.style.display = 'none';
  for (const d of INIT_DRAFTS) {
    draftsList.appendChild(d.mode === 'plan' ? buildPlanListRow(d) : buildDraftListRow(d));
  }
  pageDrafts.appendChild(draftsList);

  const draftsEmpty = h('div', 'tp-empty');
  draftsEmpty.id = 'tp-drafts-empty';
  draftsEmpty.style.display = 'none';
  const emptyIco = h('div', 'tp-empty-ico');
  emptyIco.innerHTML = FILE_SVG;
  draftsEmpty.appendChild(emptyIco);
  const emptyTitle = h('p', 'tp-empty-title');
  emptyTitle.textContent = 'No drafts yet';
  draftsEmpty.appendChild(emptyTitle);
  const emptyBody = h('p', 'tp-empty-body');
  emptyBody.textContent = 'Simulations you start will appear here. Create one to get started.';
  draftsEmpty.appendChild(emptyBody);
  const emptyCreateBtn = btn('Create simulation', 'tp-btn-p');
  emptyCreateBtn.style.marginTop = '4px';
  draftsEmpty.appendChild(emptyCreateBtn);
  pageDrafts.appendChild(draftsEmpty);

  panel.appendChild(pageDrafts);

  // ── PAGE: Collections ──────────────────────────────────────────────────────
  const pageCollections = h('div', 'tp-page');
  pageCollections.id = 'tp-page-collections';

  const colTabBar = h('div', 'tp-tab-bar');
  const tabCreations = h('div', 'tp-tab act');
  tabCreations.id = 'tp-tab-creations';
  tabCreations.textContent = 'My Creations';
  const tabTemplates = h('div', 'tp-tab');
  tabTemplates.id = 'tp-tab-templates';
  tabTemplates.textContent = 'Templates';
  colTabBar.appendChild(tabCreations);
  colTabBar.appendChild(tabTemplates);
  pageCollections.appendChild(colTabBar);

  // My Creations panel
  const panelCreations = h('div', '');
  panelCreations.id = 'tp-panel-creations';
  panelCreations.style.display = 'flex';
  panelCreations.style.flexDirection = 'column';
  panelCreations.style.gap = '16px';

  const creationsFilterBar = h('div', 'tp-col-fbar');
  const cSearch = h('div', 'tp-col-search');
  cSearch.innerHTML = `<span class="tp-col-search-ico">${SEARCH_SVG}</span>`;
  const cSearchInp = document.createElement('input');
  cSearchInp.placeholder = 'Search simulations...';
  cSearch.appendChild(cSearchInp);
  creationsFilterBar.appendChild(cSearch);
  const cDiv = h('div', 'tp-filter-divider');
  creationsFilterBar.appendChild(cDiv);
  const cChips = h('div', 'tp-filter-chips');
  cChips.appendChild(filterChip('All categories'));
  cChips.appendChild(filterChip('All status'));
  creationsFilterBar.appendChild(cChips);
  const cToggleWrap = h('div', 'tp-col-fbar-right');
  const cToggle = viewToggle(true);
  cToggle.id = 'tp-creations-toggle';
  cToggleWrap.appendChild(cToggle);
  creationsFilterBar.appendChild(cToggleWrap);
  panelCreations.appendChild(creationsFilterBar);

  const creationsGrid = h('div', 'tp-grid tp-grid-3');
  creationsGrid.id = 'tp-creations-grid';
  for (const c of INIT_CREATIONS) {
    creationsGrid.appendChild(buildCreationCard(c));
  }
  panelCreations.appendChild(creationsGrid);

  const creationsList = h('div', 'tp-list-rows');
  creationsList.id = 'tp-creations-list';
  creationsList.style.display = 'none';
  for (const c of INIT_CREATIONS) {
    creationsList.appendChild(buildCreationListRow(c));
  }
  panelCreations.appendChild(creationsList);
  pageCollections.appendChild(panelCreations);

  // Templates panel
  const panelTemplates = h('div', '');
  panelTemplates.id = 'tp-panel-templates';
  panelTemplates.style.display = 'none';

  const tFilterBar = h('div', 'tp-col-fbar');
  const tSearch = h('div', 'tp-col-search');
  tSearch.innerHTML = `<span class="tp-col-search-ico">${SEARCH_SVG}</span>`;
  const tSearchInp = document.createElement('input');
  tSearchInp.placeholder = 'Search templates...';
  tSearch.appendChild(tSearchInp);
  tFilterBar.appendChild(tSearch);
  const tDiv = h('div', 'tp-filter-divider');
  tFilterBar.appendChild(tDiv);
  const tChips = h('div', 'tp-filter-chips');
  tChips.appendChild(filterChip('All categories'));
  tFilterBar.appendChild(tChips);
  const tToggleWrap = h('div', 'tp-col-fbar-right');
  tToggleWrap.appendChild(viewToggle(true));
  tFilterBar.appendChild(tToggleWrap);
  panelTemplates.appendChild(tFilterBar);

  const templatesGrid = h('div', 'tp-grid tp-grid-3');
  for (let i = 0; i < 8; i++) {
    const card = h('div', 'sim-card');
    const tThumb = h('div', 'sim-card__thumbnail sim-card__thumbnail--draft');
    card.appendChild(tThumb);
    const tDetails = h('div', 'sim-card__details');
    const tBody = h('div', 'sim-card__body');
    const s1 = h('div', 'tp-skel');
    const s2 = h('div', 'tp-skel');
    s2.style.cssText = 'width:85%;margin-top:8px;height:14px';
    const s3 = h('div', 'tp-skel');
    s3.style.cssText = 'width:65%;margin-top:4px;height:14px';
    tBody.appendChild(s1);
    tBody.appendChild(s2);
    tBody.appendChild(s3);
    tDetails.appendChild(tBody);
    card.appendChild(tDetails);
    templatesGrid.appendChild(card);
  }
  panelTemplates.appendChild(templatesGrid);
  pageCollections.appendChild(panelTemplates);

  panel.appendChild(pageCollections);

  // ── PAGE: Classes ──────────────────────────────────────────────────────────
  const pageClasses = h('div', 'tp-page');
  pageClasses.id = 'tp-page-classes';

  const classesPgHd = h('div', 'tp-pg-hd');
  const classesBread = h('div', '');
  classesBread.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap';
  const classesBack = h('div', 'tp-pg-back');
  classesBack.id = 'tp-classes-back';
  classesBack.innerHTML = `${BACK_SVG} Collections`;
  const classesSep = h('span', 'tp-bread-sep');
  classesSep.textContent = '/';
  const classesSimTitle = h('h1', 'tp-pg-title');
  classesSimTitle.id = 'tp-classes-sim-title';
  classesSimTitle.textContent = 'Simulation';
  classesBread.appendChild(classesBack);
  classesBread.appendChild(classesSep);
  classesBread.appendChild(classesSimTitle);
  classesPgHd.appendChild(classesBread);
  const createClassBtn = btn('Create new class link', 'tp-btn-p');
  createClassBtn.innerHTML = `${PLUS_SVG} Create new class link`;
  classesPgHd.appendChild(createClassBtn);
  pageClasses.appendChild(classesPgHd);

  const classesTblWrap = h('div', 'tp-tbl-wrap');
  const classesTbl = document.createElement('table');
  classesTbl.className = 'tp-tbl';
  classesTbl.innerHTML = `<thead><tr><th>Class name</th><th>Sessions</th><th>Date created</th><th>Status</th><th></th></tr></thead><tbody id="tp-classes-tbody"></tbody>`;
  classesTblWrap.appendChild(classesTbl);
  pageClasses.appendChild(classesTblWrap);
  panel.appendChild(pageClasses);

  // ── PAGE: Sessions ─────────────────────────────────────────────────────────
  const pageSessions = h('div', 'tp-page');
  pageSessions.id = 'tp-page-sessions';

  const sessionsPgHd = h('div', 'tp-pg-hd');
  const sessionsBread = h('div', '');
  sessionsBread.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap';
  const sessionsBack = h('div', 'tp-pg-back');
  sessionsBack.id = 'tp-sessions-back';
  const sessionsSimTitle = h('span', '');
  sessionsSimTitle.id = 'tp-sessions-sim-title';
  sessionsBack.innerHTML = `${BACK_SVG} `;
  sessionsBack.appendChild(sessionsSimTitle);
  const sessionsSep = h('span', 'tp-bread-sep');
  sessionsSep.textContent = '/';
  const sessionsClassName = h('h1', 'tp-pg-title');
  sessionsClassName.id = 'tp-sessions-class-name';
  sessionsClassName.textContent = 'Class';
  sessionsBread.appendChild(sessionsBack);
  sessionsBread.appendChild(sessionsSep);
  sessionsBread.appendChild(sessionsClassName);
  sessionsPgHd.appendChild(sessionsBread);
  pageSessions.appendChild(sessionsPgHd);

  const sessFilterBar = h('div', 'tp-fbar');
  const sfSearch = h('div', 'tp-fsearch');
  sfSearch.innerHTML = `<span class="tp-fsearch-ico">${SEARCH_SVG}</span>`;
  const sfSearchInp = document.createElement('input');
  sfSearchInp.placeholder = 'Search learner…';
  sfSearch.appendChild(sfSearchInp);
  sessFilterBar.appendChild(sfSearch);
  const sfStatusSel = document.createElement('select');
  sfStatusSel.className = 'tp-fsel';
  ['All statuses', 'Completed', 'In progress', 'Not started'].forEach(o => {
    const op = document.createElement('option'); op.textContent = o; sfStatusSel.appendChild(op);
  });
  sessFilterBar.appendChild(sfStatusSel);
  pageSessions.appendChild(sessFilterBar);

  const sessionsTblWrap = h('div', 'tp-tbl-wrap');
  const sessionsTbl = document.createElement('table');
  sessionsTbl.className = 'tp-tbl';
  const sessionsTbody = document.createElement('tbody');
  sessionsTbody.id = 'tp-sessions-tbody';
  sessionsTbl.innerHTML = `<thead><tr><th>Learner</th><th>Simulation</th><th>Score</th><th>Duration</th><th>Date</th><th>Status</th></tr></thead>`;
  sessionsTbl.appendChild(sessionsTbody);
  sessionsTblWrap.appendChild(sessionsTbl);
  pageSessions.appendChild(sessionsTblWrap);
  panel.appendChild(pageSessions);

  main.appendChild(panel);
  root.appendChild(main);

  // ═══ SHARE MODAL ═══════════════════════════════════════════════════════════
  const modalBackdrop = h('div', 'tp-modal-backdrop');
  modalBackdrop.id = 'tp-modal';

  const modal = h('div', 'tp-modal');

  const modalHd = h('div', 'tp-modal-hd');
  const modalHdLeft = h('div', '');
  const modalSim = h('p', 'tp-modal-sim');
  modalSim.textContent = 'Share simulation';
  const modalTitle = h('h2', 'tp-modal-title');
  modalTitle.id = 'tp-modal-title';
  modalTitle.textContent = 'Simulation';
  modalHdLeft.appendChild(modalSim);
  modalHdLeft.appendChild(modalTitle);
  const modalClose = h('button', 'tp-modal-x');
  modalClose.id = 'tp-modal-close';
  modalClose.textContent = '✕';
  modalHd.appendChild(modalHdLeft);
  modalHd.appendChild(modalClose);
  modal.appendChild(modalHd);

  const modalTabsRow = h('div', 'tp-modal-tabs');
  const mTabClass = h('div', 'tp-modal-tab act');
  mTabClass.id = 'tp-mtab-class';
  mTabClass.textContent = 'Class link';
  const mTabGuest = h('div', 'tp-modal-tab');
  mTabGuest.id = 'tp-mtab-guest';
  mTabGuest.textContent = 'Guest link';
  modalTabsRow.appendChild(mTabClass);
  modalTabsRow.appendChild(mTabGuest);
  modal.appendChild(modalTabsRow);

  const modalBody = h('div', 'tp-modal-body');

  // Class link panel
  const mpanelClass = h('div', 'tp-mpanel act');
  mpanelClass.id = 'tp-mpanel-class';

  const mpDesc = h('p', 'tp-modal-desc');
  mpDesc.textContent = 'Group all student sessions together for easy tracking and review.';
  mpanelClass.appendChild(mpDesc);

  const classNameGrp = h('div', 'tp-inp-grp');
  const classNameLbl = h('label', 'tp-inp-lbl');
  classNameLbl.textContent = 'Class name';
  const classNameInp = document.createElement('input');
  classNameInp.className = 'tp-inp';
  classNameInp.placeholder = 'Enter class name…';
  classNameInp.id = 'tp-class-name-inp';
  const ddList = h('div', 'tp-ddlist');
  ddList.id = 'tp-ddlist';
  CLASS_NAMES.forEach(name => {
    const item = h('div', 'tp-ddi');
    item.textContent = name;
    ddList.appendChild(item);
  });
  classNameGrp.appendChild(classNameLbl);
  classNameGrp.appendChild(classNameInp);
  classNameGrp.appendChild(ddList);
  mpanelClass.appendChild(classNameGrp);

  const createLinkBtn = btn('Create class link', 'tp-btn-p');
  createLinkBtn.id = 'tp-create-link-btn';
  createLinkBtn.style.cssText = 'width:100%;margin-bottom:16px';
  mpanelClass.appendChild(createLinkBtn);

  const linkSection = h('div', 'tp-link-section');
  linkSection.id = 'tp-link-section';
  linkSection.style.display = 'none';
  const linkLbl = h('p', 'tp-inp-lbl');
  linkLbl.style.marginBottom = '6px';
  linkLbl.textContent = 'Class link';
  const linkRow = h('div', 'tp-link-row');
  const linkInp = document.createElement('input');
  linkInp.className = 'tp-link-inp';
  linkInp.readOnly = true;
  linkInp.id = 'tp-generated-link';
  linkInp.value = 'https://mizou.ai/c/class-link';
  const copyBtn = btn('Copy', 'tp-btn-sm tp-btn-s');
  copyBtn.id = 'tp-copy-btn';
  linkRow.appendChild(linkInp);
  linkRow.appendChild(copyBtn);
  linkSection.appendChild(linkLbl);
  linkSection.appendChild(linkRow);
  linkSection.appendChild(buildQR());
  mpanelClass.appendChild(linkSection);

  modalBody.appendChild(mpanelClass);

  // Guest link panel
  const mpanelGuest = h('div', 'tp-mpanel');
  mpanelGuest.id = 'tp-mpanel-guest';

  const guestDesc = h('p', 'tp-modal-desc');
  guestDesc.textContent = "Share with anyone without organising by class. Sessions won't be grouped.";
  mpanelGuest.appendChild(guestDesc);

  const guestLinkLbl = h('p', 'tp-inp-lbl');
  guestLinkLbl.style.marginBottom = '6px';
  guestLinkLbl.textContent = 'Guest link';
  const guestLinkRow = h('div', 'tp-link-row');
  guestLinkRow.style.marginBottom = '14px';
  const guestInp = document.createElement('input');
  guestInp.className = 'tp-link-inp';
  guestInp.readOnly = true;
  guestInp.value = 'https://mizou.ai/g/guest-x7k2p9';
  const guestCopyBtn = btn('Copy', 'tp-btn-sm tp-btn-s');
  guestLinkRow.appendChild(guestInp);
  guestLinkRow.appendChild(guestCopyBtn);
  mpanelGuest.appendChild(guestLinkLbl);
  mpanelGuest.appendChild(guestLinkRow);

  const capRow = h('div', 'tp-cap-row');
  capRow.innerHTML = `${INFO_SVG}<span><strong>50 sessions</strong> remaining this week</span>`;
  mpanelGuest.appendChild(capRow);
  modalBody.appendChild(mpanelGuest);

  modal.appendChild(modalBody);
  modalBackdrop.appendChild(modal);
  root.appendChild(modalBackdrop);

  // ═══ TOAST ══════════════════════════════════════════════════════════════════
  const toast = h('div', 'tp-toast');
  toast.id = 'tp-toast';
  root.appendChild(toast);

  wireInteractions(root);
  return root;
}

// ─── State ───────────────────────────────────────────────────────────────────

type Draft = { id: string; mode: string; title: string; category?: string; date: string };

let tp_drafts: Draft[] = [...INIT_DRAFTS];
let tp_creations: { id: string; title: string; category: string; difficulty: string; date: string }[] = [...INIT_CREATIONS];
let tp_colTabActive = 'creations';
let tp_colSubOpen = true;
let tp_viewGrid_drafts = true;
let tp_viewGrid_creations = true;
let tp_currentCreationId: string | null = null;
let tp_currentClassId: number | null = null;
let tp_toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(msg: string, root: HTMLElement): void {
  const t = root.querySelector<HTMLElement>('#tp-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  if (tp_toastTimer) clearTimeout(tp_toastTimer);
  tp_toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

function wireInteractions(root: HTMLElement): void {
  // ── Helpers ──
  function showPage(pageId: string): void {
    root.querySelectorAll<HTMLElement>('.tp-page').forEach(p => p.classList.remove('active'));
    root.querySelector<HTMLElement>(`#tp-page-${pageId}`)?.classList.add('active');
  }

  function updateTopbarTitle(title: string): void {
    const el = root.querySelector<HTMLElement>('#tp-topbar-title');
    if (el) el.textContent = title;
  }

  function setNavActive(navId: string): void {
    root.querySelectorAll<HTMLElement>('.sb-sidebar-item').forEach(n => n.classList.remove('sb-sidebar-item--active'));
    root.querySelector<HTMLElement>(`#${navId}`)?.classList.add('sb-sidebar-item--active');
  }

  function setSubActive(itemId: string | null): void {
    root.querySelectorAll<HTMLElement>('.tp-ns-item').forEach(n => n.classList.remove('act'));
    if (itemId) root.querySelector<HTMLElement>(`#${itemId}`)?.classList.add('act');
  }

  function openColSubnav(show: boolean): void {
    const chev = root.querySelector<HTMLElement>('#tp-col-chev');
    const sub = root.querySelector<HTMLElement>('#tp-col-subnav');
    tp_colSubOpen = show;
    if (chev) chev.classList.toggle('open', show);
    if (sub) sub.classList.toggle('closed', !show);
  }

  // ── Collections tab switching ──
  function switchColTab(tabId: string): void {
    tp_colTabActive = tabId;
    const panelCreations = root.querySelector<HTMLElement>('#tp-panel-creations');
    const panelTemplates = root.querySelector<HTMLElement>('#tp-panel-templates');
    root.querySelectorAll<HTMLElement>('#tp-tab-creations, #tp-tab-templates').forEach(t => t.classList.remove('act'));
    if (tabId === 'creations') {
      root.querySelector('#tp-tab-creations')?.classList.add('act');
      if (panelCreations) panelCreations.style.display = 'flex';
      if (panelTemplates) panelTemplates.style.display = 'none';
      setSubActive('tp-ns-creations');
    } else {
      root.querySelector('#tp-tab-templates')?.classList.add('act');
      if (panelCreations) panelCreations.style.display = 'none';
      if (panelTemplates) panelTemplates.style.display = 'block';
      setSubActive('tp-ns-templates');
    }
  }

  function navigateToCollections(tab: string): void {
    showPage('collections');
    setNavActive('tp-nav-col');
    openColSubnav(true);
    switchColTab(tab);
    updateTopbarTitle('Collections');
  }

  // ── Classes page ──
  function openClasses(creationId: string, creationTitle: string): void {
    tp_currentCreationId = creationId;
    const titleEl = root.querySelector<HTMLElement>('#tp-classes-sim-title');
    if (titleEl) titleEl.textContent = creationTitle;

    const tbody = root.querySelector<HTMLElement>('#tp-classes-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      for (const cls of CLASSES_DATA) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-weight:600">${cls.name}</td>
          <td>${cls.sessions}</td>
          <td style="color:#60646c">${cls.dateCreated}</td>
          <td><span class="tp-spill tp-s-${cls.status}">${cls.status === 'active' ? 'Active' : 'Closed'}</span></td>
          <td><span class="tp-tlink tp-view-sessions-link" data-class-id="${cls.id}">View sessions →</span></td>`;
        tbody.appendChild(tr);
      }
    }
    showPage('classes');
    updateTopbarTitle('Collections');
  }

  // ── Sessions page ──
  function openSessions(classId: number, className: string): void {
    tp_currentClassId = classId;
    const creation = tp_creations.find(c => c.id === tp_currentCreationId) ||
      INIT_CREATIONS.find(c => c.id === tp_currentCreationId);
    const simTitle = creation?.title || 'Simulation';

    const simTitleEl = root.querySelector<HTMLElement>('#tp-sessions-sim-title');
    if (simTitleEl) simTitleEl.textContent = simTitle;

    const classNameEl = root.querySelector<HTMLElement>('#tp-sessions-class-name');
    if (classNameEl) classNameEl.textContent = className;

    const tbody = root.querySelector<HTMLElement>('#tp-sessions-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      for (const s of SESSIONS_DATA) {
        const statusLabel = s.status === 'completed' ? 'Completed'
          : s.status === 'inprogress' ? 'In progress' : 'Not started';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-weight:600">${s.learner}</td>
          <td style="color:#60646c;font-size:13px">${simTitle}</td>
          <td>${s.score}</td>
          <td style="color:#60646c">${s.duration}</td>
          <td style="color:#60646c">${s.date}</td>
          <td><span class="tp-spill tp-s-${s.status}">${statusLabel}</span></td>`;
        tbody.appendChild(tr);
      }
    }
    showPage('sessions');
    updateTopbarTitle('Collections');
  }

  // ── Sidebar collapse ──
  root.querySelector('#tp-collapse-btn')?.addEventListener('click', () => {
    root.querySelector('.sb-sidebar')?.classList.toggle('sb-collapsed');
  });

  // ── My Drafts nav ──
  root.querySelector('#tp-nav-drafts')?.addEventListener('click', () => {
    showPage('drafts');
    setNavActive('tp-nav-drafts');
    setSubActive(null);
    openColSubnav(false);
    updateTopbarTitle('My Drafts');
  });

  // ── Collections nav ──
  root.querySelector('#tp-nav-col')?.addEventListener('click', (e) => {
    const chevron = (e.target as HTMLElement).closest('#tp-col-chev');
    if (chevron) {
      e.stopPropagation();
      const isOnCollections = root.querySelector('#tp-page-collections')?.classList.contains('active');
      if (isOnCollections) {
        openColSubnav(!tp_colSubOpen);
      } else {
        navigateToCollections(tp_colTabActive);
      }
      return;
    }
    navigateToCollections('creations');
  });

  // ── Sub-nav items ──
  root.querySelector('#tp-ns-creations')?.addEventListener('click', () => navigateToCollections('creations'));
  root.querySelector('#tp-ns-templates')?.addEventListener('click', () => navigateToCollections('templates'));

  // ── Collections in-page tabs ──
  root.querySelector('#tp-tab-creations')?.addEventListener('click', () => switchColTab('creations'));
  root.querySelector('#tp-tab-templates')?.addEventListener('click', () => switchColTab('templates'));

  // ── Classes back ──
  root.querySelector('#tp-classes-back')?.addEventListener('click', () => navigateToCollections(tp_colTabActive));

  // ── Sessions back ──
  root.querySelector('#tp-sessions-back')?.addEventListener('click', () => {
    if (tp_currentCreationId) {
      const creation = [...tp_creations, ...INIT_CREATIONS].find(c => c.id === tp_currentCreationId);
      openClasses(tp_currentCreationId, creation?.title || 'Simulation');
    }
  });

  // ── View toggles ──
  function wireViewToggle(toggleId: string, gridId: string, listId: string, setGrid: (v: boolean) => void): void {
    root.querySelector(`#${toggleId}`)?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-view]');
      if (!btn) return;
      const view = btn.dataset.view!;
      root.querySelectorAll(`#${toggleId} .tp-vt-btn`).forEach(b => b.classList.remove('act'));
      btn.classList.add('act');
      const grid = root.querySelector<HTMLElement>(`#${gridId}`);
      const list = root.querySelector<HTMLElement>(`#${listId}`);
      setGrid(view === 'grid');
      if (grid) grid.style.display = view === 'grid' ? 'grid' : 'none';
      if (list) list.style.display = view === 'list' ? 'flex' : 'none';
    });
  }

  wireViewToggle('tp-drafts-toggle', 'tp-drafts-grid', 'tp-drafts-list', (v) => { tp_viewGrid_drafts = v; });
  wireViewToggle('tp-creations-toggle', 'tp-creations-grid', 'tp-creations-list', (v) => { tp_viewGrid_creations = v; });

  // ── Event delegation ──
  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const viewTeamsBtn = target.closest<HTMLElement>('.tp-view-teams-btn');
    if (viewTeamsBtn) {
      const id = viewTeamsBtn.dataset.creationId!;
      const title = viewTeamsBtn.dataset.creationTitle!;
      openClasses(id, title);
      return;
    }

    const viewSessLink = target.closest<HTMLElement>('.tp-view-sessions-link');
    if (viewSessLink) {
      const classId = parseInt(viewSessLink.dataset.classId!);
      const cls = CLASSES_DATA.find(c => c.id === classId);
      if (cls) openSessions(classId, cls.name);
      return;
    }

    const shareTrigger = target.closest<HTMLElement>('.tp-share-trigger');
    if (shareTrigger) {
      const title = shareTrigger.dataset.creationTitle || 'Simulation';
      openShareModal(title, root);
      return;
    }

    const publishBtn = target.closest<HTMLElement>('.tp-publish-btn');
    if (publishBtn) {
      publishDraft(publishBtn, root);
      return;
    }

    if (target === root.querySelector('#tp-modal')) {
      closeShareModal(root);
    }
  });

  // ── Share modal internals ──
  root.querySelector('#tp-modal-close')?.addEventListener('click', () => closeShareModal(root));
  root.querySelector('#tp-mtab-class')?.addEventListener('click', () => switchModalTab('class', root));
  root.querySelector('#tp-mtab-guest')?.addEventListener('click', () => switchModalTab('guest', root));

  const classNameInp = root.querySelector<HTMLInputElement>('#tp-class-name-inp');
  const ddListEl = root.querySelector<HTMLElement>('#tp-ddlist');

  classNameInp?.addEventListener('input', () => {
    const val = classNameInp.value.toLowerCase();
    const filtered = CLASS_NAMES.filter(n => !val || n.toLowerCase().includes(val));
    if (ddListEl) {
      ddListEl.innerHTML = '';
      filtered.forEach(name => {
        const item = h('div', 'tp-ddi');
        item.textContent = name;
        item.addEventListener('mousedown', () => {
          classNameInp.value = name;
          ddListEl.classList.remove('open');
          const ls = root.querySelector<HTMLElement>('#tp-link-section');
          if (ls) ls.style.display = 'none';
        });
        ddListEl.appendChild(item);
      });
      ddListEl.classList.toggle('open', filtered.length > 0 && classNameInp.value.length > 0);
    }
  });

  classNameInp?.addEventListener('focus', () => {
    if (ddListEl && classNameInp.value.length === 0) {
      ddListEl.innerHTML = '';
      CLASS_NAMES.forEach(name => {
        const item = h('div', 'tp-ddi');
        item.textContent = name;
        item.addEventListener('mousedown', () => {
          classNameInp.value = name;
          ddListEl.classList.remove('open');
        });
        ddListEl.appendChild(item);
      });
      ddListEl.classList.add('open');
    }
  });

  classNameInp?.addEventListener('blur', () => {
    setTimeout(() => ddListEl?.classList.remove('open'), 150);
  });

  root.querySelector('#tp-create-link-btn')?.addEventListener('click', () => {
    if (!classNameInp?.value.trim()) return;
    const slug = classNameInp.value.toLowerCase().replace(/\s+/g, '-');
    const li = root.querySelector<HTMLInputElement>('#tp-generated-link');
    if (li) li.value = `https://mizou.ai/c/${slug}-xf3k`;
    const section = root.querySelector<HTMLElement>('#tp-link-section');
    if (section) section.style.display = 'flex';
  });

  root.querySelector('#tp-copy-btn')?.addEventListener('click', () => showToast('Link copied!', root));
}

function openShareModal(title: string, root: HTMLElement): void {
  const modal = root.querySelector<HTMLElement>('#tp-modal');
  if (!modal) return;
  const titleEl = root.querySelector<HTMLElement>('#tp-modal-title');
  if (titleEl) titleEl.textContent = title;
  const inp = root.querySelector<HTMLInputElement>('#tp-class-name-inp');
  if (inp) inp.value = '';
  const linkSection = root.querySelector<HTMLElement>('#tp-link-section');
  if (linkSection) linkSection.style.display = 'none';
  const ddList = root.querySelector<HTMLElement>('#tp-ddlist');
  if (ddList) ddList.classList.remove('open');
  switchModalTab('class', root);
  modal.classList.add('open');
}

function closeShareModal(root: HTMLElement): void {
  root.querySelector('#tp-modal')?.classList.remove('open');
}

function switchModalTab(tabId: string, root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('#tp-mtab-class, #tp-mtab-guest').forEach(t => t.classList.remove('act'));
  root.querySelectorAll<HTMLElement>('.tp-mpanel').forEach(p => p.classList.remove('act'));
  root.querySelector(`#tp-mtab-${tabId}`)?.classList.add('act');
  root.querySelector(`#tp-mpanel-${tabId}`)?.classList.add('act');
}

function publishDraft(publishBtn: HTMLElement, root: HTMLElement): void {
  const draftId = publishBtn.dataset.draftId!;
  const title = publishBtn.dataset.title!;
  const cat = publishBtn.dataset.cat || 'General';

  const gridCard = root.querySelector<HTMLElement>(`.sim-card[data-draft-id="${draftId}"]`);
  const listRow = root.querySelector<HTMLElement>(`.tp-list-row[data-draft-id="${draftId}"]`);

  if (!gridCard && !listRow) return;

  const animateOut = (el: HTMLElement | null) => {
    if (!el) return;
    el.style.transition = 'opacity .28s, transform .28s';
    el.style.opacity = '0';
    el.style.transform = 'scale(0.94)';
  };
  animateOut(gridCard);
  animateOut(listRow);

  tp_drafts = tp_drafts.filter(d => d.id !== draftId);
  const newCreation = { id: draftId, title, category: cat, difficulty: 'easy', date: 'Just published' };
  tp_creations = [newCreation, ...tp_creations];

  setTimeout(() => {
    gridCard?.remove();
    listRow?.remove();

    const remainingGrid = root.querySelectorAll('#tp-drafts-grid .sim-card');
    const remainingList = root.querySelectorAll('#tp-drafts-list .tp-list-row');
    if (remainingGrid.length === 0 && remainingList.length === 0) {
      const empty = root.querySelector<HTMLElement>('#tp-drafts-empty');
      const grid = root.querySelector<HTMLElement>('#tp-drafts-grid');
      const list = root.querySelector<HTMLElement>('#tp-drafts-list');
      if (empty) empty.style.display = 'flex';
      if (grid) grid.style.display = 'none';
      if (list) list.style.display = 'none';
    }

    const cGrid = root.querySelector<HTMLElement>('#tp-creations-grid');
    const cList = root.querySelector<HTMLElement>('#tp-creations-list');

    const newCard = buildCreationCard(newCreation);
    newCard.style.opacity = '0';
    newCard.style.transform = 'scale(0.94)';
    newCard.style.transition = 'opacity .28s, transform .28s';
    cGrid?.prepend(newCard);
    requestAnimationFrame(() => { newCard.style.opacity = '1'; newCard.style.transform = 'scale(1)'; });

    const newRow = buildCreationListRow(newCreation);
    cList?.prepend(newRow);
  }, 300);

  const short = title.length > 32 ? title.slice(0, 32) + '…' : title;
  showToast(`"${short}" published to My Creations ✓`, root);
}
