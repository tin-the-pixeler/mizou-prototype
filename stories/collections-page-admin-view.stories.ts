import type { Meta, StoryObj } from '@storybook/html';
import {
  createCollectionsPageAdminView,
  type CollectionsPageAdminViewOptions,
} from '../components/collectionsPageAdminView';
import {
  COLLECTIONS_CATEGORIES,
  COLLECTIONS_TEAMS,
  PUBLICATIONS,
  TEMPLATES,
} from './collections-admin-view-demo-data';

// Collections page as an admin sees it in production (app.mizou.com → "/").
// Replaces the older Pages/My Collections story, which predated the production
// layout and mixed drafts into the grid.

const meta: Meta = {
  title: 'Pages/Collections - Admin View',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const render = (overrides: Partial<CollectionsPageAdminViewOptions> = {}) => () =>
  createCollectionsPageAdminView({
    teams: COLLECTIONS_TEAMS,
    publications: PUBLICATIONS,
    templates: TEMPLATES,
    categories: COLLECTIONS_CATEGORIES,
    ...overrides,
  });

export const Publications: Story = {
  name: 'Publications',
  render: render(),
};

export const TemplatesLibrary: Story = {
  name: 'Templates Library',
  render: render({ initialTab: 'templates' }),
};

export const CardMenuOpen: Story = {
  name: 'Card "…" menu open (unpublished changes)',
  render: render({ openMenuFor: 'pub-price-objection' }),
};

export const EndedOnly: Story = {
  name: 'Filtered — Status: Ended',
  render: render({ initialFilters: { status: 'ended' } }),
};

export const NoResults: Story = {
  name: 'Filtered — No results',
  render: render({ initialFilters: { search: 'zzz no match' } }),
};

export const EmptyPublications: Story = {
  name: 'Empty Publications → redirects to Templates',
  render: render({ publications: [] }),
};
