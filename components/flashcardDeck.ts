// components/flashcardDeck.ts
// Demo flashcard set for the Flashcards feature ("Effective Communication in Tech Teams").

export const FLASHCARD_SET_TITLE = 'Effective Communication in Tech Teams';

export type Flashcard = {
  id: string;
  front: string;
  back: string;
};

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'async',
    front: 'What is asynchronous communication?',
    back: 'Messages that do not need an immediate reply, so people can respond when it suits their focus time (e.g. a written update in Notion).',
  },
  {
    id: 'channel',
    front: 'How do you pick the right channel for a message?',
    back: 'Match urgency and complexity: Slack for quick questions, docs for decisions, a call when the topic is getting emotional.',
  },
  {
    id: 'bluf',
    front: 'What does BLUF stand for?',
    back: 'Bottom Line Up Front: open with the conclusion or the ask, then add context for those who need it.',
  },
  {
    id: 'cost',
    front: 'Name two costs of miscommunication in a team.',
    back: 'Rework and missed deadlines. It also lowers trust, which makes every later conversation slower.',
  },
  {
    id: 'feedback',
    front: 'What makes feedback constructive?',
    back: 'It is specific, tied to an observable behaviour, timely, and ends with a clear next step.',
  },
  {
    id: 'ack',
    front: 'Why confirm understanding at the end of a discussion?',
    back: 'Restating the decision and owners exposes mismatched assumptions while they are still cheap to fix.',
  },
  {
    id: 'written',
    front: 'What are the hallmarks of clear written communication?',
    back: 'A descriptive subject, one topic per message, short paragraphs, and an explicit ask with a due date.',
  },
  {
    id: 'listen',
    front: 'What is active listening?',
    back: 'Giving full attention, paraphrasing what you heard, and asking clarifying questions before responding.',
  },
];
