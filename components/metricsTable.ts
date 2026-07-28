// components/metricsTable.ts
// Delivery metrics table: for each metric, shows a value and a gauge bar
// with a highlighted "good" range. Hovering a metric's name shows a tooltip
// explaining what it measures and its target range.

import { iconEl } from '../icons';
import { createTooltip } from './tooltip';

export type MetricStatus = 'pass' | 'warning';

export type MetricRow = {
  key: string;
  label: string;
  value: number;
  unit: string;
  status: MetricStatus;
  /** Gauge scale bounds, e.g. 0-100 */
  scaleMin: number;
  scaleMax: number;
  /** Highlighted "good" range within the scale */
  goodMin: number;
  goodMax: number;
  /** Label shown over the good range, e.g. "120-160". Defaults to goodMin-goodMax. */
  goodRangeLabel?: string;
  /** Tooltip shown when hovering the metric name */
  tooltip: string;
};

export type MetricsTableOptions = {
  metrics?: MetricRow[];
};

const pct = (value: number, min: number, max: number): number => {
  if (max === min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

export const defaultMetrics: MetricRow[] = [
  {
    key: 'pace',
    label: 'Speaking pace',
    value: 147,
    unit: 'wpm',
    status: 'pass',
    scaleMin: 70,
    scaleMax: 210,
    goodMin: 120,
    goodMax: 160,
    tooltip:
      'How optimal your speaking tempo is. Speak at 120-160 Words Per Minute to make sure you are well understood.',
  },
  {
    key: 'silence',
    label: 'Silence',
    value: 5,
    unit: '%',
    status: 'pass',
    scaleMin: 0,
    scaleMax: 100,
    goodMin: 5,
    goodMax: 10,
    tooltip:
      'How effectively you allow reflection or pauses. Leave 5%-10% of silence in your conversation to provide time for processing and reflection.',
  },
  {
    key: 'speaker-ratio',
    label: 'Speaker ratio',
    value: 74,
    unit: '%',
    status: 'warning',
    scaleMin: 0,
    scaleMax: 100,
    goodMin: 40,
    goodMax: 60,
    tooltip:
      'How balanced your speaking contribution is. Aim for a speaker ratio of 40%-60% to foster a balanced and engaging conversation.',
  },
  {
    key: 'interruptions',
    label: 'Interruption rate',
    value: 33,
    unit: '%',
    status: 'warning',
    scaleMin: 0,
    scaleMax: 100,
    goodMin: 0,
    goodMax: 20,
    goodRangeLabel: '<20%',
    tooltip:
      'How respectful your conversation flow is. Maintain an interruption rate of less than 20% to ensure smoother communication.',
  },
];

function createGaugeBar(metric: MetricRow): HTMLElement {
  const { value, scaleMin, scaleMax, goodMin, goodMax, status, unit } = metric;

  const wrap = document.createElement('div');
  wrap.className = 'metrics-table__gauge';

  const track = document.createElement('div');
  track.className = 'metrics-table__gauge-track';

  const bandLeft = pct(goodMin, scaleMin, scaleMax);
  const bandRight = pct(goodMax, scaleMin, scaleMax);
  const band = document.createElement('div');
  band.className = 'metrics-table__gauge-band';
  band.style.left = `${bandLeft}%`;
  band.style.width = `${bandRight - bandLeft}%`;
  track.appendChild(band);

  const node = document.createElement('div');
  node.className = `metrics-table__gauge-node metrics-table__gauge-node--${status}`;
  node.style.left = `${pct(value, scaleMin, scaleMax)}%`;
  track.appendChild(node);

  wrap.appendChild(track);

  const labels = document.createElement('div');
  labels.className = 'metrics-table__gauge-labels';

  // Hide a scale-bound label when the good-range label sits close enough
  // to that edge to visually collide with it.
  const midpoint = (bandLeft + bandRight) / 2;
  const COLLISION_THRESHOLD = 15;

  const min = document.createElement('span');
  min.className = 'metrics-table__gauge-scale-label';
  min.textContent = String(scaleMin);
  if (midpoint < COLLISION_THRESHOLD) min.style.visibility = 'hidden';
  labels.appendChild(min);

  const goodLabel = document.createElement('span');
  goodLabel.className = 'metrics-table__gauge-good-label';
  goodLabel.textContent = metric.goodRangeLabel ?? `${goodMin}${unit === '%' ? '%' : ''}-${goodMax}${unit}`;
  goodLabel.style.left = `${midpoint}%`;
  labels.appendChild(goodLabel);

  const max = document.createElement('span');
  max.className = 'metrics-table__gauge-scale-label metrics-table__gauge-scale-label--end';
  max.textContent = `${scaleMax}${unit === '%' ? '%' : ''}`;
  if (midpoint > 100 - COLLISION_THRESHOLD) max.style.visibility = 'hidden';
  labels.appendChild(max);

  wrap.appendChild(labels);

  return wrap;
}

function createMetricRow(metric: MetricRow): HTMLElement {
  const row = document.createElement('div');
  row.className = 'metrics-table__row';

  const metricCell = document.createElement('div');
  metricCell.className = 'metrics-table__col metrics-table__col-metric';

  const nameWrap = document.createElement('div');
  nameWrap.className = 'metrics-table__name-wrap';

  nameWrap.appendChild(
    iconEl(
      metric.status === 'pass' ? 'check-circle' : 'exclamation-circle',
      `metrics-table__status-icon metrics-table__status-icon--${metric.status}`,
    ),
  );

  const label = document.createElement('span');
  label.className = 'metrics-table__label';
  label.textContent = metric.label;
  nameWrap.appendChild(label);

  const tooltipContainer = document.createElement('div');
  tooltipContainer.className = 'metrics-table__tooltip';
  tooltipContainer.appendChild(createTooltip({ text: metric.tooltip }));
  nameWrap.appendChild(tooltipContainer);

  metricCell.appendChild(nameWrap);
  row.appendChild(metricCell);

  const valueCell = document.createElement('div');
  valueCell.className = 'metrics-table__col metrics-table__col-value';

  const valueNum = document.createElement('span');
  valueNum.className = `metrics-table__value metrics-table__value--${metric.status}`;
  valueNum.textContent = String(metric.value);
  valueCell.appendChild(valueNum);

  const valueUnit = document.createElement('span');
  valueUnit.className = 'metrics-table__unit';
  valueUnit.textContent = metric.unit;
  valueCell.appendChild(valueUnit);

  row.appendChild(valueCell);

  const rangeCell = document.createElement('div');
  rangeCell.className = 'metrics-table__col metrics-table__col-range';
  rangeCell.appendChild(createGaugeBar(metric));
  row.appendChild(rangeCell);

  return row;
}

export function createMetricsTable(options: MetricsTableOptions = {}): HTMLElement {
  const { metrics = defaultMetrics } = options;

  const table = document.createElement('div');
  table.className = 'metrics-table';

  const header = document.createElement('div');
  header.className = 'metrics-table__header';

  const headMetric = document.createElement('span');
  headMetric.className = 'metrics-table__col metrics-table__col-metric metrics-table__head-label';
  headMetric.textContent = 'METRIC';
  header.appendChild(headMetric);

  const headValue = document.createElement('span');
  headValue.className = 'metrics-table__col metrics-table__col-value metrics-table__head-label';
  headValue.textContent = 'VALUE';
  header.appendChild(headValue);

  const headRange = document.createElement('span');
  headRange.className = 'metrics-table__col metrics-table__col-range metrics-table__head-label';
  headRange.textContent = 'RANGE';
  header.appendChild(headRange);

  table.appendChild(header);

  metrics.forEach(metric => table.appendChild(createMetricRow(metric)));

  return table;
}
