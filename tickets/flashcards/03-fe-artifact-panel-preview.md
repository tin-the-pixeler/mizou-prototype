# ⭐ Feature: Flashcard preview in the artifact panel

**Parent:** ⭐ Feature: Flashcards format · **Type:** Medium · **Area:** Front end (needs BE-1)

## Overview
Users can review a generated flashcard set in the artifact panel: see all cards, flip a card to see the answer, and move through the set.

## Context
The preview is how a trainer judges whether the AI's set is good enough to use. It has to make the question/answer sides obvious and make browsing fast.

## Details
- **Card list** on the left: every card in order, showing its number and question (max 3 lines); the selected card is outlined and highlighted
- **Header:** set title, card count, copy-link and export icon buttons
- **Card preview:** the selected card at a readable size, showing the question first; clicking flips it to the answer. The back is tinted and labelled "Answer", the front is labelled "Question"
- **Navigation:** previous / next buttons and a "3 / 8" counter; previous is disabled on the first card and next on the last
- A hint ("Click the card to flip") sits next to the navigation
- Selecting another card or navigating resets the card to the question side
- Respect reduced-motion: no flip animation when the user prefers reduced motion

## References
- Storybook: Pages → Flashcards Builder → Flashcards ready
- Storybook: Flows → Create Flashcards (steps: Ready, Card flipped)
- Prototype: `.fc-deck`, `.fc-card` in `styles/flashcards-builder.css`
- Figma: TBD

## Dependencies
- BE-1 (read a set and its cards)

## Acceptance Criteria
- [ ] All cards are listed in order with number and question
- [ ] Clicking a list item shows that card and highlights it
- [ ] Clicking the card flips between question and answer, and the answer side is visually distinct
- [ ] Previous/next and the counter work, with correct disabled states at both ends
- [ ] Changing card always shows the question side first
- [ ] Layout works at the normal artifact panel width and in fullscreen
- [ ] The flip animation is skipped when reduced motion is on
