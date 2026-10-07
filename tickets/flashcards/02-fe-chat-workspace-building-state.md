# ⭐ Feature: Flashcards chat workspace and building state

**Parent:** ⭐ Feature: Flashcards format · **Type:** Medium · **Area:** Front end (needs BE-2, BE-3)

## Overview
After sending a flashcards prompt, the user lands in a chat editor with an artifact panel. The chat shows progress while the set is built, then the assistant's reply and a version card.

## Context
Flashcards generation takes time. Users need to see progress and be able to keep using the chat, in the same pattern Slides uses.

## Details
- Chat header shows the **Flashcards** type badge and, once ready, the set title
- Chat thread shows the user's prompt, then a progress line: "Thinking…" → "Building your flashcards…" → "Thought for N seconds"
- Artifact panel shows a **Building in progress** placeholder with a "Show previous version" button (used from later edits)
- When ready, the assistant reply is added with a **version card** (set title + "Version N"); clicking it opens that version in the panel
- Chat input drops the format pill because the format is already chosen
- Fullscreen and Publish buttons appear in the panel header
- Error: if generation fails, the chat shows a message and a Retry action; the panel shows no partial set

## References
- Storybook: Pages → Flashcards Builder → Building, Flashcards ready
- Storybook: Flows → Create Flashcards (steps: Building, Ready)
- Figma: TBD

## Dependencies
- BE-2 (generation job and status), BE-3 (artifact reference in chat messages)

## Acceptance Criteria
- [ ] Sending a prompt opens the chat editor with the user's message and a progress line
- [ ] Progress moves through the thinking and building states and ends when the set is ready
- [ ] The artifact panel shows the building placeholder until the set is ready, then the set
- [ ] A version card appears in the assistant reply and reopens its version when clicked
- [ ] The chat stays usable while the set is building
- [ ] A failed generation shows an error with Retry, and no empty set is created
