// stories/simulation-sessions-demo-data.ts
// Sample data for the Simulation Sessions List Page — every row belongs to
// the same simulation, so rows omit the simulation field the shared
// SessionRowData type expects by pointing it at one fixed simulation.

import type { FilterOption } from '../components/sessionsFilterBar';
import type { SessionRowData } from '../components/sessionsTable';

export const SIMULATION = {
  id: 'sim-airline-ticket-change',
  title: 'Airline Ticket Change Request - Last-Minute Travel Disruption',
  format: 'chatbot' as const,
  thumbnailUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80',
};

export const SIMULATION_LEARNER_OPTIONS: FilterOption[] = [
  { id: 'l1', label: 'Martin Lee' },
  { id: 'l2', label: 'Anthony Smith' },
  { id: 'l3', label: 'Paula Macata' },
  { id: 'l4', label: 'Arnold Padding' },
  { id: 'l5', label: 'Tom Quintilani' },
  { id: 'l6', label: 'Rina Tan' },
  { id: 'l7', label: 'Ravi Kaab' },
  { id: 'l8', label: 'Ellen Adams' },
];

const avatar = (n: number) => `https://i.pravatar.cc/64?img=${n}`;

export const SIMULATION_SESSION_ROWS: SessionRowData[] = [
  {
    id: 'row-1',
    learner: { id: 'l1', name: 'Martin Lee', avatarUrl: avatar(60), isNew: true },
    simulation: SIMULATION,
    progress: 'completed',
    score: 92,
    durationSec: 405,
    submitted: { ts: 1762956480000, label: 'Nov. 12 @ 14:08' },
  },
  {
    id: 'row-2',
    learner: { id: 'l2', name: 'Anthony Smith', avatarUrl: avatar(12) },
    simulation: SIMULATION,
    progress: 'ongoing',
    durationSec: 204,
  },
  {
    id: 'row-3',
    learner: { id: 'l3', name: 'Paula Macata', avatarUrl: avatar(47) },
    simulation: SIMULATION,
    progress: 'ongoing',
    durationSec: 204,
  },
  {
    id: 'row-4',
    learner: { id: 'l4', name: 'Arnold Padding', avatarUrl: avatar(53) },
    simulation: SIMULATION,
    progress: 'not-started',
  },
  {
    id: 'row-5',
    learner: { id: 'l5', name: 'Tom Quintilani', avatarUrl: avatar(14) },
    simulation: SIMULATION,
    progress: 'completed',
    score: 55,
    durationSec: 316,
    submitted: { ts: 1762956480000, label: 'Nov. 12 @ 14:08' },
  },
  {
    id: 'row-6',
    learner: { id: 'l6', name: 'Rina Tan', avatarUrl: avatar(31) },
    simulation: SIMULATION,
    progress: 'completed',
    score: 78,
    durationSec: 263,
    submitted: { ts: 1762956480000, label: 'Nov. 12 @ 14:08' },
  },
  {
    id: 'row-7',
    learner: { id: 'l7', name: 'Ravi Kaab', avatarUrl: avatar(68) },
    simulation: SIMULATION,
    progress: 'completed',
    score: 64,
    durationSec: 192,
    submitted: { ts: 1762956480000, label: 'Nov. 12 @ 14:08' },
  },
  {
    id: 'row-8',
    learner: { id: 'l8', name: 'Ellen Adams', avatarUrl: avatar(45) },
    simulation: SIMULATION,
    progress: 'completed',
    score: 35,
    durationSec: 272,
    submitted: { ts: 1762956480000, label: 'Nov. 12 @ 14:08' },
  },
];
