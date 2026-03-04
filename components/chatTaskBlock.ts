// components/chatTaskBlock.ts
import { createChatEvent, type ChatEventOptions } from './chatEvent';
import { createEventLabel } from './chatEventLabel';

export type TaskBlockState = 'in-progress' | 'finished';

export type TaskBlockOptions = {
  state?: TaskBlockState;
  title?: string;
  events?: ChatEventOptions[];
  expanded?: boolean;
};

export const taskBlockStates: TaskBlockState[] = ['in-progress', 'finished'];

export function createTaskBlock({
  state = 'in-progress',
  title = 'Working on task...',
  events = [],
  expanded = true,
}: TaskBlockOptions): HTMLElement {
  const el = document.createElement('div');
  el.className = `chat-task-block chat-task-block--${state}`;

  // Header toggle
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'chat-task-block__toggle';

  const chevron = document.createElement('span');
  chevron.className = 'chat-task-block__chevron';
  chevron.textContent = '\u25B6'; // ▶

  const statusIcon = createEventLabel({
    variant: state === 'finished' ? 'complete' : 'building',
    label: title,
  });

  toggle.append(chevron, statusIcon);
  el.appendChild(toggle);

  // Collapsible content
  const content = document.createElement('div');
  content.className = 'chat-task-block__content';

  for (const event of events) {
    content.appendChild(createChatEvent(event));
  }

  el.appendChild(content);

  // Set initial state
  if (!expanded) {
    el.classList.add('chat-task-block--collapsed');
  }

  // Toggle handler
  toggle.addEventListener('click', () => {
    el.classList.toggle('chat-task-block--collapsed');
  });

  return el;
}
