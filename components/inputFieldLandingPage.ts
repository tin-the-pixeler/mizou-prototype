// components/inputFieldLandingPage.ts
// Landing-page input field — larger, prominent card with shadow.
// Features: file upload area, textarea, plus button (32px), bold format pill, mic/send toggle.

import { iconEl, type IconName } from '../icons';
import { createButton } from './button';
import { createButtonIcon } from './buttonIcon';

export type InputFieldLandingPageState = 'default' | 'populated';

export type InputFieldLandingPageOptions = {
  /** Placeholder text shown in the input */
  placeholder?: string;
  /** Current value of the input */
  value?: string;
  /** Visual state: default (empty) or populated (has content) */
  state?: InputFieldLandingPageState;
  /** Label for the format pill button (default: "Select format") */
  formatLabel?: string;
  /** Whether the format pill is in selected/active state (dark bg) */
  formatSelected?: boolean;
  /** Whether to show file upload area with attached files */
  showFileUpload?: boolean;
  /** Callback when send button is clicked */
  onSend?: (value: string) => void;
};

export function createInputFieldLandingPage({
  placeholder = 'Ask or describe your role play scenario...',
  value = '',
  state = 'default',
  formatLabel = 'Select format',
  formatSelected = false,
  showFileUpload = false,
  onSend,
}: InputFieldLandingPageOptions = {}): HTMLElement {
  const container = document.createElement('div');
  container.className = 'input-field-landing';

  // --- File upload area (optional) ---
  if (showFileUpload) {
    const filesUploaded = document.createElement('div');
    filesUploaded.className = 'input-field-landing__files';

    for (let i = 0; i < 5; i++) {
      filesUploaded.appendChild(createFileBlock('Filename.pdf'));
    }
    container.appendChild(filesUploaded);
  }

  // --- Input container ---
  const inputContainer = document.createElement('div');
  inputContainer.className = 'input-field-landing__input-container';

  const textarea = document.createElement('div');
  textarea.className = 'input-field-landing__textarea';
  textarea.contentEditable = 'true';
  textarea.setAttribute('role', 'textbox');
  textarea.setAttribute('data-placeholder', placeholder);

  if (state === 'populated' && value) {
    textarea.textContent = value;
  }

  // Update state on input
  textarea.addEventListener('input', () => {
    const hasContent = textarea.textContent!.trim().length > 0;
    container.classList.toggle('input-field-landing--populated', hasContent);
    container.classList.toggle('input-field-landing--default', !hasContent);
  });

  inputContainer.appendChild(textarea);
  container.appendChild(inputContainer);

  // --- Actions bar ---
  const actions = document.createElement('div');
  actions.className = 'input-field-landing__actions';

  // Left side
  const leftSide = document.createElement('div');
  leftSide.className = 'input-field-landing__left';

  const plusBtn = createButtonIcon({
    icon: 'plus-sm' as IconName,
    action: 'secondary',
    size: 'sm',
    label: 'Add attachment',
  });

  const formatBtn = createButton({
    label: formatLabel,
    variant: 'tertiary',
    size: 'sm',
    rightIcon: 'chevron-down-sm' as IconName,
  });

  leftSide.append(plusBtn, formatBtn);

  // Right side — default: mic only; populated: send only
  const rightSide = document.createElement('div');
  rightSide.className = 'input-field-landing__right';

  const micBtn = createButtonIcon({
    icon: 'mic-fill' as IconName,
    action: 'tertiary',
    size: 'sm',
    label: 'Voice input',
  });
  micBtn.classList.add('input-field-landing__mic-btn');

  const sendBtn = createButtonIcon({
    icon: 'arrow-up' as IconName,
    action: 'primary',
    size: 'sm',
    label: 'Send',
  });
  sendBtn.classList.add('input-field-landing__send-btn');

  if (onSend) {
    sendBtn.addEventListener('click', () => {
      const text = textarea.textContent?.trim() ?? '';
      if (text) onSend(text);
    });
  }

  rightSide.append(micBtn, sendBtn);

  actions.append(leftSide, rightSide);
  container.appendChild(actions);

  // Set initial state class
  container.classList.add(
    state === 'populated' ? 'input-field-landing--populated' : 'input-field-landing--default',
  );

  return container;
}

// --- Helper: file block with icon + filename + remove button ---
function createFileBlock(filename: string): HTMLElement {
  const block = document.createElement('div');
  block.className = 'input-field-landing__file-block';

  const content = document.createElement('div');
  content.className = 'input-field-landing__file-content';

  const fileIcon = document.createElement('span');
  fileIcon.className = 'input-field-landing__file-icon';
  fileIcon.innerHTML = `<svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M1 3C1 1.89543 1.89543 1 3 1H11L17 7V17C17 18.1046 16.1046 19 15 19H3C1.89543 19 1 18.1046 1 17V3Z" fill="#F2F2F5" stroke="#E4E4E9"/><text x="4" y="16" font-size="5" font-weight="700" fill="#F43F5E">PDF</text></svg>`;
  content.appendChild(fileIcon);

  const nameEl = document.createElement('span');
  nameEl.className = 'input-field-landing__file-name';
  nameEl.textContent = filename;
  content.appendChild(nameEl);

  block.appendChild(content);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'input-field-landing__file-remove';
  const crossIcon = document.createElement('span');
  crossIcon.className = 'input-field-landing__file-remove-icon';
  crossIcon.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  removeBtn.appendChild(crossIcon);
  removeBtn.addEventListener('click', () => block.remove());
  block.appendChild(removeBtn);

  return block;
}

