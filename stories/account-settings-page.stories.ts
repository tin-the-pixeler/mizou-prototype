import type { Meta, StoryObj } from '@storybook/html';
import { createAccountSettingsPage } from '../components/accountSettingsPage';

const meta: Meta = { title: 'Pages/Account Settings' };
export default meta;

type Story = StoryObj;

/** My Account tab with the new Privacy section — "Allow my manager to see my feedback" (off by default). */
export const MyAccount: Story = {
  name: 'My Account',
  render: () => createAccountSettingsPage({ initialTab: 'account' }),
};

export const MyAccountManagerCanSee: Story = {
  name: 'My Account — manager can see feedback',
  render: () => createAccountSettingsPage({ initialTab: 'account', allowManagerFeedback: true }),
};

/** Production as it is today, without the Privacy section. */
export const MyAccountWithoutPrivacy: Story = {
  name: 'My Account — without Privacy section',
  render: () => createAccountSettingsPage({ initialTab: 'account', showFeedbackPrivacy: false }),
};

export const OrganizationSettings: Story = {
  name: 'Organization Settings',
  render: () => createAccountSettingsPage({ initialTab: 'organization' }),
};
