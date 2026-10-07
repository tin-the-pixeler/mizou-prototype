# ⭐ Feature: Flashcards option in the Create page format menu

**Parent:** ⭐ Feature: Flashcards format · **Type:** Small · **Area:** Front end

## Overview
Users can choose **Flashcards** from the format menu on the Create page and start a flashcard set with a prompt.

## Context
The format menu today lists Text Chatbot, Voice role play, Video role play and Slides. Flashcards needs to be selectable the same way, so trainers can create a set without leaving the Create flow.

## Details
- Add a **Flashcards** item at the end of the format menu (below Slides) with its own icon, title and description: "Turn a topic into a flashcard set for quick study and recall"
- Selecting it updates the format pill (dark, with the flashcards icon and label) and closes the menu
- Selecting it can pre-fill an example prompt when the prompt box is empty, as Slides does
- Send is only enabled with a format and a prompt; sending creates a flashcards chat
- Other formats are unchanged

## References
- Storybook: Pages → Flashcards Builder → Create flashcards
- Storybook: Flows → Create Flashcards (steps: Home, Format menu, Flashcards selected)
- Icon: `icons/format-flashcards.svg`
- Figma: TBD

## Acceptance Criteria
- [ ] Flashcards appears at the end of the format menu with icon, title and description
- [ ] Choosing it shows the selected state in the menu and on the format pill
- [ ] Send creates a flashcards chat using the entered prompt
- [ ] Sending without a format keeps the menu open as a prompt to choose one
- [ ] Existing format options behave as before
