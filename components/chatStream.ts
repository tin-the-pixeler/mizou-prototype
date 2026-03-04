// components/chatStream.ts
import { createChatEvent, type ChatEventOptions } from './chatEvent';

export type ChatStreamOptions = {
  events: ChatEventOptions[];
};

export function createChatStream({ events }: ChatStreamOptions): HTMLElement {
  const el = document.createElement('div');
  el.className = 'chat-stream';

  // Vertical timeline line
  const line = document.createElement('div');
  line.className = 'chat-stream__line';
  el.appendChild(line);

  // Events container
  const eventsWrap = document.createElement('div');
  eventsWrap.className = 'chat-stream__events';

  for (const event of events) {
    eventsWrap.appendChild(createChatEvent(event));
  }

  el.appendChild(eventsWrap);
  return el;
}
