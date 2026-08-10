import type { Meta, StoryObj } from '@storybook/html';
import { createModal, type ModalActions, MODAL_MIN_WIDTH } from '../components/modal';

type ActionConfig = 'primary-secondary' | 'text-link' | 'none';

type ModalStoryArgs = {
  title: string;
  body: string;
  dismissible: boolean;
  actionConfig: ActionConfig;
  primaryLabel: string;
  secondaryLabel: string;
  textLinkLabel: string;
  width: number;
};

function buildActions(args: ModalStoryArgs): ModalActions | undefined {
  if (args.actionConfig === 'none') return undefined;
  if (args.actionConfig === 'text-link') {
    return { textLink: { label: args.textLinkLabel, onClick: () => console.log('text-link clicked') } };
  }
  return {
    secondary: { label: args.secondaryLabel, onClick: () => console.log('secondary clicked') },
    primary: { label: args.primaryLabel, onClick: () => console.log('primary clicked') },
  };
}

const baseArgTypes = {
  title: { control: 'text' },
  body: { control: 'text' },
  dismissible: { control: 'boolean' },
  actionConfig: {
    control: 'select',
    options: ['primary-secondary', 'text-link', 'none'] as ActionConfig[],
    name: 'Action configuration',
  },
  primaryLabel: { control: 'text', name: 'Primary label' },
  secondaryLabel: { control: 'text', name: 'Secondary label' },
  textLinkLabel: { control: 'text', name: 'Text-link label' },
  width: { control: 'number' },
};

const meta: Meta<ModalStoryArgs> = {
  title: 'Components/Modal',
  argTypes: baseArgTypes,
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '560px' } },
  },
};
export default meta;

type Story = StoryObj<ModalStoryArgs>;

// ---- shared content-slot helpers (layout only — no business logic) ----

function createSpinner(): HTMLElement {
  const spinner = document.createElement('div');
  spinner.style.cssText =
    'width:32px;height:32px;border-radius:999px;border:3px solid var(--border-default);' +
    'border-top-color:var(--interactive-primary);animation:sb-modal-spin 0.8s linear infinite;margin:0 auto;';
  const styleId = 'sb-modal-spin-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = '@keyframes sb-modal-spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }
  return spinner;
}

function createCenteredLabel(text: string): HTMLElement {
  const label = document.createElement('p');
  label.textContent = text;
  label.style.cssText = 'margin:0;text-align:center;color:var(--text-secondary);font-size:var(--fs-base);';
  return label;
}

function createLoadingContent(label: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;gap:var(--spacing-sm);align-items:center;padding:var(--spacing-md) 0;';
  wrap.appendChild(createSpinner());
  wrap.appendChild(createCenteredLabel(label));
  return wrap;
}

function createSuccessContent(label: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;gap:var(--spacing-sm);align-items:center;padding:var(--spacing-xs) 0;';

  const iconWrap = document.createElement('div');
  iconWrap.style.cssText =
    'width:48px;height:48px;border-radius:999px;background:var(--feedback-success-bg);' +
    'display:flex;align-items:center;justify-content:center;color:var(--feedback-success);';
  iconWrap.innerHTML =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l5 5 9-11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  wrap.appendChild(iconWrap);
  wrap.appendChild(createCenteredLabel(label));

  const divider = document.createElement('div');
  divider.style.cssText = 'width:100%;height:1px;background:var(--border-divider);margin-top:var(--spacing-2xs);';
  wrap.appendChild(divider);

  return wrap;
}

function createTextareaContent(placeholder: string): HTMLElement {
  const textarea = document.createElement('textarea');
  textarea.placeholder = placeholder;
  textarea.rows = 4;
  textarea.style.cssText =
    'width:100%;box-sizing:border-box;resize:vertical;padding:var(--spacing-2xs) var(--spacing-xs);' +
    'border:1px solid var(--border-default);border-radius:var(--radius-md);font-family:var(--font-sans);' +
    'font-size:var(--fs-base);color:var(--text-primary);';
  return textarea;
}

function createLinkColumn(heading: string, url: string): HTMLElement {
  const col = document.createElement('div');
  col.style.cssText = 'display:flex;flex-direction:column;gap:var(--spacing-2xs);';

  const h = document.createElement('h3');
  h.textContent = heading;
  h.style.cssText = 'margin:0;font-size:var(--fs-base);font-weight:var(--fw-bold);color:var(--text-primary);';
  col.appendChild(h);

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:var(--spacing-2xs);';

  const input = document.createElement('input');
  input.type = 'text';
  input.readOnly = true;
  input.value = url;
  input.style.cssText =
    'flex:1;min-width:0;padding:var(--spacing-2xs) var(--spacing-xs);border:1px solid var(--border-default);' +
    'border-radius:var(--radius-md);font-family:var(--font-sans);font-size:var(--fs-sm);color:var(--text-secondary);';
  row.appendChild(input);

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.textContent = 'Copy';
  copyBtn.style.cssText =
    'padding:var(--spacing-2xs) var(--spacing-xs);border:1px solid var(--border-button);border-radius:var(--radius-full);' +
    'background:var(--surface-emphasis);font-family:var(--font-sans);font-weight:var(--fw-bold);font-size:var(--fs-sm);' +
    'color:var(--text-primary);cursor:pointer;';
  row.appendChild(copyBtn);

  col.appendChild(row);
  return col;
}

function createTwoColumnContent(): HTMLElement {
  const columns = document.createElement('div');
  columns.className = 'sb-modal__columns';
  columns.appendChild(createLinkColumn('Public link', 'https://app.mizou.com/assign/pub-4kD2n'));
  columns.appendChild(createLinkColumn('Guest link', 'https://app.mizou.com/assign/guest-8xQ1p'));
  return columns;
}

// ---- 1. Confirmation / destructive ----

export const ConfirmationDestructive: Story = {
  name: 'Confirmation — destructive',
  args: {
    title: 'Remove team member?',
    body: 'This will remove them from every simulation and collection they were assigned to. This action cannot be undone.',
    dismissible: true,
    actionConfig: 'primary-secondary',
    primaryLabel: 'Remove member',
    secondaryLabel: 'Cancel',
    textLinkLabel: 'Dismiss',
    width: MODAL_MIN_WIDTH,
  },
  argTypes: baseArgTypes,
  render: (args) =>
    createModal({
      title: args.title,
      body: args.body,
      dismissible: args.dismissible,
      actions: buildActions(args),
      width: args.width,
    }),
};

// ---- 2. Blocking / non-dismissible ----

export const BlockingNonDismissible: Story = {
  name: 'Blocking — non-dismissible',
  args: {
    title: 'Your account is migrating',
    body: 'We’re moving your workspace to the new billing system. Choose how to continue — this can’t be skipped.',
    dismissible: false,
    actionConfig: 'primary-secondary',
    primaryLabel: 'Migrate now',
    secondaryLabel: 'Remind me later',
    textLinkLabel: 'Dismiss',
    width: MODAL_MIN_WIDTH,
  },
  argTypes: baseArgTypes,
  render: (args) =>
    createModal({
      title: args.title,
      body: args.body,
      dismissible: args.dismissible,
      actions: buildActions(args),
      width: args.width,
    }),
};

// ---- 3. Extra content block ----

export const ExtraContentBlock: Story = {
  name: 'Extra content — textarea',
  args: {
    title: 'Report a simulation issue',
    body: 'Tell us what went wrong so we can take a look.',
    dismissible: true,
    actionConfig: 'primary-secondary',
    primaryLabel: 'Submit report',
    secondaryLabel: 'Cancel',
    textLinkLabel: 'Dismiss',
    width: MODAL_MIN_WIDTH,
  },
  argTypes: baseArgTypes,
  render: (args) =>
    createModal({
      title: args.title,
      body: args.body,
      dismissible: args.dismissible,
      content: createTextareaContent('Describe the issue…'),
      actions: buildActions(args),
      width: args.width,
    }),
};

// ---- 4. Loading state ----

export const LoadingState: Story = {
  name: 'Loading state',
  args: {
    title: 'Setting up your simulation',
    body: '',
    dismissible: true,
    actionConfig: 'none',
    primaryLabel: '',
    secondaryLabel: '',
    textLinkLabel: '',
    width: MODAL_MIN_WIDTH,
  },
  argTypes: baseArgTypes,
  render: (args) =>
    createModal({
      title: args.title,
      dismissible: args.dismissible,
      content: createLoadingContent('This usually takes a few seconds…'),
      width: args.width,
    }),
};

// ---- 5. Complete / success state ----

export const CompleteState: Story = {
  name: 'Complete — success',
  args: {
    title: 'Import complete',
    body: '',
    dismissible: true,
    actionConfig: 'text-link',
    primaryLabel: '',
    secondaryLabel: '',
    textLinkLabel: 'Done',
    width: MODAL_MIN_WIDTH,
  },
  argTypes: baseArgTypes,
  render: (args) =>
    createModal({
      title: args.title,
      dismissible: args.dismissible,
      content: createSuccessContent('12 simulations imported successfully.'),
      actions: buildActions(args),
      width: args.width,
    }),
};

// ---- 6. Wide / two-column ----

export const WideTwoColumn: Story = {
  name: 'Wide — two column',
  args: {
    title: 'Share assignment link',
    body: 'Anyone with the public link can view; the guest link also lets them start the simulation.',
    dismissible: true,
    actionConfig: 'primary-secondary',
    primaryLabel: 'Done',
    secondaryLabel: 'Cancel',
    textLinkLabel: 'Dismiss',
    width: 1489,
  },
  argTypes: baseArgTypes,
  render: (args) =>
    createModal({
      title: args.title,
      body: args.body,
      dismissible: args.dismissible,
      content: createTwoColumnContent(),
      actions: buildActions(args),
      width: args.width,
    }),
};
