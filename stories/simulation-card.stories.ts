import type { Meta, StoryObj } from '@storybook/html';
import {
  createSimulationCard,
  type SimulationCardMenuItem,
  type SimulationCardOptions,
  type SimulationCardStatus,
} from '../components/simulationCard';

const meta: Meta<SimulationCardOptions> = {
  title: 'Components/Simulation Card',
  argTypes: {
    title: { control: 'text' },
    status: {
      control: 'select',
      options: ['published', 'ended', 'unpublished', 'draft', 'new', 'with-sessions', 'template'] as SimulationCardStatus[],
    },
    simulationType: { control: 'select', options: ['voice-role-play', 'chatbot', 'video-role-play'] },
    language: { control: 'text' },
    category: { control: 'text' },
    difficulty: { control: 'select', options: ['easy', 'intermediate', 'advanced'] },
    hasUnpublishedChanges: { control: 'boolean' },
    primaryActionLabel: { control: 'text' },
    secondaryActionLabel: { control: 'text' },
    sessionsCount: { control: 'number' },
    newSessionsCount: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<SimulationCardOptions>;

const THUMBNAIL = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80';
const TITLE = 'Motivating an Overwhelmed Employee Without Breaking Trust';

/** Collections → Publications "…" menu for an admin (all permissions). */
const ADMIN_MENU: SimulationCardMenuItem[] = [
  { label: 'Edit', icon: 'edit' },
  { label: 'Remix', icon: 'remix' },
  { label: 'View Sessions', icon: 'sessions' },
  { label: 'Copy share link', icon: 'link' },
  { label: 'Delete', icon: 'delete', danger: true },
];

const BASE: Partial<SimulationCardOptions> = {
  title: TITLE,
  simulationType: 'voice-role-play',
  thumbnailUrl: THUMBNAIL,
  language: 'US',
  category: 'Commercial',
  difficulty: 'intermediate',
  secondaryActionLabel: 'Sessions',
  primaryActionLabel: 'Assign',
  menuItems: ADMIN_MENU,
};

const render = (args: SimulationCardOptions) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.background = 'var(--surface-page)';
  wrapper.style.display = 'flex';
  wrapper.style.gap = '24px';
  wrapper.style.flexWrap = 'wrap';
  wrapper.appendChild(createSimulationCard(args));
  return wrapper;
};

// ── Variant: Published ─────────────────────────────────────────────────────

export const Published: Story = {
  name: 'Published',
  render,
  args: { ...BASE, status: 'published' } as SimulationCardOptions,
};

// ── Variant: Ended ─────────────────────────────────────────────────────────
// No hover Launch, no Assign, no share link in the menu.

export const Ended: Story = {
  name: 'Ended',
  render,
  args: {
    ...BASE,
    status: 'ended',
    menuItems: ADMIN_MENU.filter((i) => i.icon !== 'link'),
  } as SimulationCardOptions,
};

// ── Variant: Unpublished changes ───────────────────────────────────────────
// A published simulation that has been edited but not re-published.
// Banner only (no status chip); the menu gains "Publish changes".

export const UnpublishedChanges: Story = {
  name: 'Unpublished Changes',
  render,
  args: {
    ...BASE,
    status: 'unpublished',
    difficulty: 'advanced',
    menuItems: [
      ...ADMIN_MENU.slice(0, 4),
      { label: 'Publish changes', icon: 'publish' },
      ADMIN_MENU[4],
    ],
  } as SimulationCardOptions,
};

// ── Variant: Ended + unpublished changes ───────────────────────────────────

export const EndedWithUnpublishedChanges: Story = {
  name: 'Ended + Unpublished Changes',
  render,
  args: {
    ...BASE,
    status: 'ended',
    hasUnpublishedChanges: true,
    menuItems: [
      ...ADMIN_MENU.slice(0, 3),
      { label: 'Publish changes', icon: 'publish' },
      ADMIN_MENU[4],
    ],
  } as SimulationCardOptions,
};

// ── Variant: Template ──────────────────────────────────────────────────────
// Collections → Templates Library. No menu; hover "Preview"; "Copy" action.

export const Template: Story = {
  name: 'Template',
  render,
  args: {
    title: TITLE,
    status: 'template',
    simulationType: 'chatbot',
    thumbnailUrl: THUMBNAIL,
    language: 'US',
    category: 'Management',
    difficulty: 'easy',
    primaryActionLabel: 'Copy',
  },
};

// ── Variant: Draft ─────────────────────────────────────────────────────────

export const Draft: Story = {
  name: 'Draft',
  render,
  args: {
    title: TITLE,
    status: 'draft',
    simulationType: 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Commercial',
    difficulty: 'intermediate',
    primaryActionLabel: 'Continue editing',
  },
};

// ── Variant: New (Plan only, no image) ────────────────────────────────────

export const New: Story = {
  name: 'New (Plan)',
  render,
  args: {
    title: TITLE,
    status: 'new',
    primaryActionLabel: 'Continue editing',
  },
};

// ── Variant: With Sessions ─────────────────────────────────────────────────

export const WithSessions: Story = {
  name: 'With Sessions',
  render,
  args: {
    title: TITLE,
    status: 'with-sessions',
    simulationType: 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    language: 'US',
    category: 'Commercial',
    difficulty: 'intermediate',
    sessionsCount: 43,
    newSessionsCount: 2,
  },
};

// ── All variants together ──────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.padding = '24px';
    wrapper.style.background = 'var(--surface-page)';
    wrapper.style.display = 'flex';
    wrapper.style.gap = '24px';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.alignItems = 'flex-start';

    const stories = [Published, Ended, UnpublishedChanges, EndedWithUnpublishedChanges, Template, Draft, New, WithSessions];
    for (const s of stories) {
      wrapper.appendChild(createSimulationCard(s.args as SimulationCardOptions));
    }
    return wrapper;
  },
};
