// components/chatThread.ts

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
};

export type ChatThreadOptions = {
  messages: ChatMessage[];
};

export function createChatThread({ messages }: ChatThreadOptions) {
  const thread = document.createElement('div');
  thread.className = 'chat-thread';

  messages.forEach((message) => {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message chat-message--${message.role}`;

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'chat-message__avatar';
    
    if (message.role === 'user') {
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
    header.textContent = message.role === 'user' ? 'You' : 'Assistant';

    // Content
    const content = document.createElement('div');
    content.className = 'chat-message__content';
    content.textContent = message.content;

    // Timestamp (optional)
    if (message.timestamp) {
      const timestamp = document.createElement('div');
      timestamp.className = 'chat-message__timestamp';
      timestamp.textContent = message.timestamp;
      contentWrap.append(header, content, timestamp);
    } else {
      contentWrap.append(header, content);
    }

    messageEl.append(avatar, contentWrap);
    thread.appendChild(messageEl);
  });

  return thread;
}
