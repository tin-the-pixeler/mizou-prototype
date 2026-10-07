# ⭐ Feature: Flashcards limits, moderation and analytics events

**Parent:** ⭐ Feature: Flashcards format · **Type:** Small · **Area:** Back end (+ FE event hookup)

> Requirements are proposed.

## Overview
Flashcards creation is limited and safe by default, and we can measure how it is used.

## Context
AI generation costs money and can return unsuitable content. We also need data to decide whether Flashcards is worth expanding.

## Details
**Limits**
- Max cards per set, max length per card side, max sets per user/plan (values to confirm)
- Generation rate limit per user, with a clear message when reached
- Plan gating: which plans can create Flashcards (to confirm)

**Moderation**
- Generated and user-edited content passes the same content checks as other formats
- Blocked content returns a clear error and is not saved

**Analytics events** (names are suggestions, align with the existing Mixpanel naming)
- Flashcards format selected on Create page
- Flashcards prompt sent
- Generation succeeded / failed (with duration)
- Card flipped, card edited
- Set published, link copied, set exported
- Properties: set id, card count, version, user type/plan

## References
- Parent epic: `00-epic-flashcards-format.md`
- Existing analytics conventions for Slides and role play formats

## Dependencies
- BE-1, BE-2

## Acceptance Criteria
- [ ] Limits are enforced and users see a clear message when they hit one
- [ ] Content that fails moderation is rejected and not saved
- [ ] Each listed event fires once per action with the agreed properties
- [ ] Generation success rate and duration can be viewed in analytics
