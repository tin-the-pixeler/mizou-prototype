import type { Meta, StoryObj } from '@storybook/html';
import { createFlashcardsBuilder, type FlashcardsBuilderOptions } from '../components/flashcardsBuilder';

const meta: Meta<FlashcardsBuilderOptions> = {
  title: 'Pages/Flashcards Builder',
  render: (args) => createFlashcardsBuilder(args),
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<FlashcardsBuilderOptions>;

/** Full create flow: pick Flashcards, send the prompt, watch the set build. */
export const CreateFlashcards: Story = {
  name: 'Create flashcards',
  args: { stage: 'home' },
};

/** Jump straight to the finished set (chat + artifact panel). */
export const FlashcardsReady: Story = {
  name: 'Flashcards ready',
  args: { stage: 'ready' },
};

/** Building state: chat is thinking, artifact panel holds the placeholder. */
export const Building: Story = {
  name: 'Building',
  args: { stage: 'building' },
};
