import type { Meta, StoryObj } from '@storybook/html';
import { createShareModal, type ShareModalOptions, type ShareModalTab } from '../components/shareModal';

type ShareModalArgs = {
  initialTab: ShareModalTab;
  simulationUrl: string;
  publishedUrl: string;
  teamName: string;
};

const meta: Meta<ShareModalArgs> = {
  title: 'Components/Share Modal',
  argTypes: {
    initialTab: {
      control: 'select',
      options: ['share', 'published'],
    },
    simulationUrl: { control: 'text' },
    publishedUrl:  { control: 'text' },
    teamName:      { control: 'text' },
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

export const ShareTab: Story = {
  name: 'Share simulation tab',
  args: {
    initialTab: 'share',
    simulationUrl: 'https://staging.app.mizou.com/call-check?ID=sim-2LgKN',
    publishedUrl: 'https://app.mizou.com/check-assignment?tok…',
    teamName: 'Default Team',
  },
  render: (args: ShareModalArgs) =>
    wrapInStage(createShareModal(args as ShareModalOptions)),
};

export const PublishedTab: Story = {
  name: 'Simulation published tab',
  args: {
    initialTab: 'published',
    simulationUrl: 'https://staging.app.mizou.com/call-check?ID=sim-2LgKN',
    publishedUrl: 'https://app.mizou.com/check-assignment?tok…',
    teamName: 'Default Team',
  },
  render: (args: ShareModalArgs) =>
    wrapInStage(createShareModal(args as ShareModalOptions)),
};

export const NoInitialSelection: Story = {
  name: 'No initial selection',
  args: {
    initialTab: 'share',
    simulationUrl: 'https://staging.app.mizou.com/call-check?ID=sim-2LgKN',
    publishedUrl: 'https://app.mizou.com/check-assignment?tok…',
    teamName: 'Default Team',
  },
  render: (args: ShareModalArgs) =>
    wrapInStage(createShareModal({ ...args, initialSelected: [] } as ShareModalOptions)),
};

export const AllMembersSelected: Story = {
  name: 'All members selected',
  args: {
    initialTab: 'share',
    simulationUrl: 'https://staging.app.mizou.com/call-check?ID=sim-2LgKN',
    publishedUrl: 'https://app.mizou.com/check-assignment?tok…',
    teamName: 'Default Team',
  },
  render: (args: ShareModalArgs) =>
    wrapInStage(
      createShareModal({
        ...args,
        initialSelected: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'],
      } as ShareModalOptions),
    ),
};
