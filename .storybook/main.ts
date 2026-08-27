import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

// Repo root — shadcn-generated components under ui/ import via the `@/`
// alias (e.g. `@/ui/lib/cn`), matching components.json. tsconfig.json already
// maps `@/*` for the type checker; Vite needs the same mapping at bundle time.
const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

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
  async viteFinal(viteConfig) {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@': REPO_ROOT,
    };
    return viteConfig;
  },
};
export default config;
