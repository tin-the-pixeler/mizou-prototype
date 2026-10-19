import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SettingsToggleRow } from '../../ui/settings-toggle-row';
import { FeedbackVisibilityControl } from '../../ui/feedback-visibility-control';

/**
 * Settings page mock for the feedback-visibility feature. The prototype has no
 * user Settings page yet, so this composes a minimal "Privacy" section the way
 * production's Account Settings groups its rows. The account-level toggle sets the
 * DEFAULT; the per-feedback control below it is the override.
 */
const meta: Meta = {
  title: 'Pages/Settings — Feedback Privacy',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

function SettingsPage() {
  const [allowManager, setAllowManager] = React.useState(false);
  return (
    <div className="min-h-screen bg-surface-page p-md font-sans text-content-primary">
      <div className="mx-auto flex max-w-2xl flex-col gap-md">
        <h1 className="m-0 text-h4">Settings</h1>
        <section className="flex flex-col gap-sm">
          <h2 className="m-0 text-lg font-semibold">Privacy</h2>
          <SettingsToggleRow
            label="Allow my manager to see my feedback"
            helperText="When off, only you can see your feedback by default. You can still make individual feedback visible to your manager."
            checked={allowManager}
            onCheckedChange={setAllowManager}
          />
          <div className="flex items-center justify-between gap-md rounded-container border border-solid border-stroke bg-surface-emphasis p-sm">
            <div className="flex flex-col gap-3xs">
              <span className="text-sm font-semibold">Handling pricing objections</span>
              <span className="text-sm text-content-secondary">Submitted Oct 14, 2026</span>
            </div>
            {/* key resets the control when the default flips, mimicking "new feedback inherits the setting" */}
            <FeedbackVisibilityControl key={String(allowManager)} defaultVisible={allowManager} />
          </div>
        </section>
      </div>
    </div>
  );
}

export const Default: Story = { render: () => <SettingsPage /> };
