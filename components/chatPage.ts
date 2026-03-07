// components/chatPage.ts
// Full chat page: gradient bg, header, chat thread, and input field.

import { createChatPanelHeader, type ChatPanelHeaderOptions } from './chatPanelHeader';
import { createChatThread, type ThreadMessage } from './chatThread';
import { createChatInputField, type ChatInputFieldOptions } from './chatInputField';

export type ChatPageOptions = {
  /** Header config */
  header?: ChatPanelHeaderOptions;
  /** Messages to display in the thread */
  messages?: ThreadMessage[];
  /** Input field config */
  input?: ChatInputFieldOptions;
};

export function createChatPage({
  header,
  messages = [],
  input,
}: ChatPageOptions = {}): HTMLElement {
  const page = document.createElement('div');
  page.className = 'chat-page';

  // --- Gradient background ---
  const bg = document.createElement('div');
  bg.className = 'chat-page__bg';
  page.appendChild(bg);

  // --- Chat panel (over the bg) ---
  const panel = document.createElement('div');
  panel.className = 'chat-page__panel';

  // Header
  panel.appendChild(createChatPanelHeader(header));

  // Content wrapper (centered column)
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'chat-page__content';

  // Chat wrapper (thread + input)
  const chatWrapper = document.createElement('div');
  chatWrapper.className = 'chat-page__chat';

  // Thread (scrollable, grows)
  chatWrapper.appendChild(createChatThread({ messages }));

  // Input field (pinned bottom)
  chatWrapper.appendChild(createChatInputField(input));

  contentWrapper.appendChild(chatWrapper);
  panel.appendChild(contentWrapper);
  page.appendChild(panel);

  return page;
}
