// components/sessionsTable.ts
// Sessions table with the Sortable Table Header pattern — the companion to
// sessionsFilterBar.ts. Sorting lives HERE, in the column headers, never in
// the filter bar. Exactly one active sort; click toggles asc/desc; clicking
// another sortable header moves the sort there. Default: Submitted, newest
// first (descending).
//
// Naming: the learner journey column is "Progress" (Completed / Ongoing /
// Not started) — "Status" is reserved for simulation lifecycle elsewhere.

import { iconEl } from '../icons';
import { formatIconEl, PROGRESS_LABEL, type SessionFormat, type SessionProgress } from './sessionsFilterBar';

// ─── Types ──────────────────────────────────────────────────────────────────

export type SortColumn = 'score' | 'duration' | 'submitted';
export type SortDirection = 'asc' | 'desc';
export type SortState = { column: SortColumn; direction: SortDirection };

export const DEFAULT_SORT: SortState = { column: 'submitted', direction: 'desc' };

export type SessionRowData = {
  id: string;
  learner: { id: string; name: string; avatarUrl: string; isNew?: boolean };
  simulation: { id: string; title: string; format: SessionFormat };
  progress: SessionProgress;
  /** 0–100; omit for ongoing / not-started rows (empty dashed pill). */
  score?: number;
  /** Seconds; ongoing rows render it rose + live-ticking, omit for not started. */
  durationSec?: number;
  /** Omit when not submitted ('-'). label e.g. "Nov. 12 @ 14:08". */
  submitted?: { ts: number; label: string };
  archived?: boolean;
};

export type SessionsTableOptions = {
  rows: SessionRowData[];
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  onRowAction?: (row: SessionRowData) => void;
  /** Tick ongoing durations up once per second (default true). */
  live?: boolean;
};

// ─── Stand-in icons ──────────────────────────────────────────────────────────
// MISSING FROM assets/icons/ — the set has no sort glyphs. Request
// `sort-neutral` / `sort-asc` / `sort-desc` matching the 1.5px-stroke style.
// Until then: hand-drawn neutral stack for inactive headers, and
// chevron-down-sm (rotated for asc) for the active state, per the handover.

const SORT_NEUTRAL_SVG =
  '<svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 4.5L6 2l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 7.5L6 10l2.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const COLUMNS: { key: string; label: string; sortable: boolean }[] = [
  { key: 'learner', label: 'Learners', sortable: false },
  { key: 'simulation', label: 'Simulation', sortable: false },
  { key: 'score', label: 'Score', sortable: true },
  { key: 'duration', label: 'Duration', sortable: true },
  { key: 'submitted', label: 'Submitted', sortable: true },
  { key: 'progress', label: 'Progress', sortable: false },
  { key: 'actions', label: '', sortable: false },
];

// ─── Sorting ─────────────────────────────────────────────────────────────────

export function sortSessions(rows: SessionRowData[], sort: SortState): SessionRowData[] {
  const value = (row: SessionRowData): number | undefined => {
    switch (sort.column) {
      case 'score': return row.score;
      case 'duration': return row.durationSec;
      case 'submitted': return row.submitted?.ts;
    }
  };
  const dir = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = value(a);
    const vb = value(b);
    if (va === undefined && vb === undefined) return 0;
    if (va === undefined) return 1; // missing values sink to the bottom either way
    if (vb === undefined) return -1;
    return (va - vb) * dir;
  });
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createSessionsTable({
  rows,
  sort = DEFAULT_SORT,
  onSortChange,
  onRowAction,
  live = true,
}: SessionsTableOptions): HTMLElement {
  const table = document.createElement('table');
  table.className = 'sst';

  // ── Header ──
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.className = 'sst__head-row';

  COLUMNS.forEach((col) => {
    const th = document.createElement('th');
    th.className = `sst__th sst__th--${col.key}`;

    if (col.key === 'learner') {
      const label = document.createElement('span');
      label.className = 'sst__th-label';
      label.textContent = `Learners (${rows.length} total)`;
      th.appendChild(label);
      const newCount = rows.filter((r) => r.learner.isNew).length;
      if (newCount > 0) {
        const annotation = document.createElement('span');
        annotation.className = 'sst__th-new';
        annotation.textContent = `${newCount} new`;
        th.appendChild(annotation);
      }
    } else if (col.sortable) {
      const isActive = sort.column === col.key;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `sst__sort${isActive ? ' sst__sort--active' : ''}`;
      th.setAttribute('aria-sort', isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none');

      const label = document.createElement('span');
      label.className = 'sst__th-label';
      label.textContent = col.label;
      btn.appendChild(label);

      if (isActive) {
        const arrow = iconEl('chevron-down-sm', `sst__sort-icon${sort.direction === 'asc' ? ' sst__sort-icon--asc' : ''}`);
        btn.appendChild(arrow);
      } else {
        const neutral = document.createElement('span');
        neutral.className = 'sst__sort-icon sst__sort-icon--neutral';
        neutral.innerHTML = SORT_NEUTRAL_SVG;
        btn.appendChild(neutral);
      }

      btn.addEventListener('click', () => {
        const next: SortState = isActive
          ? { column: sort.column, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
          : { column: col.key as SortColumn, direction: 'desc' };
        onSortChange?.(next);
      });
      th.appendChild(btn);
    } else {
      const label = document.createElement('span');
      label.className = 'sst__th-label';
      label.textContent = col.label;
      th.appendChild(label);
    }
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  // ── Body ──
  const tbody = document.createElement('tbody');
  sortSessions(rows, sort).forEach((row) => {
    tbody.appendChild(buildRow(row, { onRowAction, live }));
  });
  table.appendChild(tbody);

  return table;
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function buildRow(
  row: SessionRowData,
  { onRowAction, live }: { onRowAction?: (row: SessionRowData) => void; live: boolean },
): HTMLElement {
  const tr = document.createElement('tr');
  tr.className = `sst__row sst__row--${row.progress}`;

  // Learner: photo avatar + bold name + optional indigo "new" dot
  const learnerTd = td('learner');
  const learnerWrap = div('sst__learner');
  const avatar = document.createElement('img');
  avatar.className = 'sst__avatar';
  avatar.src = row.learner.avatarUrl;
  avatar.alt = '';
  const name = document.createElement('span');
  name.className = 'sst__learner-name';
  name.textContent = row.learner.name;
  learnerWrap.append(avatar, name);
  if (row.learner.isNew) learnerWrap.appendChild(div('sst__new-dot'));
  learnerTd.appendChild(learnerWrap);
  tr.appendChild(learnerTd);

  // Simulation: small format icon + title (2-line wrap allowed)
  const simTd = td('simulation');
  const simWrap = div('sst__sim');
  simWrap.appendChild(formatIconEl(row.simulation.format, 'sst__sim-icon'));
  const simTitle = document.createElement('span');
  simTitle.className = 'sst__sim-title';
  simTitle.textContent = row.simulation.title;
  simWrap.appendChild(simTitle);
  simTd.appendChild(simWrap);
  tr.appendChild(simTd);

  // Score: pill, no % sign; empty dashed pill for ongoing / not started
  const scoreTd = td('score');
  const pill = div('sst__score-pill');
  if (row.score === undefined) {
    pill.classList.add('sst__score-pill--empty');
  } else {
    pill.classList.add(`sst__score-pill--${scoreTone(row.score)}`);
    pill.textContent = String(row.score);
  }
  scoreTd.appendChild(pill);
  tr.appendChild(scoreTd);

  // Duration: plain for completed; rose + live for ongoing; '-' for not started
  const durationTd = td('duration');
  if (row.durationSec === undefined) {
    durationTd.textContent = '-';
  } else {
    const duration = document.createElement('span');
    duration.className = `sst__duration${row.progress === 'ongoing' ? ' sst__duration--live' : ''}`;
    duration.textContent = formatDuration(row.durationSec);
    durationTd.appendChild(duration);
    if (row.progress === 'ongoing' && live) {
      let seconds = row.durationSec;
      const timer = window.setInterval(() => {
        if (!duration.isConnected) { window.clearInterval(timer); return; }
        seconds += 1;
        duration.textContent = formatDuration(seconds);
      }, 1000);
    }
  }
  tr.appendChild(durationTd);

  // Submitted: "Nov. 12 @ 14:08" or '-'
  const submittedTd = td('submitted');
  submittedTd.textContent = row.submitted?.label ?? '-';
  tr.appendChild(submittedTd);

  // Progress
  const progressTd = td('progress');
  if (row.progress === 'ongoing') {
    const ongoing = div('sst__progress-ongoing');
    const label = document.createElement('span');
    label.textContent = PROGRESS_LABEL.ongoing;
    ongoing.append(label, div('sst__progress-pulse'));
    progressTd.appendChild(ongoing);
  } else {
    const chip = div(`sst__progress-chip sst__progress-chip--${row.progress}`);
    chip.textContent = PROGRESS_LABEL[row.progress];
    progressTd.appendChild(chip);
  }
  tr.appendChild(progressTd);

  // Row actions
  const actionsTd = td('actions');
  const actionBtn = document.createElement('button');
  actionBtn.type = 'button';
  actionBtn.className = 'sst__action-btn';
  actionBtn.setAttribute('aria-label', `Actions for ${row.learner.name}`);
  actionBtn.appendChild(iconEl('dots-horizontal', 'sst__action-icon'));
  if (onRowAction) actionBtn.addEventListener('click', () => onRowAction(row));
  actionsTd.appendChild(actionBtn);
  tr.appendChild(actionsTd);

  return tr;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreTone(score: number): 'high' | 'mid' | 'low' {
  if (score >= 75) return 'high';
  if (score >= 50) return 'mid';
  return 'low';
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function td(key: string): HTMLTableCellElement {
  const cell = document.createElement('td');
  cell.className = `sst__td sst__td--${key}`;
  return cell;
}

function div(className: string): HTMLElement {
  const el = document.createElement('div');
  el.className = className;
  return el;
}
