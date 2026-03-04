// components/chatThinkingBlock.ts
import { createChatStream, type ChatStreamOptions } from './chatStream';
import { createEventLabel } from './chatEventLabel';

export type ThinkingBlockState = 'thinking' | 'populated';

export type ThinkingBlockOptions = {
  state?: ThinkingBlockState;
  events?: ChatStreamOptions['events'];
  expanded?: boolean;
};

export const thinkingBlockStates: ThinkingBlockState[] = ['thinking', 'populated'];

export function createThinkingBlock({
  state = 'populated',
  events = [],
  expanded = true,
}: ThinkingBlockOptions): HTMLElement {
  const el = document.createElement('div');
  el.className = `chat-thinking-block chat-thinking-block--${state}`;

  if (state === 'thinking') {
    // Compact "thinking..." indicator
    el.appendChild(createEventLabel({ variant: 'thinking' }));
    return el;
  }

  // Populated state — collapsible
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'chat-thinking-block__toggle';

  const chevron = document.createElement('span');
  chevron.className = 'chat-thinking-block__chevron';
  chevron.textContent = '\u25B6'; // ▶

  const toggleLabel = document.createElement('span');
  toggleLabel.className = 'chat-thinking-block__toggle-label';
  toggleLabel.textContent = `${events.length} thinking step${events.length !== 1 ? 's' : ''}`;

  toggle.append(chevron, toggleLabel);
  el.appendChild(toggle);

  // Collapsible content
  const content = document.createElement('div');
  content.className = 'chat-thinking-block__content';

  if (events.length > 0) {
    content.appendChild(createChatStream({ events }));
  }

  el.appendChild(content);

  // Set initial state
  if (!expanded) {
    el.classList.add('chat-thinking-block--collapsed');
  }

  // Toggle handler
  toggle.addEventListener('click', () => {
    el.classList.toggle('chat-thinking-block--collapsed');
  });

  return el;
}
