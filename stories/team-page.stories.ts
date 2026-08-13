import type { Meta, StoryObj } from '@storybook/html';
import { createTeamPage } from '../components/teamPage';
import { ASSIGNED_SIMULATIONS, ASSIGNED_SIMULATIONS_BY_TEAM, TEAM_MEMBERS, TEAM_SESSION_LEARNERS, TEAM_SESSION_SIMULATIONS, TEAM_SESSION_ROWS } from './team-page-demo-data';

const meta: Meta = { title: 'Pages/Team Page - Team Manager view' };
export default meta;

type Story = StoryObj;

const TEAMS = [
  { name: 'Alpha', initials: 'A', color: '#f68c0a' },
  { name: 'Beta', initials: 'B', color: '#f60aea' },
  { name: 'Charlie', initials: 'C', color: '#7fe41a' },
  { name: 'Delta', initials: 'D', color: '#4f46e5' },
  { name: 'Echo', initials: 'E', color: '#06b6d4' },
  { name: 'Foxtrot', initials: 'F', color: '#e11d48' },
  { name: 'Golf', initials: 'G', color: '#16a34a' },
  { name: 'Hotel', initials: 'H', color: '#ca8a04' },
  { name: 'India', initials: 'I', color: '#9333ea' },
  { name: 'Juliett', initials: 'J', color: '#0ea5e9' },
  { name: 'Kilo', initials: 'K', color: '#db2777' },
];

function render(initialTab: 'assigned' | 'sessions' | 'members' | 'settings') {
  return createTeamPage({
    teamName: 'Alpha',
    teamInitials: 'A',
    teamColor: '#f68c0a',
    teams: TEAMS,
    initialTab,
    assignedSimulations: ASSIGNED_SIMULATIONS,
    assignedSimulationsByTeam: ASSIGNED_SIMULATIONS_BY_TEAM,
    sessionsLearners: TEAM_SESSION_LEARNERS,
    sessionsSimulations: TEAM_SESSION_SIMULATIONS,
    sessionsRows: TEAM_SESSION_ROWS,
    members: TEAM_MEMBERS,
  });
}

export const AssignedSimulations: Story = {
  name: 'Assigned Simulations',
  render: () => render('assigned'),
};

export const Sessions: Story = {
  render: () => render('sessions'),
};

export const Members: Story = {
  render: () => render('members'),
};

export const TeamSettings: Story = {
  name: 'Team Settings',
  render: () => render('settings'),
};
