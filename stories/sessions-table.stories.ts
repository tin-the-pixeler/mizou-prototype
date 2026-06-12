import type { Meta, StoryObj } from '@storybook/html';
import {
  createSessionsTable,
  sortSessions,
  DEFAULT_SORT,
  type SessionsTableOptions,
  type SortState,
} from '../components/sessionsTable';
import { SESSION_ROWS } from './sessions-demo-data';

const meta: Meta<SessionsTableOptions> = {
  title: 'Components/Sessions Table',
  argTypes: {
    live: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<SessionsTableOptions>;

// Archived row excluded by default, matching the filter bar's behavior rule.
const VISIBLE_ROWS = SESSION_ROWS.filter((r) => !r.archived);

const render = (args: SessionsTableOptions) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.background = 'var(--surface-page)';

  const container = document.createElement('div');
  container.className = 'sessions-card';

  let sort: SortState = args.sort ?? DEFAULT_SORT;
  const renderTable = () => {
    container.replaceChildren(
      createSessionsTable({
        ...args,
        rows: sortSessions(args.rows, sort),
        sort,
        onSortChange: (next) => { sort = next; renderTable(); },
      }),
    );
  };
  renderTable();

  wrapper.appendChild(container);
  return wrapper;
};

// ── Default: sorted by Submitted, newest first ──────────────────────────────

export const Default: Story = {
  name: 'Default (Submitted, newest first)',
  render,
  args: {
    rows: VISIBLE_ROWS,
  },
};

// ── Sort moved to another column ─────────────────────────────────────────────

export const SortedByScore: Story = {
  name: 'Sorted by Score (ascending)',
  render,
  args: {
    rows: VISIBLE_ROWS,
    sort: { column: 'score', direction: 'asc' },
  },
};

// ── Cell states (full Figma row set incl. archived) ──────────────────────────
// Demonstrates: score pills (emerald/amber/rose + empty dashed), live rose
// duration, '-' placeholders, progress chips + pulsing ongoing dot, new-learner
// dot, all three format icons (video is a stand-in glyph).

export const CellStates: Story = {
  name: 'Cell states (all rows)',
  render,
  args: {
    rows: SESSION_ROWS,
  },
};
