// components/levelChip.ts

export type LevelChipTheme = 'green' | 'yellow' | 'red';

export type LevelChipOptions = {
  /** Text label */
  label: string;
  /** Color theme */
  theme?: LevelChipTheme;
};

export const levelChipThemes: LevelChipTheme[] = ['green', 'yellow', 'red'];

export type LevelConfig = { theme: LevelChipTheme };

export const levelConfigs: Record<string, LevelConfig> = {
  Friendly:        { theme: 'green' },
  Warm:            { theme: 'green' },
  Decisive:        { theme: 'yellow' },
  'In a hurry':    { theme: 'yellow' },
  Skeptical:       { theme: 'yellow' },
  Undecided:       { theme: 'yellow' },
  Dismissive:      { theme: 'yellow' },
  Confrontational: { theme: 'red' },
  Indifferent:     { theme: 'red' },
  Silent:          { theme: 'red' },
  Tough:           { theme: 'red' },
};

export const levelNames = Object.keys(levelConfigs);

export function createLevelChip(options: LevelChipOptions): HTMLElement {
  const {
    label,
    theme = 'yellow',
  } = options;

  const chip = document.createElement('span');
  chip.className = `level-chip level-chip--${theme}`;

  // Label
  const labelEl = document.createElement('span');
  labelEl.className = 'level-chip__label';
  labelEl.textContent = label;
  chip.appendChild(labelEl);

  return chip;
}
