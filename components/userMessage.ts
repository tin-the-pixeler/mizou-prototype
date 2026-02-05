// components/userMessage.ts
import { marked } from 'marked';

export type UserMessageOptions = {
  content: string;
  timestamp?: string;
};

export function createUserMessage({ content, timestamp }: UserMessageOptions) {
  const messageEl = document.createElement('div');
  messageEl.className = 'chat-message chat-message--user';

  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'chat-message__avatar';
  avatar.textContent = 'U';
  avatar.style.background = 'var(--primitive-indigo-base)';

  // Content wrapper
  const contentWrap = document.createElement('div');
  contentWrap.className = 'chat-message__content-wrap';

  // Header (role label)
  const header = document.createElement('div');
  header.className = 'chat-message__header';
  header.textContent = 'You';

  // Content - render markdown as HTML
  const contentDiv = document.createElement('div');
  contentDiv.className = 'chat-message__content';
  contentDiv.innerHTML = marked.parse(content) as string;

  // Timestamp (optional)
  if (timestamp) {
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'chat-message__timestamp';
    timestampDiv.textContent = timestamp;
    contentWrap.append(header, contentDiv, timestampDiv);
  } else {
    contentWrap.append(header, contentDiv);
  }

  messageEl.append(avatar, contentWrap);
  return messageEl;
}