import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  stories: ['../stories/**/*.stories.@(js|ts)'],
  addons: [],
};
export default config;
