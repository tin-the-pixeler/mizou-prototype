// components/organizationButton.ts
import { iconEl, type IconName } from '../icons';

export type OrganizationOptions = {
  name: string;
  logoIcon?: IconName;     // e.g., 'logo-sq-acme'
  open?: boolean;          // initial dropdown state
};

export function createOrganizationButton({
  name,
  logoIcon = 'logo-sq-acme',
  open = false,
}: OrganizationOptions) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'sb-org-button';
  btn.setAttribute('aria-haspopup', 'menu');
  btn.setAttribute('aria-expanded', String(open));
  btn.dataset.state = open ? 'open' : 'closed';

  // Left: logo + truncated label (with tooltip)
  const left = document.createElement('div');
  left.className = 'sb-org-left';

  const logo = document.createElement('span');
  logo.className = 'sb-org-button__logo';
  logo.appendChild(iconEl(logoIcon)); // your square logo SVG

  const wrap = document.createElement('span');
  wrap.className = 'sb-tooltip-wrap';

  const label = document.createElement('span');
  label.className = 'sb-org-button__name';
  label.textContent = name;
  label.title = name; // native tooltip

  const tip = document.createElement('span');
  tip.className = 'sb-tooltip';
  tip.textContent = name;

  wrap.append(label, tip);
  left.append(logo, wrap);

  // Right: chevron (inline SVG, NOT from icon library)
  const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  chevron.setAttribute('viewBox', '0 0 24 24');
  chevron.setAttribute('aria-hidden', 'true');
  chevron.classList.add('sb-org-button__chevron');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M6 9l6 6 6-6'); // down chevron
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  chevron.appendChild(path);

  // Click → toggle "open" state (future dropdown hook)
  btn.addEventListener('click', () => {
    const isOpen = btn.dataset.state === 'open';
    btn.dataset.state = isOpen ? 'closed' : 'open';
    btn.setAttribute('aria-expanded', String(!isOpen));
  });

  btn.append(left, chevron);

  // Hide custom tooltip if the label doesn't truncate
  queueMicrotask(() => {
    if (label.scrollWidth <= label.clientWidth) tip.style.display = 'none';
  });

  return btn;
}
