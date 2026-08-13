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

const teamSim = (id: string, title: string, format: SessionRowData['simulation']['format']) => ({ id, title, format });

export const TEAM_SESSION_ROWS: SessionRowData[] = [
  {
    id: 'ts-1',
    learner: { id: 'm1', name: 'Amy Liu', avatarUrl: TEAM_MEMBERS[0].avatarUrl },
    simulation: teamSim('s1', 'Managing Guest Tensions Over Shared Amenities at the Hotel', 'voice-role-play'),
    progress: 'completed',
    score: 92,
    durationSec: 301,
    submitted: { ts: 1762956480000, label: 'Nov. 12 @ 14:08' },
  },
  {
    id: 'ts-2',
    learner: { id: 'm2', name: 'John Garde', avatarUrl: TEAM_MEMBERS[1].avatarUrl },
    simulation: teamSim('s2', 'Guiding a Client Through a Commercial Space Visit', 'chatbot'),
    progress: 'ongoing',
    durationSec: 168,
  },
  {
    id: 'ts-3',
    learner: { id: 'm3', name: 'Carl Andrews', avatarUrl: TEAM_MEMBERS[2].avatarUrl },
    simulation: teamSim('s4', 'Customer Support For Service Skills Training', 'chatbot'),
    progress: 'completed',
    score: 78,
    durationSec: 245,
    submitted: { ts: 1762947120000, label: 'Nov. 12 @ 11:32' },
  },
  {
    id: 'ts-4',
    learner: { id: 'm4', name: 'Ethan Carter', avatarUrl: TEAM_MEMBERS[3].avatarUrl },
    simulation: teamSim('s1', 'Managing Guest Tensions Over Shared Amenities at the Hotel', 'voice-role-play'),
    progress: 'not-started',
  },
  {
    id: 'ts-5',
    learner: { id: 'm5', name: 'Sophia Mitchell', avatarUrl: TEAM_MEMBERS[4].avatarUrl },
    simulation: teamSim('s5', 'Final interview for culture fit', 'video-role-play'),
    progress: 'completed',
    score: 61,
    durationSec: 289,
    submitted: { ts: 1762877700000, label: 'Nov. 11 @ 16:15' },
  },
  {
    id: 'ts-6',
    learner: { id: 'm6', name: 'Liam Reynolds', avatarUrl: TEAM_MEMBERS[5].avatarUrl },
    simulation: teamSim('s3', 'Aiding And Explaining Airline Fare Rules To A Distraught Passenger', 'voice-role-play'),
    progress: 'completed',
    score: 45,
    durationSec: 210,
    submitted: { ts: 1762767900000, label: 'Nov. 10 @ 09:45' },
  },
  {
    id: 'ts-7',
    learner: { id: 'm7', name: 'Olivia Bennett', avatarUrl: TEAM_MEMBERS[6].avatarUrl },
    simulation: teamSim('s2', 'Guiding a Client Through a Commercial Space Visit', 'chatbot'),
    progress: 'ongoing',
    durationSec: 94,
  },
  {
    id: 'ts-8',
    learner: { id: 'm8', name: 'Noah Fischer', avatarUrl: TEAM_MEMBERS[7].avatarUrl },
    simulation: teamSim('s4', 'Customer Support For Service Skills Training', 'chatbot'),
    progress: 'completed',
    score: 87,
    durationSec: 198,
    submitted: { ts: 1762614060000, label: 'Nov. 8 @ 15:01' },
  },
];
