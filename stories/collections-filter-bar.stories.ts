import type { Meta, StoryObj } from '@storybook/html';
import {
  createCollectionsFilterBar,
  DEFAULT_CATEGORY_OPTIONS,
  type CollectionsFilterBarOptions,
} from '../components/collectionsFilterBar';

const meta: Meta<CollectionsFilterBarOptions> = {
  title: 'Components/Collections Filter Bar',
  argTypes: {
    openMenu: { control: 'select', options: [null, 'categories', 'level', 'status'] },
  },
};

export default meta;
type Story = StoryObj<CollectionsFilterBarOptions>;

// ─── Shared render helpers ───────────────────────────────────────────────────

const page = () => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.minHeight = '420px';
  wrapper.style.background = 'var(--surface-page)';
  return wrapper;
};

const card = () => {
  const el = document.createElement('div');
  el.className = 'sessions-card';
  return el;
};

const baseOptions = (overrides: Partial<CollectionsFilterBarOptions> = {}): CollectionsFilterBarOptions => ({
  categories: DEFAULT_CATEGORY_OPTIONS,
  ...overrides,
});

const render = (args: CollectionsFilterBarOptions) => {
  const wrapper = page();
  const container = card();
  container.appendChild(createCollectionsFilterBar(baseOptions(args)));
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

export const CategoriesTriggerApplied: Story = {
  name: 'Bar — Categories trigger applied with count',
  render,
  args: {
    initialState: { categories: ['recruitment', 'commercial'] },
  },
};

export const CategoriesMenuOpen: Story = {
  name: 'Bar — Categories menu open (multi-select)',
  render,
  args: {
    initialState: { categories: ['recruitment', 'commercial'] },
    openMenu: 'categories',
  },
};

export const LevelMenuOpen: Story = {
  name: 'Bar — Level menu open (single-select)',
  render,
  args: {
    initialState: { level: 'easy' },
    openMenu: 'level',
  },
};

export const LevelValueLabel: Story = {
  name: 'Bar — Level trigger shows value',
  render,
  args: {
    initialState: { level: 'advanced' },
  },
};

export const StatusMenuOpen: Story = {
  name: 'Bar — Status menu open (single-select)',
  render,
  args: {
    initialState: { status: 'draft' },
    openMenu: 'status',
  },
};

export const ClearFiltersVisible: Story = {
  name: 'Bar — Clear filters visible',
  render,
  args: {
    initialState: {
      formats: ['voice-role-play'],
      categories: ['recruitment', 'commercial'],
      level: 'easy',
      status: 'draft',
    },
  },
};

// ─── Documentation ───────────────────────────────────────────────────────────
// The full interactive My Collection page (bar + card grid wired together)
// lives under Pages/My Collections — see stories/collections-page.stories.ts.

export const Documentation: Story = {
  name: 'Docs',
  render: () => {
    const doc = document.createElement('div');
    doc.style.cssText = 'max-width:760px;padding:32px;font-family:var(--font-sans);color:var(--text-primary);line-height:1.55;font-size:var(--fs-base);';
    doc.innerHTML = `
      <h1 style="font-size:24px;margin:0 0 4px;">Collections Filter Bar</h1>
      <p style="color:var(--text-secondary);margin:0 0 24px;">A true-filters-only bar for the My Collections page — same anatomy and interaction model as the <strong>Sessions Filter Bar</strong>, with groups swapped for Collections: Categories / Level / Status.</p>
      <p style="color:var(--text-secondary);margin:0 0 24px;"><strong>Naming:</strong> "Status" here is the simulation lifecycle (Draft / Published). Never reuse "Status" for the learner journey — that's "Progress" on the Sessions page.</p>

      <h2 style="font-size:18px;margin:24px 0 8px;">Anatomy (left → right)</h2>
      <ol style="margin:0;padding-left:20px;">
        <li><strong>Format pills</strong> — Chatbot / Voice Role Play / Video Role Play. Identical behavior and UI to the Sessions Filter Bar: multi-toggle, outline = no filter, active = Mizou blue tint. Multiple can be active (OR within the group).</li>
        <li><strong>Vertical divider</strong> — 1px <code>--border-divider</code>, ~24px tall.</li>
        <li><strong>Dropdown triggers</strong> — Categories / Level / Status. Same pill silhouette as format pills, trailing <code>chevron-down-sm</code>.</li>
        <li><strong>Clear filters</strong> — text link at the end of the trigger group, visible only when ≥1 filter is active.</li>
        <li><strong>Search input</strong> — right-aligned rounded-rectangle input, placeholder "Search simulations", trailing search icon.</li>
      </ol>

      <h2 style="font-size:18px;margin:24px 0 8px;">Trigger labels when applied</h2>
      <ul style="margin:0;padding-left:20px;">
        <li><strong>Multi-select</strong> (Categories): indigo count, e.g. <em>Categories · 2</em>.</li>
        <li><strong>Single-select</strong> (Level, Status): shows the selected <em>value</em>, never a count — <em>Easy</em>, <em>Draft</em>. Nothing active = the group name in default styling.</li>
      </ul>

      <h2 style="font-size:18px;margin:24px 0 8px;">Behavior rules (locked — same model as Sessions)</h2>
      <ul style="margin:0;padding-left:20px;">
        <li>Filter groups combine with <strong>AND</strong>; options within the multi-select Categories group combine with <strong>OR</strong>.</li>
        <li><strong>Categories menu stages its changes.</strong> Checking/unchecking updates a draft only — the grid does not change. <strong>Apply</strong> commits the draft and closes the menu; it is disabled while the draft equals the applied state. Closing without Apply (outside click) discards the draft.</li>
        <li><strong>Level and Status menus apply instantly:</strong> single-select radio lists (All / Easy / Intermediate / Advanced and All / Draft / Published); the menu stays open.</li>
        <li>Only one menu open at a time; outside-click closes.</li>
      </ul>

      <h2 style="font-size:18px;margin:24px 0 8px;">Props</h2>
      <table style="border-collapse:collapse;width:100%;font-size:var(--fs-sm);">
        <tr style="background:var(--primitive-slate-3);"><th style="text-align:left;padding:8px;">Option</th><th style="text-align:left;padding:8px;">Type</th><th style="text-align:left;padding:8px;">Notes</th></tr>
        <tr><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>categories</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>FilterOption[]</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);">Options for the Categories multi-select menu.</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>initialState</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>Partial&lt;CollectionsFilterState&gt;</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);">formats, categories, level, status, search.</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>onChange</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);"><code>(state) =&gt; void</code></td><td style="padding:8px;border-bottom:1px solid var(--border-subtle);">Fires on every committed change. Pair with <code>collectionsFilterPredicate(state)</code>.</td></tr>
        <tr><td style="padding:8px;"><code>openMenu</code></td><td style="padding:8px;"><code>MenuKey</code></td><td style="padding:8px;">Demo/docs hook to open a menu on mount.</td></tr>
      </table>

      <h2 style="font-size:18px;margin:24px 0 8px;">Do / Don't</h2>
      <ul style="margin:0;padding-left:20px;">
        <li style="color:var(--primitive-emerald-dark);"><strong>Do</strong> reuse the Sessions Filter Bar's format pill behavior and CSS verbatim — same classes, same states.</li>
        <li style="color:var(--primitive-rose-dark);"><strong>Don't</strong> apply the Categories checkboxes instantly — they stage to a draft and commit on Apply.</li>
        <li style="color:var(--primitive-rose-dark);"><strong>Don't</strong> show a count on the single-select Level/Status triggers — they show the selected value.</li>
        <li style="color:var(--primitive-rose-dark);"><strong>Don't</strong> show "Clear filters" when nothing is active, and don't allow two open menus at once.</li>
      </ul>
    `;
    return doc;
  },
};
