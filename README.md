# Mizou Prototype

A UI component library and design system for Mizou, built as a Storybook-powered prototype. It contains all the core interface components for the Mizou chat/simulation platform — from buttons and chips to full page layouts. There is no backend or application runtime; Storybook serves as both the development environment and the living documentation.

## Tech Stack

| Layer | Tool |
|---|---|
| Build | Vite 5.4 |
| Language | TypeScript (strict, ES2020 target) |
| Component format | Vanilla TS — factory functions returning DOM elements (no framework) |
| Showcase / Dev server | Storybook 8.6 (`@storybook/html-vite`) |
| Styling | Plain CSS with BEM naming + CSS custom properties (design tokens) |
| Markdown rendering | `marked` 16.4 |
| Icons | 46 custom SVGs, auto-loaded via `import.meta.glob()` |
| Fonts | Nunito Sans (300, 400, 600, 700) from Google Fonts |
| Deployment | Netlify (auto-builds `storybook-static`) |
| Node requirement | Node 22.x / npm 10.x |

## How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start the Storybook dev server (http://localhost:6006)
npm run storybook

# 3. Build for production (outputs to /storybook-static)
npm run build-storybook
```

No environment variables or API keys are needed.

## Project Structure

```
├── .storybook/          # Storybook config (main.ts, preview.ts)
├── assets/              # Images (ai-avatar.png, artifact previews)
├── components/          # 23 TypeScript component files
├── icons/               # 46 SVG icons + index.ts barrel export
├── stories/             # 24 Storybook story files
├── styles/              # 17 CSS files (tokens, component styles)
├── figma-plugin-rename/ # Figma helper plugin (not part of main app)
├── storybook-static/    # Built output (deploy target)
├── netlify.toml         # Netlify deploy config
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Component Architecture

**Pattern:** Every component is a factory function that takes an options object and returns a native `HTMLElement`. No React, no framework.

```ts
// Example
export function createButton(options: ButtonOptions): HTMLElement { ... }
```

**Styling:** BEM convention (`component__element--modifier`), powered by design tokens in `styles/tokens.css` (colors, spacing, typography).

**State:** Managed locally via DOM manipulation (class toggling, innerHTML updates). Edit-mode components use a snapshot/revert pattern for cancel/save.

## Components

| Component | File | Purpose |
|---|---|---|
| **Chat Page** | `chatPage.ts` | Full-page layout: header + thread + input |
| **Chat Thread** | `chatThread.ts` | Message list container |
| **User / Mizou Message** | `userMessage.ts`, `mizouMessage.ts` | Chat bubbles (user and AI) |
| **Thinking Block** | `chatThinkingBlock.ts` | Expandable AI reasoning display |
| **Task Block** | `chatTaskBlock.ts` | Task progress/status indicator |
| **Chat Input Field** | `chatInputField.ts` | Textarea + action buttons + format selector |
| **Artifact Panel** | `artifactPanel.ts` | Multi-tab side panel (Preview, Persona, Scorecard, Sources) with edit mode |
| **Environment Details Card** | `environmentDetailsCard.ts` | Character/persona config card with inline editing |
| **Button** | `button.ts` | Variants: primary/secondary/tertiary/special, sizes: xs/sm/md/lg |
| **Level Chip** | `levelChip.ts` | Difficulty badge (green/yellow/red) |
| **Category Chip** | `categoryChip.ts` | Role category badge |
| **Instruction Field** | `instructionField.ts` | Editable instruction list |
| **AI Avatar** | `aiAvatar.ts` | Avatar image (sm/md/lg) |
| **Sidebar / Org / Team** | `sidebarItem.ts`, `organizationButton.ts`, `teamButton.ts` | Navigation components |
| **Chat Event / Stream** | `chatEvent.ts`, `chatStream.ts` | Event labels and streaming message support |

## Storybook Stories

Each component has a corresponding `*.stories.ts` file in `/stories`. Stories showcase different states and configurations. Open Storybook and browse the sidebar to see every component in action.

## Deployment

Netlify is configured to:
- Run `npm run build-storybook`
- Serve the `storybook-static/` directory
- Use Node 22

Push to `main` to trigger a deploy.
