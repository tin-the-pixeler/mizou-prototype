import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig, {
  mizouTokens,
  mizouSpacing,
  mizouRadius,
  mizouShadows,
  mizouTypeScale,
} from '../../tailwind.config';

/**
 * Foundations — reads the RESOLVED Tailwind config at runtime, so what renders
 * here is exactly what utilities will produce. If a swatch looks wrong against
 * Figma, the fix belongs in styles/tokens.css, not in this file.
 */
const resolved = resolveConfig(tailwindConfig as never).theme as Record<string, Record<string, unknown>>;

const meta: Meta = {
  title: 'UI/Foundations',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ */
/* Layout primitives (plain inline styles so the page itself is not    */
/* under test — only the swatches it displays are).                    */
/* ------------------------------------------------------------------ */

const page: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  color: 'var(--text-primary)',
  background: 'var(--surface-emphasis)',
  padding: 32,
  minHeight: '100vh',
};

const Section = ({ title, source, children }: { title: string; source: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ font: '700 27px/36px var(--font-sans)', letterSpacing: '-0.09px', margin: '0 0 4px' }}>{title}</h2>
    <p style={{ font: '400 13px/18px var(--font-sans)', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
      Source: <code>{source}</code>
    </p>
    {children}
  </section>
);

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>{children}</div>
);

/** Resolve a `var(--x)` theme entry to its computed hex/rgb for display. */
function computed(value: string): string {
  const m = /^var\((--[\w-]+)\)$/.exec(value.trim());
  if (!m) return value;
  if (typeof window === 'undefined') return value;
  return getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() || value;
}

const Swatch = ({ name, value }: { name: string; value: string }) => (
  <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>
    <div style={{ background: value, height: 64, borderBottom: '1px solid var(--border-subtle)' }} />
    <div style={{ padding: '8px 10px' }}>
      <div style={{ font: '700 13px/18px var(--font-sans)' }}>{name}</div>
      <div style={{ font: '400 11px/18px var(--font-sans)', color: 'var(--text-secondary)' }}>{computed(value)}</div>
    </div>
  </div>
);

/** Flatten the resolved color theme into [utilityName, value] pairs. */
function colorEntries(group: string): Array<[string, string]> {
  const node = (resolved.colors as Record<string, unknown>)[group];
  if (typeof node === 'string') return [[group, node]];
  if (!node || typeof node !== 'object') return [];
  return Object.entries(node as Record<string, string>).map(([k, v]) => [
    k === 'DEFAULT' ? group : `${group}-${k}`,
    v,
  ]);
}

/* ------------------------------------------------------------------ */

export const Colors: Story = {
  render: () => (
    <div style={page}>
      <h1 style={{ font: '800 45px/54px var(--font-sans)', letterSpacing: '-0.63px', margin: '0 0 32px' }}>
        Color palette
      </h1>

      <Section title="Primitives" source="styles/tokens.css → --primitive-*">
        <Grid>
          {['slate', 'indigo', 'rose', 'emerald', 'amber'].flatMap((g) =>
            colorEntries(g).map(([name, value]) => <Swatch key={name} name={name} value={value} />),
          )}
          <Swatch name="black" value={mizouTokens.black} />
          <Swatch name="white" value={mizouTokens.white} />
        </Grid>
      </Section>

      <Section title="Semantic — surface / stroke / content" source="styles/tokens.css → semantic tokens">
        <Grid>
          {['surface', 'stroke', 'content', 'icon'].flatMap((g) =>
            colorEntries(g).map(([name, value]) => <Swatch key={name} name={name} value={value} />),
          )}
        </Grid>
      </Section>

      <Section title="Interactive & feedback" source="styles/tokens.css → --interactive-* / --feedback-*">
        <Grid>
          {['interactive', 'feedback'].flatMap((g) =>
            colorEntries(g).map(([name, value]) => <Swatch key={name} name={name} value={value} />),
          )}
        </Grid>
      </Section>

      <Section title="Gradient" source="styles/tokens.css → --ocean-gradient-diagonal">
        <div className="bg-ocean-diagonal h-lg w-full rounded-md" />
      </Section>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div style={page}>
      <h1 style={{ font: '800 45px/54px var(--font-sans)', letterSpacing: '-0.63px', margin: '0 0 8px' }}>
        Type scale
      </h1>
      <p style={{ font: '400 16px/24px var(--font-sans)', color: 'var(--text-secondary)', margin: '0 0 32px' }}>
        Nunito Sans. Source: <code>styles/app-typography.css</code> (Figma → Type System [App]).
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', font: '700 11px/18px var(--font-sans)', letterSpacing: '0.39px', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-divider)' }}>Utility</th>
            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-divider)' }}>Size / LH / Weight / LS</th>
            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-divider)' }}>Sample</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(mizouTypeScale).map(([key, [size, rest]]) => (
            <tr key={key}>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)', font: '700 13px/18px var(--font-sans)', whiteSpace: 'nowrap' }}>
                text-{key}
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)', font: '400 11px/18px var(--font-sans)', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                {size} / {rest.lineHeight} / {rest.fontWeight} / {rest.letterSpacing}
              </td>
              <td
                style={{
                  padding: '12px',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: size,
                  lineHeight: rest.lineHeight,
                  fontWeight: rest.fontWeight,
                  letterSpacing: rest.letterSpacing,
                }}
              >
                The quick brown fox
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={page}>
      <h1 style={{ font: '800 45px/54px var(--font-sans)', letterSpacing: '-0.63px', margin: '0 0 32px' }}>
        Spacing, radius & elevation
      </h1>

      <Section title="Spacing scale" source="styles/tokens.css → --spacing-*">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(mizouSpacing).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <code style={{ font: '700 13px/18px var(--font-sans)', width: 120 }}>p-{key} / gap-{key}</code>
              <code style={{ font: '400 11px/18px var(--font-sans)', color: 'var(--text-secondary)', width: 56 }}>{value}</code>
              <div style={{ width: value, height: 24, background: 'var(--interactive-primary)', borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Border radius" source="styles/tokens.css → --radius-*">
        <Grid>
          {Object.entries(mizouRadius).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ height: 80, background: 'var(--surface-sunken)', border: '1px solid var(--border-strong)', borderRadius: value, marginBottom: 8 }} />
              <div style={{ font: '700 13px/18px var(--font-sans)' }}>rounded-{key}</div>
              <div style={{ font: '400 11px/18px var(--font-sans)', color: 'var(--text-secondary)' }}>{value}</div>
            </div>
          ))}
        </Grid>
      </Section>

      <Section title="Shadows" source="styles/tokens.css → --shadow-*">
        <Grid>
          {Object.entries(mizouShadows).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center', padding: 12 }}>
              <div style={{ height: 80, background: 'var(--surface-emphasis)', borderRadius: 8, boxShadow: value, marginBottom: 12 }} />
              <div style={{ font: '700 13px/18px var(--font-sans)' }}>shadow-{key}</div>
            </div>
          ))}
        </Grid>
      </Section>
    </div>
  ),
};
