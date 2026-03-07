// components/chatPanelHeader.ts
// Chat panel header with back button, simulation type badge, and title.

import { iconEl, type IconName } from '../icons';

export type ChatPanelHeaderOptions = {
  /** Simulation type label (e.g. "Chatbot") */
  type?: string;
  /** Title shown after the badge (e.g. "Draft") */
  title?: string;
  /** Callback when back button is clicked */
  onBack?: () => void;
};

export function createChatPanelHeader({
  type = 'Chatbot',
  title = 'Draft',
  onBack,
}: ChatPanelHeaderOptions = {}): HTMLElement {
  const header = document.createElement('div');
  header.className = 'chat-panel-header';

  const breadcrumb = document.createElement('div');
  breadcrumb.className = 'chat-panel-header__breadcrumb';

  // Back chevron
  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'chat-panel-header__back';
  backBtn.appendChild(iconEl('chevron-left-sm' as IconName, 'chat-panel-header__back-icon'));
  if (onBack) backBtn.addEventListener('click', onBack);

  // Divider
  const divider = document.createElement('span');
  divider.className = 'chat-panel-header__divider';

  // Badge
  const badge = document.createElement('span');
  badge.className = 'chat-panel-header__badge';

  const badgeIcon = iconEl('chat-ai' as IconName, 'chat-panel-header__badge-icon');
  const badgeLabel = document.createElement('span');
  badgeLabel.className = 'chat-panel-header__badge-label';
  badgeLabel.textContent = type;
  badge.append(badgeIcon, badgeLabel);

  // Title
  const titleEl = document.createElement('span');
  titleEl.className = 'chat-panel-header__title';
  titleEl.textContent = title;

  breadcrumb.append(backBtn, divider, badge, titleEl);
  header.appendChild(breadcrumb);

  return header;
}
