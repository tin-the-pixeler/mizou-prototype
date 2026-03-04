// components/chatThread.ts
import { createChatMessage, type ChatMessageOptions } from './chatMessage';

export type { ChatMessageOptions as ChatMessage };

export type ChatThreadOptions = {
  messages: ChatMessageOptions[];
};

export function createChatThread({ messages }: ChatThreadOptions) {
  const thread = document.createElement('div');
  thread.className = 'chat-thread';

  for (const message of messages) {
    thread.appendChild(createChatMessage(message));
  }

  return thread;
}
