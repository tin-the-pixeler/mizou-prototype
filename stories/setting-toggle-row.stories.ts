import type { Meta, StoryObj } from '@storybook/html';
import { createSettingToggleRow, type SettingToggleRowOptions } from '../components/settingToggleRow';

const LABEL = 'Allow my manager to see my feedback';
const HELPER =
  'When off, only you can see your feedback by default. You can still make individual feedback visible to your manager.';

const meta: Meta<SettingToggleRowOptions> = {
  title: 'Components/Setting Toggle Row',
  render: (args) => createSettingToggleRow(args),
  args: { label: LABEL, helperText: HELPER, checked: false, disabled: false },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<SettingToggleRowOptions>;

export const Off: Story = {
  name: 'Off',
  args: { checked: false },
};

export const On: Story = {
  name: 'On',
  args: { checked: true },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: { checked: true, disabled: true },
};

export const WithoutHelperText: Story = {
  name: 'Without Helper Text',
  args: { label: 'Email me when feedback is ready', helperText: undefined },
};
