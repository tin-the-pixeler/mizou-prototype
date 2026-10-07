# ⭐ Feature: Flashcards format — create a flashcard set through chat

**Size:** Large (multi-week, FE + BE, parent ticket with sub-tickets)

## Overview
Users can pick **Flashcards** as a format on the Create page, describe a topic, and have the AI build a flashcard set. The set opens in the chat editor with an artifact panel that previews the cards (flip, browse, edit), the same way Slides works today.

## Context
Mizou formats today are role play (text, voice, video) and Slides. Flashcards add a lightweight recall and study format that trainers can create in minutes from a topic or source material. It reuses the existing chat + artifact panel pattern, so the new surface area is mainly the format, the generation, and the card preview.

## Details
The work is split into sub-tickets. Each follows the Small or Medium template.

**Front end**
1. FE-1 — Flashcards option in the Create page format menu
2. FE-2 — Flashcards chat workspace and building state
3. FE-3 — Flashcard preview in the artifact panel (list, flip, navigate)
4. FE-4 — Edit cards in the artifact panel

**Back end**
5. BE-1 — Flashcard set data model and API
6. BE-2 — AI flashcard generation from a prompt
7. BE-3 — Versions and chat integration for flashcard sets
8. BE-4 — Publish, share and export flashcards
9. BE-5 — Limits, moderation and analytics events

### Back-end requirements (summary)
> Proposed, based on the prototype's behavior. To be validated with the BE team.

| Area | Requirement |
|---|---|
| Format | `flashcards` is a new chat format alongside `text`, `audio`, `video` and `slides` |
| Data | A flashcard set belongs to a user/workspace and has a title and an ordered list of cards (`front`, `back`) |
| Generation | Creating a set from a prompt is asynchronous. The client gets a job/status it can follow (thinking → building → ready or failed) while the chat stays usable |
| Chat | The assistant reply carries an artifact reference (set + version) that the chat renders as a version card |
| Versions | Every AI change or manual save creates a new version; older versions can be reopened |
| Editing | Cards can be edited, reordered, added and removed with persistence |
| Sharing | Publish produces a shareable link; export produces a downloadable file |
| Access | Same permission model as other formats (owner, workspace members, plan limits) |
| Observability | Events for create, generation success/failure, edit, publish and export |

## References
- Prototype (Storybook): **Pages → Flashcards Builder** (create flow, ready, building)
- Annotated flow (Storybook): **Flows → Create Flashcards**
- Prototype code: `components/flashcardsBuilder.ts`, `components/flashcardDeck.ts`, `styles/flashcards-builder.css`
- Figma: **TBD — no Figma file yet; the Storybook prototype is the current design reference**

## Dependencies
- Slides format work (shared Create page format menu and chat + artifact panel pattern)
- AI generation service / prompt pipeline used by the other formats
- Share and Publish flows (BE-4 needs the same link and permission model)

## Open questions
- Figma designs: do we need a Figma pass before FE-1 to FE-4, or is the Storybook prototype the source of truth?
- Card content: plain text only for v1, or Markdown, images, and cloze cards?
- Size: default number of cards, and maximum per set? Can the user choose a count or difficulty in the prompt?
- Source material: does "+" on the Create page attach files (PDF, docs) as generation input in v1?
- Which plans and user types get Flashcards (free, team, enterprise)?
- What does Publish give a learner: a study view only, or tracked progress (known / unknown)?
- Export formats: CSV, Anki, PDF?
- Languages: generate in the prompt's language?

## Acceptance Criteria
- [ ] **Phase 1 – Create:** User can choose Flashcards on the Create page, enter a prompt and send it
- [ ] **Phase 2 – Build:** User sees the building state, then the finished set in the artifact panel without leaving the chat
- [ ] **Phase 3 – Review:** User can browse the set, flip cards, and edit front/back text
- [ ] **Phase 4 – Persist:** Reloading the chat shows the same set, and previous versions can be reopened
- [ ] **Phase 5 – Share:** User can publish or export the set
- [ ] Failed generation shows a clear error and lets the user retry
- [ ] Existing formats (Chatbot, Voice, Video, Slides) behave as before
