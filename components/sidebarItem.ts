// components/sidebarItem.ts
import { iconEl, type IconName } from '../icons';

export type SidebarItemOptions = {
  label: string;
  active?: boolean;
  icon?: IconName;
};

export function createSidebarItem({
  label,
  active = false,
  icon = 'simulations',
}: SidebarItemOptions) {
  const a = document.createElement('a');
  a.href = '#';
  a.className = `sb-sidebar-item ${active ? 'sb-sidebar-item--active' : ''}`;

  const chip = document.createElement('span');
  chip.className = 'sb-sidebar-item__icon-wrap';
  chip.appendChild(iconEl(icon));

  const text = document.createElement('span');
  text.textContent = label;

  a.append(chip, text);
  return a;
}
