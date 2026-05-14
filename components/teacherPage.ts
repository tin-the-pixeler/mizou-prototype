import '../styles/teacher-page.css';

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
  { id: 'c1', title: 'Planning for Brief', category: 'Sales', date: 'Apr 20, 2026' },
  { id: 'c2', title: 'Training Effective Communication and Problem Resolution', category: 'Customer Support', date: 'Apr 15, 2026' },
  { id: 'c3', title: 'Disciplinary Talk with a GO Over Inappropriate Remarks at the Marrakesh Village', category: 'Management', date: 'Apr 10, 2026' },
  { id: 'c4', title: 'Final Interview for Culture Fit', category: 'Recruitment', date: 'Apr 5, 2026' },
  { id: 'c5', title: 'Addressing Tax Concerns to Close a Real Estate Deal', category: 'Customer Support', date: 'Mar 28, 2026' },
  { id: 'c6', title: 'Upselling Premium Services to an Existing Client', category: 'Sales', date: 'Mar 21, 2026' },
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

// QR pattern: 7×7 grid (1=dark, 0=light)
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

const LOGO_SVG = `<svg width="16" height="16" viewBox="0 0 48 48" fill="none">
  <path d="M13 36V12h2.5L24 27.5 32.5 12H35v24h-2.5V18.5L25 31.5h-2L15.5 18.5V36H13Z" fill="#60646c"/>
</svg>`;

const COLLAPSE_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const PLUS_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`;

const PENCIL_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M16.29 2.29a1 1 0 0 1 1.42 0l4 4a1 1 0 0 1 0 1.42l-13 13A1 1 0 0 1 8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .29-.71l13-13ZM5 16.41V19h2.59L19.59 7 17 4.41 5 16.41Z" stroke="none"/>
</svg>`;

const GRID4_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
</svg>`;

const CHEVRON_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const FEEDBACK_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const SEARCH_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
  <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
  <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const GRID_VIEW_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
</svg>`;

const LIST_VIEW_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const CHAT_AI_SVG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#8b8d98" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="9" cy="10" r="1" fill="#8b8d98"/>
  <circle cx="12" cy="10" r="1" fill="#8b8d98"/>
  <circle cx="15" cy="10" r="1" fill="#8b8d98"/>
</svg>`;

const PLUS_CIRCLE_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#b9bbc6" stroke-width="2.5" stroke-linecap="round"/></svg>`;

const BACK_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const INFO_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="flex-shrink:0">
  <circle cx="12" cy="12" r="9" stroke="#8b8d98" stroke-width="1.5"/>
  <path d="M12 8v4M12 16h.01" stroke="#8b8d98" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const USER_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#8b8d98" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="12" cy="7" r="4" stroke="#8b8d98" stroke-width="1.5"/>
</svg>`;

const FILE_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#60646c" stroke-width="1.5"/>
  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#60646c" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function h(tag: string, className?: string, innerHTML?: string): HTMLElement {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

function btn(label: string, cls: string): HTMLButtonElement {
  const el = document.createElement('button');
  el.className = `tp-btn ${cls}`;
  el.textContent = label;
  return el;
}

function draftThumb(): HTMLElement {
  const wrap = h('div', 'tp-thumb-plus');
  const circle = h('div', 'tp-thumb-circle');
  circle.innerHTML = PLUS_CIRCLE_SVG;
  wrap.appendChild(circle);
  return wrap;
}

function listThumbDraft(small = false): HTMLElement {
  if (small) {
    const wrap = h('div', 'tp-list-thumb');
    const circle = h('div', 'tp-thumb-circle');
    circle.style.cssText = 'width:28px;height:28px;border-width:1.5px';
    circle.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#b9bbc6" stroke-width="2.5" stroke-linecap="round"/></svg>`;
    wrap.appendChild(circle);
    return wrap;
  }
  return draftThumb();
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

// ─── Card builders ────────────────────────────────────────────────────────────

type DraftItem = { id: string; mode: string; title: string; category?: string; date: string };
type CreationItem = { id: string; title: string; category: string; date: string };

function buildPlanCard(d: DraftItem): HTMLElement {
  const card = h('div', 'tp-card tp-plan-card-wrap');
  card.dataset.draftId = d.id;

  const thumb = h('div', 'tp-plan-card-thumb');
  const iconBox = h('div', 'tp-plan-icon-box');
  iconBox.innerHTML = CHAT_AI_SVG;
  thumb.appendChild(iconBox);
  card.appendChild(thumb);

  const body = h('div', 'tp-card-body');
  const chip = h('span', 'tp-plan-mode-chip');
  chip.textContent = 'Plan mode';
  body.appendChild(chip);
  const title = h('div', 'tp-card-title');
  title.textContent = d.title;
  body.appendChild(title);
  const date = h('div', 'tp-card-date');
  date.textContent = `Created ${d.date}`;
  body.appendChild(date);
  card.appendChild(body);

  const foot = h('div', 'tp-card-foot');
  foot.appendChild(btn('Continue', 'tp-btn-s tp-btn-sm'));
  card.appendChild(foot);
  return card;
}

function buildDraftCard(d: DraftItem): HTMLElement {
  const card = h('div', 'tp-card');
  card.dataset.draftId = d.id;

  card.appendChild(draftThumb());

  const body = h('div', 'tp-card-body');
  const badges = h('div', 'tp-card-badges');
  if (d.category) {
    const catBadge = h('span', 'tp-badge');
    catBadge.textContent = d.category;
    badges.appendChild(catBadge);
  }
  const draftBadge = h('span', 'tp-draft-badge');
  draftBadge.textContent = 'Draft';
  badges.appendChild(draftBadge);
  body.appendChild(badges);

  const title = h('div', 'tp-card-title');
  title.textContent = d.title;
  body.appendChild(title);
  const date = h('div', 'tp-card-date');
  date.textContent = d.date;
  body.appendChild(date);
  card.appendChild(body);

  const foot = h('div', 'tp-card-foot');
  foot.appendChild(btn('Edit', 'tp-btn-s tp-btn-sm'));
  const pubBtn = btn('Publish', 'tp-btn-publish tp-btn-sm tp-publish-btn');
  pubBtn.dataset.draftId = d.id;
  pubBtn.dataset.title = d.title;
  pubBtn.dataset.cat = d.category || 'General';
  foot.appendChild(pubBtn);
  card.appendChild(foot);
  return card;
}

function buildPlanListRow(d: DraftItem): HTMLElement {
  const row = h('div', 'tp-list-row');
  row.dataset.draftId = d.id;

  const thumb = h('div', 'tp-list-thumb-plan');
  thumb.innerHTML = CHAT_AI_SVG;
  row.appendChild(thumb);

  const info = h('div', 'tp-list-info');
  const chip = h('span', 'tp-plan-mode-chip');
  chip.style.flexShrink = '0';
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
  actions.appendChild(btn('Continue', 'tp-btn-s tp-btn-sm'));
  row.appendChild(actions);
  return row;
}

function buildDraftListRow(d: DraftItem): HTMLElement {
  const row = h('div', 'tp-list-row');
  row.dataset.draftId = d.id;

  row.appendChild(listThumbDraft(true));

  const info = h('div', 'tp-list-info');
  if (d.category) {
    const catBadge = h('span', 'tp-badge');
    catBadge.style.flexShrink = '0';
    catBadge.textContent = d.category;
    info.appendChild(catBadge);
  }
  const draftBadge = h('span', 'tp-draft-badge');
  draftBadge.style.flexShrink = '0';
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
  actions.appendChild(btn('Edit', 'tp-btn-s tp-btn-sm'));
  const pubBtn = btn('Publish', 'tp-btn-publish tp-btn-sm tp-publish-btn');
  pubBtn.dataset.draftId = d.id;
  pubBtn.dataset.title = d.title;
  pubBtn.dataset.cat = d.category || 'General';
  actions.appendChild(pubBtn);
  row.appendChild(actions);
  return row;
}

function buildCreationCard(c: CreationItem): HTMLElement {
  const card = h('div', 'tp-card');
  card.dataset.creationId = c.id;
  card.dataset.creationTitle = c.title;

  card.appendChild(draftThumb());

  const body = h('div', 'tp-card-body');
  const catBadge = h('span', 'tp-badge');
  catBadge.textContent = c.category;
  body.appendChild(catBadge);
  const title = h('div', 'tp-card-title');
  title.textContent = c.title;
  body.appendChild(title);
  const date = h('div', 'tp-card-date');
  date.textContent = c.date;
  body.appendChild(date);
  card.appendChild(body);

  const foot = h('div', 'tp-card-foot');
  const shareBtn = btn('Share', 'tp-btn-s tp-btn-sm tp-share-trigger');
  shareBtn.dataset.creationId = c.id;
  shareBtn.dataset.creationTitle = c.title;
  const viewBtn = btn('View Teams', 'tp-btn-s tp-btn-sm tp-view-teams-btn');
  viewBtn.dataset.creationId = c.id;
  viewBtn.dataset.creationTitle = c.title;
  foot.appendChild(shareBtn);
  foot.appendChild(viewBtn);
  card.appendChild(foot);
  return card;
}

function buildCreationListRow(c: CreationItem): HTMLElement {
  const row = h('div', 'tp-list-row');
  row.dataset.creationId = c.id;
  row.dataset.creationTitle = c.title;

  row.appendChild(listThumbDraft(true));

  const info = h('div', 'tp-list-info');
  const catBadge = h('span', 'tp-badge');
  catBadge.style.flexShrink = '0';
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
  const shareBtn = btn('Share', 'tp-btn-s tp-btn-sm tp-share-trigger');
  shareBtn.dataset.creationId = c.id;
  shareBtn.dataset.creationTitle = c.title;
  const viewBtn = btn('View Teams', 'tp-btn-s tp-btn-sm tp-view-teams-btn');
  viewBtn.dataset.creationId = c.id;
  viewBtn.dataset.creationTitle = c.title;
  actions.appendChild(shareBtn);
  actions.appendChild(viewBtn);
  row.appendChild(actions);
  return row;
}

// ─── Main factory ─────────────────────────────────────────────────────────────

export function createTeacherPage({ userInitial = 'JD' }: TeacherPageOptions = {}): HTMLElement {
  const root = h('div', 'tp-root');

  // ═══ SIDEBAR ═══════════════════════════════════════════════════════════════
  const sidebar = h('aside', 'tp-sidebar');

  // Header
  const sbHd = h('div', 'tp-sb-hd');
  const sbLogo = h('div', 'tp-sb-logo');
  const sbMark = h('div', 'tp-sb-mark');
  sbMark.innerHTML = LOGO_SVG;
  const sbName = h('span', 'tp-sb-name');
  sbName.textContent = 'Mizou';
  sbLogo.appendChild(sbMark);
  sbLogo.appendChild(sbName);
  const sbCollBtn = h('button', 'tp-sb-coll-btn');
  sbCollBtn.id = 'tp-collapse-btn';
  sbCollBtn.innerHTML = COLLAPSE_SVG;
  sbHd.appendChild(sbLogo);
  sbHd.appendChild(sbCollBtn);
  sidebar.appendChild(sbHd);

  // Create button
  const createWrap = h('div', 'tp-create-wrap');
  const createBtn = h('button', 'tp-create');
  createBtn.innerHTML = `${PLUS_SVG}<span class="tp-create-lbl">Create</span>`;
  createWrap.appendChild(createBtn);
  sidebar.appendChild(createWrap);

  // Nav
  const nav = h('nav', 'tp-nav');

  // My Drafts nav item
  const niDrafts = h('div', 'tp-ni act');
  niDrafts.id = 'tp-nav-drafts';
  niDrafts.innerHTML = `${PENCIL_SVG}<span class="tp-ni-lbl">My Drafts</span>`;
  nav.appendChild(niDrafts);

  // Collections nav item (expandable)
  const niCol = h('div', 'tp-ni');
  niCol.id = 'tp-nav-col';
  const niColChev = h('span', 'tp-ni-chev open');
  niColChev.id = 'tp-col-chev';
  niColChev.innerHTML = CHEVRON_SVG;
  niCol.innerHTML = `${GRID4_SVG}<span class="tp-ni-lbl">Collections</span>`;
  niCol.appendChild(niColChev);
  nav.appendChild(niCol);

  // Collections sub-items
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
  nav.appendChild(nsWrap);

  sidebar.appendChild(nav);

  // Bottom feedback
  const sbBot = h('div', 'tp-sb-bot');
  const fbItem = h('div', 'tp-fb');
  fbItem.innerHTML = `${FEEDBACK_SVG}<span class="tp-fb-lbl">Feedback</span>`;
  sbBot.appendChild(fbItem);
  sidebar.appendChild(sbBot);
  root.appendChild(sidebar);

  // ═══ MAIN ══════════════════════════════════════════════════════════════════
  const main = h('div', 'tp-main');

  // Topbar
  const topbar = h('div', 'tp-topbar');
  const av = h('div', 'tp-av');
  av.innerHTML = USER_SVG;
  topbar.appendChild(av);
  main.appendChild(topbar);

  // ── PAGE: My Drafts ────────────────────────────────────────────────────────
  const pageDrafts = h('div', 'tp-page active');
  pageDrafts.id = 'tp-page-drafts';

  const draftsTitle = h('h1', 'tp-inpage-title');
  draftsTitle.textContent = 'My Drafts';
  pageDrafts.appendChild(draftsTitle);

  // Filter bar
  const draftsFilterBar = h('div', 'tp-col-fbar');
  const dSearch = h('div', 'tp-col-search');
  dSearch.innerHTML = `<span class="tp-col-search-ico">${SEARCH_SVG}</span>`;
  const dSearchInp = document.createElement('input');
  dSearchInp.placeholder = 'Search drafts...';
  dSearch.appendChild(dSearchInp);
  draftsFilterBar.appendChild(dSearch);

  const dCatSel = document.createElement('select');
  dCatSel.className = 'tp-col-sel';
  ['All categories', 'Sales', 'Customer Support', 'Management'].forEach(o => {
    const op = document.createElement('option');
    op.textContent = o;
    dCatSel.appendChild(op);
  });
  draftsFilterBar.appendChild(dCatSel);

  const dDateSel = document.createElement('select');
  dDateSel.className = 'tp-col-sel';
  ['All dates', 'This week', 'This month'].forEach(o => {
    const op = document.createElement('option');
    op.textContent = o;
    dDateSel.appendChild(op);
  });
  draftsFilterBar.appendChild(dDateSel);

  const dToggleWrap = h('div', 'tp-col-fbar-right');
  const dToggle = viewToggle(true);
  dToggle.id = 'tp-drafts-toggle';
  dToggleWrap.appendChild(dToggle);
  draftsFilterBar.appendChild(dToggleWrap);
  pageDrafts.appendChild(draftsFilterBar);

  // Grid
  const draftsGrid = h('div', 'tp-grid tp-grid-3');
  draftsGrid.id = 'tp-drafts-grid';
  for (const d of INIT_DRAFTS) {
    draftsGrid.appendChild(d.mode === 'plan' ? buildPlanCard(d) : buildDraftCard(d));
  }
  pageDrafts.appendChild(draftsGrid);

  // List view container (hidden by default)
  const draftsList = h('div', 'tp-list-rows');
  draftsList.id = 'tp-drafts-list';
  draftsList.style.display = 'none';
  for (const d of INIT_DRAFTS) {
    draftsList.appendChild(d.mode === 'plan' ? buildPlanListRow(d) : buildDraftListRow(d));
  }
  pageDrafts.appendChild(draftsList);

  // Empty state
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

  main.appendChild(pageDrafts);

  // ── PAGE: Collections ──────────────────────────────────────────────────────
  const pageCollections = h('div', 'tp-page');
  pageCollections.id = 'tp-page-collections';

  const colTitle = h('h1', 'tp-inpage-title');
  colTitle.textContent = 'Collections';
  pageCollections.appendChild(colTitle);

  // Tabs
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

  const creationsFilterBar = h('div', 'tp-col-fbar');
  const cSearch = h('div', 'tp-col-search');
  cSearch.innerHTML = `<span class="tp-col-search-ico">${SEARCH_SVG}</span>`;
  const cSearchInp = document.createElement('input');
  cSearchInp.placeholder = 'Search simulations...';
  cSearch.appendChild(cSearchInp);
  creationsFilterBar.appendChild(cSearch);
  const cCatSel = document.createElement('select');
  cCatSel.className = 'tp-col-sel';
  ['All categories', 'Sales', 'Customer Support', 'Management', 'Recruitment'].forEach(o => {
    const op = document.createElement('option'); op.textContent = o; cCatSel.appendChild(op);
  });
  creationsFilterBar.appendChild(cCatSel);
  const cStatusSel = document.createElement('select');
  cStatusSel.className = 'tp-col-sel';
  ['All status', 'Published', 'Draft'].forEach(o => {
    const op = document.createElement('option'); op.textContent = o; cStatusSel.appendChild(op);
  });
  creationsFilterBar.appendChild(cStatusSel);
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
  const tCatSel = document.createElement('select');
  tCatSel.className = 'tp-col-sel';
  ['All categories', 'Sales', 'Customer Support', 'Management'].forEach(o => {
    const op = document.createElement('option'); op.textContent = o; tCatSel.appendChild(op);
  });
  tFilterBar.appendChild(tCatSel);
  const tToggleWrap = h('div', 'tp-col-fbar-right');
  tToggleWrap.appendChild(viewToggle(true));
  tFilterBar.appendChild(tToggleWrap);
  panelTemplates.appendChild(tFilterBar);

  const templatesGrid = h('div', 'tp-grid tp-grid-3');
  for (let i = 0; i < 8; i++) {
    const card = h('div', 'tp-card');
    card.style.cursor = 'default';
    const tThumb = h('div', 'tp-thumb-plus');
    tThumb.style.height = '120px';
    card.appendChild(tThumb);
    const tBody = h('div', 'tp-card-body');
    tBody.appendChild(h('div', 'tp-skel', ''));
    const s2 = h('div', 'tp-skel', '');
    s2.style.cssText = 'width:85%;margin-top:8px;height:14px';
    tBody.appendChild(s2);
    const s3 = h('div', 'tp-skel', '');
    s3.style.cssText = 'width:65%;margin-top:4px;height:14px';
    tBody.appendChild(s3);
    const s4 = h('div', 'tp-skel', '');
    s4.style.cssText = 'width:42%';
    tBody.appendChild(s4);
    card.appendChild(tBody);
    templatesGrid.appendChild(card);
  }
  panelTemplates.appendChild(templatesGrid);
  pageCollections.appendChild(panelTemplates);

  main.appendChild(pageCollections);

  // ── PAGE: Classes ──────────────────────────────────────────────────────────
  const pageClasses = h('div', 'tp-page');
  pageClasses.id = 'tp-page-classes';

  const classesPgHd = h('div', 'tp-pg-hd');
  const classesBreadcrumb = h('div', '');
  classesBreadcrumb.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap';
  const classesBack = h('div', 'tp-pg-back');
  classesBack.id = 'tp-classes-back';
  classesBack.innerHTML = `${BACK_SVG} Collections`;
  const classesSep = h('span', 'tp-bread-sep');
  classesSep.textContent = '/';
  const classesSimTitle = h('h1', 'tp-pg-title');
  classesSimTitle.id = 'tp-classes-sim-title';
  classesSimTitle.textContent = 'Simulation';
  classesBreadcrumb.appendChild(classesBack);
  classesBreadcrumb.appendChild(classesSep);
  classesBreadcrumb.appendChild(classesSimTitle);
  classesPgHd.appendChild(classesBreadcrumb);

  const createClassBtn = btn('Create new class link', 'tp-btn-p');
  createClassBtn.innerHTML = `${PLUS_SVG} Create new class link`;
  classesPgHd.appendChild(createClassBtn);
  pageClasses.appendChild(classesPgHd);

  const classesTblWrap = h('div', 'tp-tbl-wrap');
  const classesTbl = document.createElement('table');
  classesTbl.className = 'tp-tbl';
  classesTbl.innerHTML = `
    <thead><tr>
      <th>Class name</th><th>Sessions</th><th>Date created</th><th>Status</th><th></th>
    </tr></thead>
    <tbody id="tp-classes-tbody"></tbody>`;
  classesTblWrap.appendChild(classesTbl);
  pageClasses.appendChild(classesTblWrap);
  main.appendChild(pageClasses);

  // ── PAGE: Sessions ─────────────────────────────────────────────────────────
  const pageSessions = h('div', 'tp-page');
  pageSessions.id = 'tp-page-sessions';

  const sessionsPgHd = h('div', 'tp-pg-hd');
  const sessionsBreadcrumb = h('div', '');
  sessionsBreadcrumb.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap';
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
  sessionsBreadcrumb.appendChild(sessionsBack);
  sessionsBreadcrumb.appendChild(sessionsSep);
  sessionsBreadcrumb.appendChild(sessionsClassName);
  sessionsPgHd.appendChild(sessionsBreadcrumb);
  pageSessions.appendChild(sessionsPgHd);

  // Sessions filter bar
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
  sessionsTbl.innerHTML = `
    <thead><tr>
      <th>Learner</th><th>Simulation</th><th>Score</th><th>Duration</th><th>Date</th><th>Status</th>
    </tr></thead>`;
  sessionsTbl.appendChild(sessionsTbody);
  sessionsTblWrap.appendChild(sessionsTbl);
  pageSessions.appendChild(sessionsTblWrap);
  main.appendChild(pageSessions);

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
  const classNameInp = h('input', 'tp-inp') as HTMLInputElement;
  (classNameInp as HTMLInputElement).placeholder = 'Enter class name…';
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
  createLinkBtn.style.cssText = 'width:100%;justify-content:center;margin-bottom:16px';
  mpanelClass.appendChild(createLinkBtn);

  const linkSection = h('div', 'tp-link-section');
  linkSection.id = 'tp-link-section';
  linkSection.style.display = 'none';
  const linkLbl = h('p', 'tp-inp-lbl');
  linkLbl.style.marginBottom = '6px';
  linkLbl.textContent = 'Class link';
  const linkRow = h('div', 'tp-link-row');
  const linkInp = h('input', 'tp-link-inp') as HTMLInputElement;
  (linkInp as HTMLInputElement).readOnly = true;
  linkInp.id = 'tp-generated-link';
  (linkInp as HTMLInputElement).value = 'https://mizou.ai/c/class-link';
  const copyBtn = btn('Copy', 'tp-btn-s tp-btn-sm');
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
  const guestInp = h('input', 'tp-link-inp') as HTMLInputElement;
  (guestInp as HTMLInputElement).readOnly = true;
  (guestInp as HTMLInputElement).value = 'https://mizou.ai/g/guest-x7k2p9';
  const guestCopyBtn = btn('Copy', 'tp-btn-s tp-btn-sm');
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

  // ═══ WIRE INTERACTIONS ══════════════════════════════════════════════════════
  wireInteractions(root);
  return root;
}

// ─── State ───────────────────────────────────────────────────────────────────

type Draft = { id: string; mode: string; title: string; category?: string; date: string };

let tp_drafts: Draft[] = [...INIT_DRAFTS];
let tp_creations: { id: string; title: string; category: string; date: string }[] = [...INIT_CREATIONS];
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
  // ── Page navigation ──
  function showPage(pageId: string): void {
    root.querySelectorAll<HTMLElement>('.tp-page').forEach(p => p.classList.remove('active'));
    root.querySelector<HTMLElement>(`#tp-page-${pageId}`)?.classList.add('active');
  }

  function setNavActive(navId: string): void {
    root.querySelectorAll<HTMLElement>('.tp-ni').forEach(n => n.classList.remove('act'));
    root.querySelector<HTMLElement>(`#${navId}`)?.classList.add('act');
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
    if (sub) sub.style.display = show ? 'flex' : 'none';
  }

  // ── Collections tab switching ──
  function switchColTab(tabId: string): void {
    tp_colTabActive = tabId;
    const panelCreations = root.querySelector<HTMLElement>('#tp-panel-creations');
    const panelTemplates = root.querySelector<HTMLElement>('#tp-panel-templates');
    root.querySelectorAll<HTMLElement>('#tp-tab-creations, #tp-tab-templates').forEach(t => t.classList.remove('act'));
    if (tabId === 'creations') {
      root.querySelector('#tp-tab-creations')?.classList.add('act');
      if (panelCreations) panelCreations.style.display = 'block';
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
  }

  // ── Sessions page ──
  function openSessions(classId: number, className: string): void {
    tp_currentClassId = classId;
    const cls = CLASSES_DATA.find(c => c.id === classId);
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
  }

  // ── Sidebar collapse ──
  root.querySelector('#tp-collapse-btn')?.addEventListener('click', () => {
    sidebar(root)?.classList.toggle('collapsed');
  });

  function sidebar(r: HTMLElement): HTMLElement | null {
    return r.querySelector('.tp-sidebar');
  }

  // ── My Drafts nav ──
  root.querySelector('#tp-nav-drafts')?.addEventListener('click', () => {
    showPage('drafts');
    setNavActive('tp-nav-drafts');
    setSubActive(null);
    openColSubnav(false);
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
  function wireViewToggle(toggleId: string, gridId: string, listId: string, isGrid: () => boolean, setGrid: (v: boolean) => void): void {
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

  wireViewToggle('tp-drafts-toggle', 'tp-drafts-grid', 'tp-drafts-list',
    () => tp_viewGrid_drafts, (v) => { tp_viewGrid_drafts = v; });
  wireViewToggle('tp-creations-toggle', 'tp-creations-grid', 'tp-creations-list',
    () => tp_viewGrid_creations, (v) => { tp_viewGrid_creations = v; });

  // ── Event delegation ──
  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    // View Teams → Classes page
    const viewTeamsBtn = target.closest<HTMLElement>('.tp-view-teams-btn');
    if (viewTeamsBtn) {
      const id = viewTeamsBtn.dataset.creationId!;
      const title = viewTeamsBtn.dataset.creationTitle!;
      openClasses(id, title);
      return;
    }

    // View sessions link in classes table
    const viewSessLink = target.closest<HTMLElement>('.tp-view-sessions-link');
    if (viewSessLink) {
      const classId = parseInt(viewSessLink.dataset.classId!);
      const cls = CLASSES_DATA.find(c => c.id === classId);
      if (cls) openSessions(classId, cls.name);
      return;
    }

    // Share trigger
    const shareTrigger = target.closest<HTMLElement>('.tp-share-trigger');
    if (shareTrigger) {
      const title = shareTrigger.dataset.creationTitle || 'Simulation';
      openShareModal(title, root);
      return;
    }

    // Publish button
    const publishBtn = target.closest<HTMLElement>('.tp-publish-btn');
    if (publishBtn) {
      publishDraft(publishBtn, root);
      return;
    }

    // Modal backdrop
    if (target === root.querySelector('#tp-modal')) {
      closeShareModal(root);
    }
  });

  // ── Share modal internals ──
  root.querySelector('#tp-modal-close')?.addEventListener('click', () => closeShareModal(root));
  root.querySelector('#tp-mtab-class')?.addEventListener('click', () => switchModalTab('class', root));
  root.querySelector('#tp-mtab-guest')?.addEventListener('click', () => switchModalTab('guest', root));

  // Typeahead
  const classNameInp = root.querySelector<HTMLInputElement>('#tp-class-name-inp');
  const ddList = root.querySelector<HTMLElement>('#tp-ddlist');

  classNameInp?.addEventListener('input', () => {
    const val = classNameInp.value.toLowerCase();
    const filtered = CLASS_NAMES.filter(n => !val || n.toLowerCase().includes(val));
    if (ddList) {
      ddList.innerHTML = '';
      filtered.forEach(name => {
        const item = h('div', 'tp-ddi');
        item.textContent = name;
        item.addEventListener('mousedown', () => {
          classNameInp.value = name;
          ddList.classList.remove('open');
          root.querySelector<HTMLElement>('#tp-link-section')!.style.display = 'none';
        });
        ddList.appendChild(item);
      });
      ddList.classList.toggle('open', filtered.length > 0 && classNameInp.value.length > 0);
    }
  });

  classNameInp?.addEventListener('focus', () => {
    if (ddList && classNameInp.value.length === 0) {
      ddList.innerHTML = '';
      CLASS_NAMES.forEach(name => {
        const item = h('div', 'tp-ddi');
        item.textContent = name;
        item.addEventListener('mousedown', () => {
          classNameInp.value = name;
          ddList.classList.remove('open');
        });
        ddList.appendChild(item);
      });
      ddList.classList.add('open');
    }
  });

  classNameInp?.addEventListener('blur', () => {
    setTimeout(() => ddList?.classList.remove('open'), 150);
  });

  // Create class link button
  root.querySelector('#tp-create-link-btn')?.addEventListener('click', () => {
    if (!classNameInp?.value.trim()) return;
    const slug = classNameInp.value.toLowerCase().replace(/\s+/g, '-');
    const linkInp = root.querySelector<HTMLInputElement>('#tp-generated-link');
    if (linkInp) linkInp.value = `https://mizou.ai/c/${slug}-xf3k`;
    const section = root.querySelector<HTMLElement>('#tp-link-section');
    if (section) section.style.display = 'block';
  });

  // Copy button
  root.querySelector('#tp-copy-btn')?.addEventListener('click', () => showToast('Link copied!', root));
}

function openShareModal(title: string, root: HTMLElement): void {
  const modal = root.querySelector<HTMLElement>('#tp-modal');
  if (!modal) return;
  const titleEl = root.querySelector<HTMLElement>('#tp-modal-title');
  if (titleEl) titleEl.textContent = title;
  // Reset class link state
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

  // Find and animate out the grid card and list row
  const gridCard = root.querySelector<HTMLElement>(`.tp-card[data-draft-id="${draftId}"]`);
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
  const newCreation = { id: draftId, title, category: cat, date: 'Just published' };
  tp_creations = [newCreation, ...tp_creations];

  setTimeout(() => {
    gridCard?.remove();
    listRow?.remove();

    // Check if drafts are empty
    const remainingGrid = root.querySelectorAll('#tp-drafts-grid .tp-card, #tp-drafts-grid .tp-card');
    const remainingList = root.querySelectorAll('#tp-drafts-list .tp-list-row');
    if (remainingGrid.length === 0 && remainingList.length === 0) {
      const empty = root.querySelector<HTMLElement>('#tp-drafts-empty');
      const grid = root.querySelector<HTMLElement>('#tp-drafts-grid');
      const list = root.querySelector<HTMLElement>('#tp-drafts-list');
      if (empty) empty.style.display = 'flex';
      if (grid) grid.style.display = 'none';
      if (list) list.style.display = 'none';
    }

    // Add new card to creations grid
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
