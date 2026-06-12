import type { Meta, StoryObj } from '@storybook/html';
import {
  createSessionsFilterBar,
  sessionFilterPredicate,
  type SessionsFilterBarOptions,
  type SessionsFilterState,
} from '../components/sessionsFilterBar';
import {
  createSessionsTable,
  sortSessions,
  DEFAULT_SORT,
  type SortState,
} from '../components/sessionsTable';
import { LEARNER_OPTIONS, SIMULATION_OPTIONS, SESSION_ROWS } from './sessions-demo-data';

const meta: Meta<SessionsFilterBarOptions> = {
  title: 'Components/Sessions Filter Bar',
  argTypes: {
    layout: { control: 'select', options: ['desktop', 'tablet'] },
    openMenu: { control: 'select', options: [null, 'learners', 'simulations', 'progress'] },
    drawerOpen: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<SessionsFilterBarOptions>;

// ─── Shared render helpers ───────────────────────────────────────────────────

const page = (tablet = false) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.minHeight = '420px';
  wrapper.style.background = 'var(--surface-page)';
  if (tablet) wrapper.style.maxWidth = '900px';
  return wrapper;
};

const card = (tablet = false) => {
  const el = document.createElement('div');
  el.className = `sessions-card${tablet ? ' sessions-card--tablet' : ''}`;
  return el;
};

const baseOptions = (overrides: Partial<SessionsFilterBarOptions> = {}): SessionsFilterBarOptions => ({
  learners: LEARNER_OPTIONS,
  simulations: SIMULATION_OPTIONS,
  ...overrides,
});

const render = (args: SessionsFilterBarOptions) => {
  const wrapper = page(args.layout === 'tablet');
  const container = card(args.layout === 'tablet');
  container.appendChild(createSessionsFilterBar(baseOptions(args)));
  wrapper.appendChild(container);
  return wrapper;
};

// ─── Bar states ──────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Bar — Default',
  render,
  args: {},
};

export const FormatPillsActive: Story = {
  name: 'Bar — Format pills active',
  render,
  args: {
    initialState: { formats: ['chatbot', 'voice-role-play'] },
  },
};

export const TriggerApplied: Story = {
  name: 'Bar — Trigger applied with count',
  render,
  args: {
    initialState: { learners: ['l1', 'l4'] },
  },
};

export const LearnersMenuOpen: Story = {
  name: 'Bar — Learners menu open',
  render,
  args: {
    initialState: { learners: ['l1', 'l4'] },
    openMenu: 'learners',
  },
};

export const ProgressMenuOpen: Story = {
  name: 'Bar — Progress menu open',
  render,
  args: {
    initialState: { progress: 'completed' },
    openMenu: 'progress',
  },
};

export const ProgressValueLabel: Story = {
  name: 'Bar — Progress trigger shows value',
  render,
  args: {
    initialState: { progress: 'ongoing', showArchived: true },
  },
};

export const ClearFiltersVisible: Story = {
  name: 'Bar — Clear filters visible',
  render,
  args: {
    initialState: {
      formats: ['voice-role-play'],
      learners: ['l1', 'l4'],
      simulations: ['s2'],
      progress: 'completed',
      showArchived: true,
    },
  },
};

// ─── Tablet states ───────────────────────────────────────────────────────────

export const TabletCollapsed: Story = {
  name: 'Tablet — Collapsed (Filters · N + chips row)',
  render,
  args: {
    layout: 'tablet',
    initialState: { learners: ['l1', 'l4'], progress: 'completed' },
  },
};

export const TabletDrawerOpen: Story = {
  name: 'Tablet — Drawer open',
  render,
  args: {
    layout: 'tablet',
    initialState: { learners: ['l1', 'l4'], progress: 'completed' },
    drawerOpen: true,
  },
};

// ─── Full Sessions page (interactive) ────────────────────────────────────────
// Bar + table wired together: bar narrows the rows, headers sort them.

export const SessionsPage: Story = {
  name: 'Sessions Page (interactive)',
  render: () => {
    const wrapper = page();

    const title = document.createElement('h1');
    title.textContent = 'Sessions';
    title.style.cssText = 'font-family:var(--font-sans);font-size:24px;font-weight:var(--fw-bold);margin:0 0 16px;color:var(--text-primary);';
    wrapper.appendChild(title);

    const container = card();
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

    const bar = createSessionsFilterBar(
      baseOptions({
        onChange: (state) => { filterState = state; renderTable(); },
      }),
    );

    container.append(bar, tableHost);
    renderTable();
    return wrapper;
  },
};

// ─── Documentation ───────────────────────────────────────────────────────────

export const Documentation: Story = {
  name: 'Docs',
  render: () => {
    const doc = document.createElement('div');
    doc.style.cssText = 'max-width:760px;padding:32px;font-family:var(--font-sans);color:var(--text-primary);line-height:1.55;font-size:var(--fs-base);';
    doc.innerHTML = `
      <h1 style="font-size:24px;margin:0 0 4px;">Sessions Filter Bar</h1>
      <p style="color:var(--text-secondary);margin:0 0 24px;">A true-filters-only bar for the Sessions page, with its companion Sortable Table Header pattern. Everything in the bar <strong>narrows</strong> data; nothing in the bar sorts — sorting lives in the table column headers.</p>
      <p style="color:var(--text-secondary);margin:0 0 24px;"><strong>Naming:</strong> the learner journey on Sessions is <strong>Progress</strong> (Completed / Ongoing / Not started). "Status" is reserved for simulation lifecycle (Draft, Published) on the Collections page — never use it here.</p>

      <h2 style="font-size:18px;margin:24px 0 8px;">Anatomy (left → right)</h2>
      <ol style="margin:0;padding-left:20px;">
        <li><strong>Format pills</strong> — Chatbot / Voice Role Play / Video Role Play. Multi-toggle: outline = no filter (all formats); filled (slate-12 bg, white text) = filtered to that format. Multiple can be active (OR within the group).</li>
        <li><strong>Vertical divider</strong> — 1px <code>--border-divider</code>, ~24px tall.</li>
        <li><strong>Dropdown triggers</strong> — Learners / Simulations / Progress. Pill-shaped (<code>--radius-full</code>), same silhouette as format pills, never rectangles. Trailing <code>chevron-down-sm</code>. Applied triggers tint <code>--feedback-info-bg-subtle</code> with <code>--interactive-primary</code> border/text.</li>
        <li><strong>Clear filters</strong> — text link at the end of the trigger group, visible only when ≥1 filter is active.</li>
        <li><strong>Search input</strong> — right-aligned pill input, placeholder "Search", trailing search icon.</li>
      </ol>

      <h2 style="font-size:18px;margin:24px 0 8px;">Trigger labels when applied</h2>
      <ul style="margin:0;padding-left:20px;">
        <li><strong>Multi-select</strong> (Learners, Simulations): indigo count, e.g. <em>Learners · 2</em>.</li>
        <li><strong>Single-select</strong> (Progress): shows the selected <em>value</em>, never a count — <em>Completed</em>; with archived on, <em>Completed, Archived</em>; archived only, <em>Archived</em>. Nothing active = <em>Progress</em> in default styling.</li>
      </ul>

      <h2 style="font-size:18px;margin:24px 0 8px;">Behavior rules (locked — "Option A")</h2>
      <ul style="margin:0;padding-left:20px;">
        <li>Filter groups combine with <strong>AND</strong>; options within a multi-select group combine with <strong>OR</strong>.</li>
        <li><strong>Multi-select menus stage their changes.</strong> Checking/unchecking updates a draft only — the table does not change. <strong>Apply</strong> at the bottom of the menu commits the draft and closes the menu; it is disabled while the draft equals the applied state. Closing without Apply (outside click) discards the draft. The trigger count updates only on Apply. Same draft/commit model as the tablet drawer.</li>
        <li>The in-menu search field filters the option list live (it never touches the table).</li>
        <li><strong>Progress menu applies instantly:</strong> single-select radio list (All / Completed / Ongoing / Not started) <em>plus</em> a "Show archived" toggle, separated by a divider; the menu stays open. Archived sessions are hidden unless the toggle is on.</li>
        <li>Only one menu open at a time; outside-click closes.</li>
      </ul>

      <h2 style="font-size:18px;margin:24px 0 8px;">Sortable Table Header (companion pattern)</h2>
      <ul style="margin:0;padding-left:20px;">
        <li>Header row sits on a light slate band (<code>--primitive-slate-3</code>).</li>
        <li><strong>Score, Duration, Submitted</strong> are sortable; Learners, Simulation, Progress are not.</li>
        <li>Exactly one active sort. Click toggles asc/desc; clicking another sortable header moves the sort there. Default: <strong>Submitted, newest first</strong> (descending).</li>
        <li>Inactive sortable: muted stacked up/down indicator. Active: single direction arrow + emphasized (extrabold, darker) label.</li>
        <li>First header cell reads <em>Learners (8 total)</em> with an indigo <em>1 new</em> annotation (count = visible rows).</li>
      </ul>

      <h2 style="font-size:18px;margin:24px 0 8px;">Tablet (768–1024px) — locked</h2>
      <ul style="margin:0;padding-left:20px;">
        <li>Format pills stay visible; the three dropdown triggers collapse into one <strong>Filters · N</strong> pill (N = active non-format filters) opening a right slide-in drawer with stacked groups and a Clear all + Apply footer.</li>
        <li>Active filters render as removable chips (<em>label ×</em>) under the bar, plus a Clear all link.</li>
        <li>Sorting stays in the column headers; the table scrolls horizontally with Learners + Simulation prioritized.</li>
        <li>In app code, switch <code>layout: 'tablet'</code> via <code>matchMedia('(max-width: 1024px)')</code>.</li>
      </ul>

      <h2 style="font-size:18px;margin:24px 0 8px;">Props</h2>
      <table style="border-collapse:collapse;width:100%;font-size:var(--fs-sm);">
        <tr style="background:var(--primitive-slate-3);"><th style="text-align:left;padding:8px;">Option</th><th style="text-align:left;padding:8px;">Type</th><th style="text-align:left;padding:8px;">Notes</th></tr>
        <tr><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>learners</code> / <code>simulations</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>FilterOption[]</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);">Options for the multi-select menus.</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>initialState</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>Partial&lt;SessionsFilterState&gt;</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);">formats, learners, simulations, progress, showArchived, search.</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>layout</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>'desktop' | 'tablet'</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);">Tablet collapses triggers into Filters · N + drawer + chips row.</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>onChange</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>(state) =&gt; void</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);">Fires on every committed change. Pair with <code>sessionFilterPredicate(state)</code>.</td></tr>
        <tr><td style="padding:8px;"><code>openMenu</code> / <code>drawerOpen</code></td><td style="padding:8px;"><code>MenuKey | boolean</code></td><td style="padding:8px;">Demo/docs hooks to open UI on mount.</td></tr>
      </table>

      <h2 style="font-size:18px;margin:24px 0 8px;">Do / Don't</h2>
      <ul style="margin:0;padding-left:20px;">
        <li style="color:var(--primitive-emerald-dark);"><strong>Do</strong> keep every control in the bar a narrowing filter; let column headers own sorting.</li>
        <li style="color:var(--primitive-emerald-dark);"><strong>Do</strong> use pill silhouettes (<code>--radius-full</code>) for both format pills and dropdown triggers.</li>
        <li style="color:var(--primitive-rose-dark);"><strong>Don't</strong> call the learner journey "Status" — Status is the simulation lifecycle on Collections; here it is Progress.</li>
        <li style="color:var(--primitive-rose-dark);"><strong>Don't</strong> show a count on the single-select Progress trigger — it shows the selected value ("Completed, Archived").</li>
        <li style="color:var(--primitive-rose-dark);"><strong>Don't</strong> apply multi-select checkboxes instantly — they stage to a draft and commit on Apply.</li>
        <li style="color:var(--primitive-rose-dark);"><strong>Don't</strong> add a "Sort by" dropdown to the bar — it never sorts.</li>
        <li style="color:var(--primitive-rose-dark);"><strong>Don't</strong> show "Clear filters" when nothing is active, and don't allow two open menus or two active sorts at once.</li>
      </ul>

      <h2 style="font-size:18px;margin:24px 0 8px;">Icon requests (for the library owner)</h2>
      <p style="margin:0 0 8px;color:var(--text-secondary);">The set in <code>assets/icons/</code> is missing these glyphs. The build uses hand-drawn stand-ins styled to the 1.5px-stroke convention — replace once the icons ship:</p>
      <ul style="margin:0;padding-left:20px;">
        <li><code>sort-neutral</code> / <code>sort-asc</code> / <code>sort-desc</code> — table header sort indicators (active state currently uses <code>chevron-down-sm</code>, rotated for asc).</li>
        <li><code>search</code> — bar search input + in-menu search fields.</li>
        <li><code>video-camera</code> — Video Role Play format icon.</li>
        <li><code>close-x</code> — chip remove + drawer close.</li>
      </ul>
    `;
    return doc;
  },
};
