// components/adminPage.ts
// Full Admin Page wireframe: sidebar navigation, multiple pages,
// share modal, view toggle, and draft publish flow.

import '../styles/admin-page.css';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AdminPageOptions = {
  userInitial?: string;
};

// ─── SVGs ────────────────────────────────────────────────────────────────────

const LOGO_SVG = `<svg width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 0.5H40C44.14 0.5 47.5 3.86 47.5 8V40C47.5 44.14 44.14 47.5 40 47.5H8C3.86 47.5 0.5 44.14 0.5 40V8C0.5 3.86 3.86 0.5 8 0.5Z" fill="url(#lg)" stroke="#DDDDE3"/>
<defs><linearGradient id="lg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#6366f1"/><stop offset="1" stop-color="#4f46e5"/></linearGradient></defs>
<path d="M12.7 36c-.38 0-.7-.31-.7-.7V12.7c0-.38.32-.7.7-.7h2.5c.26 0 .49.14.61.37L24.33 28.24c.12.22-.04.47-.28.47s-.4-.26-.28-.48L32.26 12.37c.12-.23.36-.37.61-.37H35.3c.38 0 .7.31.7.7V35.3c0 .39-.32.7-.7.7h-2.52c-.38 0-.7-.31-.7-.7V18.75c0-.15.12-.28.26-.28.21 0 .34.23.24.41L25.46 31.99c-.12.22-.35.36-.6.36h-1.71c-.25 0-.48-.14-.6-.37L15.35 18.88c-.11-.2.03-.45.26-.45.17 0 .3.14.3.31V35.3c0 .39-.31.7-.69.7H12.7z" fill="white"/>
</svg>`;

const CHEVRON_SVG = `<svg class="ap-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;

const SEARCH_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

const GRID_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`;

const LIST_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>`;

const CHAT_AI_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="22" height="22"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M9.5 9h5M9.5 12.5h3" stroke-linecap="round"/></svg>`;

const FILE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

const HATCH_DIV = `<div class="ap-card-hatch" style="width:100%;height:100%"></div>`;

const PLUS_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

const TMPL_SVG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/></svg>`;

const LINK_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

const REMOVE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;

const BACK_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>`;

const SIM_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function h(tag: string, className?: string, innerHTML?: string): HTMLElement {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

function btn(label: string, cls: string): HTMLButtonElement {
  const el = document.createElement('button');
  el.className = `ap-btn ${cls}`;
  el.textContent = label;
  return el;
}

function filterBar(searchPlaceholder: string, selects: string[][], withToggle = true): HTMLElement {
  const bar = h('div', 'ap-filter-bar');

  const wrap = h('div', 'ap-search-wrap');
  wrap.innerHTML = SEARCH_SVG;
  const inp = document.createElement('input');
  inp.className = 'ap-search-input';
  inp.type = 'text';
  inp.placeholder = searchPlaceholder;
  wrap.appendChild(inp);
  bar.appendChild(wrap);

  for (const [dflt, ...opts] of selects) {
    const sel = document.createElement('select');
    sel.className = 'ap-filter-select';
    [dflt, ...opts].forEach(o => {
      const opt = document.createElement('option');
      opt.textContent = o;
      sel.appendChild(opt);
    });
    bar.appendChild(sel);
  }

  if (withToggle) {
    const toggle = h('div', 'ap-view-toggle');
    toggle.dataset.viewToggle = '';
    const gridBtn = h('button', 'ap-view-btn active');
    gridBtn.innerHTML = GRID_SVG;
    gridBtn.dataset.view = 'grid';
    gridBtn.title = 'Grid view';
    const listBtn = h('button', 'ap-view-btn');
    listBtn.innerHTML = LIST_SVG;
    listBtn.dataset.view = 'list';
    listBtn.title = 'List view';
    toggle.appendChild(gridBtn);
    toggle.appendChild(listBtn);
    bar.appendChild(toggle);
  }

  return bar;
}

function cardThumb(): HTMLElement {
  const thumb = h('div', 'ap-card-thumb');
  thumb.innerHTML = HATCH_DIV;
  return thumb;
}

function simCard(opts: {
  title: string;
  date: string;
  category: string;
  badge?: string;
  badgeCls?: string;
  statusPill?: string;
  statusCls?: string;
  actions: Array<{ label: string; cls: string; dataset?: Record<string, string> }>;
  draftId?: string;
}): HTMLElement {
  const card = h('div', 'ap-sim-card');
  if (opts.draftId) card.dataset.draftId = opts.draftId;

  card.appendChild(cardThumb());

  const body = h('div', 'ap-card-body');
  const meta = h('div', 'ap-card-meta');
  if (opts.category) {
    const badge = h('span', 'ap-badge ap-badge-cat');
    badge.textContent = opts.category;
    meta.appendChild(badge);
  }
  if (opts.badge) {
    const b2 = h('span', `ap-badge ${opts.badgeCls || 'ap-badge-draft'}`);
    b2.textContent = opts.badge;
    meta.appendChild(b2);
  }
  if (opts.statusPill) {
    const pill = h('span', `ap-status-pill ap-status-pill-sm ${opts.statusCls || ''}`);
    pill.textContent = opts.statusPill;
    meta.appendChild(pill);
  }
  body.appendChild(meta);

  const title = h('div', 'ap-card-title');
  title.textContent = opts.title;
  body.appendChild(title);

  const date = h('div', 'ap-card-date');
  date.innerHTML = opts.date;
  body.appendChild(date);

  card.appendChild(body);

  const actions = h('div', 'ap-card-actions');
  for (const a of opts.actions) {
    const b = document.createElement('button');
    b.className = `ap-btn ${a.cls}`;
    b.textContent = a.label;
    if (a.dataset) {
      for (const [k, v] of Object.entries(a.dataset)) {
        b.dataset[k] = v;
      }
    }
    actions.appendChild(b);
  }
  card.appendChild(actions);

  return card;
}

function planCard(title: string, date: string): HTMLElement {
  const card = h('div', 'ap-plan-card');

  const iconArea = h('div', 'ap-plan-icon-area');
  const icon = h('div', 'ap-plan-icon');
  icon.innerHTML = CHAT_AI_SVG;
  iconArea.appendChild(icon);
  card.appendChild(iconArea);

  const body = h('div', 'ap-card-body');
  const meta = h('div', 'ap-card-meta');
  const badge = h('span', 'ap-badge ap-badge-plan');
  badge.textContent = 'Plan mode';
  meta.appendChild(badge);
  body.appendChild(meta);

  const titleEl = h('div', 'ap-card-title');
  titleEl.textContent = title;
  body.appendChild(titleEl);

  const dateEl = h('div', 'ap-card-date');
  dateEl.textContent = date;
  body.appendChild(dateEl);

  card.appendChild(body);

  const acts = h('div', 'ap-card-actions');
  acts.appendChild(btn('Continue', 'ap-btn-secondary ap-btn-sm'));
  card.appendChild(acts);

  return card;
}

function viewToggle(): HTMLElement {
  const toggle = h('div', 'ap-view-toggle');
  toggle.dataset.viewToggle = '';
  const gridBtn = h('button', 'ap-view-btn active');
  gridBtn.innerHTML = GRID_SVG;
  gridBtn.dataset.view = 'grid';
  gridBtn.title = 'Grid view';
  const listBtn = h('button', 'ap-view-btn');
  listBtn.innerHTML = LIST_SVG;
  listBtn.dataset.view = 'list';
  listBtn.title = 'List view';
  toggle.appendChild(gridBtn);
  toggle.appendChild(listBtn);
  return toggle;
}

function navParent(label: string, id: string): { parent: HTMLElement; children: HTMLElement } {
  const parent = h('div', 'ap-nav-parent');
  parent.id = id + '-parent';
  parent.innerHTML = `<span class="ap-nav-parent-label">${label}</span>${CHEVRON_SVG}`;
  const children = h('div', 'ap-nav-children');
  children.id = id + '-children';
  return { parent, children };
}

function navSubItem(label: string): HTMLElement {
  const item = h('div', 'ap-nav-sub-item');
  item.textContent = label;
  return item;
}

function memberRow(initials: string, name: string): HTMLElement {
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;gap:9px';
  const av = h('div', 'ap-member-avatar');
  av.textContent = initials;
  const strong = document.createElement('strong');
  strong.textContent = name;
  row.appendChild(av);
  row.appendChild(strong);
  return row;
}

function activeStatusDot(): string {
  return `<span style="display:inline-flex;align-items:center;gap:5px;background:#d1fae5;color:#065f46;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px"><span style="width:7px;height:7px;border-radius:50%;background:#34d399;display:inline-block"></span>ACTIVE</span>`;
}

// ─── Main factory ─────────────────────────────────────────────────────────────

export function createAdminPage({ userInitial = 'JD' }: AdminPageOptions = {}): HTMLElement {
  const root = h('div', 'ap-root');

  // ═══ SIDEBAR ═══════════════════════════════════════════════════════════════
  const sidebar = h('aside', 'ap-sidebar');

  // Logo
  const logo = h('div', 'ap-sidebar-logo');
  logo.innerHTML = LOGO_SVG;
  const logoText = h('span', 'ap-sidebar-logo-text');
  logoText.textContent = 'Mizou';
  logo.appendChild(logoText);
  sidebar.appendChild(logo);

  // Nav
  const nav = document.createElement('nav');

  // Create button
  const createBtn = document.createElement('button');
  createBtn.className = 'ap-create-btn';
  createBtn.innerHTML = `${PLUS_SVG} Create`;
  nav.appendChild(createBtn);

  // My Drafts
  const draftsItem = h('div', 'ap-nav-item active');
  draftsItem.textContent = 'My Drafts';
  draftsItem.dataset.page = 'drafts';
  nav.appendChild(draftsItem);

  // Collections
  const col = navParent('Collections', 'col');
  col.parent.classList.add('ap-nav-parent');
  const colCreations = navSubItem('My Creations');
  colCreations.dataset.colTab = 'creations';
  const colLibrary = navSubItem('Shared Library');
  colLibrary.dataset.colTab = 'library';
  const colTemplates = navSubItem('Templates');
  colTemplates.dataset.colTab = 'templates';
  col.children.appendChild(colCreations);
  col.children.appendChild(colLibrary);
  col.children.appendChild(colTemplates);
  nav.appendChild(col.parent);
  nav.appendChild(col.children);

  // Learning Hub
  const hub = navParent('Learning Hub', 'hub');
  const hubAssigned = navSubItem('My Assigned Simulations');
  hubAssigned.dataset.hubTab = 'assigned';
  const hubSessions = navSubItem('My Sessions');
  hubSessions.dataset.hubTab = 'sessions';
  hub.children.appendChild(hubAssigned);
  hub.children.appendChild(hubSessions);
  nav.appendChild(hub.parent);
  nav.appendChild(hub.children);

  // Teams section
  nav.appendChild(h('div', 'ap-nav-divider'));
  nav.appendChild(h('div', 'ap-nav-section', 'Teams'));

  const teams = [
    { id: 'sales', label: 'Sales Team', initial: 'S' },
    { id: 'marketing', label: 'Marketing Team', initial: 'M' },
    { id: 'product', label: 'Product &mdash; Internal', initial: 'P' },
  ];

  for (const team of teams) {
    const par = h('div', 'ap-nav-parent team-parent');
    par.id = `team-parent-${team.id}`;
    par.dataset.team = team.id;
    par.innerHTML = `<span class="ap-nav-parent-label"><span class="ap-team-badge">${team.initial}</span>${team.label}</span>${CHEVRON_SVG}`;
    nav.appendChild(par);

    const chi = h('div', 'ap-nav-children');
    chi.id = `team-children-${team.id}`;
    for (const [tabId, tabLabel] of [
      ['assigned', 'Assigned Simulations'],
      ['sessions', 'Sessions'],
      ['members', 'Members'],
      ['settings', 'Settings'],
    ]) {
      const sub = navSubItem(tabLabel);
      sub.dataset.teamTab = tabId;
      sub.dataset.team = team.id;
      chi.appendChild(sub);
    }
    nav.appendChild(chi);
  }

  sidebar.appendChild(nav);
  root.appendChild(sidebar);

  // ═══ MAIN ══════════════════════════════════════════════════════════════════
  const main = h('div', 'ap-main');

  // Topbar
  const topbar = h('div', 'ap-topbar');
  const avatar = h('div', 'ap-avatar');
  avatar.textContent = userInitial;
  topbar.appendChild(avatar);
  main.appendChild(topbar);

  // ── PAGE: My Drafts ────────────────────────────────────────────────────────
  const pageDrafts = h('div', 'ap-page active');
  pageDrafts.id = 'page-drafts';

  const draftsHeader = h('div', 'ap-page-header');
  const draftsTitle = h('h1', 'ap-page-title');
  draftsTitle.textContent = 'My Drafts';
  draftsHeader.appendChild(draftsTitle);
  pageDrafts.appendChild(draftsHeader);

  const draftsFilterBar = h('div', 'ap-filter-bar');
  const draftsSearchWrap = h('div', 'ap-search-wrap');
  draftsSearchWrap.innerHTML = SEARCH_SVG;
  const draftsSearch = document.createElement('input');
  draftsSearch.className = 'ap-search-input';
  draftsSearch.type = 'text';
  draftsSearch.placeholder = 'Search drafts…';
  draftsSearchWrap.appendChild(draftsSearch);
  draftsFilterBar.appendChild(draftsSearchWrap);

  for (const [dflt, ...opts] of [
    ['All categories', 'Sales', 'Customer Support', 'Management'],
    ['All dates', 'This week', 'This month'],
  ]) {
    const sel = document.createElement('select');
    sel.className = 'ap-filter-select';
    [dflt, ...opts].forEach(o => {
      const opt = document.createElement('option');
      opt.textContent = o;
      sel.appendChild(opt);
    });
    draftsFilterBar.appendChild(sel);
  }
  draftsFilterBar.appendChild(viewToggle());
  pageDrafts.appendChild(draftsFilterBar);

  const draftsGrid = h('div', 'ap-card-grid');
  draftsGrid.id = 'drafts-grid';

  draftsGrid.appendChild(planCard('Sales Pitch Planning Session', 'Created May 8, 2026'));
  draftsGrid.appendChild(planCard('New Employee Onboarding Scenario', 'Created May 5, 2026'));

  const draftData = [
    { id: 'd1', title: 'Handling Objections in a Product Demo', cat: 'Sales', date: 'May 7, 2026' },
    { id: 'd2', title: 'De-escalating an Angry Customer', cat: 'Customer Support', date: 'May 3, 2026' },
    { id: 'd3', title: 'Giving Constructive Feedback to a Direct Report', cat: 'Management', date: 'Apr 28, 2026' },
  ];

  for (const d of draftData) {
    draftsGrid.appendChild(simCard({
      title: d.title, date: d.date, category: d.cat,
      badge: 'Draft', badgeCls: 'ap-badge-draft',
      draftId: d.id,
      actions: [
        { label: 'Edit', cls: 'ap-btn-secondary ap-btn-sm' },
        { label: 'Publish', cls: 'ap-btn-primary ap-btn-sm publish-btn', dataset: { draftId: d.id, title: d.title, cat: d.cat } },
      ],
    }));
  }
  pageDrafts.appendChild(draftsGrid);

  const draftsEmpty = h('div', 'ap-empty-state');
  draftsEmpty.id = 'drafts-empty';
  draftsEmpty.innerHTML = `${FILE_SVG}<div class="ap-empty-state-title">No drafts yet</div><div class="ap-empty-state-desc">Simulations you're working on will appear here before you publish them.</div>`;
  pageDrafts.appendChild(draftsEmpty);

  main.appendChild(pageDrafts);

  // ── PAGE: Simulation Teams ─────────────────────────────────────────────────
  const pageSimTeams = h('div', 'ap-page');
  pageSimTeams.id = 'page-sim-teams';

  // Sim header bar
  const simHeader = h('div', 'ap-sim-header');
  const simBackBtn = document.createElement('button');
  simBackBtn.className = 'ap-sim-back-btn';
  simBackBtn.id = 'sim-teams-back';
  simBackBtn.innerHTML = BACK_SVG;
  simHeader.appendChild(simBackBtn);

  const simThumb = h('div', 'ap-sim-thumb');
  simThumb.innerHTML = HATCH_DIV;
  simHeader.appendChild(simThumb);

  const simInfo = h('div', '');
  simInfo.style.cssText = 'flex:1;min-width:0';
  simInfo.innerHTML = `<div class="ap-sim-badge-row">${SIM_SVG}<span class="ap-sim-type-label">Simulation</span></div>`;
  const simTitleEl = h('div', '');
  simTitleEl.id = 'sim-teams-title';
  simTitleEl.style.cssText = 'font-size:15px;font-weight:700;color:var(--primitive-slate-12);white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
  simTitleEl.textContent = 'Planning for Brief';
  simInfo.appendChild(simTitleEl);
  simHeader.appendChild(simInfo);

  const simHeaderActions = h('div', '');
  simHeaderActions.style.cssText = 'display:flex;gap:8px;flex-shrink:0';
  const pauseBtn = btn('Pause', 'ap-btn-secondary ap-btn-sm');
  const endBtn = btn('End', 'ap-btn-secondary ap-btn-sm');
  simHeaderActions.appendChild(pauseBtn);
  simHeaderActions.appendChild(endBtn);
  simHeader.appendChild(simHeaderActions);

  pageSimTeams.appendChild(simHeader);

  // Teams list heading
  const simTeamsHeading = h('div', '');
  simTeamsHeading.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:18px';
  const simTeamsH2 = h('h2', '');
  simTeamsH2.style.cssText = 'font-size:16px;font-weight:700;color:var(--primitive-slate-12)';
  simTeamsH2.textContent = 'Teams assigned to this simulation';
  const shareAssignBtn = btn('Share or assign', 'ap-btn-indigo share-trigger');
  simTeamsHeading.appendChild(simTeamsH2);
  simTeamsHeading.appendChild(shareAssignBtn);
  pageSimTeams.appendChild(simTeamsHeading);

  const simTeamsList = h('div', '');
  simTeamsList.style.cssText = 'display:flex;flex-direction:column;gap:10px';

  for (const [teamName, members, teamId] of [
    ['Sales Team', '16', 'sales'],
    ['Marketing Team', '8', 'marketing'],
  ]) {
    const row = h('div', 'ap-sim-team-row');
    const nameEl = h('div', '');
    nameEl.style.cssText = 'flex:1;font-size:14px;font-weight:600;color:var(--primitive-slate-12)';
    nameEl.textContent = teamName as string;
    row.appendChild(nameEl);

    for (const [statLabel, statVal] of [['Members', members as string], ['Created on', 'May 5, 2026']]) {
      const stat = h('div', 'ap-sim-stat');
      const l = h('div', 'ap-sim-stat-label'); l.textContent = statLabel as string;
      const v = h('div', 'ap-sim-stat-val'); v.textContent = statVal as string;
      stat.appendChild(l); stat.appendChild(v);
      row.appendChild(stat);
    }

    const statusStat = h('div', 'ap-sim-stat');
    const statusL = h('div', 'ap-sim-stat-label'); statusL.textContent = 'Status';
    const statusV = h('div', ''); statusV.innerHTML = activeStatusDot();
    statusStat.appendChild(statusL); statusStat.appendChild(statusV);
    row.appendChild(statusStat);

    const vsBtn = btn('View sessions', 'ap-btn-secondary ap-btn-sm view-team-sessions');
    (vsBtn as HTMLButtonElement).dataset.team = teamId as string;
    row.appendChild(vsBtn);
    simTeamsList.appendChild(row);
  }
  pageSimTeams.appendChild(simTeamsList);
  main.appendChild(pageSimTeams);

  // ── PAGE: Collections ──────────────────────────────────────────────────────
  const pageCollections = h('div', 'ap-page');
  pageCollections.id = 'page-collections';

  const colHeader = h('div', 'ap-page-header');
  const colTitle = h('h1', 'ap-page-title');
  colTitle.textContent = 'Collections';
  colHeader.appendChild(colTitle);
  pageCollections.appendChild(colHeader);

  const colTabs = h('div', 'ap-page-tabs');
  for (const [tabId, label] of [['creations', 'My Creations'], ['library', 'Shared Library'], ['templates', 'Templates']]) {
    const tab = h('div', `ap-page-tab${tabId === 'creations' ? ' active' : ''}`);
    tab.textContent = label as string;
    tab.dataset.colTab = tabId as string;
    colTabs.appendChild(tab);
  }
  pageCollections.appendChild(colTabs);

  // My Creations panel
  const panelCreations = h('div', '');
  panelCreations.id = 'col-panel-creations';
  const creationsFilterBar = h('div', 'ap-filter-bar');
  const cSearch = h('div', 'ap-search-wrap');
  cSearch.innerHTML = SEARCH_SVG;
  const cSearchInp = document.createElement('input');
  cSearchInp.className = 'ap-search-input';
  cSearchInp.placeholder = 'Search simulations…';
  cSearch.appendChild(cSearchInp);
  creationsFilterBar.appendChild(cSearch);
  for (const [dflt, ...opts] of [
    ['All categories', 'Sales', 'Customer Support', 'Management', 'Recruitment'],
    ['All status', 'Published', 'Archived'],
  ]) {
    const sel = document.createElement('select');
    sel.className = 'ap-filter-select';
    [dflt, ...opts].forEach(o => { const op = document.createElement('option'); op.textContent = o; sel.appendChild(op); });
    creationsFilterBar.appendChild(sel);
  }
  creationsFilterBar.appendChild(viewToggle());
  panelCreations.appendChild(creationsFilterBar);

  const creationsGrid = h('div', 'ap-card-grid');
  creationsGrid.id = 'creations-grid';
  const creationData = [
    { title: 'Planning for Brief', cat: 'Sales', date: 'Apr 20, 2026' },
    { title: 'Training Effective Communication and Problem Resolution', cat: 'Customer Support', date: 'Apr 15, 2026' },
    { title: 'Disciplinary Talk with a GO Over Inappropriate Remarks at the Marrakesh Village', cat: 'Management', date: 'Apr 10, 2026' },
    { title: 'Final Interview for Culture Fit', cat: 'Recruitment', date: 'Apr 5, 2026' },
    { title: 'Addressing Tax Concerns to Close a Real Estate Deal', cat: 'Customer Support', date: 'Mar 28, 2026' },
    { title: 'Upselling Premium Services to an Existing Client', cat: 'Sales', date: 'Mar 21, 2026' },
  ];
  for (const d of creationData) {
    creationsGrid.appendChild(simCard({
      title: d.title, date: d.date, category: d.cat,
      actions: [
        { label: 'Share', cls: 'ap-btn-secondary ap-btn-sm share-trigger' },
        { label: 'View Teams', cls: 'ap-btn-secondary ap-btn-sm view-teams-btn' },
      ],
    }));
  }
  panelCreations.appendChild(creationsGrid);
  pageCollections.appendChild(panelCreations);

  // Shared Library panel
  const panelLibrary = h('div', '');
  panelLibrary.id = 'col-panel-library';
  panelLibrary.style.display = 'none';
  const libFilterBar = h('div', 'ap-filter-bar');
  const lSearch = h('div', 'ap-search-wrap');
  lSearch.innerHTML = SEARCH_SVG;
  const lSearchInp = document.createElement('input');
  lSearchInp.className = 'ap-search-input';
  lSearchInp.placeholder = 'Search library…';
  lSearch.appendChild(lSearchInp);
  libFilterBar.appendChild(lSearch);
  const lSel = document.createElement('select');
  lSel.className = 'ap-filter-select';
  ['All categories', 'Sales', 'Customer Support', 'Management'].forEach(o => { const op = document.createElement('option'); op.textContent = o; lSel.appendChild(op); });
  libFilterBar.appendChild(lSel);
  libFilterBar.appendChild(viewToggle());
  panelLibrary.appendChild(libFilterBar);

  const libraryGrid = h('div', 'ap-card-grid');
  const libraryData = [
    { title: 'Planning for Brief', cat: 'Sales', date: 'Apr 20, 2026' },
    { title: 'Training Effective Communication and Problem Resolution', cat: 'Customer Support', date: 'Apr 15, 2026' },
    { title: 'Disciplinary Talk with a GO Over Inappropriate Remarks at the Marrakesh Village', cat: 'Management', date: 'Apr 10, 2026' },
    { title: 'Final Interview for Culture Fit', cat: 'Recruitment', date: 'Apr 5, 2026' },
    { title: 'Aiding and Explaining Airline Fare Rules to a Distraught Passenger', cat: 'Customer Support', date: 'Mar 28, 2026' },
    { title: 'Customer Support for Service Skills Training', cat: 'Customer Support', date: 'Mar 21, 2026' },
  ];
  for (const d of libraryData) {
    libraryGrid.appendChild(simCard({
      title: d.title, date: d.date, category: d.cat,
      actions: [
        { label: 'Share', cls: 'ap-btn-secondary ap-btn-sm share-trigger' },
        { label: 'View Teams', cls: 'ap-btn-secondary ap-btn-sm view-teams-btn' },
      ],
    }));
  }
  panelLibrary.appendChild(libraryGrid);
  pageCollections.appendChild(panelLibrary);

  // Templates panel
  const panelTemplates = h('div', '');
  panelTemplates.id = 'col-panel-templates';
  panelTemplates.style.display = 'none';
  const tFilterBar = h('div', 'ap-filter-bar');
  const tSearch = h('div', 'ap-search-wrap');
  tSearch.innerHTML = SEARCH_SVG;
  const tSearchInp = document.createElement('input');
  tSearchInp.className = 'ap-search-input';
  tSearchInp.placeholder = 'Search templates…';
  tSearch.appendChild(tSearchInp);
  tFilterBar.appendChild(tSearch);
  const tSel = document.createElement('select');
  tSel.className = 'ap-filter-select';
  const tOp = document.createElement('option');
  tOp.textContent = 'All categories';
  tSel.appendChild(tOp);
  tFilterBar.appendChild(tSel);
  tFilterBar.appendChild(viewToggle());
  panelTemplates.appendChild(tFilterBar);

  const templatesGrid = h('div', 'ap-card-grid');
  for (let i = 0; i < 8; i++) {
    const card = h('div', 'ap-tmpl-card');
    card.innerHTML = `${TMPL_SVG}Template`;
    templatesGrid.appendChild(card);
  }
  panelTemplates.appendChild(templatesGrid);
  pageCollections.appendChild(panelTemplates);

  main.appendChild(pageCollections);

  // ── PAGE: Team ─────────────────────────────────────────────────────────────
  const pageTeam = h('div', 'ap-page');
  pageTeam.id = 'page-team';

  const teamPageHeader = h('div', 'ap-page-header');
  const teamPageTitle = h('h1', 'ap-page-title');
  teamPageTitle.id = 'team-page-title';
  teamPageTitle.textContent = 'Sales Team';
  teamPageHeader.appendChild(teamPageTitle);
  pageTeam.appendChild(teamPageHeader);

  const teamTabs = h('div', 'ap-page-tabs');
  for (const [tabId, label] of [
    ['assigned', 'Assigned Simulations'],
    ['sessions', 'Sessions'],
    ['members', 'Members'],
    ['settings', 'Settings'],
  ]) {
    const tab = h('div', `ap-page-tab${tabId === 'assigned' ? ' active' : ''}`);
    tab.textContent = label as string;
    tab.dataset.teamTab = tabId as string;
    teamTabs.appendChild(tab);
  }
  pageTeam.appendChild(teamTabs);

  // Team: Assigned Simulations
  const teamPanelAssigned = h('div', '');
  teamPanelAssigned.id = 'team-panel-assigned';
  const taFilterBar = h('div', 'ap-filter-bar');
  const taSearch = h('div', 'ap-search-wrap');
  taSearch.innerHTML = SEARCH_SVG;
  const taSearchInp = document.createElement('input');
  taSearchInp.className = 'ap-search-input';
  taSearchInp.placeholder = 'Search simulations…';
  taSearch.appendChild(taSearchInp);
  taFilterBar.appendChild(taSearch);
  const taStatusSel = document.createElement('select');
  taStatusSel.className = 'ap-filter-select';
  ['All status', 'Active', 'Completed'].forEach(o => { const op = document.createElement('option'); op.textContent = o; taStatusSel.appendChild(op); });
  taFilterBar.appendChild(taStatusSel);
  taFilterBar.appendChild(viewToggle());
  teamPanelAssigned.appendChild(taFilterBar);

  const teamAssignedGrid = h('div', 'ap-card-grid');
  const teamAssignedData = [
    { title: 'Planning for Brief', cat: 'Sales', status: 'Active', statusCls: 'ap-s-in-progress', date: '6 / 8 completed &middot; Avg score: 82' },
    { title: 'Training Effective Communication', cat: 'Customer Support', status: 'Completed', statusCls: 'ap-s-completed', date: '8 / 8 completed &middot; Avg score: 77' },
    { title: 'Disciplinary Talk with a GO Over Inappropriate Remarks', cat: 'Management', status: 'Active', statusCls: 'ap-s-in-progress', date: '3 / 8 completed &middot; Avg score: 71' },
    { title: 'Final Interview for Culture Fit', cat: 'Recruitment', status: 'Completed', statusCls: 'ap-s-completed', date: '8 / 8 completed &middot; Avg score: 88' },
  ];
  for (const d of teamAssignedData) {
    teamAssignedGrid.appendChild(simCard({
      title: d.title, date: d.date, category: d.cat,
      statusPill: d.status, statusCls: d.statusCls,
      actions: [{ label: 'View sessions', cls: 'ap-btn-secondary ap-btn-sm team-sim-sessions-btn' }],
    }));
  }
  teamPanelAssigned.appendChild(teamAssignedGrid);
  pageTeam.appendChild(teamPanelAssigned);

  // Team: Sessions
  const teamPanelSessions = h('div', '');
  teamPanelSessions.id = 'team-panel-sessions';
  teamPanelSessions.style.display = 'none';
  const tsFilterBar = h('div', 'ap-filter-bar');
  for (const placeholder of ['Members', 'Simulations', 'Score', 'Status']) {
    const sel = document.createElement('select');
    sel.className = 'ap-filter-select';
    const opt = document.createElement('option');
    opt.textContent = placeholder;
    sel.appendChild(opt);
    tsFilterBar.appendChild(sel);
  }
  teamPanelSessions.appendChild(tsFilterBar);

  const sessionsTable = document.createElement('table');
  sessionsTable.className = 'ap-table';
  sessionsTable.innerHTML = `
    <thead><tr><th>Learner</th><th>Simulation</th><th>Score</th><th>Duration</th><th>Submitted</th><th>Status</th></tr></thead>
    <tbody>
      <tr>
        <td></td>
        <td><span class="ap-secondary">Managing Guest Tensions&hellip;</span></td>
        <td>&mdash;</td>
        <td><span class="ap-secondary">03:24</span></td>
        <td><span class="ap-secondary">&mdash;</span></td>
        <td><span class="ap-status-pill ap-s-in-progress">Ongoing</span></td>
      </tr>
      <tr>
        <td></td>
        <td><span class="ap-secondary">Guiding a Client Through&hellip;</span></td>
        <td>&mdash;</td>
        <td><span class="ap-secondary">03:24</span></td>
        <td><span class="ap-secondary">&mdash;</span></td>
        <td><span class="ap-status-pill ap-s-in-progress">Ongoing</span></td>
      </tr>
      <tr>
        <td></td>
        <td><span class="ap-secondary">Aiding And Explaining Airline Fare Rules&hellip;</span></td>
        <td><span class="ap-score-chip">89</span></td>
        <td><span class="ap-secondary">06:45</span></td>
        <td><span class="ap-secondary">May 8 @ 14:08</span></td>
        <td><span class="ap-status-pill ap-s-completed">Completed</span></td>
      </tr>
      <tr>
        <td></td>
        <td><span class="ap-secondary">Managing Guest Tensions&hellip;</span></td>
        <td><span class="ap-score-chip">55</span></td>
        <td><span class="ap-secondary">05:16</span></td>
        <td><span class="ap-secondary">May 7 @ 14:08</span></td>
        <td><span class="ap-status-pill ap-s-completed">Completed</span></td>
      </tr>
      <tr>
        <td></td>
        <td><span class="ap-secondary">Customer Support For Service Skills&hellip;</span></td>
        <td><span class="ap-score-chip">75</span></td>
        <td><span class="ap-secondary">04:23</span></td>
        <td><span class="ap-secondary">May 6 @ 10:15</span></td>
        <td><span class="ap-status-pill ap-s-completed">Completed</span></td>
      </tr>
    </tbody>`;
  // Fill in member cells
  const sessionRows: Array<[string, string]> = [
    ['AS', 'Anthony Smith'], ['PM', 'Paula Macata'], ['ML', 'Martin Lee'],
    ['TQ', 'Tom Quintilani'], ['RT', 'Rina Tan'],
  ];
  const sessionTds = sessionsTable.querySelectorAll('tbody tr td:first-child');
  sessionTds.forEach((td, i) => { td.appendChild(memberRow(sessionRows[i][0], sessionRows[i][1])); });
  teamPanelSessions.appendChild(sessionsTable);
  pageTeam.appendChild(teamPanelSessions);

  // Team: Members
  const teamPanelMembers = h('div', '');
  teamPanelMembers.id = 'team-panel-members';
  teamPanelMembers.style.display = 'none';
  const tmFilterBar = h('div', 'ap-filter-bar');
  const tmSearch = h('div', 'ap-search-wrap');
  tmSearch.innerHTML = SEARCH_SVG;
  const tmSearchInp = document.createElement('input');
  tmSearchInp.className = 'ap-search-input';
  tmSearchInp.placeholder = 'Search members…';
  tmSearch.appendChild(tmSearchInp);
  tmFilterBar.appendChild(tmSearch);
  const tmRoleSel = document.createElement('select');
  tmRoleSel.className = 'ap-filter-select';
  ['All roles', 'Admin', 'Member'].forEach(o => { const op = document.createElement('option'); op.textContent = o; tmRoleSel.appendChild(op); });
  tmFilterBar.appendChild(tmRoleSel);
  const addMemberBtn = btn('+ Add member', 'ap-btn-secondary ap-btn-sm');
  addMemberBtn.style.marginLeft = 'auto';
  tmFilterBar.appendChild(addMemberBtn);
  teamPanelMembers.appendChild(tmFilterBar);

  const membersTable = document.createElement('table');
  membersTable.className = 'ap-table';
  membersTable.innerHTML = `
    <thead><tr><th>Member</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr></thead>
    <tbody>
      <tr>
        <td></td>
        <td><span class="ap-secondary">a.smith@acme.com</span></td>
        <td><span class="ap-badge ap-badge-cat">Admin</span></td>
        <td><span class="ap-secondary">Jan 10, 2026</span></td>
        <td><button class="ap-btn ap-btn-secondary ap-btn-sm">Remove</button></td>
      </tr>
      <tr>
        <td></td>
        <td><span class="ap-secondary">p.macata@acme.com</span></td>
        <td><span class="ap-badge ap-badge-cat">Member</span></td>
        <td><span class="ap-secondary">Jan 15, 2026</span></td>
        <td><button class="ap-btn ap-btn-secondary ap-btn-sm">Remove</button></td>
      </tr>
      <tr>
        <td></td>
        <td><span class="ap-secondary">m.lee@acme.com</span></td>
        <td><span class="ap-badge ap-badge-cat">Member</span></td>
        <td><span class="ap-secondary">Feb 3, 2026</span></td>
        <td><button class="ap-btn ap-btn-secondary ap-btn-sm">Remove</button></td>
      </tr>
      <tr>
        <td></td>
        <td><span class="ap-secondary">t.quintilani@acme.com</span></td>
        <td><span class="ap-badge ap-badge-cat">Member</span></td>
        <td><span class="ap-secondary">Feb 3, 2026</span></td>
        <td><button class="ap-btn ap-btn-secondary ap-btn-sm">Remove</button></td>
      </tr>
    </tbody>`;
  const memberRowData: Array<[string, string]> = [
    ['AS', 'Anthony Smith'], ['PM', 'Paula Macata'], ['ML', 'Martin Lee'], ['TQ', 'Tom Quintilani'],
  ];
  const memberTds = membersTable.querySelectorAll('tbody tr td:first-child');
  memberTds.forEach((td, i) => { td.appendChild(memberRow(memberRowData[i][0], memberRowData[i][1])); });
  teamPanelMembers.appendChild(membersTable);
  pageTeam.appendChild(teamPanelMembers);

  // Team: Settings
  const teamPanelSettings = h('div', '');
  teamPanelSettings.id = 'team-panel-settings';
  teamPanelSettings.style.display = 'none';
  teamPanelSettings.innerHTML = `
    <div style="max-width:520px;display:flex;flex-direction:column;gap:18px;margin-top:4px">
      <div>
        <div class="ap-field-label">Team name</div>
        <input class="ap-text-input" type="text" id="team-settings-name" value="Sales Team" style="max-width:340px"/>
      </div>
      <div>
        <div class="ap-field-label">Description</div>
        <textarea class="ap-text-input" rows="3" style="max-width:340px;resize:vertical" placeholder="Describe this team…"></textarea>
      </div>
      <div style="padding-top:8px;border-top:1px solid var(--primitive-slate-4);display:flex;gap:8px">
        <button class="ap-btn ap-btn-primary ap-btn-sm">Save changes</button>
        <button class="ap-btn ap-btn-secondary ap-btn-sm" style="color:var(--primitive-slate-9);border-color:var(--primitive-slate-4)">Delete team</button>
      </div>
    </div>`;
  pageTeam.appendChild(teamPanelSettings);

  main.appendChild(pageTeam);

  // ── PAGE: Learning Hub ─────────────────────────────────────────────────────
  const pageHub = h('div', 'ap-page');
  pageHub.id = 'page-hub';

  const hubHeader = h('div', 'ap-page-header');
  const hubTitle = h('h1', 'ap-page-title');
  hubTitle.textContent = 'Learning Hub';
  hubHeader.appendChild(hubTitle);
  pageHub.appendChild(hubHeader);

  const hubPageTabs = h('div', 'ap-page-tabs');
  for (const [tabId, label] of [['assigned', 'My Assigned Simulations'], ['sessions', 'My Sessions']]) {
    const tab = h('div', `ap-page-tab${tabId === 'assigned' ? ' active' : ''}`);
    tab.textContent = label as string;
    tab.dataset.hubTab = tabId as string;
    hubPageTabs.appendChild(tab);
  }
  pageHub.appendChild(hubPageTabs);

  // Hub: My Assigned Simulations
  const hubPanelAssigned = h('div', '');
  hubPanelAssigned.id = 'hub-panel-assigned';
  const haFilterBar = h('div', 'ap-filter-bar');
  const haSearch = h('div', 'ap-search-wrap');
  haSearch.innerHTML = SEARCH_SVG;
  const haSearchInp = document.createElement('input');
  haSearchInp.className = 'ap-search-input';
  haSearchInp.placeholder = 'Search simulations…';
  haSearch.appendChild(haSearchInp);
  haFilterBar.appendChild(haSearch);
  const haStatusSel = document.createElement('select');
  haStatusSel.className = 'ap-filter-select';
  ['All status', 'Not started', 'In progress', 'Completed'].forEach(o => { const op = document.createElement('option'); op.textContent = o; haStatusSel.appendChild(op); });
  haFilterBar.appendChild(haStatusSel);
  haFilterBar.appendChild(viewToggle());
  hubPanelAssigned.appendChild(haFilterBar);

  const hubAssignedGrid = h('div', 'ap-card-grid');
  const hubAssignedData = [
    { title: 'Planning for Brief', cat: 'Sales', status: 'In progress', statusCls: 'ap-s-in-progress', date: 'Due May 20 &middot; Sarah Mitchell', action: { label: 'Continue', cls: 'ap-btn-primary ap-btn-sm' } },
    { title: 'Handling Objections in a Product Demo', cat: 'Sales', status: 'Not started', statusCls: 'ap-s-not-started', date: 'Due May 22 &middot; Sarah Mitchell', action: { label: 'Start', cls: 'ap-btn-primary ap-btn-sm' } },
    { title: 'Training Effective Communication', cat: 'Customer Support', status: 'Completed', statusCls: 'ap-s-completed', date: 'Due May 15 &middot; James Okafor', action: { label: 'Review', cls: 'ap-btn-secondary ap-btn-sm' } },
    { title: 'De-escalating an Angry Customer', cat: 'Customer Support', status: 'Not started', statusCls: 'ap-s-not-started', date: 'Due Jun 1 &middot; James Okafor', action: { label: 'Start', cls: 'ap-btn-primary ap-btn-sm' } },
    { title: 'Final Interview for Culture Fit', cat: 'Recruitment', status: 'In progress', statusCls: 'ap-s-in-progress', date: 'Due May 30 &middot; Priya Nair', action: { label: 'Continue', cls: 'ap-btn-primary ap-btn-sm' } },
  ];
  for (const d of hubAssignedData) {
    hubAssignedGrid.appendChild(simCard({
      title: d.title, date: d.date, category: d.cat,
      statusPill: d.status, statusCls: d.statusCls,
      actions: [d.action],
    }));
  }
  hubPanelAssigned.appendChild(hubAssignedGrid);
  pageHub.appendChild(hubPanelAssigned);

  // Hub: My Sessions
  const hubPanelSessions = h('div', '');
  hubPanelSessions.id = 'hub-panel-sessions';
  hubPanelSessions.style.display = 'none';
  const hsFilterBar = h('div', 'ap-filter-bar');
  const hsSearch = h('div', 'ap-search-wrap');
  hsSearch.innerHTML = SEARCH_SVG;
  const hsSearchInp = document.createElement('input');
  hsSearchInp.className = 'ap-search-input';
  hsSearchInp.placeholder = 'Search sessions…';
  hsSearch.appendChild(hsSearchInp);
  hsFilterBar.appendChild(hsSearch);
  const hsStart = document.createElement('input');
  hsStart.className = 'ap-filter-select';
  hsStart.type = 'text';
  hsStart.placeholder = 'Start date';
  hsStart.style.maxWidth = '130px';
  const hsEnd = document.createElement('input');
  hsEnd.className = 'ap-filter-select';
  hsEnd.type = 'text';
  hsEnd.placeholder = 'End date';
  hsEnd.style.maxWidth = '130px';
  hsFilterBar.appendChild(hsStart);
  hsFilterBar.appendChild(hsEnd);
  hubPanelSessions.appendChild(hsFilterBar);

  const sessionsHubTable = document.createElement('table');
  sessionsHubTable.className = 'ap-table';
  sessionsHubTable.innerHTML = `
    <thead><tr><th>Simulation</th><th>Date</th><th>Score</th><th>Duration</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td><strong>Training Effective Communication</strong></td><td><span class="ap-secondary">May 8, 2026</span></td><td><strong>88</strong><span class="ap-secondary"> / 100</span></td><td><span class="ap-secondary">12:45</span></td><td><span class="ap-status-pill ap-s-completed">Completed</span></td></tr>
      <tr><td><strong>Planning for Brief</strong></td><td><span class="ap-secondary">May 5, 2026</span></td><td><strong>74</strong><span class="ap-secondary"> / 100</span></td><td><span class="ap-secondary">08:14</span></td><td><span class="ap-status-pill ap-s-in-progress">In progress</span></td></tr>
      <tr><td><strong>Handling Objections in a Product Demo</strong></td><td><span class="ap-secondary">Apr 30, 2026</span></td><td><strong>91</strong><span class="ap-secondary"> / 100</span></td><td><span class="ap-secondary">15:32</span></td><td><span class="ap-status-pill ap-s-completed">Completed</span></td></tr>
      <tr><td><strong>De-escalating an Angry Customer</strong></td><td><span class="ap-secondary">Apr 22, 2026</span></td><td><strong>65</strong><span class="ap-secondary"> / 100</span></td><td><span class="ap-secondary">10:20</span></td><td><span class="ap-status-pill ap-s-completed">Completed</span></td></tr>
      <tr><td><strong>Customer Support for Service Skills</strong></td><td><span class="ap-secondary">Apr 11, 2026</span></td><td><strong>79</strong><span class="ap-secondary"> / 100</span></td><td><span class="ap-secondary">09:55</span></td><td><span class="ap-status-pill ap-s-completed">Completed</span></td></tr>
    </tbody>`;
  hubPanelSessions.appendChild(sessionsHubTable);
  pageHub.appendChild(hubPanelSessions);

  main.appendChild(pageHub);
  root.appendChild(main);

  // ═══ SHARE MODAL ═══════════════════════════════════════════════════════════
  const modalBackdrop = h('div', 'ap-modal-backdrop');
  modalBackdrop.id = 'ap-share-modal';

  const modalBox = h('div', 'ap-modal-box');

  const modalHead = h('div', 'ap-modal-head');
  const modalHeadLeft = h('div', '');
  const modalTitle = h('div', 'ap-modal-title');
  modalTitle.textContent = 'Share simulation';
  const modalSubtitle = h('div', 'ap-modal-subtitle');
  modalSubtitle.innerHTML = 'Select a sharing option. Choose a <strong>Public link</strong> where anyone can join. You can also assign to specific teams, or individuals.';
  modalHeadLeft.appendChild(modalTitle);
  modalHeadLeft.appendChild(modalSubtitle);
  const modalCloseBtn = document.createElement('button');
  modalCloseBtn.className = 'ap-modal-close-btn';
  modalCloseBtn.id = 'ap-modal-close';
  modalCloseBtn.textContent = '✕';
  modalHead.appendChild(modalHeadLeft);
  modalHead.appendChild(modalCloseBtn);
  modalBox.appendChild(modalHead);

  const modalTabsRow = h('div', 'ap-modal-tabs-row');
  const modalTabData = [
    { id: 'link', label: 'Member Link' },
    { id: 'teams', label: 'Teams', count: '1' },
    { id: 'individual', label: 'Individual', count: '2' },
  ];
  for (const t of modalTabData) {
    const tab = h('div', `ap-modal-tab${t.id === 'link' ? ' active' : ''}`);
    tab.dataset.modalTab = t.id;
    tab.textContent = t.label;
    if (t.count) {
      const badge = h('span', 'ap-tab-count');
      badge.textContent = t.count;
      tab.appendChild(badge);
    }
    modalTabsRow.appendChild(tab);
  }
  modalBox.appendChild(modalTabsRow);

  const modalBody = h('div', 'ap-modal-body');

  // Tab: Member Link
  const mpanelLink = h('div', 'ap-mpanel active');
  mpanelLink.id = 'ap-mpanel-link';
  const linkLabel = h('div', 'ap-field-label');
  linkLabel.textContent = 'Anyone with this link can join the simulation';
  const linkRow = h('div', 'ap-field-row');
  const linkInput = document.createElement('input');
  linkInput.className = 'ap-link-field';
  linkInput.type = 'text';
  linkInput.value = 'https://app.mizou.com/check-assignment?token=sim-sOQL7su_CZiaRYKeri1v9iXeZMb…';
  linkInput.readOnly = true;
  const copyBtn = document.createElement('button');
  copyBtn.className = 'ap-link-copy-btn';
  copyBtn.innerHTML = `${LINK_SVG} Copy`;
  copyBtn.addEventListener('click', () => showToast('Link copied!', root));
  linkRow.appendChild(linkInput);
  linkRow.appendChild(copyBtn);
  mpanelLink.appendChild(linkLabel);
  mpanelLink.appendChild(linkRow);
  const embedLink = h('a', 'ap-embed-link');
  embedLink.textContent = '</> Embed code';
  mpanelLink.appendChild(embedLink);
  modalBody.appendChild(mpanelLink);

  // Tab: Teams
  const mpanelTeams = h('div', 'ap-mpanel');
  mpanelTeams.id = 'ap-mpanel-teams';
  const teamsLabel = h('div', 'ap-field-label');
  teamsLabel.textContent = 'All team members get access';
  const teamsSel = document.createElement('select');
  teamsSel.className = 'ap-select-full';
  ['Select a team…', 'Alpha Team', 'Beta Team', 'Marketing Team', 'Product — Internal'].forEach(o => {
    const op = document.createElement('option'); op.textContent = o; teamsSel.appendChild(op);
  });
  const teamsSectionLabel = h('div', 'ap-section-label');
  teamsSectionLabel.textContent = 'Assigned Teams';
  const teamsAssignedList = h('div', 'ap-assigned-list');
  const alphaRow = h('div', 'ap-assigned-row');
  const alphaAv = h('div', 'ap-a-avatar ap-a-avatar-sq');
  alphaAv.style.background = 'var(--primitive-indigo-base)';
  alphaAv.style.color = '#fff';
  alphaAv.textContent = 'A';
  const alphaInfo = h('div', 'ap-a-info');
  alphaInfo.innerHTML = '<div class="ap-a-name">Alpha Team</div><div class="ap-a-sub">2 members</div>';
  const alphaRemove = document.createElement('button');
  alphaRemove.className = 'ap-a-remove';
  alphaRemove.innerHTML = REMOVE_SVG;
  alphaRow.appendChild(alphaAv);
  alphaRow.appendChild(alphaInfo);
  alphaRow.appendChild(alphaRemove);
  teamsAssignedList.appendChild(alphaRow);
  mpanelTeams.appendChild(teamsLabel);
  mpanelTeams.appendChild(teamsSel);
  mpanelTeams.appendChild(teamsSectionLabel);
  mpanelTeams.appendChild(teamsAssignedList);
  modalBody.appendChild(mpanelTeams);

  // Tab: Individual
  const mpanelIndividual = h('div', 'ap-mpanel');
  mpanelIndividual.id = 'ap-mpanel-individual';
  const indLabel = h('div', 'ap-field-label');
  indLabel.textContent = 'Assign to specific people by name or email.';
  const indSel = document.createElement('select');
  indSel.className = 'ap-select-full';
  ['Name or email address', 'John Doe', 'Mia Tan', 'Sarah Mitchell', 'James Okafor'].forEach(o => {
    const op = document.createElement('option'); op.textContent = o; indSel.appendChild(op);
  });
  const indSectionLabel = h('div', 'ap-section-label');
  indSectionLabel.textContent = 'Assigned People';
  const indAssignedList = h('div', 'ap-assigned-list');
  for (const [initials, name, email, bg] of [
    ['JD', 'John Doe', 'john.doe@acme.com', '#6963FC'],
    ['MT', 'Mia Tan', 'mia.tan@acme.com', '#34d399'],
  ]) {
    const row = h('div', 'ap-assigned-row');
    const av = h('div', 'ap-a-avatar');
    av.style.background = bg as string;
    av.style.color = '#fff';
    av.textContent = initials as string;
    const info = h('div', 'ap-a-info');
    const nameEl = h('div', 'ap-a-name');
    nameEl.innerHTML = `${name} <span style="color:var(--primitive-slate-9);font-weight:400">${email}</span>`;
    info.appendChild(nameEl);
    const removeBtn = document.createElement('button');
    removeBtn.className = 'ap-a-remove';
    removeBtn.innerHTML = REMOVE_SVG;
    row.appendChild(av);
    row.appendChild(info);
    row.appendChild(removeBtn);
    indAssignedList.appendChild(row);
  }
  mpanelIndividual.appendChild(indLabel);
  mpanelIndividual.appendChild(indSel);
  mpanelIndividual.appendChild(indSectionLabel);
  mpanelIndividual.appendChild(indAssignedList);
  modalBody.appendChild(mpanelIndividual);

  modalBox.appendChild(modalBody);
  modalBackdrop.appendChild(modalBox);
  root.appendChild(modalBackdrop);

  // ═══ TOAST ══════════════════════════════════════════════════════════════════
  const toast = h('div', 'ap-toast');
  toast.id = 'ap-toast';
  root.appendChild(toast);

  // ═══ WIRE UP INTERACTIONS ══════════════════════════════════════════════════
  wireInteractions(root);

  return root;
}

// ─── State & interaction wiring ──────────────────────────────────────────────

let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(msg: string, root: HTMLElement): void {
  const t = root.querySelector<HTMLElement>('#ap-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

function wireInteractions(root: HTMLElement): void {
  const pages = root.querySelectorAll<HTMLElement>('.ap-page');
  const colParent = root.querySelector<HTMLElement>('#col-parent');
  const colChildren = root.querySelector<HTMLElement>('#col-children');
  const hubParent = root.querySelector<HTMLElement>('#hub-parent');
  const hubChildren = root.querySelector<HTMLElement>('#hub-children');

  let currentTeam: string | null = null;
  let simTeamsPrevPage: string | null = null;

  const teamNames: Record<string, string> = {
    sales: 'Sales Team',
    marketing: 'Marketing Team',
    product: 'Product — Internal',
  };

  function clearAllActive(): void {
    pages.forEach(p => p.classList.remove('active'));
    root.querySelectorAll('.ap-nav-item, .ap-nav-sub-item').forEach(n => n.classList.remove('active'));
    root.querySelectorAll('.ap-nav-parent').forEach(p => p.classList.remove('open'));
    root.querySelectorAll('.ap-nav-children').forEach(c => c.classList.remove('open'));
  }

  function navigateTo(pageId: string): void {
    clearAllActive();
    root.querySelector<HTMLElement>(`#page-${pageId}`)?.classList.add('active');
    root.querySelector<HTMLElement>(`[data-page="${pageId}"]`)?.classList.add('active');
  }

  // ── Collections ──
  function openCollections(tabId: string): void {
    clearAllActive();
    root.querySelector<HTMLElement>('#page-collections')?.classList.add('active');
    colParent?.classList.add('open');
    colChildren?.classList.add('open');
    switchColTab(tabId);
  }

  function switchColTab(tabId: string): void {
    root.querySelectorAll('#page-collections .ap-page-tab').forEach(t => t.classList.remove('active'));
    root.querySelector<HTMLElement>(`#page-collections [data-col-tab="${tabId}"]`)?.classList.add('active');

    const panels: Record<string, string> = {
      creations: 'col-panel-creations',
      library: 'col-panel-library',
      templates: 'col-panel-templates',
    };
    for (const [id, elId] of Object.entries(panels)) {
      const el = root.querySelector<HTMLElement>(`#${elId}`);
      if (el) el.style.display = id === tabId ? 'block' : 'none';
    }
    root.querySelectorAll('#col-children [data-col-tab]').forEach(n => n.classList.remove('active'));
    root.querySelector<HTMLElement>(`#col-children [data-col-tab="${tabId}"]`)?.classList.add('active');
  }

  colParent?.addEventListener('click', () => {
    const collectionsActive = root.querySelector('#page-collections')?.classList.contains('active');
    if (colChildren?.classList.contains('open') && collectionsActive) {
      colChildren?.classList.toggle('open');
      colParent?.classList.toggle('open');
    } else {
      openCollections('creations');
    }
  });

  root.querySelectorAll<HTMLElement>('#col-children [data-col-tab]').forEach(item => {
    item.addEventListener('click', () => openCollections(item.dataset.colTab!));
  });

  root.querySelectorAll<HTMLElement>('#page-collections .ap-page-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (!root.querySelector('#page-collections')?.classList.contains('active')) return;
      switchColTab(tab.dataset.colTab!);
    });
  });

  // ── Learning Hub ──
  function openHub(tabId: string): void {
    clearAllActive();
    root.querySelector<HTMLElement>('#page-hub')?.classList.add('active');
    hubParent?.classList.add('open');
    hubChildren?.classList.add('open');
    switchHubTab(tabId);
  }

  function switchHubTab(tabId: string): void {
    root.querySelectorAll('#page-hub .ap-page-tab').forEach(t => t.classList.remove('active'));
    root.querySelector<HTMLElement>(`#page-hub [data-hub-tab="${tabId}"]`)?.classList.add('active');
    const assigned = root.querySelector<HTMLElement>('#hub-panel-assigned');
    const sessions = root.querySelector<HTMLElement>('#hub-panel-sessions');
    if (assigned) assigned.style.display = tabId === 'assigned' ? 'block' : 'none';
    if (sessions) sessions.style.display = tabId === 'sessions' ? 'block' : 'none';
    root.querySelectorAll('#hub-children [data-hub-tab]').forEach(n => n.classList.remove('active'));
    root.querySelector<HTMLElement>(`#hub-children [data-hub-tab="${tabId}"]`)?.classList.add('active');
  }

  hubParent?.addEventListener('click', () => {
    const hubActive = root.querySelector('#page-hub')?.classList.contains('active');
    if (hubChildren?.classList.contains('open') && hubActive) {
      hubChildren?.classList.toggle('open');
      hubParent?.classList.toggle('open');
    } else {
      openHub('assigned');
    }
  });

  root.querySelectorAll<HTMLElement>('#hub-children [data-hub-tab]').forEach(item => {
    item.addEventListener('click', () => openHub(item.dataset.hubTab!));
  });

  root.querySelectorAll<HTMLElement>('#page-hub .ap-page-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (!root.querySelector('#page-hub')?.classList.contains('active')) return;
      switchHubTab(tab.dataset.hubTab!);
    });
  });

  // ── Teams ──
  function openTeam(teamId: string, tabId: string): void {
    clearAllActive();
    currentTeam = teamId;
    root.querySelector<HTMLElement>('#page-team')?.classList.add('active');
    const titleEl = root.querySelector<HTMLElement>('#team-page-title');
    if (titleEl) titleEl.textContent = teamNames[teamId] || teamId;
    const par = root.querySelector<HTMLElement>(`#team-parent-${teamId}`);
    const chi = root.querySelector<HTMLElement>(`#team-children-${teamId}`);
    par?.classList.add('open');
    chi?.classList.add('open');
    switchTeamTab(tabId);
  }

  function switchTeamTab(tabId: string): void {
    root.querySelectorAll('#page-team .ap-page-tab').forEach(t => t.classList.remove('active'));
    root.querySelector<HTMLElement>(`#page-team [data-team-tab="${tabId}"]`)?.classList.add('active');
    for (const id of ['assigned', 'sessions', 'members', 'settings']) {
      const el = root.querySelector<HTMLElement>(`#team-panel-${id}`);
      if (el) el.style.display = id === tabId ? 'block' : 'none';
    }
    if (currentTeam) {
      root.querySelectorAll(`#team-children-${currentTeam} [data-team-tab]`).forEach(n => n.classList.remove('active'));
      root.querySelector<HTMLElement>(`#team-children-${currentTeam} [data-team-tab="${tabId}"]`)?.classList.add('active');
      // update settings team name
      const nameInput = root.querySelector<HTMLInputElement>('#team-settings-name');
      if (nameInput) nameInput.value = teamNames[currentTeam] || currentTeam;
    }
  }

  root.querySelectorAll<HTMLElement>('.team-parent').forEach(par => {
    par.addEventListener('click', () => {
      const teamId = par.dataset.team!;
      const teamActive = root.querySelector('#page-team')?.classList.contains('active');
      if (par.classList.contains('open') && teamActive && currentTeam === teamId) {
        par.classList.toggle('open');
        root.querySelector(`#team-children-${teamId}`)?.classList.toggle('open');
      } else {
        openTeam(teamId, 'assigned');
      }
    });
  });

  root.querySelectorAll<HTMLElement>('[data-team-tab][data-team]').forEach(item => {
    item.addEventListener('click', e => {
      e.stopPropagation();
      openTeam(item.dataset.team!, item.dataset.teamTab!);
    });
  });

  root.querySelectorAll<HTMLElement>('#page-team .ap-page-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (!root.querySelector('#page-team')?.classList.contains('active')) return;
      switchTeamTab(tab.dataset.teamTab!);
    });
  });

  // ── Sim Teams page ──
  function openSimTeams(title: string): void {
    simTeamsPrevPage = root.querySelector('.ap-page.active')?.id || 'page-collections';
    clearAllActive();
    root.querySelector<HTMLElement>('#page-sim-teams')?.classList.add('active');
    const titleEl = root.querySelector<HTMLElement>('#sim-teams-title');
    if (titleEl) titleEl.textContent = title || 'Simulation';
    colParent?.classList.add('open');
    colChildren?.classList.add('open');
  }

  function navBack(): void {
    if (simTeamsPrevPage) {
      clearAllActive();
      root.querySelector<HTMLElement>(`#${simTeamsPrevPage}`)?.classList.add('active');
      if (simTeamsPrevPage === 'page-collections') {
        colParent?.classList.add('open');
        colChildren?.classList.add('open');
      }
      simTeamsPrevPage = null;
    }
  }

  root.querySelector('#sim-teams-back')?.addEventListener('click', navBack);

  // ── My Drafts nav item ──
  root.querySelector<HTMLElement>('[data-page="drafts"]')?.addEventListener('click', () => navigateTo('drafts'));

  // ── Create button ──
  root.querySelector<HTMLElement>('.ap-create-btn')?.addEventListener('click', () => showToast('Create flow coming soon', root));

  // ── Event delegation ──
  root.addEventListener('click', e => {
    const target = e.target as HTMLElement;

    // View Teams button
    const viewTeamsBtn = target.closest<HTMLElement>('.view-teams-btn');
    if (viewTeamsBtn) {
      const card = viewTeamsBtn.closest<HTMLElement>('.ap-sim-card');
      const title = card?.querySelector('.ap-card-title')?.textContent || '';
      openSimTeams(title);
      return;
    }

    // View sessions (from sim teams page)
    const viewTeamSessions = target.closest<HTMLElement>('.view-team-sessions');
    if (viewTeamSessions) {
      openTeam(viewTeamSessions.dataset.team!, 'sessions');
      return;
    }

    // View sessions (from team assigned simulations)
    const teamSimSessions = target.closest<HTMLElement>('.team-sim-sessions-btn');
    if (teamSimSessions && currentTeam) {
      switchTeamTab('sessions');
      return;
    }

    // Share trigger
    const shareTrigger = target.closest<HTMLElement>('.share-trigger');
    if (shareTrigger) {
      openShareModal();
      return;
    }

    // Publish button
    const publishBtn = target.closest<HTMLElement>('.publish-btn');
    if (publishBtn) {
      publishDraft(publishBtn, root);
      return;
    }

    // View toggle
    const viewBtn = target.closest<HTMLElement>('[data-view-toggle] [data-view]');
    if (viewBtn) {
      const toggle = viewBtn.closest<HTMLElement>('[data-view-toggle]');
      const view = viewBtn.dataset.view!;
      toggle?.querySelectorAll('.ap-view-btn').forEach(b => b.classList.remove('active'));
      viewBtn.classList.add('active');
      const panel = toggle?.closest('.ap-filter-bar')?.parentElement;
      const grid = panel?.querySelector<HTMLElement>('.ap-card-grid');
      if (grid) grid.classList.toggle('ap-list-view', view === 'list');
      return;
    }

    // Modal backdrop click to close
    if (target === root.querySelector('#ap-share-modal')) {
      closeShareModal();
    }
  });

  // ── Share modal ──
  function openShareModal(): void {
    root.querySelector('#ap-share-modal')?.classList.add('open');
    switchModalTab('link');
  }
  function closeShareModal(): void {
    root.querySelector('#ap-share-modal')?.classList.remove('open');
  }
  function switchModalTab(tabId: string): void {
    root.querySelectorAll('[data-modal-tab]').forEach(t => t.classList.remove('active'));
    root.querySelectorAll('.ap-mpanel').forEach(p => p.classList.remove('active'));
    root.querySelector<HTMLElement>(`[data-modal-tab="${tabId}"]`)?.classList.add('active');
    root.querySelector<HTMLElement>(`#ap-mpanel-${tabId}`)?.classList.add('active');
  }
  root.querySelector('#ap-modal-close')?.addEventListener('click', closeShareModal);
  root.querySelectorAll<HTMLElement>('[data-modal-tab]').forEach(tab => {
    tab.addEventListener('click', () => switchModalTab(tab.dataset.modalTab!));
  });
}

function publishDraft(btn: HTMLElement, root: HTMLElement): void {
  const draftId = btn.dataset.draftId!;
  const title = btn.dataset.title!;
  const cat = btn.dataset.cat!;
  const card = root.querySelector<HTMLElement>(`.ap-sim-card[data-draft-id="${draftId}"]`);
  if (!card) return;

  card.style.transition = 'opacity 0.28s, transform 0.28s';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.94)';

  setTimeout(() => {
    card.remove();

    const remaining = root.querySelectorAll('#drafts-grid .ap-sim-card, #drafts-grid .ap-plan-card');
    if (remaining.length === 0) {
      root.querySelector('#drafts-empty')?.classList.add('visible');
    }

    const grid = root.querySelector<HTMLElement>('#creations-grid');
    if (!grid) return;

    const newCard = document.createElement('div');
    newCard.className = 'ap-sim-card';
    newCard.style.opacity = '0';
    newCard.style.transform = 'scale(0.94)';
    newCard.style.transition = 'opacity 0.28s, transform 0.28s';

    const thumb = document.createElement('div');
    thumb.className = 'ap-card-thumb';
    thumb.innerHTML = '<div class="ap-card-hatch" style="width:100%;height:100%"></div>';
    newCard.appendChild(thumb);

    const body = document.createElement('div');
    body.className = 'ap-card-body';
    const meta = document.createElement('div');
    meta.className = 'ap-card-meta';
    const badge = document.createElement('span');
    badge.className = 'ap-badge ap-badge-cat';
    badge.textContent = cat;
    meta.appendChild(badge);
    body.appendChild(meta);
    const titleEl = document.createElement('div');
    titleEl.className = 'ap-card-title';
    titleEl.textContent = title;
    body.appendChild(titleEl);
    const dateEl = document.createElement('div');
    dateEl.className = 'ap-card-date';
    dateEl.textContent = 'Just published';
    body.appendChild(dateEl);
    newCard.appendChild(body);

    const actions = document.createElement('div');
    actions.className = 'ap-card-actions';
    const shareBtn = document.createElement('button');
    shareBtn.className = 'ap-btn ap-btn-secondary ap-btn-sm share-trigger';
    shareBtn.textContent = 'Share';
    const viewTeamsBtn = document.createElement('button');
    viewTeamsBtn.className = 'ap-btn ap-btn-secondary ap-btn-sm view-teams-btn';
    viewTeamsBtn.textContent = 'View Teams';
    actions.appendChild(shareBtn);
    actions.appendChild(viewTeamsBtn);
    newCard.appendChild(actions);

    grid.prepend(newCard);
    requestAnimationFrame(() => {
      newCard.style.opacity = '1';
      newCard.style.transform = 'scale(1)';
    });
  }, 300);

  const shortTitle = title.length > 32 ? title.slice(0, 32) + '…' : title;
  showToast(`"${shortTitle}" published`, root);
}
