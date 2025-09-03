import type { Meta, StoryObj } from '@storybook/html';
import { createSidebarItem } from '../components/sidebarItem';
import { createOrganizationButton } from '../components/organizationButton';
import { createTeamButton } from '../components/teamButton';
import { iconEl } from '../icons';

/* -------- Types -------- */
type ItemSpec = { label: string; icon: string; active?: boolean };
type SectionSpec = { title: string; items: ItemSpec[] };

/* -------- Helpers -------- */
function createSection(title: string, items: ItemSpec[]) {
  const section = document.createElement('div');
  section.className = 'sb-sidebar-section';

  const h = document.createElement('div');
  h.className = 'sb-sidebar-section__title';
  h.textContent = title;

  section.appendChild(h);
  items.forEach((i) => section.appendChild(createSidebarItem(i)));
  return section;
}

function createSidebarWithSections(sections: SectionSpec[]) {
  const nav = document.createElement('nav');
  nav.className = 'sb-sidebar';

  /* --- HEADER: [Org (left) | spacer | Divider | Toggle (right)] + Team --- */
  const header = document.createElement('div');
  header.className = 'sb-sidebar-header';

  const row = document.createElement('div');
  row.className = 'sb-header-row';

  // Org button (left)
  const orgBtn = createOrganizationButton({
    name: 'ACME',
    logoIcon: 'logo-sq-acme',
    open: false,
  });

  // Spacer pushes the right cluster to the far right
  const spacer = document.createElement('div');
  spacer.className = 'sb-header-spacer'; // CSS: flex:1;

  // Divider + Toggle (right)
  const divider = document.createElement('span');
  divider.className = 'sb-top-divider';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'sb-top-toggle';

  function setToggleIcon(collapsed: boolean) {
    toggle.innerHTML = '';
    toggle.appendChild(iconEl(collapsed ? 'chevron-bar-right' : 'chevron-bar-left'));
    toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
    toggle.setAttribute('title', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
  }

  setToggleIcon(false);
  toggle.addEventListener('click', () => {
    const collapsed = nav.classList.toggle('sb-collapsed');
    setToggleIcon(collapsed);
  });

  // Order: Org → Spacer → Divider → Toggle
  row.append(orgBtn, spacer, divider, toggle);

  // Row 2: Team button
  const teamBtn = createTeamButton({
    name: 'Team Name',
    initials: 'TN',
    color: '#b17979',
  });

  header.append(row, teamBtn);

  /* --- BODY: sections --- */
  const body = document.createElement('div');
  body.className = 'sb-sidebar-body';
  sections.forEach((s) => body.appendChild(createSection(s.title, s.items)));

  // Compose (NOTE: no separate "top" element anymore)
  nav.append(header, body);
  return nav;
}

/* -------- Story -------- */
const meta: Meta = { title: 'Navigation/Sidebar (Expand)' };
export default meta;

type Story = StoryObj;

export const Sidebar: Story = {
  render: () =>
    createSidebarWithSections([
      {
        title: 'Create',
        items: [
          { label: 'New Course', icon: 'new-course' },
          { label: 'New Simulation', icon: 'new-simulation' },
        ],
      },
      {
        title: 'Practice',
        items: [
          { label: 'Courses', icon: 'courses' },
          { label: 'Simulations', icon: 'simulations', active: true },
          { label: 'Sessions', icon: 'session-list' },
          { label: 'Analytics', icon: 'analytics' },
        ],
      },
      {
        title: 'Assets',
        items: [
          { label: 'Persona', icon: 'persona' },
          { label: 'Skills', icon: 'skills' },
        ],
      },
    ]),
};
