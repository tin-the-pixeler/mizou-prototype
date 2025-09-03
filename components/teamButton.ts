// components/teamButton.ts
import { iconEl } from '../icons';

export type TeamOptions = {
  name: string;
  initials?: string;
  color?: string;   // avatar bg
  open?: boolean;   // (kept for future use; not used here)
};

export function createTeamButton({
  name,
  initials = 'TN',
  color = '#b17979',
}: TeamOptions) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'sb-team-button';
  btn.setAttribute('aria-haspopup', 'menu');
  btn.setAttribute('aria-expanded', 'false');

  const left = document.createElement('div');
  left.className = 'sb-team-left';

  const chip = document.createElement('span');
  chip.className = 'sb-team-button__avatar';
  chip.textContent = initials.toUpperCase();
  chip.style.background = color;

  const label = document.createElement('span');
  label.className = 'sb-team-button__name';
  label.textContent = name;
  label.title = name;

  left.append(chip, label);

  // Right actions: 3-dots icon inside a small chip
  const menuBtn = document.createElement('button');
  menuBtn.type = 'button';
  menuBtn.className = 'sb-team-button__menu';
  menuBtn.setAttribute('aria-label', 'Team actions');
  menuBtn.appendChild(iconEl('dots-horizontal')); 

  // (Optional) stop propagation if you later add a dropdown on click
  menuBtn.addEventListener('click', (e) => e.stopPropagation());

  btn.append(left, menuBtn);
  return btn;
}
