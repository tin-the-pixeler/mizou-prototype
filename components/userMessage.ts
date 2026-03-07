// components/userMessage.ts
import { marked } from 'marked';

export type UserMessageOptions = {
  content: string;
};

export function createUserMessage({ content }: UserMessageOptions) {
  const wrapper = document.createElement('div');
  wrapper.className = 'user-message';

  const bubble = document.createElement('div');
  bubble.className = 'user-message__bubble chat-markdown';
  bubble.innerHTML = marked.parse(content) as string;

  wrapper.appendChild(bubble);
  return wrapper;
}