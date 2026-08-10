import type { Meta, StoryObj } from '@storybook/html';
import { createShareModal, type ShareModalOptions, type ShareModalTab } from '../components/shareModal';

type ShareModalArgs = {
  initialTab: ShareModalTab;
  memberLinkUrl: string;
};

const meta: Meta<ShareModalArgs> = {
  title: 'Components/Share Modal',
  argTypes: {
    initialTab: {
      control: 'select',
      options: ['member', 'team', 'individual'],
    },
    memberLinkUrl: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<ShareModalArgs>;

function wrapInStage(el: HTMLElement): HTMLElement {
  const stage = document.createElement('div');
  stage.className = 'share-modal-stage';
  stage.appendChild(el);
  return stage;
}

export const MemberLinkTab: Story = {
  name: 'Member link tab',
  args: {
    initialTab: 'member',
    memberLinkUrl: 'https://app.mizou.com/check-assignment?token=8f3c1a9d4e2b7f50a6d1c3b4e7f9a02b',
  },
  render: (args: ShareModalArgs) => wrapInStage(createShareModal(args as ShareModalOptions)),
};

export const TeamsTabEmpty: Story = {
  name: 'Teams tab — empty',
  args: {
    initialTab: 'team',
    memberLinkUrl: 'https://app.mizou.com/check-assignment?token=8f3c1a9d4e2b7f50a6d1c3b4e7f9a02b',
  },
  render: (args: ShareModalArgs) =>
    wrapInStage(createShareModal({ ...args, assignedTeams: [] } as ShareModalOptions)),
};

export const TeamsTabPopulated: Story = {
  name: 'Teams tab — populated',
  args: {
    initialTab: 'team',
    memberLinkUrl: 'https://app.mizou.com/check-assignment?token=8f3c1a9d4e2b7f50a6d1c3b4e7f9a02b',
  },
  render: (args: ShareModalArgs) => wrapInStage(createShareModal(args as ShareModalOptions)),
};

export const IndividualTabEmpty: Story = {
  name: 'Individual tab — empty',
  args: {
    initialTab: 'individual',
    memberLinkUrl: 'https://app.mizou.com/check-assignment?token=8f3c1a9d4e2b7f50a6d1c3b4e7f9a02b',
  },
  render: (args: ShareModalArgs) =>
    wrapInStage(createShareModal({ ...args, assignedIndividuals: [] } as ShareModalOptions)),
};

export const IndividualTabPopulated: Story = {
  name: 'Individual tab — populated',
  args: {
    initialTab: 'individual',
    memberLinkUrl: 'https://app.mizou.com/check-assignment?token=8f3c1a9d4e2b7f50a6d1c3b4e7f9a02b',
  },
  render: (args: ShareModalArgs) => wrapInStage(createShareModal(args as ShareModalOptions)),
};
