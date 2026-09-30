// components/collectionsPageAdminView.ts
// Collections page as an admin sees it in production (app.mizou.com → "/").
// Source: mizou-business Collections.container + Simulations.container +
// SimulationCard.tsx.
//
// - Sidebar (production nav, Collections expanded) + topbar + white panel
// - Tabs: Publications (default) / Templates Library
// - Publications: published simulations only; filters = formats, Category,
//   Level, Status (Active / Ended), search. Cards: "…" menu, Sessions + Assign
//   (Assign opens the Share modal; hidden once ended), Launch on hover
//   (not when ended), amber "Unpublished changes" banner for edited sims.
// - Templates Library: no Status filter, no "…" menu, Preview on hover and on
//   card click, full-width Copy.
// - An empty Publications tab redirects to Templates Library (production
//   behaviour for users who can view templates).

import '../styles/collections-page-admin-view.css';
import { createSidebarEnterpriseV2, type SidebarV2NavKey, type SidebarV2Team } from './sidebarEnterpriseV2';
import { createTopbarPrimary } from './topbarPrimary';
import { createTabsNav } from './tabsNav';
import {
  createCollectionsFilterBar,
  collectionsFilterPredicate,
  DEFAULT_CATEGORY_OPTIONS,
  type CollectionLevel,
  type CollectionsFilterState,
  type FilterOption,
} from './collectionsFilterBar';
import type { SessionFormat } from './sessionsFilterBar';
import {
  createSimulationCard,
  type SimulationCardMenuItem,
  type SimulationCardOptions,
} from './simulationCard';
import { createShareModal } from './shareModal';
import { createModal } from './modal';
import type { IconName } from '../icons';

// ─── Types ──────────────────────────────────────────────────────────────────

export type CollectionsTabKey = 'publications' | 'templates';

export type CollectionsItem = {
  id: string;
  title: string;
  format: SessionFormat;
  categoryId: string;
  category: string;
  level: CollectionLevel;
  /** Country code for the language chip, e.g. "US" */
  language?: string;
  thumbnailUrl?: string;
  /** Production `is_terminated` → 'ended' */
  availability: 'active' | 'ended';
  /** latest_artifact_version > artifact_version */
  hasUnpublishedChanges?: boolean;
  /** Templates only — shown in the preview modal */
  description?: string;
};

export type CollectionsPageAdminViewOptions = {
  orgName?: string;
  orgLogo?: IconName;
  userInitial?: string;
  teams?: SidebarV2Team[];
  initialTab?: CollectionsTabKey;
  publications?: CollectionsItem[];
  templates?: CollectionsItem[];
  categories?: FilterOption[];
  /** Open the "…" menu of this publication on mount (for docs/demos). */
  openMenuFor?: string;
  /** Initial filter state for the active tab (for docs/demos). */
  initialFilters?: Partial<CollectionsFilterState>;
};

const TABS: { key: CollectionsTabKey; label: string }[] = [
  { key: 'publications', label: 'Publications' },
  { key: 'templates', label: 'Templates Library' },
];

const SUB_ITEM_TO_TAB: Record<string, CollectionsTabKey> = {
  Publications: 'publications',
  'Templates Library': 'templates',
};

// ─── Factory ────────────────────────────────────────────────────────────────

export function createCollectionsPageAdminView({
  orgName = 'Lumon Industries',
  orgLogo,
  userInitial = 'C',
  teams = [],
  initialTab = 'publications',
  publications = [],
  templates = [],
  categories = DEFAULT_CATEGORY_OPTIONS,
  openMenuFor,
  initialFilters,
}: CollectionsPageAdminViewOptions = {}): HTMLElement {
  let items = [...publications];
  let currentTab: CollectionsTabKey = initialTab;
  let sidebarCollapsed = false;
  let hasAutoRedirected = false;
  let pendingInitialFilters = initialFilters;

  const page = el('div', 'team-page cpav');

  const sidebarSlot = el('div', 'team-page__sidebar-slot');
  const mainArea = el('div', 'team-page__main');
  page.append(sidebarSlot, mainArea);

  const topbarSlot = el('div');
  const panelWrapper = el('div', 'team-page__panel-wrapper');
  const panel = el('div', 'team-page__panel');
  const tabsWrapper = el('div', 'team-page__tabs-wrapper');
  const content = el('div', 'team-page__container');
  panel.append(tabsWrapper, content);
  panelWrapper.appendChild(panel);
  mainArea.append(topbarSlot, panelWrapper);

  topbarSlot.appendChild(
    createTopbarPrimary({ title: 'Collections', planLabel: 'Enterprise', userInitial, hideTitleChevron: true }),
  );

  // ── Sidebar ──
  function renderSidebar() {
    sidebarSlot.replaceChildren(
      createSidebarEnterpriseV2({
        orgName,
        ...(orgLogo ? { orgLogo } : {}),
        teams,
        fullNav: true,
        activeItem: 'collections',
        activeSubItem: TABS.find((t) => t.key === currentTab)?.label,
        collapsed: sidebarCollapsed,
        onCollapsedChange: (c) => { sidebarCollapsed = c; },
        onNavItemClick: (item: SidebarV2NavKey, sub?: string) => {
          if (item === 'collections') setTab(SUB_ITEM_TO_TAB[sub ?? 'Publications'] ?? 'publications');
          else toast(`Navigates to ${labelFor(item)}`);
        },
      }),
    );
  }

  // ── Tabs ──
  function renderTabs() {
    tabsWrapper.replaceChildren(
      createTabsNav({
        items: TABS,
        activeKey: currentTab,
        onChange: (key) => setTab(key as CollectionsTabKey),
      }),
    );
  }

  function setTab(tab: CollectionsTabKey) {
    if (tab === currentTab) return;
    currentTab = tab;
    renderSidebar();
    renderTabs();
    renderContent();
  }

  // ── Content ──
  function renderContent() {
    // Production: empty Publications → redirect once to Templates Library.
    if (currentTab === 'publications' && items.length === 0 && !hasAutoRedirected && templates.length) {
      hasAutoRedirected = true;
      currentTab = 'templates';
      renderSidebar();
      renderTabs();
    }

    const isTemplates = currentTab === 'templates';
    const source = isTemplates ? templates : items;

    const tab = el('div', 'team-page__tab cpav__tab');
    const filterWrap = el('div', 'team-page__filters');
    const grid = el('div', 'team-page__card-grid cpav__grid');
    const empty = el('div', 'cpav__empty');
    tab.append(filterWrap, grid, empty);

    let filterState: CollectionsFilterState = {
      formats: [], categories: [], level: null, status: null, search: '',
      ...pendingInitialFilters,
    };
    const initialState = pendingInitialFilters;
    pendingInitialFilters = undefined;

    const renderGrid = () => {
      const keep = collectionsFilterPredicate(filterState);
      const visible = source.filter((item) =>
        keep({
          format: item.format,
          categoryId: item.categoryId,
          level: item.level,
          status: item.availability,
          searchText: item.title,
        }),
      );
      grid.replaceChildren(...visible.map((item) => buildCard(item, isTemplates)));

      const filtersOn =
        filterState.formats.length > 0 || filterState.categories.length > 0 ||
        filterState.level !== null || filterState.status !== null || filterState.search.trim() !== '';
      if (visible.length) {
        empty.replaceChildren();
        empty.hidden = true;
      } else {
        empty.hidden = false;
        empty.replaceChildren(
          ...emptyState(
            filtersOn ? 'No results found' : 'Publish your first simulation',
            filtersOn
              ? "We couldn't find any matches. Try searching again."
              : 'Create your first simulation or copy a template and customize it.',
          ),
        );
      }
    };

    filterWrap.appendChild(
      createCollectionsFilterBar({
        categories,
        hideStatus: isTemplates,
        statusMode: 'availability',
        searchPlaceholder: 'Search...',
        initialState,
        onChange: (state) => { filterState = state; renderGrid(); },
      }),
    );

    renderGrid();
    content.replaceChildren(tab);
  }

  // ── Cards ──
  function buildCard(item: CollectionsItem, isTemplate: boolean): HTMLElement {
    const base: SimulationCardOptions = {
      title: item.title,
      status: 'published',
      simulationType: item.format,
      thumbnailUrl: item.thumbnailUrl,
      language: item.language,
      category: item.category,
      difficulty: item.level,
    };

    if (isTemplate) {
      return createSimulationCard({
        ...base,
        status: 'template',
        primaryActionLabel: 'Copy',
        onPrimaryAction: () => toast(`"${short(item.title)}" copied to your collection`),
        onPreviewClick: () => openPreview(item),
      });
    }

    const ended = item.availability === 'ended';
    const card = createSimulationCard({
      ...base,
      status: ended ? 'ended' : 'published',
      hasUnpublishedChanges: item.hasUnpublishedChanges,
      secondaryActionLabel: 'Sessions',
      primaryActionLabel: 'Assign',
      onSecondaryAction: () => toast('Opens the Sessions page filtered to this simulation'),
      onPrimaryAction: () => openShare(),
      onPreviewClick: () => toast(`Launching "${short(item.title)}"`),
      menuItems: menuFor(item),
    });
    card.dataset.id = item.id;
    return card;
  }

  /** Admin "…" menu — production order, items gated by state. */
  function menuFor(item: CollectionsItem): SimulationCardMenuItem[] {
    const ended = item.availability === 'ended';
    return [
      { label: 'Edit', icon: 'edit', onClick: () => toast('Opens the simulation builder') },
      { label: 'Remix', icon: 'remix', onClick: () => remix(item) },
      { label: 'View Sessions', icon: 'sessions', onClick: () => toast('Opens the Sessions page filtered to this simulation') },
      ...(!ended
        ? [{ label: 'Copy share link', icon: 'link' as const, onClick: () => toast('Share link copied') }]
        : []),
      ...(item.hasUnpublishedChanges
        ? [{ label: 'Publish changes', icon: 'publish' as const, onClick: () => publishChanges(item) }]
        : []),
      { label: 'Delete', icon: 'delete', danger: true, onClick: () => confirmDelete(item) },
    ];
  }

  function remix(item: CollectionsItem) {
    toast(`"${short(item.title)}" remixed into My Drafts`);
  }

  function publishChanges(item: CollectionsItem) {
    items = items.map((i) => (i.id === item.id ? { ...i, hasUnpublishedChanges: false } : i));
    renderContent();
    toast('Changes published');
  }

  function confirmDelete(item: CollectionsItem) {
    const body = document.createElement('div');
    body.innerHTML =
      `You are about to delete <strong>${escapeHtml(item.title)}</strong>. ` +
      'Once deleted, members will no longer have access to this simulation. However, any existing session data will be kept.' +
      '<br><br>This action cannot be undone. Are you sure you want to proceed?';
    const modal = createModal({
      title: 'Delete Simulation',
      body,
      actions: {
        secondary: { label: 'Cancel', onClick: () => modal.remove() },
        primary: {
          label: 'Delete',
          onClick: () => {
            modal.remove();
            items = items.filter((i) => i.id !== item.id);
            renderContent();
            toast('Simulation deleted');
          },
        },
      },
    });
    document.body.appendChild(modal);
  }

  function openShare() {
    // createShareModal brings its own backdrop, Escape and click-outside handling
    document.body.appendChild(createShareModal());
  }

  function openPreview(item: CollectionsItem) {
    const preview = el('div', 'cpav__preview');
    if (item.thumbnailUrl) {
      const img = document.createElement('img');
      img.className = 'cpav__preview-img';
      img.src = item.thumbnailUrl;
      img.alt = '';
      preview.appendChild(img);
    }
    const meta = el('div', 'cpav__preview-meta');
    meta.textContent = [item.language, item.category, levelLabel(item.level)].filter(Boolean).join(' · ');
    preview.appendChild(meta);

    const modal = createModal({
      title: item.title,
      body: item.description ?? '',
      content: preview,
      width: 650,
      actions: {
        secondary: { label: 'Close', onClick: () => modal.remove() },
        primary: {
          label: 'Copy',
          onClick: () => {
            modal.remove();
            toast(`"${short(item.title)}" copied to your collection`);
          },
        },
      },
    });
    document.body.appendChild(modal);
  }

  renderSidebar();
  renderTabs();
  renderContent();

  // Docs/demo: open a card's "…" menu once the page is in the DOM.
  if (openMenuFor) {
    const tryOpen = (attempt = 0) => {
      const btn = page.querySelector<HTMLButtonElement>(`.sim-card[data-id="${openMenuFor}"] .sim-card__menu-btn`);
      // Wait until the page is mounted and laid out so the menu can anchor to the button
      if (!btn || !page.isConnected || btn.getBoundingClientRect().width === 0) {
        if (attempt < 50) window.setTimeout(() => tryOpen(attempt + 1), 50);
        return;
      }
      btn.click();
    };
    tryOpen();
  }

  return page;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function el(tag: string, className = ''): HTMLElement {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function emptyState(title: string, subtitle: string): HTMLElement[] {
  const t = el('div', 'cpav__empty-title');
  t.textContent = title;
  const s = el('div', 'cpav__empty-subtitle');
  s.textContent = subtitle;
  return [t, s];
}

function levelLabel(level: CollectionLevel): string {
  return { easy: 'Easy', intermediate: 'Intermediate', advanced: 'Advanced' }[level];
}

function labelFor(item: SidebarV2NavKey): string {
  return { 'my-drafts': 'My Drafts', 'learning-hub': 'My Learning Hub', collections: 'Collections', 'all-sessions': 'All Sessions' }[item];
}

function short(title: string): string {
  return title.length > 48 ? `${title.slice(0, 45)}…` : title;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

let toastTimer: number | undefined;
/** Lightweight demo toast (bottom-centre), stands in for react-hot-toast. */
function toast(message: string) {
  let host = document.querySelector<HTMLElement>('.cpav-toast');
  if (!host) {
    host = el('div', 'cpav-toast');
    host.setAttribute('role', 'status');
    document.body.appendChild(host);
  }
  host.textContent = message;
  host.classList.add('cpav-toast--visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => host!.classList.remove('cpav-toast--visible'), 2200);
}
