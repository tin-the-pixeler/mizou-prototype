// components/tabsNav.ts
// Generic pill tab bar. The active pill gets a white background + bold label.
// Figma: tabs / tabs-item (node 15321:162099 and children)

export type TabItem = { key: string; label: string };

export type TabsNavOptions = {
  items: TabItem[];
  activeKey: string;
  onChange?: (key: string) => void;
};

export function createTabsNav({ items, activeKey, onChange }: TabsNavOptions): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tnav';
  wrap.setAttribute('role', 'tablist');

  items.forEach((item) => {
    const isActive = item.key === activeKey;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tnav__item' + (isActive ? ' tnav__item--active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(isActive));
    btn.textContent = item.label;
    btn.addEventListener('click', () => {
      if (isActive) return;
      onChange?.(item.key);
    });
    wrap.appendChild(btn);
  });

  return wrap;
}
