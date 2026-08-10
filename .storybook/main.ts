import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  stories: ['../stories/**/*.stories.@(js|ts)', '../stories/**/*.mdx'],
  addons: ['@storybook/addon-docs'],
};
export default config;
