// Auto-import every .svg in this folder as a raw string (Vite feature)
const raw = import.meta.glob('./*.svg', { as: 'raw', eager: true }) as Record<string, string>;

/** Map: { simulations: '<svg…>', sessions: '<svg…>', … } */
export const icons: Record<string, string> = Object.fromEntries(
  Object.entries(raw).map(([path, svg]) => {
    const name = path.split('/').pop()!.replace('.svg', '');
    return [name, svg];
  }),
);

export type IconName = keyof typeof icons; // e.g., "simulations" | "sessions" | "analytics"
export const iconNames = Object.keys(icons) as IconName[];

/** Utility: create a DOM element for an icon */
export function iconEl(name: IconName, className = 'sb-icon') {
  const span = document.createElement('span');
  span.className = className;
  span.innerHTML = icons[name]; // your own SVG assets (safe for this workflow)
  return span;
}
