// components/sidebar.ts
// Reusable sidebar component with Free and Enterprise variants.
// Supports expanded and collapsed states with animated toggle.

import { createSidebarItem } from './sidebarItem';
import { createOrganizationButton } from './organizationButton';
import { createTeamButton } from './teamButton';
import { createCreateButton } from './createButton';
import { createButtonIcon } from './buttonIcon';
import { createButton } from './button';
import { iconEl, type IconName } from '../icons';

export type SidebarVariant = 'free' | 'enterprise';

export type SidebarOptions = {
  /** Variant: 'free' (no team button) or 'enterprise' (org + team button) */
  variant?: SidebarVariant;
  /** Start in collapsed state */
  collapsed?: boolean;
  /** Organization name (default: 'My Space' for free, 'ACME' for enterprise) */
  orgName?: string;
  /** Organization logo icon name */
  orgLogo?: IconName;
  /** Team name (enterprise only) */
  teamName?: string;
  /** Team initials (enterprise only) */
  teamInitials?: string;
  /** Team avatar color (enterprise only) */
  teamColor?: string;
};

export function createSidebar({
  variant = 'free',
  collapsed = false,
  orgName,
  orgLogo,
  teamName = 'Team Name',
  teamInitials = 'TN',
  teamColor = '#b17979',
}: SidebarOptions = {}): HTMLElement {
  const resolvedOrgName = orgName ?? (variant === 'enterprise' ? 'ACME' : 'My Space');
  const resolvedOrgLogo = orgLogo ?? (variant === 'enterprise' ? 'logo-sq-acme' as IconName : 'logo-sq-mizou' as IconName);

  const nav = document.createElement('nav');
  nav.className = `sb-sidebar sb-sidebar--${variant}` + (collapsed ? ' sb-collapsed' : '');

  // --- Header ---
  const header = document.createElement('div');
  header.className = 'sb-sidebar-header';

  const headerRowContainer = document.createElement('div');
  headerRowContainer.className = 'sb-sidebar__header-container';

  const teamContainer = document.createElement('div');
  teamContainer.className = 'sb-sidebar__team-container';

  function updateHeader(isCollapsed: boolean) {
    headerRowContainer.innerHTML = '';
    teamContainer.innerHTML = '';

    if (isCollapsed) {
      // Collapsed: org logo that reveals chevron-bar-right on hover
      const row = document.createElement('div');
      row.className = 'sb-header-row';

      const toggleWrap = document.createElement('button');
      toggleWrap.type = 'button';
      toggleWrap.className = 'sb-org-toggle-btn';
      toggleWrap.setAttribute('aria-label', 'Expand sidebar');

      const logoLayer = document.createElement('span');
      logoLayer.className = 'sb-org-toggle-btn__logo';

      if (variant === 'free') {
        // Free: letter avatar chip (like team button avatar)
        const avatar = document.createElement('span');
        avatar.className = 'sb-org-toggle-btn__avatar';
        avatar.textContent = 'M';
        logoLayer.appendChild(avatar);
      } else {
        logoLayer.appendChild(iconEl(resolvedOrgLogo));
      }

      const chevronLayer = document.createElement('span');
      chevronLayer.className = 'sb-org-toggle-btn__chevron';
      chevronLayer.appendChild(iconEl('chevron-bar-right' as IconName));

      toggleWrap.append(logoLayer, chevronLayer);
      toggleWrap.addEventListener('click', () => {
        const nowCollapsed = nav.classList.toggle('sb-collapsed');
        updateHeader(nowCollapsed);
        updateCreateButton(nowCollapsed);
        updateFeedbackButton(nowCollapsed);
      });

      row.appendChild(toggleWrap);
      headerRowContainer.appendChild(row);

      if (variant === 'enterprise') {
        teamContainer.appendChild(createTeamButton({
          name: teamName,
          initials: teamInitials,
          color: teamColor,
          minimized: true,
        }));
      }
    } else {
      // Expanded: org button + spacer + divider? + collapse toggle
      const row = document.createElement('div');
      row.className = 'sb-header-row';

      const orgBtnOpts = variant === 'free'
        ? { name: resolvedOrgName, avatarLetter: 'M', avatarColor: '#6963FC', open: false }
        : { name: resolvedOrgName, logoIcon: resolvedOrgLogo, open: false };
      row.appendChild(createOrganizationButton(orgBtnOpts));

      const spacer = document.createElement('div');
      spacer.className = 'sb-header-spacer';
      row.appendChild(spacer);

      if (variant === 'enterprise') {
        const divider = document.createElement('span');
        divider.className = 'sb-top-divider';
        row.appendChild(divider);
      }

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'sb-top-toggle';
      toggle.appendChild(iconEl('chevron-bar-left' as IconName));
      toggle.setAttribute('aria-label', 'Collapse sidebar');
      toggle.addEventListener('click', () => {
        const nowCollapsed = nav.classList.toggle('sb-collapsed');
        updateHeader(nowCollapsed);
        updateCreateButton(nowCollapsed);
        updateFeedbackButton(nowCollapsed);
      });

      row.appendChild(toggle);
      headerRowContainer.appendChild(row);

      if (variant === 'enterprise') {
        teamContainer.appendChild(createTeamButton({
          name: teamName,
          initials: teamInitials,
          color: teamColor,
        }));
      }
    }
  }

  header.append(headerRowContainer, teamContainer);
  nav.appendChild(header);

  // --- Divider ---
  const divider = document.createElement('hr');
  divider.className = 'sb-sidebar-divider';
  nav.appendChild(divider);

  // --- Create button ---
  const createBtnContainer = document.createElement('div');
  createBtnContainer.className = 'sb-sidebar__create-wrap';

  function updateCreateButton(isCollapsed: boolean) {
    createBtnContainer.innerHTML = '';
    createBtnContainer.appendChild(
      createCreateButton({ state: isCollapsed ? 'minimized' : 'expanded' }),
    );
  }

  nav.appendChild(createBtnContainer);

  // --- Practice section ---
  const practiceSection = document.createElement('div');
  practiceSection.className = 'sb-sidebar-section';

  const practiceTitle = document.createElement('div');
  practiceTitle.className = 'sb-sidebar-section__title';
  practiceTitle.textContent = 'PRACTICE';
  practiceSection.appendChild(practiceTitle);

  practiceSection.appendChild(createSidebarItem({ label: 'My Collection', icon: 'my-collection' as IconName, active: true }));
  practiceSection.appendChild(createSidebarItem({ label: 'Sessions', icon: 'session-list' as IconName }));
  nav.appendChild(practiceSection);

  // --- Discover section ---
  const discoverSection = document.createElement('div');
  discoverSection.className = 'sb-sidebar-section';
  discoverSection.appendChild(createSidebarItem({ label: 'Discover', icon: 'discover' as IconName }));
  nav.appendChild(discoverSection);

  // --- Spacer ---
  const bottomSpacer = document.createElement('div');
  bottomSpacer.style.flex = '1';
  nav.appendChild(bottomSpacer);

  // --- Feedback button ---
  const feedbackContainer = document.createElement('div');
  feedbackContainer.className = 'sb-sidebar__feedback-wrap';

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
