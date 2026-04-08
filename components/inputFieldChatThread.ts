// components/inputFieldChatThread.ts
// Compact chat input field used inside the chat thread view.
// Features: textarea, plus button, format pill (xs), Create pill, mic button, send button.

import { iconEl, type IconName } from '../icons';
import { createModeBadge, type ModeBadgeMode } from './modeBadge';

export type InputFieldChatThreadState = 'default' | 'populated' | 'generating';

export type InputFieldChatThreadOptions = {
  /** Placeholder text shown in the input */
  placeholder?: string;
  /** Current value of the input */
  value?: string;
  /** Visual state: default (empty), populated (has content), or generating (awaiting response) */
  state?: InputFieldChatThreadState;
  /** Label for the format pill button (default: "Select format") */
  formatLabel?: string;
  /** Whether the format pill is in selected/active state (dark bg) */
  formatSelected?: boolean;
  /** Icon shown in the format pill when a format is selected */
  formatIcon?: IconName;
  /** Callback when send button is clicked */
  onSend?: (value: string) => void;
  /** Callback when stop button is clicked (generating state) */
  onStop?: () => void;
  /** Active mode shown in the mode badge (default: 'create') */
  mode?: ModeBadgeMode;
  /** Callback when mode badge is clicked */
  onModeClick?: (mode: ModeBadgeMode) => void;
};

export function createInputFieldChatThread({
  placeholder = 'Type your message',
  value = '',
  state = 'default',
  formatLabel = 'Select format',
  formatSelected = false,
  formatIcon,
  onSend,
  onStop,
  mode = 'create',
  onModeClick,
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
  // Only show icon when a format is actively selected
  const formatBtn = createPillButton(formatLabel, 'chevron-down-sm' as IconName, formatSelected ? (formatIcon ?? 'chat-ai' as IconName) : undefined);
  if (formatSelected) {
    formatBtn.classList.add('input-field-chat-thread__pill-btn--selected');
  }

  leftSide.append(plusBtn, formatBtn);

  // Right side
  const rightSide = document.createElement('div');
  rightSide.className = 'input-field-chat-thread__right';

  const createBtn = createModeBadge({ mode, onClick: onModeClick });

  // Single dynamic action button — changes per state
  let actionBtn: HTMLButtonElement;
  if (state === 'generating') {
    actionBtn = createIconButton('stop' as IconName, 'input-field-chat-thread__icon-btn input-field-chat-thread__icon-btn--destructive');
    if (onStop) actionBtn.addEventListener('click', onStop);
  } else if (state === 'populated') {
    actionBtn = createIconButton('arrow-up' as IconName, 'input-field-chat-thread__icon-btn input-field-chat-thread__icon-btn--primary');
    if (onSend) {
      actionBtn.addEventListener('click', () => {
        const text = textarea.textContent?.trim() ?? '';
        if (text) onSend(text);
      });
    }
  } else {
    actionBtn = createIconButton('mic-fill' as IconName, 'input-field-chat-thread__icon-btn input-field-chat-thread__icon-btn--outlined');
  }

  rightSide.append(createBtn, actionBtn);

  actions.append(leftSide, rightSide);
  container.appendChild(actions);

  // Set initial state class
  const stateClass = state === 'populated'
    ? 'input-field-chat-thread--populated'
    : state === 'generating'
      ? 'input-field-chat-thread--generating'
      : 'input-field-chat-thread--default';
  container.classList.add(stateClass);

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

// --- Helper: pill button with optional leading icon + label + chevron ---
function createPillButton(label: string, chevronIcon: IconName, leadingIcon?: IconName): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'input-field-chat-thread__pill-btn';

  const root = document.createElement('span');
  root.className = 'input-field-chat-thread__pill-root';

  if (leadingIcon) {
    const icon = iconEl(leadingIcon, 'input-field-chat-thread__pill-icon');
    root.appendChild(icon);
  }

  const labelSpan = document.createElement('span');
  labelSpan.className = 'input-field-chat-thread__pill-label';
  labelSpan.textContent = label;
  root.appendChild(labelSpan);

  const chevron = iconEl(chevronIcon, 'input-field-chat-thread__pill-chevron');

  btn.append(root, chevron);
  return btn;
}
