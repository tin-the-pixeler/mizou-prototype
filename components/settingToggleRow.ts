// components/settingToggleRow.ts
// Settings row: label + helper text on the left, switch on the right.
// Used on settings pages for single boolean preferences.

export type SettingToggleRowOptions = {
  label: string;
  /** Helper text shown below the label */
  helperText?: string;
  /** Initial state */
  checked?: boolean;
  disabled?: boolean;
  /** Called after the switch is toggled, with the new state */
  onChange?: (checked: boolean) => void;
};

let rowCount = 0;

export function createSettingToggleRow({
  label,
  helperText,
  checked: initialChecked = false,
  disabled = false,
  onChange,
}: SettingToggleRowOptions): HTMLElement {
  let checked = initialChecked;
  const id = `setting-toggle-row-${++rowCount}`;

  const row = document.createElement('div');
  row.className = 'setting-toggle-row';

  const text = document.createElement('div');
  text.className = 'setting-toggle-row__text';

  const labelEl = document.createElement('label');
  labelEl.className = 'setting-toggle-row__label';
  labelEl.id = `${id}-label`;
  labelEl.htmlFor = id;
  labelEl.textContent = label;
  text.appendChild(labelEl);

  if (helperText) {
    const helper = document.createElement('p');
    helper.className = 'setting-toggle-row__helper';
    helper.id = `${id}-helper`;
    helper.textContent = helperText;
    text.appendChild(helper);
  }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.id = id;
  toggle.className = 'setting-toggle-row__switch';
  toggle.setAttribute('role', 'switch');
  toggle.setAttribute('aria-labelledby', `${id}-label`);
  if (helperText) toggle.setAttribute('aria-describedby', `${id}-helper`);
  toggle.disabled = disabled;

  const thumb = document.createElement('span');
  thumb.className = 'setting-toggle-row__thumb';
  toggle.appendChild(thumb);

  const render = () => {
    toggle.setAttribute('aria-checked', String(checked));
    toggle.classList.toggle('setting-toggle-row__switch--on', checked);
  };
  render();

  toggle.addEventListener('click', () => {
    checked = !checked;
    render();
    onChange?.(checked);
  });

  row.append(text, toggle);
  return row;
}
