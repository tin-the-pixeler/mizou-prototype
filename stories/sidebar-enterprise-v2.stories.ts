import type { Meta, StoryObj } from '@storybook/html';
import { createSidebarEnterpriseV2, type SidebarV2Team } from '../components/sidebarEnterpriseV2';

const meta: Meta = { title: 'Navigation/Sidebar Enterprise (V2)' };
export default meta;

type Story = StoryObj;

const manyTeamNames = [
  'Alpha', 'Beta', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel',
  'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa',
  'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'Xray',
  'Yankee', 'Zulu', 'Phoenix', 'Falcon', 'Nimbus', 'Vertex', 'Atlas', 'Nova',
  'Orbit', 'Zenith', 'Quartz', 'Ember',
];

function generateTeams(count: number): SidebarV2Team[] {
  const goldenAngle = 137.508;
  return manyTeamNames.slice(0, count).map((name, i) => ({
    name,
    initials: name.slice(0, 1).toUpperCase(),
    color: `hsl(${Math.round((i * goldenAngle) % 360)}, 65%, 45%)`,
  }));
}

export const Expanded: Story = {
  render: () => createSidebarEnterpriseV2(),
};

export const Collapsed: Story = {
  render: () => createSidebarEnterpriseV2({ collapsed: true }),
};

export const TeamExpanded: Story = {
  name: 'Team Expanded',
  render: () => createSidebarEnterpriseV2({ expandedTeam: 'Alpha' }),
};

export const ManyTeams: Story = {
  name: 'Stress Test (34 Teams)',
  render: () => createSidebarEnterpriseV2({ teams: generateTeams(34) }),
};

export const ManyTeamsCollapsed: Story = {
  name: 'Stress Test (34 Teams, Collapsed)',
  render: () => createSidebarEnterpriseV2({ teams: generateTeams(34), collapsed: true }),
};
