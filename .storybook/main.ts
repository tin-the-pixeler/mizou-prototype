import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Legacy HTML/TS stories (existing) + new React stories under stories/ui/.
  stories: [
    '../stories/**/*.stories.@(js|ts|tsx)',
    '../stories/**/*.mdx',
  ],
  addons: ['@storybook/addon-docs'],
};
export default config;
