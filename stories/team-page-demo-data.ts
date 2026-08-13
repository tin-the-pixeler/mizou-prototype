// stories/team-page-demo-data.ts
// Demo data for the Team Page story — Assigned Simulations cards, Members
// rows, and the Sessions tab's rows/Learners filter. The Sessions tab's
// Learners filter lists this team's own members (not the generic
// sessions-demo-data.ts learners) since only team members generate sessions
// for their own team.

import type { AssignedSimulationItem } from '../components/teamPage';
import type { TeamMemberRow } from '../components/teamMembersTable';
import type { FilterOption } from '../components/sessionsFilterBar';
import type { SessionRowData } from '../components/sessionsTable';

const THUMBNAIL = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80';

export const ASSIGNED_SIMULATIONS: AssignedSimulationItem[] = [
  {
    title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
    status: 'with-sessions',
    simulationType: 'chatbot',
    thumbnailUrl: THUMBNAIL,
    category: 'Management',
    difficulty: 'medium',
    sessionsCount: 8,
    categoryId: 'management',
    id: 'sim-motivating-overwhelmed-employee',
  },
  {
    title: 'Managing Guest Tensions Over Shared Amenities at the Hotel',
    status: 'with-sessions',
    simulationType: 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Customer Service',
    difficulty: 'easy',
    sessionsCount: 5,
    categoryId: 'customer-service',
    id: 's1',
  },
  {
    title: 'Guiding a Client Through a Commercial Space Visit',
    status: 'with-sessions',
    simulationType: 'chatbot',
    thumbnailUrl: THUMBNAIL,
    category: 'Commercial',
    difficulty: 'medium',
    sessionsCount: 3,
    categoryId: 'commercial',
    id: 's2',
  },
  {
    title: 'Interviewing a Nervous but Qualified Candidate',
    status: 'with-sessions',
    simulationType: 'video-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Recruitment',
    difficulty: 'hard',
    sessionsCount: 6,
    categoryId: 'recruitment',
    id: 'sim-interviewing-nervous-candidate',
  },
  {
    title: 'Aiding And Explaining Airline Fare Rules To A Distraught Passenger',
    status: 'with-sessions',
    simulationType: 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Customer Service',
    difficulty: 'medium',
    sessionsCount: 4,
    categoryId: 'customer-service',
    id: 's3',
  },
  {
    title: 'Negotiating Renewal Terms With a Price-Sensitive Client',
    status: 'with-sessions',
    simulationType: 'chatbot',
    thumbnailUrl: THUMBNAIL,
    category: 'Commercial',
    difficulty: 'hard',
    sessionsCount: 2,
    categoryId: 'commercial',
    id: 'sim-negotiating-renewal-terms',
  },
  {
    title: 'Delivering a Performance Improvement Plan With Empathy',
    status: 'with-sessions',
    simulationType: 'video-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Management',
    difficulty: 'hard',
    sessionsCount: 7,
    categoryId: 'management',
    id: 'sim-delivering-performance-improvement-plan',
  },
  {
    title: 'Onboarding a New Hire Into a Remote-First Team',
    status: 'with-sessions',
    simulationType: 'chatbot',
    thumbnailUrl: THUMBNAIL,
    category: 'Recruitment',
    difficulty: 'easy',
    sessionsCount: 9,
    categoryId: 'recruitment',
    id: 'sim-onboarding-new-hire',
  },
  {
    title: 'De-escalating an Angry Customer After a Delayed Delivery',
    status: 'with-sessions',
    simulationType: 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Customer Service',
    difficulty: 'medium',
    sessionsCount: 5,
    categoryId: 'customer-service',
    id: 'sim-deescalating-angry-customer',
  },
  {
    title: 'Pitching a Product Upgrade to a Skeptical Buyer',
    status: 'with-sessions',
    simulationType: 'chatbot',
    thumbnailUrl: THUMBNAIL,
    category: 'Commercial',
    difficulty: 'easy',
    sessionsCount: 1,
    categoryId: 'commercial',
    id: 'sim-pitching-product-upgrade',
  },
  {
    title: 'Resolving a Conflict Between Two Direct Reports',
    status: 'with-sessions',
    simulationType: 'video-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Management',
    difficulty: 'medium',
    sessionsCount: 3,
    categoryId: 'management',
    id: 'sim-resolving-conflict-direct-reports',
  },
  {
    title: 'Screening a Candidate for Culture and Values Fit',
    status: 'with-sessions',
    simulationType: 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Recruitment',
    difficulty: 'medium',
    sessionsCount: 4,
    categoryId: 'recruitment',
    id: 'sim-screening-culture-values-fit',
  },
  {
    title: 'Handling a Refund Request Outside Policy',
    status: 'with-sessions',
    simulationType: 'chatbot',
    thumbnailUrl: THUMBNAIL,
    category: 'Customer Service',
    difficulty: 'easy',
    sessionsCount: 6,
    categoryId: 'customer-service',
    id: 'sim-handling-refund-request',
  },
];

// Per-team slice of the shared pool above — varies both the count and which
// items show, so switching teams visibly changes the Assigned Simulations
// tab (there's no real per-team backend data in this prototype).
const TEAM_SIM_COUNTS: Record<string, number> = {
  Alpha: 13, Beta: 8, Charlie: 5, Delta: 10, Echo: 3, Foxtrot: 7,
  Golf: 11, Hotel: 6, India: 9, Juliett: 4, Kilo: 12,
};

function rotate<T>(arr: T[], offset: number): T[] {
  const n = arr.length;
  const o = ((offset % n) + n) % n;
  return [...arr.slice(o), ...arr.slice(0, o)];
}

export const ASSIGNED_SIMULATIONS_BY_TEAM: Record<string, AssignedSimulationItem[]> = Object.fromEntries(
  Object.entries(TEAM_SIM_COUNTS).map(([team, count], i) => [
    team,
    rotate(ASSIGNED_SIMULATIONS, i * 3).slice(0, count),
  ]),
);

const avatar = (n: number) => `https://i.pravatar.cc/64?img=${n}`;

export const TEAM_MEMBERS: TeamMemberRow[] = [
  { id: 'm1', name: 'Amy Liu', email: 'amy.liu@acme.com', avatarUrl: avatar(5), role: 'admin', lastActive: 'Today', lastActiveTs: 5 },
  { id: 'm2', name: 'John Garde', email: 'john.g@acme.com', avatarUrl: avatar(51), role: 'manager', lastActive: 'Today', lastActiveTs: 5 },
  { id: 'm3', name: 'Carl Andrews', email: 'c.andrews@acme.com', avatarUrl: avatar(52), role: 'manager', lastActive: 'Today', lastActiveTs: 5 },
  { id: 'm4', name: 'Ethan Carter', email: 'ethan@acme.com', avatarUrl: avatar(13), role: 'member', lastActive: '2d', lastActiveTs: 2 },
  { id: 'm5', name: 'Sophia Mitchell', email: 'sophia@acme.com', avatarUrl: avatar(45), role: 'member', lastActive: 'Yesterday', lastActiveTs: 4 },
  { id: 'm6', name: 'Liam Reynolds', email: 'liam@acme.com', avatarUrl: avatar(15), role: 'member', lastActive: '1m', lastActiveTs: 0 },
  { id: 'm7', name: 'Olivia Bennett', email: 'olivia@acme.com', avatarUrl: avatar(47), role: 'member', lastActive: 'Yesterday', lastActiveTs: 4 },
  { id: 'm8', name: 'Noah Fischer', email: 'noah@acme.com', avatarUrl: avatar(33), role: 'member', lastActive: '3d', lastActiveTs: 1 },
];

/** Sessions tab "Learners" filter — this team's own members. */
export const TEAM_SESSION_LEARNERS: FilterOption[] = TEAM_MEMBERS.map((m) => ({ id: m.id, label: m.name }));

/** Sessions tab "Simulations" filter — must list this team's own assigned simulations (not the generic sessions-demo-data pool), so every card's id resolves to a real filter option. */
export const TEAM_SESSION_SIMULATIONS: FilterOption[] = ASSIGNED_SIMULATIONS.map((s) => ({ id: s.id, label: s.title }));

// Generated (not hand-listed) so each simulation's row count always matches
// the `sessionsCount` shown on its Assigned Simulations card — clicking
// "View sessions" must land on exactly that many filtered rows.
const PROGRESS_CYCLE: SessionRowData['progress'][] = ['completed', 'completed', 'ongoing', 'not-started'];

function buildTeamSessionRows(): SessionRowData[] {
  const rows: SessionRowData[] = [];
  let i = 0;
  for (const sim of ASSIGNED_SIMULATIONS) {
    const format: SessionRowData['simulation']['format'] =
      sim.simulationType === 'chatbot' || sim.simulationType === 'video-role-play' ? sim.simulationType : 'voice-role-play';
    for (let n = 0; n < (sim.sessionsCount ?? 0); n++, i++) {
      const learner = TEAM_MEMBERS[i % TEAM_MEMBERS.length];
      const progress = PROGRESS_CYCLE[i % PROGRESS_CYCLE.length];
      const row: SessionRowData = {
        id: `ts-${i + 1}`,
        learner: { id: learner.id, name: learner.name, avatarUrl: learner.avatarUrl },
        simulation: { id: sim.id, title: sim.title, format },
        progress,
      };
      if (progress === 'completed') {
        row.score = 55 + ((i * 7) % 45);
        row.durationSec = 120 + ((i * 23) % 240);
        row.submitted = { ts: 1762300000000 + i * 43200000, label: `Nov. ${1 + (i % 20)} @ ${9 + (i % 10)}:00` };
      } else if (progress === 'ongoing') {
        row.durationSec = 60 + ((i * 17) % 200);
      }
      rows.push(row);
    }
  }
  return rows;
}

export const TEAM_SESSION_ROWS: SessionRowData[] = buildTeamSessionRows();
