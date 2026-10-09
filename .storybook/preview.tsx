import '../styles/tokens.css';
import '../ui/tailwind.css';
import '../styles/app-typography.css';
import '../styles/chat-markdown.css';
import '../styles/sidebar.css';
import '../styles/sidebar-enterprise-v2.css';
import '../styles/icons.css';
import '../styles/chat-thread.css';
import '../styles/chat-typography.css';
import '../styles/button.css';
import '../styles/chat-components.css';
import '../styles/chat-page.css';
import '../styles/ai-avatar.css';
import '../styles/environment-details-card.css';
import '../styles/level-chip.css';
import '../styles/category-chip.css';
import '../styles/instruction-field.css';
import '../styles/artifact-thumbnail.css';
import '../styles/artifact-panel.css';
import '../styles/scorecard.css';
import '../styles/input-field-chat-thread.css';
import '../styles/input-field-landing-page.css';
import '../styles/mode-toggle.css';
import '../styles/mode-badge.css';
import '../styles/tooltip.css';
import '../styles/prompt-card.css';
import '../styles/simulation-builder-page.css';
import '../styles/simulation-builder-workspace.css';
import '../styles/button-icon.css';
import '../styles/button-xs.css';
import '../styles/create-button.css';
import '../styles/simulation-card.css';
import '../styles/sessions-filter-bar.css';
import '../styles/sessions-table.css';
import '../styles/timestamp-chip.css';
import '../styles/criteria-card.css';
import '../styles/reference-chip.css';
import '../styles/text-criteria-card.css';
import '../styles/skill-card.css';
import '../styles/metrics-table.css';
import '../styles/feedback-transcript.css';
import '../styles/feedback-drawer.css';
import '../styles/topbar-primary.css';
import '../styles/tabs-nav.css';
import '../styles/team-members-table.css';
import '../styles/team-settings-form.css';
import '../styles/team-page.css';
import '../styles/modal.css';
import '../styles/slides-builder.css';
import '../styles/flashcards-builder.css';
import type { Preview } from '@storybook/react';
import React, { useEffect, useRef } from 'react';

/**
 * DOM interop for the legacy HTML/TS stories.
 *
 * The 52 pre-existing stories are authored against `@storybook/html` and their
 * `render` returns a raw HTMLElement. Under the React renderer that value would
 * throw, so this host component adopts the node into a React-owned container.
 * Result: every existing story renders unchanged, with zero edits to the story
 * or component files.
 */
function DomHost({ node }: { node: Node }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.appendChild(node);
    return () => {
      if (node.parentNode === host) host.removeChild(node);
    };
  }, [node]);

  return React.createElement('div', { ref, 'data-dom-host': '' });
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      // `Story` is already React-wrapped by the renderer, so inspect the raw
      // story function instead: legacy stories return an HTMLElement, which we
      // host; React stories fall through to the normal decorator chain.
      // `originalStoryFn` is typed as `LegacyStoryFn | ArgsStoryFn` (different
      // arities), which TS can't call directly — narrow to the legacy shape,
      // the one every pre-existing HTML story actually uses.
      const callLegacy = context.originalStoryFn as unknown as ((args: typeof context.args, ctx: typeof context) => unknown) | undefined;
      const raw = callLegacy?.(context.args, context);
      if (raw instanceof Node) {
        return React.createElement(DomHost, { node: raw });
      }
      return React.createElement(Story);
    },
  ],
  parameters: {},
};

export default preview;
