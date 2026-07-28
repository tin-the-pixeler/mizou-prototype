import type { Meta, StoryObj } from '@storybook/html';
import {
  createCollectionsFilterBar,
  collectionsFilterPredicate,
  DEFAULT_CATEGORY_OPTIONS,
  type CollectionsFilterState,
} from '../components/collectionsFilterBar';
import { createSimulationCard } from '../components/simulationCard';
import { COLLECTION_ITEMS, toSimulationCardOptions } from './collections-demo-data';

const meta: Meta = {
  title: 'Pages/My Collections',
};

export default meta;
type Story = StoryObj;

// Full My Collections page: filter bar + card grid wired together — the bar
// narrows which cards render. Mirrors stories/sessions-page.stories.ts.

export const MyCollectionsPage: Story = {
  name: 'My Collections Page (interactive)',
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.padding = '24px';
    wrapper.style.minHeight = '420px';
    wrapper.style.background = 'var(--surface-page)';

    const title = document.createElement('h1');
    title.textContent = 'My Collection';
    title.style.cssText = 'font-family:var(--font-sans);font-size:24px;font-weight:var(--fw-bold);margin:0 0 16px;color:var(--text-primary);';
    wrapper.appendChild(title);

    const container = document.createElement('div');
    container.className = 'sessions-card';
    wrapper.appendChild(container);

    let filterState: CollectionsFilterState = {
      formats: [], categories: [], level: null, status: null, search: '',
    };

    const gridHost = document.createElement('div');
    gridHost.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:20px;padding:20px;';

    const renderGrid = () => {
      const keep = collectionsFilterPredicate(filterState);
      const visible = COLLECTION_ITEMS.filter((item) =>
        keep({
          format: item.format,
          categoryId: item.categoryId,
          level: item.level,
          status: item.status,
          searchText: item.title,
        }),
      );
      gridHost.replaceChildren(...visible.map((item) => createSimulationCard(toSimulationCardOptions(item))));
    };

    const bar = createCollectionsFilterBar({
      categories: DEFAULT_CATEGORY_OPTIONS,
      onChange: (state) => { filterState = state; renderGrid(); },
    });

    container.append(bar, gridHost);
    renderGrid();
    return wrapper;
  },
};
