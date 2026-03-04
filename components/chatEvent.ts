// components/chatEvent.ts
import { createEventLabel, type EventLabelVariant } from './chatEventLabel';

export type ChatEventOptions = {
  variant: EventLabelVariant;
  label?: string;
  description?: string;
  bullets?: string[];
};

export function createChatEvent({
  variant,
  label,
  description,
  bullets,
}: ChatEventOptions): HTMLElement {
  const el = document.createElement('div');
  el.className = 'chat-event';

  el.appendChild(createEventLabel({ variant, label }));

  if (description) {
    const desc = document.createElement('p');
    desc.className = 'chat-event__description';
    desc.textContent = description;
    el.appendChild(desc);
  }

  if (bullets && bullets.length > 0) {
    const list = document.createElement('ul');
    list.className = 'chat-event__bullets';
    for (const item of bullets) {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    }
    el.appendChild(list);
  }

  return el;
}
