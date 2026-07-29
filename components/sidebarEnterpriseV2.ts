// components/sidebarEnterpriseV2.ts
// Enterprise sidebar v2: workspace button + Learning Hub/Collections nav + Teams list.
// Figma: sidebar-primary-v2-enterprise (node 14155:233892)

import { createCreateButton } from './createButton';
import { createButtonIcon } from './buttonIcon';
import { createButton } from './button';
import { iconEl, type IconName } from '../icons';

export type SidebarV2Team = {
  name: string;
  initials: string;
  color: string;
};

export type SidebarEnterpriseV2Options = {
  /** Start in collapsed (rail) state */
  collapsed?: boolean;
  /** Organization/workspace name shown in the header button */
  orgName?: string;
  /** Organization logo icon name */
  orgLogo?: IconName;
  /** Teams listed under the TEAMS section */
  teams?: SidebarV2Team[];
  /** Name of the team to render expanded initially (none by default) */
  expandedTeam?: string;
  /** Sub-nav label (within the expanded team) to highlight as active */
  activeSubNav?: string;
  /** Fired when a team's sub-nav link (Assigned Simulations / Sessions / Members / Team Settings) is clicked */
  onTeamSubNavClick?: (teamName: string, item: string) => void;
  /** Fired when a team's header (avatar + name) is clicked, e.g. to navigate to that team's page */
  onTeamSelect?: (teamName: string) => void;
  /** Hide the "Collections" nav item. Default false. */
  hideCollections?: boolean;
  /** Hide the "Create" button. Default false. */
  hideCreateButton?: boolean;
  /** Fired when the user toggles the sidebar collapsed/expanded via its own header buttons */
  onCollapsedChange?: (collapsed: boolean) => void;
};

const defaultTeams: SidebarV2Team[] = [
  { name: 'Alpha', initials: 'A', color: '#f68c0a' },
  { name: 'Beta', initials: 'B', color: '#f60aea' },
  { name: 'Charlie', initials: 'C', color: '#7fe41a' },
];

/** Sub-nav links revealed under a team when it's expanded (mirrors the Team Page tabs). */
const teamSubNavItems = ['Assigned Simulations', 'Sessions', 'Members', 'Team Settings'];

function createNavItem(label: string, icon: IconName): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = '#';
  a.className = 'sv2-item';
  a.title = label;

  a.appendChild(iconEl(icon, 'sb-icon sv2-item__icon'));

  const text = document.createElement('span');
  text.className = 'sv2-item__label';
  text.textContent = label;
  a.appendChild(text);

  return a;
}

/**
 * Nav item with a disclosure chevron that reveals disabled (unlinked)
 * sub-items on click. Used for "My Learning Hub" — the sub-items are
 * placeholders to show they'll live in the sidebar, not real links yet.
 */
function createExpandableNavItem(label: string, icon: IconName, subItems: string[]): HTMLDivElement {
  let isOpen = false;

  const wrap = document.createElement('div');
  wrap.className = 'sv2-expandable';

  const header = document.createElement('button');
  header.type = 'button';
  header.className = 'sv2-item sv2-expandable-header';
  header.setAttribute('aria-expanded', 'false');

  header.appendChild(iconEl(icon, 'sb-icon sv2-item__icon'));

  const text = document.createElement('span');
  text.className = 'sv2-item__label';
  text.textContent = label;
  header.appendChild(text);

  const chevron = iconEl('chevron-down-sm' as IconName, 'sb-icon sv2-expandable-chevron');
  header.appendChild(chevron);

  const sublist = document.createElement('div');
  sublist.className = 'sv2-expandable-sublist';
  sublist.style.display = 'none';
  subItems.forEach((itemLabel) => {
    const item = document.createElement('span');
    item.className = 'sv2-expandable-subitem sv2-expandable-subitem--disabled';
    item.textContent = itemLabel;
    sublist.appendChild(item);
  });

  header.addEventListener('click', () => {
    isOpen = !isOpen;
    header.setAttribute('aria-expanded', String(isOpen));
    sublist.style.display = isOpen ? '' : 'none';
    chevron.classList.toggle('sv2-expandable-chevron--open', isOpen);
  });

  wrap.append(header, sublist);
  return wrap;
}

function createTeamNavItem(
  team: SidebarV2Team,
  isExpanded: boolean,
  onToggle: () => void,
  activeSubNav?: string,
  onSubNavClick?: (teamName: string, item: string) => void,
  onSelect?: (teamName: string) => void,
): HTMLDivElement {
  const wrap = document.createElement('div');
  wrap.className = 'sv2-team' + (isExpanded ? ' sv2-team--expanded' : '');

  const header = document.createElement('button');
  header.type = 'button';
  header.className = 'sv2-item sv2-team-header';
  header.title = team.name;
  header.setAttribute('aria-expanded', String(isExpanded));

  const avatar = document.createElement('span');
  avatar.className = 'sv2-team-avatar';
  avatar.textContent = team.initials.toUpperCase();
  avatar.style.background = team.color;
  header.appendChild(avatar);

  const text = document.createElement('span');
  text.className = 'sv2-item__label sv2-team-header__name';
  text.textContent = team.name;
  header.appendChild(text);

  header.addEventListener('click', () => {
    onSelect?.(team.name);
    onToggle();
  });
  wrap.appendChild(header);

  if (isExpanded) {
    const sublist = document.createElement('div');
    sublist.className = 'sv2-team-sublist';
    teamSubNavItems.forEach((label) => {
      const link = document.createElement('a');
      link.href = '#';
      link.className = 'sv2-team-subitem' + (label === activeSubNav ? ' sv2-team-subitem--active' : '');
      link.textContent = label;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        onSubNavClick?.(team.name, label);
      });
      sublist.appendChild(link);
    });
    wrap.appendChild(sublist);
  }

  return wrap;
}

export function createSidebarEnterpriseV2({
  collapsed = false,
  orgName = 'ACME',
  orgLogo = 'logo-sq-acme' as IconName,
  teams = defaultTeams,
  expandedTeam,
  activeSubNav,
  onTeamSubNavClick,
  onTeamSelect,
  hideCollections = false,
  hideCreateButton = false,
  onCollapsedChange,
}: SidebarEnterpriseV2Options = {}): HTMLElement {
  let currentExpandedTeam = expandedTeam;
  const nav = document.createElement('nav');
  nav.className = 'sv2-sidebar' + (collapsed ? ' sv2-collapsed' : '');

  // --- Header ---
  const header = document.createElement('div');
  header.className = 'sv2-header';

  function updateHeader(isCollapsed: boolean) {
    header.innerHTML = '';

    if (isCollapsed) {
      const expandBtn = document.createElement('button');
      expandBtn.type = 'button';
      expandBtn.className = 'sv2-icon-toggle';
      expandBtn.setAttribute('aria-label', 'Expand sidebar');
      expandBtn.appendChild(iconEl('chevron-bar-right' as IconName));
      expandBtn.addEventListener('click', () => {
        const nowCollapsed = nav.classList.toggle('sv2-collapsed');
        updateHeader(nowCollapsed);
        updateCreateButton(nowCollapsed);
        updateFeedbackButton(nowCollapsed);
        onCollapsedChange?.(nowCollapsed);
      });
      header.appendChild(expandBtn);
    } else {
      const workspaceBtn = document.createElement('button');
      workspaceBtn.type = 'button';
      workspaceBtn.className = 'sv2-workspace-btn';
      workspaceBtn.setAttribute('aria-haspopup', 'menu');
      workspaceBtn.setAttribute('aria-expanded', 'false');

      workspaceBtn.appendChild(iconEl(orgLogo, 'sb-icon sv2-workspace-btn__logo'));

      const name = document.createElement('span');
      name.className = 'sv2-workspace-btn__name';
      name.textContent = orgName;
      name.title = orgName;
      workspaceBtn.appendChild(name);

      workspaceBtn.appendChild(iconEl('chevron-down-sm' as IconName, 'sb-icon sv2-workspace-btn__chevron'));

      const collapseBtn = document.createElement('button');
      collapseBtn.type = 'button';
      collapseBtn.className = 'sv2-icon-toggle';
      collapseBtn.setAttribute('aria-label', 'Collapse sidebar');
      collapseBtn.appendChild(iconEl('chevron-bar-left' as IconName));
      collapseBtn.addEventListener('click', () => {
        const nowCollapsed = nav.classList.toggle('sv2-collapsed');
        updateHeader(nowCollapsed);
        updateCreateButton(nowCollapsed);
        updateFeedbackButton(nowCollapsed);
        onCollapsedChange?.(nowCollapsed);
      });

      header.append(workspaceBtn, collapseBtn);
    }
  }

  nav.appendChild(header);

  // --- Content (top section) ---
  const contentTop = document.createElement('div');
  contentTop.className = 'sv2-content-top';

  // Create button
  const createBtnContainer = document.createElement('div');
  createBtnContainer.className = 'sv2-create-wrap';

  function updateCreateButton(isCollapsed: boolean) {
    if (hideCreateButton) return;
    createBtnContainer.innerHTML = '';
    createBtnContainer.appendChild(
      createCreateButton({ state: isCollapsed ? 'minimized' : 'expanded' }),
    );
  }
  if (!hideCreateButton) contentTop.appendChild(createBtnContainer);

  // My Learning Hub (expandable: My Assigned Simulations / My Sessions — placeholders, not linked yet)
  contentTop.appendChild(
    createExpandableNavItem('My Learning Hub', 'courses' as IconName, ['My Assigned Simulations', 'My Sessions']),
  );

  if (!hideCollections) {
    const divider1 = document.createElement('hr');
    divider1.className = 'sv2-divider';
    contentTop.appendChild(divider1);

    // Collections
    contentTop.appendChild(createNavItem('Collections', 'my-collection' as IconName));
  }

  const divider2 = document.createElement('hr');
  divider2.className = 'sv2-divider';
  contentTop.appendChild(divider2);

  nav.appendChild(contentTop);

  // --- Teams (scrollable, grows to fill remaining space) ---
  const teamsSection = document.createElement('div');
  teamsSection.className = 'sv2-teams';

  let teamsListVisible = true;

  const teamsHeader = document.createElement('button');
  teamsHeader.type = 'button';
  teamsHeader.className = 'sv2-teams__header';
  teamsHeader.setAttribute('aria-expanded', 'true');
  teamsHeader.setAttribute('aria-label', 'Toggle teams list');

  const teamsTitle = document.createElement('span');
  teamsTitle.className = 'sv2-teams__title';
  teamsTitle.textContent = 'TEAMS';
  teamsHeader.appendChild(teamsTitle);

  const teamsChevron = iconEl('chevron-down-sm' as IconName, 'sb-icon sv2-teams__chevron');
  teamsHeader.appendChild(teamsChevron);

  teamsHeader.addEventListener('click', () => {
    teamsListVisible = !teamsListVisible;
    teamsHeader.setAttribute('aria-expanded', String(teamsListVisible));
    teamsList.style.display = teamsListVisible ? '' : 'none';
    teamsChevron.classList.toggle('sv2-teams__chevron--collapsed', !teamsListVisible);
  });

  teamsSection.appendChild(teamsHeader);

  const teamsList = document.createElement('div');
  teamsList.className = 'sv2-teams-list';
  teamsSection.appendChild(teamsList);

  function renderTeams() {
    teamsList.innerHTML = '';
    teams.forEach((team) => {
      teamsList.appendChild(
        createTeamNavItem(
          team,
          team.name === currentExpandedTeam,
          () => {
            currentExpandedTeam = currentExpandedTeam === team.name ? undefined : team.name;
            renderTeams();
          },
          activeSubNav,
          onTeamSubNavClick,
          onTeamSelect,
        ),
      );
    });
  }
  renderTeams();

  nav.appendChild(teamsSection);

  // --- Feedback button ---
  const feedbackContainer = document.createElement('div');
  feedbackContainer.className = 'sv2-feedback-wrap';

  function updateFeedbackButton(isCollapsed: boolean) {
    feedbackContainer.innerHTML = '';
    if (isCollapsed) {
      feedbackContainer.appendChild(
        createButtonIcon({ icon: 'feedback' as IconName, action: 'tertiary', size: 'sm', label: 'Feedback' }),
      );
    } else {
      feedbackContainer.appendChild(
        createButton({ label: 'Feedback', variant: 'tertiary', size: 'sm', leftIcon: 'feedback' as IconName }),
      );
    }
  }
  nav.appendChild(feedbackContainer);

  // Initial render
  updateHeader(collapsed);
  updateCreateButton(collapsed);
  updateFeedbackButton(collapsed);

  return nav;
}
