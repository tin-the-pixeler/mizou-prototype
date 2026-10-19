// components/accountSettingsPage.ts
// Account settings ("Manage Account") as it looks in production: sidebar + topbar +
// white panel with two segmented tabs.
//   My Account            — avatar, name, log-in information, language, and the
//                           new Privacy section ("Allow my manager to see my feedback").
//   Organization Settings — workspace logo + name, Feature Request card.
// The Privacy toggle is a React component (ui/settings-toggle-row) mounted into
// this DOM page, same approach as the manager-visibility control in feedbackDrawer.ts.

import '../styles/account-settings-page.css';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { createSidebar } from './sidebar';
import { createTopbarPrimary } from './topbarPrimary';
import { createTabsNav } from './tabsNav';
import { createButton } from './button';
import { iconEl, type IconName } from '../icons';
import { SettingsToggleRow } from '../ui/settings-toggle-row';

export type AccountTabKey = 'account' | 'organization';

const TABS: { key: AccountTabKey; label: string }[] = [
  { key: 'account', label: 'My Account' },
  { key: 'organization', label: 'Organization Settings' },
];

const FOOTER_LINKS = [
  'About Us',
  'Privacy Policy',
  'Terms of Service',
  'Legal Notice',
  'Cookie Policy',
  'Data Protection Agreement',
];

export type AccountSettingsPageOptions = {
  initialTab?: AccountTabKey;
  firstName?: string;
  lastName?: string;
  email?: string;
  workspaceName?: string;
  /** Initial state of "Allow my manager to see my feedback". Default off (private by default). */
  allowManagerFeedback?: boolean;
  /** Omit to render the page without the Privacy section (production as it is today). */
  showFeedbackPrivacy?: boolean;
  onAllowManagerFeedbackChange?: (allowed: boolean) => void;
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function field(label: string, control: HTMLElement, id: string): HTMLElement {
  const wrap = el('div', 'acct__field');
  const lab = el('label', 'acct__label', label);
  lab.htmlFor = id;
  control.id = id;
  wrap.append(lab, control);
  return wrap;
}

function textInput(value: string, opts: { readOnly?: boolean; type?: string } = {}): HTMLInputElement {
  const input = el('input', 'acct__input' + (opts.readOnly ? ' acct__input--readonly' : ''));
  input.type = opts.type ?? 'text';
  input.value = value;
  input.readOnly = !!opts.readOnly;
  return input;
}

function changeLink(): HTMLElement {
  const link = el('a', 'acct__change');
  link.href = '#';
  link.append('Change', iconEl('edit' as IconName, 'sb-icon acct__change-icon'));
  link.addEventListener('click', (e) => e.preventDefault());
  return link;
}

function avatar(content: HTMLElement | string, modifier: string): HTMLElement {
  const wrap = el('div', 'acct__avatar-wrap');
  const circle = el('div', `acct__avatar ${modifier}`);
  if (typeof content === 'string') circle.textContent = content;
  else circle.appendChild(content);
  const editBtn = el('button', 'acct__avatar-edit');
  editBtn.type = 'button';
  editBtn.setAttribute('aria-label', 'Change picture');
  editBtn.appendChild(iconEl('edit' as IconName, 'sb-icon'));
  wrap.append(circle, editBtn);
  return wrap;
}

/** Save stays disabled until something changes, matching the production form. */
function saveButton(inputs: HTMLInputElement[]): HTMLButtonElement {
  const btn = createButton({ label: 'Save changes', variant: 'primary', size: 'sm', disabled: true });
  const initial = inputs.map((i) => i.value);
  const sync = () => {
    btn.disabled = inputs.every((input, i) => input.value === initial[i]);
  };
  inputs.forEach((input) => input.addEventListener('input', sync));
  return btn;
}

function buildAccountTab(o: Required<Pick<AccountSettingsPageOptions, 'firstName' | 'lastName' | 'email'>> &
  Pick<AccountSettingsPageOptions, 'allowManagerFeedback' | 'showFeedbackPrivacy' | 'onAllowManagerFeedbackChange'>): HTMLElement {
  const tab = el('div', 'acct__tab');

  tab.appendChild(avatar('A', 'acct__avatar--green'));

  const first = textInput(o.firstName);
  const last = textInput(o.lastName);
  const names = el('div', 'acct__row');
  names.append(field('First Name', first, 'acct-first-name'), field('Last Name', last, 'acct-last-name'));
  tab.append(names, saveButton([first, last]));

  tab.appendChild(el('hr', 'acct__divider'));

  const login = el('section', 'acct__section');
  login.appendChild(el('h2', 'acct__heading', 'Log In Information'));
  const loginRow = el('div', 'acct__row');
  const emailCol = el('div', 'acct__col');
  emailCol.append(field('Email', textInput(o.email, { readOnly: true }), 'acct-email'), changeLink());
  const passCol = el('div', 'acct__col');
  passCol.append(field('Password', textInput('*********', { readOnly: true, type: 'password' }), 'acct-password'), changeLink());
  loginRow.append(emailCol, passCol);
  login.appendChild(loginRow);
  tab.appendChild(login);

  tab.appendChild(el('hr', 'acct__divider'));

  const langSelect = el('div', 'acct__select');
  langSelect.append(el('span', 'acct__select-flag', '🇺🇸'), el('span', 'acct__select-value', 'English'));
  langSelect.appendChild(iconEl('chevron-down-sm' as IconName, 'sb-icon acct__select-chevron'));
  const langField = field('Select language', langSelect, 'acct-language');
  langField.classList.add('acct__field--half');
  tab.appendChild(langField);

  if (o.showFeedbackPrivacy) {
    tab.appendChild(el('hr', 'acct__divider'));
    const privacy = el('section', 'acct__section');
    privacy.appendChild(el('h2', 'acct__heading', 'Privacy'));
    const toggleHost = el('div');
    createRoot(toggleHost).render(
      createElement(SettingsToggleRow, {
        label: 'Allow my manager to see my feedback',
        helperText:
          'When off, only you can see your feedback by default. You can still make individual feedback visible to your manager.',
        defaultChecked: o.allowManagerFeedback ?? false,
        onCheckedChange: o.onAllowManagerFeedbackChange,
      }),
    );
    privacy.appendChild(toggleHost);
    tab.appendChild(privacy);
  }

  return tab;
}

function buildOrganizationTab(workspaceName: string): HTMLElement {
  const tab = el('div', 'acct__tab');

  tab.appendChild(avatar('LUMON', 'acct__avatar--logo'));

  const name = textInput(workspaceName);
  tab.append(field('Workspace Name', name, 'acct-workspace-name'), saveButton([name]));

  tab.appendChild(el('hr', 'acct__divider'));

  const card = el('div', 'acct__card');
  card.appendChild(el('h2', 'acct__card-title', 'Feature Request'));
  card.appendChild(
    el('p', 'acct__card-body', 'Need a specific feature or action? Our team is available for your dedicated support and assistance.'),
  );
  card.appendChild(createButton({ label: 'Contact Mizou', variant: 'secondary', size: 'sm' }));
  tab.appendChild(card);

  return tab;
}

export function createAccountSettingsPage({
  initialTab = 'account',
  firstName = 'Andrea',
  lastName = 'Applesmith',
  email = 'helena_troy@amex.com',
  workspaceName = 'Lumon Industries',
  allowManagerFeedback = false,
  showFeedbackPrivacy = true,
  onAllowManagerFeedbackChange,
}: AccountSettingsPageOptions = {}): HTMLElement {
  let currentTab: AccountTabKey = initialTab;

  // Reuses the Team Page shell classes (sidebar slot / main / rounded panel).
  const page = el('div', 'team-page acct');

  const sidebarSlot = el('div', 'team-page__sidebar-slot');
  sidebarSlot.appendChild(createSidebar({ variant: 'enterprise', hideSectionLabels: true, noActiveItem: true }));

  const main = el('div', 'team-page__main');
  const topbarSlot = el('div');
  topbarSlot.appendChild(
    createTopbarPrimary({
      title: 'Manage Account',
      hideTitleChevron: true,
      contactLabel: 'Contact Mizou',
      planLabel: 'Free',
      userInitial: 'A',
      userColor: '#be3a82',
    }),
  );

  const panelWrapper = el('div', 'team-page__panel-wrapper');
  const panel = el('div', 'team-page__panel');
  const tabsWrapper = el('div', 'team-page__tabs-wrapper acct__tabs');
  const container = el('div', 'team-page__container');
  panel.append(tabsWrapper, container);
  panelWrapper.appendChild(panel);

  const footer = el('footer', 'acct__footer');
  FOOTER_LINKS.forEach((label) => {
    const a = el('a', 'acct__footer-link', label);
    a.href = '#';
    a.addEventListener('click', (e) => e.preventDefault());
    footer.appendChild(a);
  });

  main.append(topbarSlot, panelWrapper, footer);
  page.append(sidebarSlot, main);

  function renderTabs() {
    tabsWrapper.replaceChildren(
      createTabsNav({
        items: TABS,
        activeKey: currentTab,
        onChange: (key) => {
          currentTab = key as AccountTabKey;
          renderTabs();
          renderContent();
        },
      }),
    );
  }

  function renderContent() {
    container.replaceChildren(
      currentTab === 'account'
        ? buildAccountTab({ firstName, lastName, email, allowManagerFeedback, showFeedbackPrivacy, onAllowManagerFeedbackChange })
        : buildOrganizationTab(workspaceName),
    );
  }

  renderTabs();
  renderContent();
  return page;
}
