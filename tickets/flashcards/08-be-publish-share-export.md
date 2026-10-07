# ⭐ Feature: Publish, share and export flashcards

**Parent:** ⭐ Feature: Flashcards format · **Type:** Medium · **Area:** Back end + front end

> The prototype only shows Publish, copy-link and export buttons with no behavior. Scope below is a proposal and needs a design/product decision.

## Overview
Users can publish a flashcard set, share it through a link, and export it as a file.

## Context
A set only has value when learners can use it. The artifact panel already has Publish, copy link and export buttons; these tickets define what they do.

## Details
**Publish and share**
- Publishing makes the current version available through a unique link
- Learners open the link to study the set (flip and browse, as in the preview). Whether they need an account is to be decided
- Link access control follows the existing share model (to confirm: anyone with link, workspace only, specific people)
- Unpublish / stop sharing
- Copy-link button copies the published link

**Export**
- Download the set as a file (formats to confirm: CSV, Anki, PDF)
- Export always uses the current version

**Back end**
- Published state and link per set (which version is published)
- Study view reads a published version without edit rights
- Export endpoint that returns the file for the chosen format
- Permissions and plan limits applied

## References
- Storybook: Pages → Flashcards Builder (Publish, link and export buttons)
- Storybook: Flows → Create Flashcards (Publish annotation)
- Related: Share and Assign flow, Share modal
- Figma: TBD (study view and publish modal not designed)

## Dependencies
- BE-1, BE-3, existing Share modal and link-access model

## Open questions
- Is publishing the same as sharing, or are they separate steps?
- Do learners get progress tracking (known / still learning)?
- Which export formats for v1?

## Acceptance Criteria
- [ ] Publishing a set gives a link that opens the study view
- [ ] The published link shows the version that was published, even after later edits
- [ ] Access to the link follows the chosen access setting
- [ ] User can stop sharing and the link stops working
- [ ] User can export the set in the agreed format(s) and the file contains all cards in order
- [ ] Copy link copies the correct published URL
