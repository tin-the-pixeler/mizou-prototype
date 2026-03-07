// components/mizouMessage.ts
// Mizou (AI assistant) message with optional artifact card and footer.

import { iconEl } from '../icons';

export type ArtifactCard = {
  title: string;
  subtitle?: string;
  onClick?: () => void;
};

export type MizouMessageOptions = {
  /** Plain-text or HTML message body */
  content: string;
  /** Optional artifact card shown below the message */
  artifact?: ArtifactCard;
  /** Optional footer text (appears below divider) */
  footer?: string;
};

export function createMizouMessage({
  content,
  artifact,
  footer,
}: MizouMessageOptions): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'mizou-message';

  // --- Message body (uses chat-markdown typography) ---
  const body = document.createElement('div');
  body.className = 'mizou-message__body chat-markdown';
  body.innerHTML = content;
  wrapper.appendChild(body);

  // --- Artifact card (optional) ---
  if (artifact) {
    const card = document.createElement('button');
    card.className = 'mizou-message__artifact';
    card.type = 'button';

    const contentEl = document.createElement('div');
    contentEl.className = 'mizou-message__artifact-content';

    const title = document.createElement('span');
    title.className = 'mizou-message__artifact-title';
    title.textContent = artifact.title;
    contentEl.appendChild(title);

    if (artifact.subtitle) {
      const subtitle = document.createElement('span');
      subtitle.className = 'mizou-message__artifact-subtitle';
      subtitle.textContent = artifact.subtitle;
      contentEl.appendChild(subtitle);
    }

    const chevron = iconEl('chevron-right-sm' as any, 'mizou-message__artifact-chevron');

    card.append(contentEl, chevron);

    if (artifact.onClick) {
      card.addEventListener('click', artifact.onClick);
    }

    wrapper.appendChild(card);
  }

  // --- Footer (optional) ---
  if (footer) {
    const footerEl = document.createElement('div');
    footerEl.className = 'mizou-message__footer';
    footerEl.textContent = footer;
    wrapper.appendChild(footerEl);
  }

  return wrapper;
}
