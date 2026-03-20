import type { Meta, StoryObj } from '@storybook/html';
import {
  createEnvironmentDetailsCard,
  type EnvironmentDetailsCardOptions,
  type SimulationType,
  type DifficultyLevel,
} from '../components/environmentDetailsCard';

type StoryProps = EnvironmentDetailsCardOptions;

const meta: Meta<StoryProps> = {
  title: 'Components/Environment Details Card',
  argTypes: {
    simulationType: { control: 'select', options: ['chatbot', 'roleplay'] as SimulationType[] },
    title: { control: 'text' },
    avatarUrl: { control: 'text' },
    role: { control: 'text' },
    name: { control: 'text' },
    levelLabel: { control: 'text' },
    difficulty: { control: 'select', options: ['easy', 'medium', 'hard'] as DifficultyLevel[] },
    categoryLabel: { control: 'text' },
    instructionHeader: { control: 'text' },
    primaryActionLabel: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<StoryProps>;

const sampleInstructions = [
  {
    title: 'Introduction',
    body: 'A senior staff auditor, Jason Westlake, had been coming to work very late and unengaged. The learner needs to talk with the auditor about the behavioral issues.',
  },
  {
    title: 'Take notes and formulate questions',
    body: 'Take initial notes on the key arguments, interpretations, and evidence he presents. After the introduction phase, you will be prompted to ask critical questions.',
  },
  {
    title: 'Engage in discussion',
    body: 'Engage in a scholarly exchange with Professor Joles by: referencing your own prior research, challenging assumptions, and proposing alternative interpretations.',
  },
  {
    title: 'Write your conclusion',
    body: 'Produce a 400-word critical synthesis that combines: insights from Prof. Jole\'s opening explanation, your own prior knowledge, and any new perspectives gained.',
  },
];

const render = (args: StoryProps) => {
  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px';
  wrapper.style.background = 'var(--surface-page)';
  wrapper.appendChild(createEnvironmentDetailsCard(args));
  return wrapper;
};

export const Default: Story = {
  args: {
    simulationType: 'chatbot',
    title: 'Helping A Subordinate Get Their Groove Back',
    role: 'Senior Staff Auditor',
    name: 'Jason Westlake',
    levelLabel: 'Dismissive',
    difficulty: 'hard',
    categoryLabel: 'Management',
    instructionHeader: 'Read instructions',
    instructions: sampleInstructions,
    primaryActionLabel: 'Test the chatbot',
  },
  render,
};

