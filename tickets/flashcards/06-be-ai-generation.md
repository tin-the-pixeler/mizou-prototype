# ⭐ Feature: AI flashcard generation from a prompt

**Parent:** ⭐ Feature: Flashcards format · **Type:** Medium · **Area:** Back end

> Requirements are proposed. Model, prompt design and job mechanism are for the BE/AI team to decide.

## Overview
Given a user prompt, the system generates a flashcard set (title and question/answer cards) and reports progress while it works.

## Context
This is the core of the feature. In the prototype the AI is scripted and always returns the same set. In production it must turn any prompt into a useful set, and the client must be able to show "thinking → building → ready".

## Details
**Input**
- User prompt (topic, audience, tone, difficulty)
- Optional: attached source material (to confirm for v1)
- Optional: desired card count; otherwise a sensible default (to confirm, prototype uses 8)
- Chat/conversation context, so follow-up messages can change an existing set

**Output**
- Set title
- Ordered cards, each with a short question (`front`) and a concise answer (`back`)
- The assistant's chat reply summarising what was created, with a reference to the set and version (see BE-3)

**Behavior**
- Generation is asynchronous: starting it returns immediately with a job/status the client can follow
- Status values the UI needs: `thinking`, `building`, `ready`, `failed`
- The chat stays usable while the job runs
- Follow-up prompts ("make it harder", "add 4 more cards", "shorter answers") update the existing set and create a new version
- Failure: clear error state, no partial or empty set saved, user can retry
- Output is validated before saving: card count within limits, no empty fronts/backs, no duplicate questions
- Language follows the prompt's language (to confirm)

## References
- Prototype reply and demo set: `components/flashcardsBuilder.ts`, `components/flashcardDeck.ts`
- Storybook: Flows → Create Flashcards (Building step)
- Parent epic: `00-epic-flashcards-format.md`

## Dependencies
- BE-1 (store the generated set)
- Existing AI pipeline used for other formats

## Acceptance Criteria
- [ ] A prompt produces a titled set of question/answer cards, saved and readable through the API
- [ ] The client can follow progress through thinking, building and ready
- [ ] A failed generation returns a failed state, saves no partial set, and can be retried
- [ ] A follow-up prompt updates the set instead of creating a new one, and creates a new version
- [ ] Output that breaks the rules (empty text, too many cards) is not saved
- [ ] Generation time and failure rate are measurable (see BE-5)
