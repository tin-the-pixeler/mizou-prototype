// stories/sessions-demo-data.ts
// Shared sample data for the Sessions Filter Bar / Sessions Table stories.
// Mirrors the final Figma frame (Screenshot 2026-06-11 at 14.19.21).

import type { FilterOption } from '../components/sessionsFilterBar';
import type { SessionRowData } from '../components/sessionsTable';

export const LEARNER_OPTIONS: FilterOption[] = [
  { id: 'l1', label: 'Anthony Smith' },
  { id: 'l2', label: 'Paula Macata' },
  { id: 'l3', label: 'Arnold Padding' },
  { id: 'l4', label: 'Martin Lee' },
  { id: 'l5', label: 'Tom Quintilani' },
  { id: 'l6', label: 'Rina Tan' },
  { id: 'l7', label: 'Ravi Kaab' },
  { id: 'l8', label: 'Ellen Adams' },
  { id: 'l9', label: 'Maya Goldberg' },
];

export const SIMULATION_OPTIONS: FilterOption[] = [
  { id: 's1', label: 'Managing Guest Tensions Over Shared Amenities at the Hotel' },
  { id: 's2', label: 'Guiding a Client Through a Commercial Space Visit' },
  { id: 's3', label: 'Aiding And Explaining Airline Fare Rules To A Distraught Passenger' },
  { id: 's4', label: 'Customer Support For Service Skills Training' },
  { id: 's5', label: 'Final interview for culture fit' },
];

const avatar = (n: number) => `https://i.pravatar.cc/64?img=${n}`;

export const SESSION_ROWS: SessionRowData[] = [
  {
    id: 'row-1',
    learner: { id: 'l1', name: 'Anthony Smith', avatarUrl: avatar(12) },
    simulation: { id: 's1', title: 'Managing Guest Tensions Over Shared Amenities at the Hotel', format: 'voice-role-play' },
    progress: 'ongoing',
    durationSec: 204,
  },
  {
    id: 'row-2',
    learner: { id: 'l2', name: 'Paula Macata', avatarUrl: avatar(47) },
    simulation: { id: 's2', title: 'Guiding a Client Through a Commercial Space Visit', format: 'chatbot' },
    progress: 'ongoing',
    durationSec: 204,
  },
  {
    id: 'row-3',
    learner: { id: 'l3', name: 'Arnold Padding', avatarUrl: avatar(53) },
    simulation: { id: 's1', title: 'Managing Guest Tensions Over Shared Amenities at the Hotel', format: 'voice-role-play' },
    progress: 'not-started',
  },
  {
    id: 'row-4',
    learner: { id: 'l4', name: 'Martin Lee', avatarUrl: avatar(60), isNew: true },
    simulation: { id: 's3', title: 'Aiding And Explaining Airline Fare Rules To A Distraught Passenger', format: 'voice-role-play' },
    progress: 'completed',
    score: 89,
    durationSec: 405,
    submitted: { ts: 1762956480000, label: 'Nov. 12 @ 14:08' },
  },
  {
    id: 'row-5',
    learner: { id: 'l5', name: 'Tom Quintilani', avatarUrl: avatar(14) },
    simulation: { id: 's1', title: 'Managing Guest Tensions Over Shared Amenities at the Hotel', format: 'voice-role-play' },
    progress: 'completed',
    score: 55,
    durationSec: 316,
    submitted: { ts: 1762947120000, label: 'Nov. 12 @ 11:32' },
  },
  {
    id: 'row-6',
    learner: { id: 'l6', name: 'Rina Tan', avatarUrl: avatar(31) },
    simulation: { id: 's2', title: 'Guiding a Client Through a Commercial Space Visit', format: 'chatbot' },
    progress: 'completed',
    score: 75,
    durationSec: 263,
    submitted: { ts: 1762877700000, label: 'Nov. 11 @ 16:15' },
  },
  {
    id: 'row-7',
    learner: { id: 'l7', name: 'Ravi Kaab', avatarUrl: avatar(68) },
    simulation: { id: 's4', title: 'Customer Support For Service Skills Training', format: 'chatbot' },
    progress: 'completed',
    score: 65,
    durationSec: 192,
    submitted: { ts: 1762767900000, label: 'Nov. 10 @ 09:45' },
  },
  {
    id: 'row-8',
    learner: { id: 'l8', name: 'Ellen Adams', avatarUrl: avatar(45) },
    simulation: { id: 's5', title: 'Final interview for culture fit', format: 'video-role-play' },
    progress: 'completed',
    score: 48,
    durationSec: 272,
    submitted: { ts: 1762614060000, label: 'Nov. 8 @ 15:01' },
  },
  // Hidden unless "Show archived" is on.
  {
    id: 'row-9',
    learner: { id: 'l9', name: 'Maya Goldberg', avatarUrl: avatar(26) },
    simulation: { id: 's2', title: 'Guiding a Client Through a Commercial Space Visit', format: 'chatbot' },
    progress: 'completed',
    score: 81,
    durationSec: 288,
    submitted: { ts: 1762093500000, label: 'Nov. 2 @ 16:25' },
    archived: true,
  },
];
