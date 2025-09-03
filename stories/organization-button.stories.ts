import type { Meta, StoryObj } from '@storybook/html';
import { createOrganizationButton } from '../components/organizationButton';

type Props = { name: string; logoIcon: string; open: boolean };

const meta: Meta<Props> = {
  title: 'Navigation/Organization Button',
  argTypes: {
    name: { control: 'text' },
    logoIcon: { control: 'text' },   // e.g. 'logo-sq-acme'
    open: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<Props>;

export const Default: Story = {
  args: { name: 'ACME', logoIcon: 'logo-sq-acme', open: false },
  render: (args) => createOrganizationButton(args),
};


