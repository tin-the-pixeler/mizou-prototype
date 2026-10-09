import type { Meta, StoryObj } from '@storybook/html';
import { createSessionsStats, type SessionsStatsOptions } from '../components/sessionsStats';
import { SESSION_ROWS } from './sessions-demo-data';

const meta: Meta<SessionsStatsOptions> = {
  title: 'Components/Sessions Stats',
};

export default meta;
type Story = StoryObj<SessionsStatsOptions>;

const VISIBLE_ROWS = SESSION_ROWS.filter((r) => !r.archived);

const render = (args: SessionsStatsOptions) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.background = 'var(--surface-page)';
  wrapper.style.maxWidth = '960px';

  const card = document.createElement('div');
  card.className = 'sessions-card';
  card.style.padding = '16px';
  card.appendChild(createSessionsStats(args));

  wrapper.appendChild(card);
  return wrapper;
};

// ── Default: full, unfiltered set ───────────────────────────────────────────

export const Default: Story = {
  name: 'Default (all sessions)',
  render,
  args: {
    rows: VISIBLE_ROWS,
  },
};

// ── Filtered to one simulation — tiles should track whatever's visible ──────

export const FilteredToOneSimulation: Story = {
  name: 'Filtered to one simulation',
  render,
  args: {
    rows: VISIBLE_ROWS.filter((r) => r.simulation.id === VISIBLE_ROWS[0].simulation.id),
  },
};

// ── Mostly ongoing / not-started — few or no completed rows to average ──────

export const MostlyIncomplete: Story = {
  name: 'Mostly ongoing / not started',
  render,
  args: {
    rows: VISIBLE_ROWS.filter((r) => r.progress !== 'completed').concat(
      VISIBLE_ROWS.filter((r) => r.progress === 'completed').slice(0, 1),
    ),
  },
};

// ── Empty filtered result — every tile should fall back to '-' ─────────────

export const Empty: Story = {
  name: 'Empty (no sessions match)',
  render,
  args: {
    rows: [],
  },
};
