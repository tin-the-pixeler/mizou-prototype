// components/organizationButton.ts
import { iconEl, type IconName } from '../icons';

export type OrganizationOptions = {
  name: string;
  logoIcon?: IconName;       // e.g., 'logo-sq-acme'
  /** Render a letter avatar instead of an SVG icon */
  avatarLetter?: string;     // e.g., 'M'
  /** Background color for the letter avatar */
  avatarColor?: string;      // e.g., '#6963FC'
  open?: boolean;            // initial dropdown state
  minimized?: boolean;       // show logo-only (no name, no chevron)
};

export function createOrganizationButton({
  name,
  logoIcon = 'logo-sq-acme',
  avatarLetter,
  avatarColor,
  open = false,
  minimized = false,
}: OrganizationOptions) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'sb-org-button' + (minimized ? ' sb-org-button--minimized' : '');
  btn.setAttribute('aria-haspopup', 'menu');
  btn.setAttribute('aria-expanded', String(open));
  btn.dataset.state = open ? 'open' : 'closed';

  // Logo: letter avatar or SVG icon
  const logo = document.createElement('span');
  logo.className = 'sb-org-button__logo';

  if (avatarLetter) {
    const chip = document.createElement('span');
    chip.className = 'sb-org-button__avatar';
    chip.textContent = avatarLetter;
    if (avatarColor) chip.style.background = avatarColor;
    logo.appendChild(chip);
  } else {
    logo.appendChild(iconEl(logoIcon));
  }

  btn.appendChild(logo);

  if (!minimized) {
    const wrap = document.createElement('span');
    wrap.className = 'sb-tooltip-wrap';

    const label = document.createElement('span');
    label.className = 'sb-org-button__name';
    label.textContent = name;
    label.title = name;

    const tip = document.createElement('span');
    tip.className = 'sb-tooltip';
    tip.textContent = name;

    wrap.append(label, tip);
    btn.appendChild(wrap);

    // Chevron
    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevron.setAttribute('viewBox', '0 0 24 24');
    chevron.setAttribute('aria-hidden', 'true');
    chevron.classList.add('sb-org-button__chevron');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M6 9l6 6 6-6');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    chevron.appendChild(path);
    btn.appendChild(chevron);

    queueMicrotask(() => {
      if (label.scrollWidth <= label.clientWidth) tip.style.display = 'none';
    });
  }

  // Click → toggle "open" state
  btn.addEventListener('click', () => {
    const isOpen = btn.dataset.state === 'open';
    btn.dataset.state = isOpen ? 'closed' : 'open';
    btn.setAttribute('aria-expanded', String(!isOpen));
  });

  return btn;
}
