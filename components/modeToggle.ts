// components/modeToggle.ts
// Pill-shaped toggle for switching between Create and Plan modes.

export type ModeToggleMode = 'create' | 'plan';

export type ModeToggleOptions = {
  /** Which mode is currently active */
  activeMode?: ModeToggleMode;
  /** Callback when mode changes */
  onChange?: (mode: ModeToggleMode) => void;
};

export function createModeToggle({
  activeMode = 'create',
  onChange,
}: ModeToggleOptions = {}): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'mode-toggle';
  wrapper.dataset.mode = activeMode;

  const createBtn = createTab('CREATE', 'create', activeMode);
  const planBtn = createTab('PLAN', 'plan', activeMode);

  createBtn.addEventListener('click', () => {
    if (activeMode === 'create') return;
    activeMode = 'create';
    updateTabs();
    onChange?.('create');
  });

  planBtn.addEventListener('click', () => {
    if (activeMode === 'plan') return;
    activeMode = 'plan';
    updateTabs();
    onChange?.('plan');
  });

  wrapper.append(createBtn, planBtn);

  function updateTabs() {
    wrapper.dataset.mode = activeMode;
    createBtn.classList.toggle('mode-toggle__tab--active', activeMode === 'create');
    planBtn.classList.toggle('mode-toggle__tab--active', activeMode === 'plan');
  }

  return wrapper;
}

function createTab(label: string, mode: ModeToggleMode, activeMode: ModeToggleMode): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `mode-toggle__tab${mode === activeMode ? ' mode-toggle__tab--active' : ''}`;

  const labelEl = document.createElement('span');
  labelEl.className = 'mode-toggle__label';
  labelEl.textContent = label;
  btn.appendChild(labelEl);

  return btn;
}
