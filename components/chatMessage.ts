// components/chatMessage.ts

export type ChatMessageRole = 'user' | 'assistant';

export type ChatMessageOptions = {
  role: ChatMessageRole;
  content: string;
  timestamp?: string;
};

export function createChatMessage({
  role,
  content,
  timestamp,
}: ChatMessageOptions): HTMLElement {
  const messageEl = document.createElement('div');
  messageEl.className = `chat-message chat-message--${role}`;

  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'chat-message__avatar';

  if (role === 'user') {
    avatar.textContent = 'U';
    avatar.style.background = 'var(--primitive-indigo-base)';
  } else {
    avatar.textContent = 'AI';
    avatar.style.background = 'var(--primitive-emerald-base)';
  }

  // Content wrapper
  const contentWrap = document.createElement('div');
  contentWrap.className = 'chat-message__content-wrap';

  // Header (role label)
  const header = document.createElement('div');
  header.className = 'chat-message__header';
  header.textContent = role === 'user' ? 'You' : 'Assistant';

  // Content — uses chat-markdown typography for conversation text
  const contentEl = document.createElement('div');
  contentEl.className = 'chat-message__content chat-markdown';
  contentEl.innerHTML = content;

  contentWrap.append(header, contentEl);

  // Timestamp (optional)
  if (timestamp) {
    const timestampEl = document.createElement('div');
    timestampEl.className = 'chat-message__timestamp';
    timestampEl.textContent = timestamp;
    contentWrap.appendChild(timestampEl);
  }

  messageEl.append(avatar, contentWrap);
  return messageEl;
}
