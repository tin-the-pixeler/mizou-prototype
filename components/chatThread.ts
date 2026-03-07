// components/chatThread.ts
import { createUserMessage } from './userMessage';
import { createMizouMessage, type ArtifactCard } from './mizouMessage';
import { createThinkingBlock, type ThinkingBlockOptions } from './chatThinkingBlock';
import { createTaskBlock, type TaskBlockOptions } from './chatTaskBlock';

export type UserThreadMessage = {
  role: 'user';
  content: string;
};

export type AssistantThreadMessage = {
  role: 'assistant';
  content: string;
  artifact?: ArtifactCard;
  footer?: string;
};

export type ThinkingThreadMessage = {
  role: 'thinking';
} & ThinkingBlockOptions;

export type TaskThreadMessage = {
  role: 'task';
} & TaskBlockOptions;

export type ThreadMessage =
  | UserThreadMessage
  | AssistantThreadMessage
  | ThinkingThreadMessage
  | TaskThreadMessage;

export type ChatThreadOptions = {
  messages: ThreadMessage[];
};

export function createChatThread({ messages }: ChatThreadOptions) {
  const thread = document.createElement('div');
  thread.className = 'chat-thread';

  for (const message of messages) {
    switch (message.role) {
      case 'user':
        thread.appendChild(createUserMessage({ content: message.content }));
        break;
      case 'assistant':
        thread.appendChild(
          createMizouMessage({
            content: message.content,
            artifact: message.artifact,
            footer: message.footer,
          }),
        );
        break;
      case 'thinking':
        thread.appendChild(
          createThinkingBlock({
            state: message.state,
            events: message.events,
            expanded: message.expanded,
          }),
        );
        break;
      case 'task':
        thread.appendChild(
          createTaskBlock({
            state: message.state,
            title: message.title,
            events: message.events,
            expanded: message.expanded,
          }),
        );
        break;
    }
  }

  return thread;
}
