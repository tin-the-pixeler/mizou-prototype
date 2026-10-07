# ⭐ Feature: Edit flashcards in the artifact panel

**Parent:** ⭐ Feature: Flashcards format · **Type:** Medium · **Area:** Front end (needs BE-1, BE-3)

## Overview
Users can change the front and back text of any card directly in the artifact panel, and see the preview update as they type.

## Context
AI-generated cards often need small wording fixes. Editing in place is faster than asking the AI again for a one-word change.

## Details
- Two text fields under the preview, **Front** and **Back**, bound to the selected card
- Typing updates the preview card and the card list text immediately
- Edits are saved automatically (debounced) and survive a reload
- Manual edits create a new version of the set (see BE-3), shown as a new version in the chat
- Not in the prototype yet, to confirm with design: add card, delete card, reorder cards

## References
- Storybook: Pages → Flashcards Builder → Flashcards ready (fields under the card)
- Storybook: Flows → Create Flashcards (step: Ready, "Edit card")
- Figma: TBD

## Dependencies
- BE-1 (update card), BE-3 (versioning)

## Acceptance Criteria
- [ ] Front and Back fields show the selected card's text
- [ ] Editing a field updates the preview and the card list as the user types
- [ ] Changes persist after reload
- [ ] A saved edit is reflected in the set's version history
- [ ] Empty front or back is blocked or clearly flagged before saving
- [ ] Switching card loads that card's text into the fields without losing earlier edits
