import type { Meta, StoryObj } from '@storybook/html';
import { createOrganizationButton } from '../components/organizationButton';

type Props = { name: string; logoIcon: string; open: boolean; minimized: boolean };

const meta: Meta<Props> = {
  title: 'Navigation/Organization Button',
  argTypes: {
    name: { control: 'text' },
    logoIcon: { control: 'text' },
    open: { control: 'boolean' },
    minimized: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<Props>;

export const Default: Story = {
  args: { name: 'ACME', logoIcon: 'logo-sq-acme', open: false, minimized: false },
  render: (args) => createOrganizationButton(args),
};

export const Minimized: Story = {
  args: { name: 'ACME', logoIcon: 'logo-sq-acme', open: false, minimized: true },
  render: (args) => createOrganizationButton(args),
};
