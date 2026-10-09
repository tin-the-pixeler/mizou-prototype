// components/sessionsStats.ts
// Summary stat tiles above the sessions table — total sessions, completion
// rate, average score, average duration. Companion to sessionsTable.ts and
// sessionsFilterBar.ts.
//
// Purely derived from whatever rows are handed in: no fetch, no stub. Pass
// it the same (filtered) rows the table below it is showing and the tiles
// move with the filters for free — the exploration this is meant to test.
//
// Score and duration are averaged over completed rows only — ongoing /
// not-started rows don't have a final value yet, so folding them in would
// understate both.

import { iconEl, type IconName } from '../icons';
import type { SessionRowData } from './sessionsTable';

export type SessionsStatsOptions = {
  rows: SessionRowData[];
};

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function createTile(icon: IconName, label: string, value: string): HTMLElement {
  const tile = document.createElement('div');
  tile.className = 'sstats__tile';

  const header = document.createElement('div');
  header.className = 'sstats__tile-header';
  const labelEl = document.createElement('span');
  labelEl.className = 'sstats__tile-label';
  labelEl.textContent = label;
  header.append(labelEl, iconEl(icon, 'sstats__tile-icon'));
  tile.appendChild(header);

  const valueEl = document.createElement('span');
  valueEl.className = 'sstats__tile-value';
  valueEl.textContent = value;
  tile.appendChild(valueEl);

  return tile;
}

export function createSessionsStats({ rows }: SessionsStatsOptions): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'sstats';

  const total = rows.length;
  const completed = rows.filter((r) => r.progress === 'completed');
  const completionRate = total ? Math.round((completed.length / total) * 100) : null;

  const scored = completed.filter((r) => r.score !== undefined);
  const avgScore = scored.length
    ? Math.round(scored.reduce((sum, r) => sum + (r.score ?? 0), 0) / scored.length)
    : null;

  const timed = completed.filter((r) => r.durationSec !== undefined);
  const avgDurationSec = timed.length
    ? Math.round(timed.reduce((sum, r) => sum + (r.durationSec ?? 0), 0) / timed.length)
    : null;

  wrap.append(
    createTile('session-list', 'Total sessions', String(total)),
    createTile('check-circle', 'Completion rate', completionRate !== null ? `${completionRate}%` : '-'),
    createTile('bar-chart', 'Average score', avgScore !== null ? `${avgScore}%` : '-'),
    createTile('hourglass', 'Average duration', avgDurationSec !== null ? formatDuration(avgDurationSec) : '-'),
  );

  return wrap;
}
