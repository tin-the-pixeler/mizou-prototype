# ⭐ Feature: Flashcard set data model and API

**Parent:** ⭐ Feature: Flashcards format · **Type:** Medium · **Area:** Back end

> Requirements are proposed from the prototype. The BE team owns the final schema and endpoint design.

## Overview
The back end can store, read, update and delete flashcard sets and their cards, owned by a user or workspace.

## Context
Everything else (generation, versions, sharing, editing) depends on a persisted set. The prototype only holds demo data in memory.

## Details
**Data**
- **Flashcard set:** id, owner (user/workspace), title, status (`building`, `ready`, `failed`), created/updated timestamps, current version
- **Card:** id, set, position (order), `front` text, `back` text
- Cards are ordered; order is stable and changeable
- v1 content is plain text. Format for future Markdown/images should not require a breaking change (to confirm)

**Capabilities**
- Create a set (empty or from generation, see BE-2)
- Read a set with its cards in order
- Update set title
- Add, update, delete and reorder cards
- Delete a set (soft delete preferred, to confirm)
- List the sets the user can access (for collections / sessions views, if applicable)

**Rules**
- Only the owner, or members with edit rights in the workspace, can change a set
- Validate: non-empty front and back, reasonable max length per side, max cards per set (limits in BE-5)
- All writes respect the same permission model as other formats

## References
- Prototype data shape: `components/flashcardDeck.ts` (`Flashcard`: id, front, back; set title)
- Parent epic: `00-epic-flashcards-format.md`

## Acceptance Criteria
- [ ] A set and its cards can be created, read, updated and deleted through the API
- [ ] Cards are returned in a stable, user-defined order and can be reordered
- [ ] Users without access cannot read or change another user's set
- [ ] Invalid cards (empty text, over the length limit) are rejected with a clear error
- [ ] Deleting a set removes it from the user's views
- [ ] API responses contain what FE-3 and FE-4 need (title, count, cards)
