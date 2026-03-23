import type { Meta, StoryObj } from '@storybook/html';
import {
  createArtifactPanel,
  type ArtifactPanelOptions,
  artifactTabs,
} from '../components/artifactPanel';
import type { SimulationType } from '../components/environmentDetailsCard';
import { levelChipThemes } from '../components/levelChip';
import { categoryTypes } from '../components/categoryChip';

type StoryProps = ArtifactPanelOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/Artifact Panel',
  argTypes: {
    activeTab: { control: 'select', options: artifactTabs },
    thumbnailUrl: { control: 'text' },
    simulationType: { control: 'select', options: ['chatbot', 'roleplay'] as SimulationType[] },
    title: { control: 'text' },
    role: { control: 'text' },
    name: { control: 'text' },
    levelLabel: { control: 'text' },
    levelTheme: { control: 'select', options: levelChipThemes },
    category: { control: 'select', options: categoryTypes },
    categoryLabel: { control: 'text' },
    instructionHeader: { control: 'text' },
    primaryActionLabel: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

const sampleInstructions = [
  {
    title: 'Strategic Alignment',
    body: 'Leveraging cross-functional synergies to optimise key deliverables and ensure stakeholder buy-in across all verticals.',
  },
  {
    title: 'Operational Efficiency',
    body: 'Streamlining workflow pipelines to maximise bandwidth and facilitate scalable outcomes within the current roadmap.',
  },
  {
    title: 'Value Proposition',
    body: 'Driving actionable insights to elevate key performance indicators and unlock sustainable growth through innovative paradigms.',
  },
];

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.background = '#e8e8ec';
  wrapper.appendChild(createArtifactPanel(args));
  return wrapper;
};

export const Default: Story = {
  args: {
    activeTab: 'Preview',
    thumbnailUrl: new URL('../assets/artifact-preview/simulations/thumbnails/image.png', import.meta.url).href,
    simulationType: 'chatbot',
    title: 'What sparked World War 2?',
    role: 'WW2 Historian',
    name: 'Prof. Miriam Jole',
    levelLabel: 'Grade 5',
    levelTheme: 'green',
    category: 'History' as any,
    categoryLabel: 'History',
    instructionHeader: 'Read instructions',
    instructions: sampleInstructions,
    primaryActionLabel: 'Test the chatbot',
  },
  render,
};
