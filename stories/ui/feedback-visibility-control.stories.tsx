import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FeedbackVisibilityControl } from '../../ui/feedback-visibility-control';
import { FeedbackExportButton } from '../../ui/feedback-export-button';

/**
 * Per-feedback visibility: eye icon button + settings popover. Explicit `render`, per
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

export const ReadOnly: Story = { args: { defaultVisible: true, readOnly: true } };

export const Disabled: Story = { args: { defaultVisible: true, disabled: true } };

/**
 * Mirrors the feedback drawer's metabar right side: eye button, export button,
 * divider. The popover opens below, right-aligned to the eye button.
 */
export const InFeedbackMetabar: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ minHeight: 200 }} className="flex justify-end rounded-container bg-surface-overlay p-sm font-sans">
      <div className="flex items-center gap-2xs">
        <FeedbackVisibilityControl defaultVisible />
        <FeedbackExportButton />
      </div>
    </div>
  ),
};
