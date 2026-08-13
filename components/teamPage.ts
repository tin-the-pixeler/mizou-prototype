// components/teamPage.ts
// Full Team Page: enterprise sidebar (with the active team expanded) +
// topbar + 4 tabs — Assigned Simulations, Sessions, Members, Team Settings.
// Figma: Teams - Assigned Simulations / Sessions / Members / Team Settings
// (nodes 15183:256868, 15183:256865, 15183:256866, 15183:256867)

import { createSidebarEnterpriseV2, type SidebarV2Team } from './sidebarEnterpriseV2';
import { createTopbarPrimary } from './topbarPrimary';
import { createTabsNav, type TabItem } from './tabsNav';
import { createCollectionsFilterBar, DEFAULT_CATEGORY_OPTIONS, collectionsFilterPredicate, type CollectionsFilterState, type FilterOption as CollectionsFilterOption } from './collectionsFilterBar';
import { createSimulationCard, type SimulationCardOptions } from './simulationCard';
import { createSessionsFilterBar, sessionFilterPredicate, type SessionsFilterState, type FilterOption } from './sessionsFilterBar';
import { createSessionsTable, sortSessions, DEFAULT_SORT, type SortState, type SessionRowData } from './sessionsTable';
import { createTeamMembersTable, sortMembers, DEFAULT_MEMBERS_SORT, type MembersSortState, type TeamMemberRow } from './teamMembersTable';
import { createTeamSettingsForm } from './teamSettingsForm';
import { createButton } from './button';
import { STAND_IN_ICONS } from './sessionsFilterBar';
import type { IconName } from '../icons';

function standInIconEl(name: keyof typeof STAND_IN_ICONS, className: string): HTMLElement {
  const span = document.createElement('span');
  span.className = className;
  span.innerHTML = STAND_IN_ICONS[name];
  return span;
}

export type TeamTabKey = 'assigned' | 'sessions' | 'members' | 'settings';

const TABS: { key: TeamTabKey; label: string }[] = [
  { key: 'assigned', label: 'Assigned Simulations' },
  { key: 'sessions', label: 'Sessions' },
  { key: 'members', label: 'Members' },
  { key: 'settings', label: 'Team Settings' },
];

export type AssignedSimulationItem = SimulationCardOptions & { categoryId: string; id: string };

export type TeamPageOptions = {
  teamName: string;
  teamInitials: string;
  teamColor: string;
  orgName?: string;
  /** Full teams list rendered in the sidebar (defaults to just this team) */
  teams?: SidebarV2Team[];
  initialTab?: TeamTabKey;

  assignedSimulations?: AssignedSimulationItem[];
  /** Per-team override of assignedSimulations, keyed by team name (falls back to assignedSimulations when a team has no entry) */
  assignedSimulationsByTeam?: Record<string, AssignedSimulationItem[]>;
  categoryOptions?: CollectionsFilterOption[];

  sessionsLearners?: FilterOption[];
  sessionsSimulations?: FilterOption[];
  sessionsRows?: SessionRowData[];

  members?: TeamMemberRow[];

  onSaveSettings?: (name: string) => void;
  onDeleteTeam?: () => void;
};

export function createTeamPage({
  teamName,
  teamInitials,
  teamColor,
  orgName = 'ACME',
  teams,
  initialTab = 'assigned',
  assignedSimulations = [],
  assignedSimulationsByTeam,
  categoryOptions = DEFAULT_CATEGORY_OPTIONS,
  sessionsLearners = [],
  sessionsSimulations = [],
  sessionsRows = [],
  members = [],
  onSaveSettings,
  onDeleteTeam,
}: TeamPageOptions): HTMLElement {
  const sidebarTeams = teams ?? [{ name: teamName, initials: teamInitials, color: teamColor }];

  let currentTeam: SidebarV2Team = sidebarTeams.find((t) => t.name === teamName)
    ?? { name: teamName, initials: teamInitials, color: teamColor };
  let currentTab: TeamTabKey = initialTab;
  // Set right before switching to the Sessions tab via a simulation card's
  // "View sessions" link; consumed once by renderContent() then cleared so a
  // normal tab click doesn't keep a stale filter.
  let pendingSessionsSimulationFilter: string[] | null = null;
  // Preserved across sidebar re-renders (e.g. switching teams) so collapsing
  // the rail doesn't silently pop back open on the next navigation.
  let sidebarCollapsed = false;

  const page = document.createElement('div');
  page.className = 'team-page';

  const sidebarSlot = document.createElement('div');
  sidebarSlot.className = 'team-page__sidebar-slot';
  page.appendChild(sidebarSlot);

  const mainArea = document.createElement('div');
  mainArea.className = 'team-page__main';
  page.appendChild(mainArea);

  const topbarSlot = document.createElement('div');
  mainArea.appendChild(topbarSlot);

  const panelWrapper = document.createElement('div');
  panelWrapper.className = 'team-page__panel-wrapper';
  mainArea.appendChild(panelWrapper);

  const panel = document.createElement('div');
  panel.className = 'team-page__panel';
  panelWrapper.appendChild(panel);

  const tabsWrapper = document.createElement('div');
  tabsWrapper.className = 'team-page__tabs-wrapper';
  panel.appendChild(tabsWrapper);

  const contentContainer = document.createElement('div');
  contentContainer.className = 'team-page__container';
  panel.appendChild(contentContainer);

  function renderTopbar() {
    topbarSlot.innerHTML = '';
    const otherTeams = sidebarTeams.filter((t) => t.name !== currentTeam.name);
    topbarSlot.appendChild(
      createTopbarPrimary({
        title: currentTeam.name,
        userInitial: orgName.slice(0, 1),
        dropdownItems: otherTeams.map((t) => ({
          label: t.name,
          initials: t.initials,
          color: t.color,
          onClick: () => selectTeam(t.name),
        })),
      }),
    );
  }

  function renderSidebar() {
    sidebarSlot.innerHTML = '';
    sidebarSlot.appendChild(
      createSidebarEnterpriseV2({
        orgName,
        teams: sidebarTeams,
        hideCollections: true,
        hideCreateButton: true,
        collapsed: sidebarCollapsed,
        onCollapsedChange: (collapsed) => { sidebarCollapsed = collapsed; },
        expandedTeam: currentTeam.name,
        activeSubNav: TABS.find((t) => t.key === currentTab)?.label,
        onTeamSubNavClick: (team, item) => {
          const tab = TABS.find((t) => t.label === item);
          selectTeam(team, tab?.key);
        },
        onTeamSelect: (team) => selectTeam(team),
      }),
    );
  }

  function renderTabsNav() {
    tabsWrapper.innerHTML = '';
    tabsWrapper.appendChild(
      createTabsNav({
        items: TABS.map((t): TabItem => ({ key: t.key, label: t.label })),
        activeKey: currentTab,
        onChange: (key) => setActiveTab(key as TeamTabKey),
      }),
    );
  }

  function renderContent() {
    contentContainer.innerHTML = '';
    if (currentTab === 'assigned') {
      const items = assignedSimulationsByTeam?.[currentTeam.name] ?? assignedSimulations;
      contentContainer.appendChild(
        buildAssignedSimulationsTab(items, categoryOptions, (simulationId) => {
          pendingSessionsSimulationFilter = [simulationId];
          setActiveTab('sessions');
        }),
      );
    } else if (currentTab === 'sessions') {
      const initialSimulationFilter = pendingSessionsSimulationFilter ?? undefined;
      pendingSessionsSimulationFilter = null;
      contentContainer.appendChild(
        buildSessionsTab(sessionsLearners, sessionsSimulations, sessionsRows, initialSimulationFilter),
      );
    } else if (currentTab === 'members') {
      contentContainer.appendChild(buildMembersTab(members));
    } else {
      const settingsWrap = document.createElement('div');
      settingsWrap.className = 'team-page__tab team-page__tab--settings';
      settingsWrap.appendChild(
        createTeamSettingsForm({ teamName: currentTeam.name, onSave: onSaveSettings, onDelete: onDeleteTeam }),
      );
      contentContainer.appendChild(settingsWrap);
    }
  }

  function setActiveTab(tab: TeamTabKey) {
    if (tab === currentTab) return;
    currentTab = tab;
    renderSidebar();
    renderTabsNav();
    renderContent();
  }

  /** Switch which team's page is showing (sidebar team click, sub-nav click, or topbar switcher). */
  function selectTeam(teamNameToSelect: string, tab?: TeamTabKey) {
    const team = sidebarTeams.find((t) => t.name === teamNameToSelect);
    const teamChanged = !!team && team.name !== currentTeam.name;
    if (team) currentTeam = team;
    if (!teamChanged && (!tab || tab === currentTab)) return;
    if (tab) currentTab = tab;
    renderTopbar();
    renderSidebar();
    renderTabsNav();
    renderContent();
  }

  renderTopbar();
  renderSidebar();
  renderTabsNav();
  renderContent();

  return page;
}

// ─── Assigned Simulations tab ────────────────────────────────────────────────

function buildAssignedSimulationsTab(
  items: AssignedSimulationItem[],
  categoryOptions: CollectionsFilterOption[],
  onViewSessions: (simulationId: string) => void,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'team-page__tab team-page__tab--assigned';

  const filterWrap = document.createElement('div');
  filterWrap.className = 'team-page__filters';
  wrap.appendChild(filterWrap);

  const grid = document.createElement('div');
  grid.className = 'team-page__card-grid';
  wrap.appendChild(grid);

  let filterState: CollectionsFilterState = {
    formats: [], categories: [], level: null, status: null, search: '',
  };

  const renderGrid = () => {
    const keep = collectionsFilterPredicate(filterState);
    const visible = items.filter((item) =>
      keep({
        format: (item.simulationType === 'chatbot' ? 'chatbot' : 'voice-role-play'),
        categoryId: item.categoryId,
        level: 'easy',
        status: 'published',
        searchText: item.title,
      }),
    );
    grid.replaceChildren(
      ...visible.map((item) =>
        createSimulationCard({ ...item, onSessionsClick: () => onViewSessions(item.id) }),
      ),
    );
  };

  filterWrap.appendChild(
    createCollectionsFilterBar({
      categories: categoryOptions,
      hideStatus: true,
      onChange: (state) => { filterState = state; renderGrid(); },
    }),
  );

  renderGrid();
  return wrap;
}

// ─── Sessions tab ────────────────────────────────────────────────────────────

function buildSessionsTab(
  learners: FilterOption[],
  simulations: FilterOption[],
  rows: SessionRowData[],
  initialSimulationFilter?: string[],
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'team-page__tab team-page__tab--sessions sessions-card';

  const filterWrap = document.createElement('div');
  filterWrap.className = 'team-page__filters';
  wrap.appendChild(filterWrap);

  const tableHost = document.createElement('div');
  tableHost.className = 'sst-scroll';
  wrap.appendChild(tableHost);

  let filterState: SessionsFilterState = {
    formats: [], learners: [], simulations: initialSimulationFilter ?? [], progress: null, showArchived: false, search: '',
  };
  let sort: SortState = DEFAULT_SORT;

  const visibleRows = () => {
    const keep = sessionFilterPredicate(filterState);
    return rows.filter((row) =>
      keep({
        format: row.simulation.format,
        learnerId: row.learner.id,
        simulationId: row.simulation.id,
        progress: row.progress,
        archived: row.archived,
        searchText: `${row.learner.name} ${row.simulation.title}`,
      }),
    );
  };

  const renderTable = () => {
    tableHost.replaceChildren(
      createSessionsTable({
        rows: sortSessions(visibleRows(), sort),
        sort,
        onSortChange: (next) => { sort = next; renderTable(); },
      }),
    );
  };

  filterWrap.appendChild(
    createSessionsFilterBar({
      learners,
      simulations,
      initialState: initialSimulationFilter ? { simulations: initialSimulationFilter } : undefined,
      onChange: (state) => { filterState = state; renderTable(); },
    }),
  );

  renderTable();
  return wrap;
}

// ─── Members tab ─────────────────────────────────────────────────────────────

function buildMembersTab(members: TeamMemberRow[]): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'team-page__tab team-page__tab--members';

  const toolbar = document.createElement('div');
  toolbar.className = 'mt-toolbar';
  wrap.appendChild(toolbar);

  const searchWrap = document.createElement('div');
  searchWrap.className = 'mt-search';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'mt-search__input';
  searchInput.placeholder = 'Search';
  searchWrap.append(searchInput, standInIconEl('search', 'mt-search__icon'));
  toolbar.appendChild(searchWrap);

  const addBtn = createButton({ label: 'Add member', variant: 'primary', size: 'sm', leftIcon: 'plus-sm' as IconName });
  toolbar.appendChild(addBtn);

  const tableCard = document.createElement('div');
  tableCard.className = 'sessions-card team-page__members-card';
  wrap.appendChild(tableCard);

  let sort: MembersSortState = DEFAULT_MEMBERS_SORT;
  let searchQuery = '';

  const renderTable = () => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? members.filter((m) => m.name.toLowerCase().includes(query) || m.email.toLowerCase().includes(query))
      : members;
    tableCard.replaceChildren(
      createTeamMembersTable({
        rows: sortMembers(filtered, sort),
        sort,
        onSortChange: (next) => { sort = next; renderTable(); },
      }),
    );
  };

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    renderTable();
  });

  renderTable();
  return wrap;
}
