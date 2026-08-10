// components/modal.ts
// Single reusable Modal anatomy: close icon, text-block, optional content slot, action-group.
// Anatomy source: Figma "Sales-trainer-MVP", node 15431:254036, section "Modals".

import '../styles/modal.css';
import { iconEl } from '../icons';

export type ModalActionButton = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export type ModalActionSize = 'md' | 'lg'; // 40px / 48px button height

// Discriminated so a caller cannot combine textLink with primary/secondary —
// there is no three-action or button+text-link pattern in the source design system.
export type ModalActions =
  | { primary?: ModalActionButton; secondary?: ModalActionButton }
  | { textLink: ModalActionButton };

export type ModalOptions = {
  title: string;
  body?: string | Node; // pass a Node (e.g. containing <b>/<strong>) for inline bold spans
  dismissible?: boolean; // default true; controls close-icon visibility
  content?: Node; // optional slot: textarea, loader, image, columns, etc.
  actions?: ModalActions;
  actionSize?: ModalActionSize;
  width?: number; // defaults to 600; only deviate with a stated content reason
  onClose?: () => void;
};

export const modalActionSizes: ModalActionSize[] = ['md', 'lg'];
export const modalWidthPresets = [600, 650, 1489] as const;
export const MODAL_MIN_WIDTH = 600;

function hasTextLink(actions: ModalActions): actions is { textLink: ModalActionButton } {
  return 'textLink' in actions && !!actions.textLink;
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute('disabled'));
}

export function createModal(options: ModalOptions): HTMLElement {
  const {
    title,
    body,
    dismissible = true,
    content,
    actions,
    actionSize = 'md',
    width = MODAL_MIN_WIDTH,
    onClose,
  } = options;

  if (actions && hasTextLink(actions)) {
    const rest = actions as { primary?: unknown; secondary?: unknown };
    if (rest.primary || rest.secondary) {
      throw new Error(
        'Modal actions: `textLink` cannot be combined with `primary`/`secondary` — use one or the other.',
      );
    }
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'sb-modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'sb-modal';
  modal.style.width = `${width}px`;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('tabindex', '-1');

  const titleId = `sb-modal-title-${Math.random().toString(36).slice(2, 9)}`;
  modal.setAttribute('aria-labelledby', titleId);

  function close() {
    document.removeEventListener('keydown', onKeydown);
    backdrop.remove();
    onClose?.();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (dismissible) close();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = getFocusable(modal);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  if (dismissible) {
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'sb-modal__close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.appendChild(iconEl('x', 'sb-icon'));
    closeBtn.addEventListener('click', close);
    modal.appendChild(closeBtn);

    backdrop.addEventListener('mousedown', (e) => {
      if (e.target === backdrop) close();
    });
  }

  const textBlock = document.createElement('div');
  textBlock.className = 'sb-modal__text-block';

  const titleEl = document.createElement('h2');
  titleEl.id = titleId;
  titleEl.className = 'sb-modal__title';
  titleEl.textContent = title;
  textBlock.appendChild(titleEl);

  if (body) {
    const bodyEl = document.createElement('div');
    bodyEl.className = 'sb-modal__body';
    if (typeof body === 'string') {
      bodyEl.textContent = body;
    } else {
      bodyEl.appendChild(body);
    }
    textBlock.appendChild(bodyEl);
  }

  modal.appendChild(textBlock);

  if (content) {
    const contentSlot = document.createElement('div');
    contentSlot.className = 'sb-modal__content';
    contentSlot.appendChild(content);
    modal.appendChild(contentSlot);
  }

  if (actions) {
    if (hasTextLink(actions)) {
      const link = document.createElement('button');
      link.type = 'button';
      link.className = 'sb-modal__text-link';
      link.textContent = actions.textLink.label;
      link.disabled = !!actions.textLink.disabled;
      link.addEventListener('click', () => actions.textLink.onClick?.());

      const group = document.createElement('div');
      group.className = 'sb-modal__actions sb-modal__actions--link';
      group.appendChild(link);
      modal.appendChild(group);
    } else if (actions.primary || actions.secondary) {
      const group = document.createElement('div');
      group.className = `sb-modal__actions sb-modal__actions--${actionSize}`;

      // Secondary always renders first, primary last — primary is always the rightmost button.
      if (actions.secondary) {
        const secondaryBtn = document.createElement('button');
        secondaryBtn.type = 'button';
        secondaryBtn.className = `sb-modal__button sb-modal__button--secondary sb-modal__button--${actionSize}`;
        secondaryBtn.textContent = actions.secondary.label;
        secondaryBtn.disabled = !!actions.secondary.disabled;
        secondaryBtn.addEventListener('click', () => actions.secondary!.onClick?.());
        group.appendChild(secondaryBtn);
      }

      if (actions.primary) {
        const primaryBtn = document.createElement('button');
        primaryBtn.type = 'button';
        primaryBtn.className = `sb-modal__button sb-modal__button--primary sb-modal__button--${actionSize}`;
        primaryBtn.textContent = actions.primary.label;
        primaryBtn.disabled = !!actions.primary.disabled;
        primaryBtn.addEventListener('click', () => actions.primary!.onClick?.());
        group.appendChild(primaryBtn);
      }

      modal.appendChild(group);
    }
  }

  backdrop.appendChild(modal);
  document.addEventListener('keydown', onKeydown);

  queueMicrotask(() => {
    const focusable = getFocusable(modal);
    (focusable[0] ?? modal).focus();
  });

  return backdrop;
}
