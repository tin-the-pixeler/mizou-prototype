// components/chatInputField.ts
// Chat AI input field with textarea, action buttons, and two states.

import { iconEl, type IconName } from '../icons';

export type ChatInputFieldState = 'default' | 'populated';

export type ChatInputFieldOptions = {
  /** Placeholder text shown in the input */
  placeholder?: string;
  /** Current value of the input */
  value?: string;
  /** Visual state: default (empty) or populated (has content) */
  state?: ChatInputFieldState;
  /** Label for the format pill button (default: "Select format") */
  formatLabel?: string;
  /** Whether the format pill is in selected/active state (dark bg) */
  formatSelected?: boolean;
  /** Callback when send button is clicked */
  onSend?: (value: string) => void;
};

export function createChatInputField({
  placeholder = 'Type your message',
  value = '',
  state = 'default',
  formatLabel = 'Select format',
  formatSelected = false,
  onSend,
}: ChatInputFieldOptions = {}): HTMLElement {
  const container = document.createElement('div');
  container.className = 'chat-input-field';

  // --- Input container ---
  const inputContainer = document.createElement('div');
  inputContainer.className = 'chat-input-field__input-container';

  const textarea = document.createElement('div');
  textarea.className = 'chat-input-field__textarea';
  textarea.contentEditable = 'true';
  textarea.setAttribute('role', 'textbox');
  textarea.setAttribute('data-placeholder', placeholder);

  if (state === 'populated' && value) {
    textarea.textContent = value;
  }

  // Update state on input
  textarea.addEventListener('input', () => {
    const hasContent = textarea.textContent!.trim().length > 0;
    container.classList.toggle('chat-input-field--populated', hasContent);
    container.classList.toggle('chat-input-field--default', !hasContent);
  });

  inputContainer.appendChild(textarea);
  container.appendChild(inputContainer);

  // --- Actions bar ---
  const actions = document.createElement('div');
  actions.className = 'chat-input-field__actions';

  // Left side
  const leftSide = document.createElement('div');
  leftSide.className = 'chat-input-field__left';

  const plusBtn = createIconButton('plus-sm' as IconName, 'chat-input-field__icon-btn chat-input-field__icon-btn--secondary');
  const formatBtn = createPillButton(formatLabel, 'chevron-down-sm' as IconName);
  if (formatSelected) {
    formatBtn.classList.add('chat-input-field__pill-btn--selected');
  }

  leftSide.append(plusBtn, formatBtn);

  // Right side
  const rightSide = document.createElement('div');
  rightSide.className = 'chat-input-field__right';

  const createBtn = createPillButton('Create', 'chevron-down-sm' as IconName);
  const micBtn = createIconButton('mic-fill' as IconName, 'chat-input-field__icon-btn chat-input-field__icon-btn--outlined');
  const sendBtn = createIconButton('arrow-up' as IconName, 'chat-input-field__icon-btn chat-input-field__icon-btn--primary');
  sendBtn.classList.add('chat-input-field__send-btn');

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
    state === 'populated' ? 'chat-input-field--populated' : 'chat-input-field--default',
  );

  return container;
}

// --- Helper: icon-only circular button ---
function createIconButton(icon: IconName, className: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;

  const iconSpan = iconEl(icon, 'chat-input-field__icon');
  btn.appendChild(iconSpan);

  return btn;
}

// --- Helper: pill button with label + chevron ---
function createPillButton(label: string, chevronIcon: IconName): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'chat-input-field__pill-btn';

  const labelSpan = document.createElement('span');
  labelSpan.className = 'chat-input-field__pill-label';
  labelSpan.textContent = label;

  const chevron = iconEl(chevronIcon, 'chat-input-field__pill-chevron');

  btn.append(labelSpan, chevron);
  return btn;
}
