import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SettingsToggleRow } from '../../ui/settings-toggle-row';

/**
 * Label + helper text + switch. Uses an explicit `render`, matching the
 * convention in stories/ui/sidebar-enterprise-v2.stories.tsx (the custom
 * decorator in .storybook/preview.tsx breaks CSF3's implicit args render).
 */
const meta: Meta<typeof SettingsToggleRow> = {
  title: 'UI/SettingsToggleRow',
  component: SettingsToggleRow,
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <SettingsToggleRow {...args} />
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof SettingsToggleRow>;

const FEEDBACK_ARGS = {
  label: 'Allow my manager to see my feedback',
  statusLabels: { on: 'On', off: 'Off' },
  helperText:
    'When off, only you can see your feedback by default. You can still make individual feedback visible to your manager.',
};

export const On: Story = { args: { ...FEEDBACK_ARGS, defaultChecked: true } };

export const Off: Story = { args: { ...FEEDBACK_ARGS, defaultChecked: false } };

export const Disabled: Story = { args: { ...FEEDBACK_ARGS, defaultChecked: true, disabled: true } };

export const WithoutHelperText: Story = {
  args: { label: 'Email me a weekly summary', defaultChecked: false },
};
