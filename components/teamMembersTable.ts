// components/teamMembersTable.ts
// Team members table: checkbox select, avatar+name+email, sortable Role /
// Last Active columns, row actions menu.
// Figma: table-members-desktop (node 15321:369726)

import { iconEl } from '../icons';

export type MemberRole = 'admin' | 'manager' | 'member';

export type TeamMemberRow = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: MemberRole;
  /** Display label, e.g. "Today", "2d", "Yesterday" */
  lastActive: string;
  /** Sortable timestamp backing `lastActive` (higher = more recent) */
  lastActiveTs: number;
};

export type MembersSortColumn = 'role' | 'lastActive';
export type MembersSortDirection = 'asc' | 'desc';
export type MembersSortState = { column: MembersSortColumn; direction: MembersSortDirection };

export const DEFAULT_MEMBERS_SORT: MembersSortState = { column: 'lastActive', direction: 'desc' };

export type TeamMembersTableOptions = {
  rows: TeamMemberRow[];
  sort?: MembersSortState;
  onSortChange?: (sort: MembersSortState) => void;
  onRowAction?: (row: TeamMemberRow) => void;
};

const ROLE_LABEL: Record<MemberRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  member: 'Member',
};

const ROLE_RANK: Record<MemberRole, number> = { admin: 0, manager: 1, member: 2 };

const SORT_NEUTRAL_SVG =
  '<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 4.5L6 2l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 7.5L6 10l2.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function sortMembers(rows: TeamMemberRow[], sort: MembersSortState): TeamMemberRow[] {
  const dir = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = sort.column === 'role' ? ROLE_RANK[a.role] : a.lastActiveTs;
    const vb = sort.column === 'role' ? ROLE_RANK[b.role] : b.lastActiveTs;
    return (va - vb) * dir;
  });
}

export function createTeamMembersTable({
  rows,
  sort = DEFAULT_MEMBERS_SORT,
  onSortChange,
  onRowAction,
}: TeamMembersTableOptions): HTMLElement {
  const table = document.createElement('table');
  table.className = 'mt';

  // ── Header ──
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.className = 'mt__head-row';

  const selectTh = document.createElement('th');
  selectTh.className = 'mt__th mt__th--select';
  const selectAll = document.createElement('input');
  selectAll.type = 'checkbox';
  selectAll.className = 'mt__checkbox';
  selectAll.setAttribute('aria-label', 'Select all members');
  selectTh.appendChild(selectAll);
  headRow.appendChild(selectTh);

  const nameTh = document.createElement('th');
  nameTh.className = 'mt__th mt__th--name';
  const nameLabel = document.createElement('span');
  nameLabel.className = 'mt__th-label';
  nameLabel.textContent = `Members (${rows.length} total)`;
  nameTh.appendChild(nameLabel);
  headRow.appendChild(nameTh);

  (['role', 'lastActive'] as MembersSortColumn[]).forEach((col) => {
    const th = document.createElement('th');
    th.className = `mt__th mt__th--${col}`;
    const isActive = sort.column === col;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `mt__sort${isActive ? ' mt__sort--active' : ''}`;
    th.setAttribute('aria-sort', isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none');

    const label = document.createElement('span');
    label.className = 'mt__th-label';
    label.textContent = col === 'role' ? 'Role' : 'Last Active';
    btn.appendChild(label);

    if (isActive) {
      btn.appendChild(iconEl('chevron-down-sm', `mt__sort-icon${sort.direction === 'asc' ? ' mt__sort-icon--asc' : ''}`));
    } else {
      const neutral = document.createElement('span');
      neutral.className = 'mt__sort-icon mt__sort-icon--neutral';
      neutral.innerHTML = SORT_NEUTRAL_SVG;
      btn.appendChild(neutral);
    }

    btn.addEventListener('click', () => {
      const next: MembersSortState = isActive
        ? { column: sort.column, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
        : { column: col, direction: 'desc' };
      onSortChange?.(next);
    });
    th.appendChild(btn);
    headRow.appendChild(th);
  });

  const actionsTh = document.createElement('th');
  actionsTh.className = 'mt__th mt__th--actions';
  headRow.appendChild(actionsTh);

  thead.appendChild(headRow);
  table.appendChild(thead);

  // ── Body ──
  const tbody = document.createElement('tbody');
  sortMembers(rows, sort).forEach((row) => tbody.appendChild(buildRow(row, onRowAction)));
  table.appendChild(tbody);

  return table;
}

function buildRow(row: TeamMemberRow, onRowAction?: (row: TeamMemberRow) => void): HTMLElement {
  const tr = document.createElement('tr');
  tr.className = 'mt__row';

  const selectTd = td('select');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'mt__checkbox';
  checkbox.setAttribute('aria-label', `Select ${row.name}`);
  selectTd.appendChild(checkbox);
  tr.appendChild(selectTd);

  const nameTd = td('name');
  const memberWrap = div('mt__member');
  const avatar = document.createElement('img');
  avatar.className = 'mt__avatar';
  avatar.src = row.avatarUrl;
  avatar.alt = '';
  const textCol = div('mt__member-text');
  const name = document.createElement('span');
  name.className = 'mt__member-name';
  name.textContent = row.name;
  const email = document.createElement('span');
  email.className = 'mt__member-email';
  email.textContent = row.email;
  textCol.append(name, email);
  memberWrap.append(avatar, textCol);
  nameTd.appendChild(memberWrap);
  tr.appendChild(nameTd);

  const roleTd = td('role');
  roleTd.textContent = ROLE_LABEL[row.role];
  tr.appendChild(roleTd);

  const lastActiveTd = td('last-active');
  lastActiveTd.textContent = row.lastActive;
  tr.appendChild(lastActiveTd);

  const actionsTd = td('actions');
  const actionBtn = document.createElement('button');
  actionBtn.type = 'button';
  actionBtn.className = 'mt__action-btn';
  actionBtn.setAttribute('aria-label', `Actions for ${row.name}`);
  actionBtn.appendChild(iconEl('dots-horizontal', 'mt__action-icon'));
  if (onRowAction) actionBtn.addEventListener('click', () => onRowAction(row));
  actionsTd.appendChild(actionBtn);
  tr.appendChild(actionsTd);

  return tr;
}

function td(key: string): HTMLTableCellElement {
  const cell = document.createElement('td');
  cell.className = `mt__td mt__td--${key}`;
  return cell;
}

function div(className: string): HTMLElement {
  const el = document.createElement('div');
  el.className = className;
  return el;
}
