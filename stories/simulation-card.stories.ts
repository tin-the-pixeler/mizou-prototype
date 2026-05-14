import type { Meta, StoryObj } from '@storybook/html';
import { createSimulationCard, type SimulationCardOptions, type SimulationCardStatus } from '../components/simulationCard';

const meta: Meta<SimulationCardOptions> = {
  title: 'Components/Simulation Card',
  argTypes: {
    title: { control: 'text' },
    status: {
      control: 'select',
      options: ['published', 'ended', 'unpublished', 'draft', 'new', 'with-sessions'] as SimulationCardStatus[],
    },
    simulationType: { control: 'select', options: ['voice-role-play', 'chatbot'] },
    category: { control: 'text' },
    difficulty: { control: 'select', options: ['easy', 'medium', 'hard'] },
    primaryActionLabel: { control: 'text' },
    secondaryActionLabel: { control: 'text' },
    sessionsCount: { control: 'number' },
    newSessionsCount: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<SimulationCardOptions>;

const THUMBNAIL = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80';

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
  args: {
    title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
    status: 'published',
    simulationType: 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Commercial',
    difficulty: 'medium',
    secondaryActionLabel: 'View teams',
    primaryActionLabel: 'Share',
  },
};

// ── Variant: Ended ─────────────────────────────────────────────────────────

export const Ended: Story = {
  name: 'Ended',
  render,
  args: {
    title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
    status: 'ended',
    simulationType: 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Commercial',
    difficulty: 'medium',
    secondaryActionLabel: 'View teams',
    primaryActionLabel: 'Share',
  },
};

// ── Variant: Unpublished changes ───────────────────────────────────────────

export const UnpublishedChanges: Story = {
  name: 'Unpublished Changes',
  render,
  args: {
    title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
    status: 'unpublished',
    simulationType: 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Commercial',
    difficulty: 'medium',
    secondaryActionLabel: 'View teams',
    primaryActionLabel: 'Share',
  },
};

// ── Variant: Draft ─────────────────────────────────────────────────────────

export const Draft: Story = {
  name: 'Draft',
  render,
  args: {
    title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
    status: 'draft',
    simulationType: 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Commercial',
    difficulty: 'medium',
    primaryActionLabel: 'Continue editing',
  },
};

// ── Variant: New (Plan only, no image) ────────────────────────────────────

export const New: Story = {
  name: 'New (Plan)',
  render,
  args: {
    title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
    status: 'new',
    primaryActionLabel: 'Continue editing',
  },
};

// ── Variant: With Sessions ─────────────────────────────────────────────────

export const WithSessions: Story = {
  name: 'With Sessions',
  render,
  args: {
    title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
    status: 'with-sessions',
    simulationType: 'voice-role-play',
    thumbnailUrl: THUMBNAIL,
    category: 'Commercial',
    difficulty: 'medium',
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

    const variants: SimulationCardOptions[] = [
      {
        title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
        status: 'published',
        simulationType: 'voice-role-play',
        thumbnailUrl: THUMBNAIL,
        category: 'Commercial',
        difficulty: 'medium',
        secondaryActionLabel: 'View teams',
        primaryActionLabel: 'Share',
      },
      {
        title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
        status: 'ended',
        simulationType: 'voice-role-play',
        thumbnailUrl: THUMBNAIL,
        category: 'Commercial',
        difficulty: 'medium',
        secondaryActionLabel: 'View teams',
        primaryActionLabel: 'Share',
      },
      {
        title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
        status: 'unpublished',
        simulationType: 'voice-role-play',
        thumbnailUrl: THUMBNAIL,
        category: 'Commercial',
        difficulty: 'medium',
        secondaryActionLabel: 'View teams',
        primaryActionLabel: 'Share',
      },
      {
        title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
        status: 'draft',
        simulationType: 'voice-role-play',
        thumbnailUrl: THUMBNAIL,
        category: 'Commercial',
        difficulty: 'medium',
        primaryActionLabel: 'Continue editing',
      },
      {
        title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
        status: 'new',
        primaryActionLabel: 'Continue editing',
      },
      {
        title: 'Motivating an Overwhelmed Employee Without Breaking Trust',
        status: 'with-sessions',
        simulationType: 'voice-role-play',
        thumbnailUrl: THUMBNAIL,
        category: 'Commercial',
        difficulty: 'medium',
        sessionsCount: 43,
        newSessionsCount: 2,
      },
    ];

    for (const opts of variants) {
      wrapper.appendChild(createSimulationCard(opts));
    }

    return wrapper;
  },
};
