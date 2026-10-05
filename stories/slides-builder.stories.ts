import type { Meta, StoryObj } from '@storybook/html';
import { createSlidesBuilder, type SlidesBuilderOptions } from '../components/slidesBuilder';

const meta: Meta<SlidesBuilderOptions> = {
  title: 'Pages/Slides Builder',
  render: (args) => createSlidesBuilder(args),
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<SlidesBuilderOptions>;

/** Full create flow: pick Slides, send the prompt, watch the deck build. */
export const CreatePresentation: Story = {
  name: 'Create a presentation',
  args: { stage: 'home' },
};

/** Jump straight to the finished deck (chat + artifact panel). */
export const DeckReady: Story = {
  name: 'Deck ready',
  args: { stage: 'ready' },
};
