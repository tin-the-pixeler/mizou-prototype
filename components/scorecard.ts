// components/scorecard.ts
// Scorecard tab content — read-only view with click-to-edit interaction

import { iconEl } from '../icons';

export interface ScorecardRow {
  criteria: string;
  weight: 'High' | 'Medium' | 'Low';
}

export interface ScorecardGroup {
  competency: string;
  rows: ScorecardRow[];
}

export type ScorecardElement = HTMLElement & {
  revertSnapshot(): void;
  commitEdit(): void;
};

const DEFAULT_SCORECARD: ScorecardGroup[] = [
  {
    competency: 'Technical Decision Making',
    rows: [
      { criteria: 'Did the learner identify the correct nature and severity of the security incident?', weight: 'High' },
      { criteria: 'Did the learner propose effective remediation steps to restore normal operations?', weight: 'Medium' },
      { criteria: 'Did the learner propose effective remediation steps to restore normal operations?', weight: 'Low' },
    ],
  },
  {
    competency: 'Stakeholder Communication',
    rows: [
      { criteria: 'Did the learner prioritize response actions based on business impact and urgency?', weight: 'High' },
      { criteria: 'Did the learner assign clear roles and responsibilities to response team members?', weight: 'Medium' },
      { criteria: 'Did the learner establish appropriate escalation procedures and communication channels?', weight: 'Low' },
    ],
  },
  {
    competency: 'Incident Coordination & Initial Assessment',
    rows: [
      { criteria: 'Did the learner prioritize response actions based on business impact and urgency?', weight: 'High' },
      { criteria: 'Did the learner assign clear roles and responsibilities to response team members?', weight: 'Medium' },
      { criteria: 'Did the learner establish appropriate escalation procedures and communication channels?', weight: 'Low' },
    ],
  },
];

// ---- SVG helpers for icons not in the icon set ----

const TRASH_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="3 6 5 6 21 6"/>
  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
  <path d="M10 11v6M14 11v6"/>
  <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
</svg>`;

const DUPLICATE_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <rect x="9" y="9" width="11" height="11" rx="2"/>
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
</svg>`;

// ---- Deep clone utility ----

function cloneData(data: ScorecardGroup[]): ScorecardGroup[] {
  return data.map(g => ({ ...g, rows: g.rows.map(r => ({ ...r })) }));
}

// ---- Weight chip ----

function weightChip(weight: ScorecardRow['weight']): HTMLElement {
  const chip = document.createElement('span');
  chip.className = `scorecard-weight-chip scorecard-weight-chip--${weight.toLowerCase()}`;
  chip.textContent = weight;
  return chip;
}

// ---- Weight select (edit mode) ----

function weightSelect(
  value: ScorecardRow['weight'],
  onChange: (v: ScorecardRow['weight']) => void,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = `scorecard-table__weight-select-wrap scorecard-table__weight-select-wrap--${value.toLowerCase()}`;

  const label = document.createElement('span');
  label.textContent = value;
  wrap.appendChild(label);

  const chevron = iconEl('chevron-down-sm', 'sb-icon');
  chevron.style.width = '12px';
  chevron.style.height = '12px';
  chevron.style.flexShrink = '0';
  wrap.appendChild(chevron);

  const sel = document.createElement('select') as HTMLSelectElement;
  sel.className = 'scorecard-table__weight-select';
  (['High', 'Medium', 'Low'] as const).forEach(opt => {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    o.selected = opt === value;
    sel.appendChild(o);
  });
  sel.addEventListener('change', () => {
    const next = sel.value as ScorecardRow['weight'];
    onChange(next);
    wrap.className = `scorecard-table__weight-select-wrap scorecard-table__weight-select-wrap--${next.toLowerCase()}`;
    label.textContent = next;
  });
  wrap.appendChild(sel);

  return wrap;
}

// ---- Auto-grow textarea ----

function autoGrowTextarea(
  value: string,
  placeholder: string,
  onChange: (v: string) => void,
): HTMLTextAreaElement {
  const ta = document.createElement('textarea');
  ta.className = 'scorecard-table__edit-textarea';
  ta.value = value;
  ta.placeholder = placeholder;
  ta.rows = 1;

  const resize = () => {
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };

  ta.addEventListener('input', () => {
    onChange(ta.value);
    resize();
  });

  requestAnimationFrame(resize);

  return ta;
}

// ---- Readonly table ----

function buildReadonlyTable(
  data: ScorecardGroup[],
  onEnterEdit: () => void,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'scorecard-table-wrap';

  const table = document.createElement('table');
  table.className = 'scorecard-table scorecard-table--readonly';

  const cg = document.createElement('colgroup');
  [
    ['col-competency', ''],
    ['col-criteria', ''],
    ['col-weight', ''],
  ].forEach(([cls]) => {
    const col = document.createElement('col');
    col.className = cls;
    cg.appendChild(col);
  });
  table.appendChild(cg);

  // thead
  const thead = document.createElement('thead');
  const hrow = document.createElement('tr');
  ['Competency', 'Evaluation Criteria', 'Weight'].forEach(label => {
    const th = document.createElement('th');
    th.textContent = label;
    hrow.appendChild(th);
  });
  thead.appendChild(hrow);
  table.appendChild(thead);

  // tbody
  const tbody = document.createElement('tbody');

  data.forEach((group, gi) => {
    group.rows.forEach((row, ri) => {
      const tr = document.createElement('tr');
      if (ri === 0 && gi !== 0) tr.style.borderTop = '1px solid var(--border-divider)';

      // Competency cell (only first row in group)
      if (ri === 0) {
        const td = document.createElement('td');
        td.className = 'scorecard-table__competency-cell';
        td.rowSpan = group.rows.length;
        td.textContent = group.competency;
        td.addEventListener('click', onEnterEdit);
        tr.appendChild(td);
      }

      // Criteria cell
      const critTd = document.createElement('td');
      critTd.className = 'scorecard-table__criteria-cell';
      if (ri !== 0) critTd.style.borderTop = '1px solid var(--border-subtle)';

      const hoverDiv = document.createElement('div');
      hoverDiv.className = 'scorecard-table__criteria-hover';
      hoverDiv.textContent = row.criteria;
      hoverDiv.addEventListener('click', onEnterEdit);
      critTd.appendChild(hoverDiv);
      tr.appendChild(critTd);

      // Weight cell
      const wtTd = document.createElement('td');
      wtTd.className = 'scorecard-table__weight-cell';
      if (ri !== 0) wtTd.style.borderTop = '1px solid var(--border-subtle)';

      const hoverWt = document.createElement('div');
      hoverWt.className = 'scorecard-table__weight-hover';
      hoverWt.appendChild(weightChip(row.weight));
      hoverWt.addEventListener('click', onEnterEdit);
      wtTd.appendChild(hoverWt);
      tr.appendChild(wtTd);

      tbody.appendChild(tr);
    });
  });

  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

// ---- Edit table ----

function buildEditTable(
  data: ScorecardGroup[],
  onDataChange: (next: ScorecardGroup[]) => void,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'scorecard-table-wrap';

  const table = document.createElement('table');
  table.className = 'scorecard-table scorecard-table--editing';

  const cg = document.createElement('colgroup');
  ['col-competency', 'col-criteria', 'col-weight', 'col-delete'].forEach(cls => {
    const col = document.createElement('col');
    col.className = cls;
    cg.appendChild(col);
  });
  table.appendChild(cg);

  // thead
  const thead = document.createElement('thead');
  const hrow = document.createElement('tr');
  ['Competency', 'Evaluation Criteria', 'Weight', ''].forEach(label => {
    const th = document.createElement('th');
    th.textContent = label;
    if (!label) th.style.padding = '14px 8px';
    hrow.appendChild(th);
  });
  thead.appendChild(hrow);
  table.appendChild(thead);

  // Mutable copy we'll mutate in-place for performance
  let live = cloneData(data);

  const tbody = document.createElement('tbody');

  function rebuildBody() {
    tbody.innerHTML = '';

    live.forEach((group, gi) => {
      // Rows = actual criteria + 1 placeholder input + 1 add-criteria footer
      const totalRows = group.rows.length + 2;

      // Per-group hover state
      let groupHovered = false;

      // All <tr> elements for this group (for outline highlighting)
      const groupRows: HTMLTableRowElement[] = [];

      const setGroupHover = (hovered: boolean) => {
        groupHovered = hovered;

        // Update competency cell outline
        const compCell = groupRows[0]?.querySelector<HTMLElement>('.scorecard-table__edit-competency-cell');
        if (compCell) {
          compCell.classList.toggle('is-group-hovered', hovered);
        }

        // Apply top/bottom/right outlines to group rows
        groupRows.forEach((tr, idx) => {
          tr.classList.remove(
            'scorecard-table__group-row--hovered-top',
            'scorecard-table__group-row--hovered-bottom',
            'scorecard-table__group-row--hovered-right',
          );
          if (!hovered) return;
          if (idx === 0) tr.classList.add('scorecard-table__group-row--hovered-top');
          if (idx === groupRows.length - 1) tr.classList.add('scorecard-table__group-row--hovered-bottom');
          else tr.classList.add('scorecard-table__group-row--hovered-right');
        });
      };

      for (let rowIdx = 0; rowIdx < totalRows; rowIdx++) {
        const isPlaceholderRow = rowIdx === group.rows.length;
        const isAddRow = rowIdx === group.rows.length + 1;
        const isFirstRow = rowIdx === 0;
        const isLastRow = rowIdx === totalRows - 1;

        const tr = document.createElement('tr');
        if (isFirstRow && gi !== 0) tr.style.borderTop = '1px solid var(--border-divider)';
        groupRows.push(tr);

        // Competency cell (spans all rows in group)
        if (isFirstRow) {
          const compTd = document.createElement('td');
          compTd.className = 'scorecard-table__edit-competency-cell';
          compTd.rowSpan = totalRows;

          compTd.addEventListener('mouseenter', () => setGroupHover(true));
          compTd.addEventListener('mouseleave', () => setGroupHover(false));

          const ta = autoGrowTextarea(group.competency, 'Enter new competency…', v => {
            live[gi].competency = v;
            onDataChange(live);
          });
          compTd.appendChild(ta);

          // Hover actions (duplicate + delete)
          const actions = document.createElement('div');
          actions.className = 'scorecard-table__comp-actions';

          const dupBtn = document.createElement('button');
          dupBtn.className = 'scorecard-table__comp-action-btn';
          dupBtn.title = 'Duplicate competency';
          dupBtn.innerHTML = DUPLICATE_SVG;
          dupBtn.addEventListener('click', e => {
            e.stopPropagation();
            const copy: ScorecardGroup = {
              competency: live[gi].competency + ' (copy)',
              rows: live[gi].rows.map(r => ({ ...r })),
            };
            live = [...live.slice(0, gi + 1), copy, ...live.slice(gi + 1)];
            onDataChange(live);
            rebuildBody();
          });
          actions.appendChild(dupBtn);

          const delCompBtn = document.createElement('button');
          delCompBtn.className = 'scorecard-table__comp-action-btn scorecard-table__comp-action-btn--delete';
          delCompBtn.title = 'Delete competency';
          delCompBtn.innerHTML = TRASH_SVG;
          delCompBtn.addEventListener('click', e => {
            e.stopPropagation();
            live = live.filter((_, i) => i !== gi);
            onDataChange(live);
            rebuildBody();
          });
          actions.appendChild(delCompBtn);

          compTd.appendChild(actions);
          tr.appendChild(compTd);
        }

        // --- Add criteria row ---
        if (isAddRow) {
          const addTd = document.createElement('td');
          addTd.colSpan = 3;
          addTd.style.padding = '6px 14px 12px';
          addTd.style.borderTop = '1px solid var(--border-subtle)';

          const addBtn = document.createElement('button');
          addBtn.className = 'scorecard-table__add-criteria-btn';
          addBtn.innerHTML = 'Add criteria <strong>+</strong>';
          addBtn.addEventListener('click', () => {
            live[gi].rows.push({ criteria: '', weight: 'High' });
            onDataChange(live);
            rebuildBody();
          });
          addTd.appendChild(addBtn);
          tr.appendChild(addTd);
          tbody.appendChild(tr);
          continue;
        }

        // --- Placeholder "Enter new criteria" row ---
        if (isPlaceholderRow) {
          const critTd = document.createElement('td');
          critTd.style.padding = '8px 12px';
          critTd.style.borderTop = '1px solid var(--border-subtle)';
          critTd.appendChild(autoGrowTextarea('', 'Enter new criteria…', () => {}));
          tr.appendChild(critTd);

          const wtTd = document.createElement('td');
          wtTd.style.padding = '8px 12px';
          wtTd.style.borderLeft = '1px solid var(--border-subtle)';
          wtTd.style.borderTop = '1px solid var(--border-subtle)';
          wtTd.appendChild(weightSelect('High', () => {}));
          tr.appendChild(wtTd);

          const delTd = document.createElement('td');
          delTd.className = 'scorecard-table__delete-cell';
          if (rowIdx !== 0) delTd.style.borderTop = '1px solid var(--border-subtle)';
          tr.appendChild(delTd);

          tbody.appendChild(tr);
          continue;
        }

        // --- Regular criteria row ---
        const ri = rowIdx;

        const critTd = document.createElement('td');
        critTd.style.padding = '8px 12px';
        if (ri !== 0) critTd.style.borderTop = '1px solid var(--border-subtle)';
        critTd.appendChild(
          autoGrowTextarea(group.rows[ri].criteria, 'Enter criteria…', v => {
            live[gi].rows[ri].criteria = v;
            onDataChange(live);
          }),
        );
        tr.appendChild(critTd);

        const wtTd = document.createElement('td');
        wtTd.style.padding = '8px 12px';
        wtTd.style.borderLeft = '1px solid var(--border-subtle)';
        if (ri !== 0) wtTd.style.borderTop = '1px solid var(--border-subtle)';
        wtTd.style.whiteSpace = 'nowrap';
        wtTd.appendChild(
          weightSelect(group.rows[ri].weight, v => {
            live[gi].rows[ri].weight = v;
            onDataChange(live);
          }),
        );
        tr.appendChild(wtTd);

        const delTd = document.createElement('td');
        delTd.className = 'scorecard-table__delete-cell';
        if (ri !== 0) delTd.style.borderTop = '1px solid var(--border-subtle)';

        const delBtn = document.createElement('button');
        delBtn.className = 'scorecard-table__delete-btn';
        delBtn.title = 'Delete criterion';
        delBtn.innerHTML = TRASH_SVG;
        delBtn.addEventListener('click', () => {
          live[gi].rows = live[gi].rows.filter((_, j) => j !== ri);
          onDataChange(live);
          rebuildBody();
        });
        delTd.appendChild(delBtn);
        tr.appendChild(delTd);

        tbody.appendChild(tr);
      }
    });
  }

  rebuildBody();
  table.appendChild(tbody);

  // tfoot — "Add a competency +"
  const tfoot = document.createElement('tfoot');
  const footRow = document.createElement('tr');
  footRow.className = 'scorecard-table__footer';
  const footTd = document.createElement('td');
  footTd.colSpan = 4;

  const addCompBtn = document.createElement('button');
  addCompBtn.className = 'scorecard-table__add-competency-btn';
  addCompBtn.textContent = 'Add a competency +';
  addCompBtn.addEventListener('click', () => {
    live.push({
      competency: '',
      rows: [
        { criteria: '', weight: 'High' },
        { criteria: '', weight: 'High' },
        { criteria: '', weight: 'High' },
      ],
    });
    onDataChange(live);
    rebuildBody();
  });

  footTd.appendChild(addCompBtn);
  footRow.appendChild(footTd);
  tfoot.appendChild(footRow);
  table.appendChild(tfoot);

  wrap.appendChild(table);
  return wrap;
}

// ---- Public factory ----

export function createScorecardContent(
  initial: ScorecardGroup[] = DEFAULT_SCORECARD,
): ScorecardElement {
  // State
  let committed = cloneData(initial);
  let snapshot = cloneData(initial);
  let editing = false;

  // Root element
  const root = document.createElement('div') as ScorecardElement;
  root.className = 'scorecard';

  // Static intro
  const title = document.createElement('h1');
  title.className = 'scorecard__title';
  title.textContent = 'Scorecard';
  root.appendChild(title);

  const intro = document.createElement('div');
  intro.className = 'scorecard__intro';
  intro.innerHTML = `
    <div class="scorecard__intro-header">Understanding Your Scorecard</div>
    <ol class="scorecard__intro-list">
      <li><b>Skills:</b> Define the high-level behaviour you want to measure.</li>
      <li><b>Criteria:</b> These are the binary (Yes/No) questions used to assess the learner.</li>
      <li><b>Weights:</b> Determine the priority of each criterion (Low, Medium, or High).</li>
    </ol>
  `;
  root.appendChild(intro);

  const description = document.createElement('p');
  description.className = 'scorecard__description';
  description.textContent =
    "To customise your scorecard, simply describe the changes you'd like to make in the chat.";
  root.appendChild(description);

  // Table area (swapped between read/edit)
  const tableArea = document.createElement('div');
  root.appendChild(tableArea);

  function enterEditMode() {
    if (editing) return;
    editing = true;
    snapshot = cloneData(committed);
    renderTable();
    root.dispatchEvent(new CustomEvent('env-card:edit-enter', { bubbles: true }));
  }

  function renderTable() {
    tableArea.innerHTML = '';
    if (editing) {
      tableArea.appendChild(
        buildEditTable(committed, next => {
          committed = next;
        }),
      );
    } else {
      tableArea.appendChild(buildReadonlyTable(committed, enterEditMode));
    }
  }

  // Exposed methods for artifact panel cancel/save
  root.revertSnapshot = () => {
    committed = cloneData(snapshot);
    editing = false;
    renderTable();
  };

  root.commitEdit = () => {
    snapshot = cloneData(committed);
    editing = false;
    renderTable();
  };

  renderTable();

  return root;
}
