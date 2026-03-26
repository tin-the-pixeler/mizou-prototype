// components/inputFieldChatThread.ts
// Compact chat input field used inside the chat thread view.
// Features: textarea, plus button, format pill (xs), Create pill, mic button, send button.

import { iconEl, type IconName } from '../icons';

export type InputFieldChatThreadState = 'default' | 'populated';

export type InputFieldChatThreadOptions = {
  /** Placeholder text shown in the input */
  placeholder?: string;
  /** Current value of the input */
  value?: string;
  /** Visual state: default (empty) or populated (has content) */
  state?: InputFieldChatThreadState;
  /** Label for the format pill button (default: "Select format") */
  formatLabel?: string;
  /** Whether the format pill is in selected/active state (dark bg) */
  formatSelected?: boolean;
  /** Callback when send button is clicked */
  onSend?: (value: string) => void;
};

export function createInputFieldChatThread({
  placeholder = 'Ask or describe what you\'d like to do...',
  value = '',
  state = 'default',
  formatLabel = 'Select format',
  formatSelected = false,
  onSend,
}: InputFieldChatThreadOptions = {}): HTMLElement {
  const container = document.createElement('div');
  container.className = 'input-field-chat-thread';

  // --- Input container ---
  const inputContainer = document.createElement('div');
  inputContainer.className = 'input-field-chat-thread__input-container';

  const textarea = document.createElement('div');
  textarea.className = 'input-field-chat-thread__textarea';
  textarea.contentEditable = 'true';
  textarea.setAttribute('role', 'textbox');
  textarea.setAttribute('data-placeholder', placeholder);

  if (state === 'populated' && value) {
    textarea.textContent = value;
  }

  // Update state on input
  textarea.addEventListener('input', () => {
    const hasContent = textarea.textContent!.trim().length > 0;
    container.classList.toggle('input-field-chat-thread--populated', hasContent);
    container.classList.toggle('input-field-chat-thread--default', !hasContent);
  });

  inputContainer.appendChild(textarea);
  container.appendChild(inputContainer);

  // --- Actions bar ---
  const actions = document.createElement('div');
  actions.className = 'input-field-chat-thread__actions';

  // Left side
  const leftSide = document.createElement('div');
  leftSide.className = 'input-field-chat-thread__left';

  const plusBtn = createIconButton('plus-sm' as IconName, 'input-field-chat-thread__icon-btn input-field-chat-thread__icon-btn--secondary');
  const formatBtn = createPillButton(formatLabel, 'chevron-down-sm' as IconName);
  if (formatSelected) {
    formatBtn.classList.add('input-field-chat-thread__pill-btn--selected');
  }

  leftSide.append(plusBtn, formatBtn);

  // Right side
  const rightSide = document.createElement('div');
  rightSide.className = 'input-field-chat-thread__right';

  const createBtn = createPillButton('Create', 'chevron-down-sm' as IconName);
  const micBtn = createIconButton('mic-fill' as IconName, 'input-field-chat-thread__icon-btn input-field-chat-thread__icon-btn--outlined');
  const sendBtn = createIconButton('arrow-up' as IconName, 'input-field-chat-thread__icon-btn input-field-chat-thread__icon-btn--primary');
  sendBtn.classList.add('input-field-chat-thread__send-btn');

  if (onSend) {
    sendBtn.addEventListener('click', () => {
      const text = textarea.textContent?.trim() ?? '';
      if (text) onSend(text);
    });
  }

  rightSide.append(createBtn, micBtn, sendBtn);

  actions.append(leftSide, rightSide);
  container.appendChild(actions);

  // Set initial state class
  container.classList.add(
    state === 'populated' ? 'input-field-chat-thread--populated' : 'input-field-chat-thread--default',
  );

  return container;
}

// --- Helper: icon-only circular button ---
function createIconButton(icon: IconName, className: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;

  const iconSpan = iconEl(icon, 'input-field-chat-thread__icon');
  btn.appendChild(iconSpan);

  return btn;
}

// --- Helper: pill button with label + chevron ---
function createPillButton(label: string, chevronIcon: IconName): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'input-field-chat-thread__pill-btn';

  const labelSpan = document.createElement('span');
  labelSpan.className = 'input-field-chat-thread__pill-label';
  labelSpan.textContent = label;

  const chevron = iconEl(chevronIcon, 'input-field-chat-thread__pill-chevron');

  btn.append(labelSpan, chevron);
  return btn;
}
