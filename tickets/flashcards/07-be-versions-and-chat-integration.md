# ⭐ Feature: Versions and chat integration for flashcard sets

**Parent:** ⭐ Feature: Flashcards format · **Type:** Medium · **Area:** Back end (+ small FE hookup)

> Requirements are proposed. Reuse the Slides versioning approach where it exists.

## Overview
Flashcards is a chat format. Chat messages can carry a flashcard set artifact, and every change to the set is stored as a version that can be reopened.

## Context
The chat shows a "Version N" card for each result, and users expect to go back to a previous version after an AI or manual change.

## Details
- Register `flashcards` as a chat format next to `text`, `audio`, `video` and `slides`
- An assistant message can reference an artifact: set id, version number, title
- A new version is created when: the AI first builds the set, the AI changes it from a follow-up prompt, or the user saves manual edits
- Manual edits made in quick succession are grouped into one version, not one per keystroke (rule to confirm)
- Read a specific version of a set (cards as they were)
- "Show previous version" in the building state can open the last ready version
- Restoring an old version creates a new version rather than rewriting history (to confirm)
- Loading a chat returns messages with their artifact references so the panel and version cards render after a reload

## References
- Version card in prototype: `components/mizouMessage.ts` (artifact card: title + "Version 1")
- Storybook: Flows → Create Flashcards (Ready step, "Version card")
- Parent epic: `00-epic-flashcards-format.md`

## Dependencies
- BE-1, BE-2

## Acceptance Criteria
- [ ] A chat can be created with the flashcards format and its prompt
- [ ] The assistant reply contains an artifact reference (set, version, title)
- [ ] Each AI change and each saved manual edit creates a new version, numbered in order
- [ ] Any earlier version can be read exactly as it was
- [ ] Reloading the chat restores messages, version cards and the current set
- [ ] Other formats' chats are unaffected
