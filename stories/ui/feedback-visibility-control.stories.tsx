import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FeedbackVisibilityControl } from '../../ui/feedback-visibility-control';

/**
 * Per-feedback visibility: status badge + icon button. Explicit `render`, per
 * the convention in stories/ui/sidebar-enterprise-v2.stories.tsx.
 */
const meta: Meta<typeof FeedbackVisibilityControl> = {
  title: 'UI/FeedbackVisibilityControl',
  component: FeedbackVisibilityControl,
  render: (args) => <FeedbackVisibilityControl {...args} />,
};
export default meta;
type Story = StoryObj<typeof FeedbackVisibilityControl>;

export const VisibleToManager: Story = { args: { defaultVisible: true } };

export const HiddenFromManager: Story = { args: { defaultVisible: false } };

export const IconOnly: Story = { args: { defaultVisible: false, showLabel: false } };

export const Disabled: Story = { args: { defaultVisible: true, disabled: true } };

/**
 * Mirrors the feedback drawer's topbar (components/feedbackDrawer.ts):
 * title, spacer, submitted date, status chip. The control sits just before the
 * date so the privacy state reads as part of the header, not the content.
 */
export const InFeedbackHeader: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ maxWidth: 880 }}>
      {(['Visible', 'Hidden'] as const).map((state) => (
        <div
          key={state}
          className="mb-sm flex items-center gap-sm rounded-container bg-surface-page px-sm py-xs font-sans"
        >
          <h1 className="m-0 text-sm font-normal text-content-primary">Handling pricing objections</h1>
          <div className="flex-1" />
          <FeedbackVisibilityControl defaultVisible={state === 'Visible'} />
          <span className="whitespace-nowrap text-xs text-content-secondary">Submitted Oct 14, 2026</span>
          <span className="inline-flex items-center gap-3xs rounded-full bg-feedback-success-bg px-2xs text-xs text-emerald-dark">
            Completed
          </span>
        </div>
      ))}
    </div>
  ),
};
