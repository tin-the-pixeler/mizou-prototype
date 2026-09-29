import type { Meta, StoryObj } from '@storybook/html';
import {
  createSimulationBuilderPage,
  type SimBuilderOptions,
} from '../components/simulationBuilderPage';
import { createSimulationBuilderWorkspace } from '../components/simulationBuilderWorkspace';

const meta: Meta<SimBuilderOptions> = {
  title: 'Pages/Simulation Builder',
  render: (args) => createSimulationBuilderPage(args),
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['create', 'plan'],
    },
    userInitial: { control: 'text' },
    heading: { control: 'text' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SimBuilderOptions>;

export const CreateMode: Story = {
  name: 'Create Mode',
  args: {
    mode: 'create',
  },
};

export const PlanMode: Story = {
  name: 'Plan Mode',
  args: {
    mode: 'plan',
  },
};

// Post-prompt states used by Flows/Create a simulation.

export const PlanOverview: Story = {
  name: 'Plan Overview',
  render: () => createSimulationBuilderWorkspace({ view: 'plan' }),
};

export const CreateArtifact: Story = {
  name: 'Create Artifact',
  render: () => createSimulationBuilderWorkspace({ view: 'create' }),
};
