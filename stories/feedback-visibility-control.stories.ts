import type { Meta, StoryObj } from '@storybook/html';
import {
  createFeedbackVisibilityControl,
  type FeedbackVisibilityControlOptions,
} from '../components/feedbackVisibilityControl';

const meta: Meta<FeedbackVisibilityControlOptions> = {
  title: 'Components/Feedback Visibility Control',
  render: (args) => createFeedbackVisibilityControl(args),
  args: { visibility: 'hidden', variant: 'badge', disabled: false },
  argTypes: {
    visibility: { control: 'select', options: ['visible', 'hidden'] },
    variant: { control: 'select', options: ['badge', 'icon'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<FeedbackVisibilityControlOptions>;

export const VisibleToManager: Story = {
  name: 'Visible to Manager',
  args: { visibility: 'visible' },
};

export const HiddenFromManager: Story = {
  name: 'Hidden from Manager',
  args: { visibility: 'hidden' },
};

export const IconVisible: Story = {
  name: 'Icon — Visible',
  args: { visibility: 'visible', variant: 'icon' },
};

export const IconHidden: Story = {
  name: 'Icon — Hidden',
  args: { visibility: 'hidden', variant: 'icon' },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: { visibility: 'hidden', disabled: true },
};

/** Mirrors the feedback drawer topbar: title, submitted date, status chip, plus the control. */
function topbar(visibility: 'visible' | 'hidden', variant: 'badge' | 'icon'): HTMLElement {
  const bar = document.createElement('div');
  bar.style.cssText =
    'display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-xs) var(--spacing-sm);' +
    'background:var(--surface-raised);border:1px solid var(--border-default);border-radius:var(--radius-container);' +
    'font-family:var(--font-sans);max-width:720px;';

  const title = document.createElement('h3');
  title.className = 'feedback-drawer__title';
  title.textContent = 'Discovery Call with Acme Corp.';

  const spacer = document.createElement('div');
  spacer.style.flex = '1 0 0';

  const submitted = document.createElement('span');
  submitted.className = 'feedback-drawer__submitted';
  submitted.textContent = 'Submitted 12 Mar 2025';

  bar.append(title, spacer, submitted, createFeedbackVisibilityControl({ visibility, variant }));
  return bar;
}

export const NearFeedbackHeader: Story = {
  name: 'Near Feedback Header',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:var(--spacing-sm);';
    wrap.append(
      topbar('hidden', 'badge'),
      topbar('visible', 'badge'),
      topbar('hidden', 'icon'),
      topbar('visible', 'icon'),
    );
    return wrap;
  },
};
