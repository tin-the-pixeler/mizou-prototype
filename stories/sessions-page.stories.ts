import type { Meta, StoryObj } from '@storybook/html';
import {
  createSessionsFilterBar,
  sessionFilterPredicate,
  type SessionsFilterState,
} from '../components/sessionsFilterBar';
import {
  createSessionsTable,
  sortSessions,
  DEFAULT_SORT,
  type SortState,
} from '../components/sessionsTable';
import { LEARNER_OPTIONS, SIMULATION_OPTIONS, SESSION_ROWS } from './sessions-demo-data';

const meta: Meta = {
  title: 'Pages/Sessions',
};

export default meta;
type Story = StoryObj;

// Full Sessions page: filter bar + table wired together with the real
// component APIs — the bar narrows the rows, the column headers sort them.

export const SessionsPage: Story = {
  name: 'Sessions Page (interactive)',
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.padding = '24px';
    wrapper.style.minHeight = '420px';
    wrapper.style.background = 'var(--surface-page)';

    const title = document.createElement('h1');
    title.textContent = 'Sessions';
    title.style.cssText = 'font-family:var(--font-sans);font-size:24px;font-weight:var(--fw-bold);margin:0 0 16px;color:var(--text-primary);';
    wrapper.appendChild(title);

    const container = document.createElement('div');
    container.className = 'sessions-card';
    wrapper.appendChild(container);

    let filterState: SessionsFilterState = {
      formats: [], learners: [], simulations: [], progress: null, showArchived: false, search: '',
    };
    let sort: SortState = DEFAULT_SORT;

    const tableHost = document.createElement('div');
    tableHost.className = 'sst-scroll';

    const visibleRows = () => {
      const keep = sessionFilterPredicate(filterState);
      return SESSION_ROWS.filter((row) =>
        keep({
          format: row.simulation.format,
          learnerId: row.learner.id,
          simulationId: row.simulation.id,
          progress: row.progress,
          archived: row.archived,
          searchText: `${row.learner.name} ${row.simulation.title}`,
        }),
      );
    };

    const renderTable = () => {
      tableHost.replaceChildren(
        createSessionsTable({
          rows: sortSessions(visibleRows(), sort),
          sort,
          onSortChange: (next) => { sort = next; renderTable(); },
        }),
      );
    };

    const bar = createSessionsFilterBar({
      learners: LEARNER_OPTIONS,
      simulations: SIMULATION_OPTIONS,
      onChange: (state) => { filterState = state; renderTable(); },
    });

    container.append(bar, tableHost);
    renderTable();
    return wrapper;
  },
};
