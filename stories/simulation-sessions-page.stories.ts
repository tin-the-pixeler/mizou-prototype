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
import { SIMULATION_LEARNER_OPTIONS, SIMULATION_SESSION_ROWS } from './simulation-sessions-demo-data';

const meta: Meta = {
  title: 'Pages/Simulation Sessions',
};

export default meta;
type Story = StoryObj;

// Simulation Sessions List Page: the session list for a single simulation.
// Same filter-bar/table primitives as the Sessions page, but scoped to one
// simulation — the filter bar only exposes Learners + Progress (no format
// pills, no Simulations picker) and the table drops the Simulation column.

export const SimulationSessionsPage: Story = {
  name: 'Simulation Sessions List Page (interactive)',
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.padding = '24px';
    wrapper.style.minHeight = '420px';
    wrapper.style.background = 'var(--surface-page)';

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
      return SIMULATION_SESSION_ROWS.filter((row) =>
        keep({
          format: row.simulation.format,
          learnerId: row.learner.id,
          simulationId: row.simulation.id,
          progress: row.progress,
          archived: row.archived,
          searchText: row.learner.name,
        }),
      );
    };

    const renderTable = () => {
      tableHost.replaceChildren(
        createSessionsTable({
          rows: sortSessions(visibleRows(), sort),
          sort,
          onSortChange: (next) => { sort = next; renderTable(); },
          showSimulationColumn: false,
        }),
      );
    };

    const bar = createSessionsFilterBar({
      learners: SIMULATION_LEARNER_OPTIONS,
      simulations: [],
      showFormats: false,
      showSimulations: false,
      onChange: (state) => { filterState = state; renderTable(); },
    });

    container.append(bar, tableHost);
    renderTable();
    return wrapper;
  },
};
