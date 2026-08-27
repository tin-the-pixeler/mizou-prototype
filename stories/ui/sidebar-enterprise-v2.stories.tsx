import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SidebarEnterpriseV2 } from '../../ui/sidebar-enterprise-v2';

/**
 * Phase 2 rebuild of the enterprise sidebar on Tailwind + shadcn (Collapsible).
 * Figma: sidebar-primary-v2-enterprise (node 14155:233892).
 * Legacy version (components/sidebarEnterpriseV2.ts + styles/sidebar-enterprise-v2.css)
 * is untouched and stays live until a separate decision swaps production over.
 *
 * Uses an explicit `render`, matching the convention in stories/ui/foundations.stories.tsx —
 * the repo's custom Storybook decorator (preview.tsx) invokes `originalStoryFn` directly to
 * support the legacy HTML stories, which breaks CSF3's implicit args-based render.
 */
const meta: Meta<typeof SidebarEnterpriseV2> = {
  title: 'UI/SidebarEnterpriseV2',
  component: SidebarEnterpriseV2,
  parameters: { layout: 'fullscreen' },
  render: (args) => <SidebarEnterpriseV2 {...args} />,
};
export default meta;
type Story = StoryObj<typeof SidebarEnterpriseV2>;

export const Expanded: Story = {
  args: {
    defaultCollapsed: false,
    defaultExpandedTeams: ['Alpha'],
    activeTeamName: 'Alpha',
    activeSubNav: 'Assigned Simulations',
  },
};

export const Collapsed: Story = {
  args: {
    defaultCollapsed: true,
    defaultExpandedTeams: ['Alpha'],
    activeTeamName: 'Alpha',
  },
};
