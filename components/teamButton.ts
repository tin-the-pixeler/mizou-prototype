// components/teamButton.ts
import { iconEl } from '../icons';

export type TeamOptions = {
  name: string;
  initials?: string;
  color?: string;   // avatar bg
  open?: boolean;   // (kept for future use)
  minimized?: boolean; // show avatar-only (no name, no menu)
};

export function createTeamButton({
  name,
  initials = 'TN',
  color = '#b17979',
  minimized = false,
}: TeamOptions) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'sb-team-button' + (minimized ? ' sb-team-button--minimized' : '');
  btn.setAttribute('aria-haspopup', 'menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.title = name;

  const chip = document.createElement('span');
  chip.className = 'sb-team-button__avatar';
  chip.textContent = initials.toUpperCase();
  chip.style.background = color;
  btn.appendChild(chip);

  if (!minimized) {
    // Wrap avatar + name in left cluster
    const left = document.createElement('div');
    left.className = 'sb-team-left';
    left.appendChild(chip);

    const label = document.createElement('span');
    label.className = 'sb-team-button__name';
    label.textContent = name;
    label.title = name;
    left.appendChild(label);

    // Re-structure: left cluster + menu button
    btn.innerHTML = '';
    btn.appendChild(left);

    const menuBtn = document.createElement('button');
    menuBtn.type = 'button';
    menuBtn.className = 'sb-team-button__menu';
    menuBtn.setAttribute('aria-label', 'Team actions');
    menuBtn.appendChild(iconEl('dots-horizontal'));
    menuBtn.addEventListener('click', (e) => e.stopPropagation());
    btn.appendChild(menuBtn);
  }

  return btn;
}
