// stories/collections-admin-view-demo-data.ts
// Demo data for Pages/Collections - Admin View. Mirrors production
// (app.mizou.com → Collections) for an admin: Publications = published
// simulations only (drafts live in My Drafts), Templates Library = the public
// template catalogue.

import type { CollectionsItem } from '../components/collectionsPageAdminView';
import type { FilterOption } from '../components/collectionsFilterBar';
import type { SidebarV2Team } from '../components/sidebarEnterpriseV2';

const img = (id: string) => `https://images.unsplash.com/${id}?w=640&q=70&auto=format&fit=crop`;

const T = {
  negotiation: img('photo-1556761175-5973dc0f32e7'),
  meeting: img('photo-1552664730-d307ca884978'),
  oneOnOne: img('photo-1600880292203-757bb62b4baf'),
  interview: img('photo-1573497019940-1c28c88b4f3e'),
  office: img('photo-1521737604893-d14cc237f11d'),
  presentation: img('photo-1542744173-8e7e53415bb0'),
  suit: img('photo-1507679799987-c73779587ccf'),
  workspace: img('photo-1551836022-d5d88e9218df'),
};

export const COLLECTIONS_CATEGORIES: FilterOption[] = [
  { id: 'commercial', label: 'Commercial' },
  { id: 'customer-support', label: 'Customer Support' },
  { id: 'management', label: 'Management' },
  { id: 'recruitment', label: 'Recruitment' },
];

export const COLLECTIONS_TEAMS: SidebarV2Team[] = [
  { name: 'Rubicon', initials: 'R', color: '#9f1239' },
  { name: 'Optics', initials: 'O', color: '#1d4ed8' },
  { name: 'Mammalian Nurturable', initials: 'M', color: '#1e40af' },
  { name: 'Lumon Team', initials: 'L', color: '#0c4a6e' },
];

/** Publications — same order and states as the production screenshot, plus
 *  the two ended states so every card state is on the page. */
export const PUBLICATIONS: CollectionsItem[] = [
  {
    id: 'pub-price-objection',
    title: "The proposal just landed and your buyer says you're 30% too expensive — hold your price without losing the deal",
    format: 'chatbot', categoryId: 'commercial', category: 'Commercial', level: 'advanced',
    language: 'US', thumbnailUrl: T.negotiation, availability: 'active', hasUnpublishedChanges: true,
  },
  {
    id: 'pub-late-delivery',
    title: 'Your delivery is late for the second time — and the customer is done being patient',
    format: 'chatbot', categoryId: 'customer-support', category: 'Customer Support', level: 'easy',
    language: 'US', thumbnailUrl: T.meeting, availability: 'active',
  },
  {
    id: 'pub-analyst-deadlines',
    title: 'Your best analyst has missed three deadlines in a row; time for the conversation nobody enjoys',
    format: 'chatbot', categoryId: 'management', category: 'Management', level: 'intermediate',
    language: 'US', thumbnailUrl: T.workspace, availability: 'active',
  },
  {
    id: 'pub-nervous-candidate',
    title: 'Interview a nervous but highly qualified candidate for an open role',
    format: 'chatbot', categoryId: 'recruitment', category: 'Recruitment', level: 'easy',
    language: 'US', thumbnailUrl: T.interview, availability: 'active',
  },
  {
    id: 'pub-overwhelmed-employee',
    title: 'Addressing repeated missed deadlines with an overwhelmed employee in a one-on-one meeting',
    format: 'chatbot', categoryId: 'management', category: 'Management', level: 'intermediate',
    language: 'US', thumbnailUrl: T.oneOnOne, availability: 'active',
  },
  {
    id: 'pub-irate-customer',
    title: 'Calming an irate customer after repeated delivery delays',
    format: 'voice-role-play', categoryId: 'customer-support', category: 'Customer Support', level: 'advanced',
    language: 'US', thumbnailUrl: T.office, availability: 'active',
  },
  {
    id: 'pub-saas-competitive',
    title: 'Win over a loyal SaaS customer in a high-stakes competitive sales meeting',
    format: 'video-role-play', categoryId: 'commercial', category: 'Commercial', level: 'intermediate',
    language: 'US', thumbnailUrl: T.presentation, availability: 'active', hasUnpublishedChanges: true,
  },
  {
    id: 'pub-valued-member',
    title: 'A valued team member keeps missing deadlines; address it without damaging trust',
    format: 'video-role-play', categoryId: 'management', category: 'Management', level: 'easy',
    language: 'US', thumbnailUrl: T.suit, availability: 'active',
  },
  {
    id: 'pub-persona-confusion',
    title: 'Persona Name Confusion',
    format: 'voice-role-play', categoryId: 'customer-support', category: 'Customer Support', level: 'easy',
    language: 'US', thumbnailUrl: T.meeting, availability: 'ended',
  },
  {
    id: 'pub-capable-candidate',
    title: 'Guide a nervous but capable candidate to confidently share their true strengths',
    format: 'video-role-play', categoryId: 'recruitment', category: 'Recruitment', level: 'intermediate',
    language: 'FR', thumbnailUrl: T.interview, availability: 'ended', hasUnpublishedChanges: true,
  },
];

/** Templates Library — public catalogue (no menu, Preview on hover, Copy). */
export const TEMPLATES: CollectionsItem[] = [
  {
    id: 'tpl-renewal-procurement',
    title: 'Negotiate a contract renewal with a procurement lead who has been told to cut 20%',
    format: 'voice-role-play', categoryId: 'commercial', category: 'Commercial', level: 'advanced',
    language: 'US', thumbnailUrl: T.negotiation, availability: 'active',
    description: 'A procurement lead opens with a hard budget cut. Protect value, trade concessions and keep the renewal on track.',
  },
  {
    id: 'tpl-discovery-call',
    title: 'Run a discovery call with a prospect who only has 15 minutes',
    format: 'chatbot', categoryId: 'commercial', category: 'Commercial', level: 'easy',
    language: 'US', thumbnailUrl: T.presentation, availability: 'active',
    description: 'Ask sharp, open questions to uncover pain points before the prospect runs out of time.',
  },
  {
    id: 'tpl-refund-policy',
    title: 'Explain a no-refund policy to a customer who feels misled',
    format: 'chatbot', categoryId: 'customer-support', category: 'Customer Support', level: 'intermediate',
    language: 'GB', thumbnailUrl: T.meeting, availability: 'active',
    description: 'Hold the policy line while acknowledging frustration and offering real alternatives.',
  },
  {
    id: 'tpl-feedback-senior',
    title: 'Give constructive feedback to a senior engineer who disagrees with it',
    format: 'video-role-play', categoryId: 'management', category: 'Management', level: 'advanced',
    language: 'US', thumbnailUrl: T.oneOnOne, availability: 'active',
    description: 'Deliver specific, behaviour-based feedback and reach agreement on next steps.',
  },
  {
    id: 'tpl-entretien-embauche',
    title: "Mener un entretien d'embauche avec un candidat en reconversion",
    format: 'voice-role-play', categoryId: 'recruitment', category: 'Recruitment', level: 'intermediate',
    language: 'FR', thumbnailUrl: T.interview, availability: 'active',
    description: 'Évaluez les compétences transférables d’un candidat qui change de carrière.',
  },
  {
    id: 'tpl-new-manager',
    title: 'Hold your first one-on-one as a newly promoted manager with a former peer',
    format: 'chatbot', categoryId: 'management', category: 'Management', level: 'easy',
    language: 'US', thumbnailUrl: T.workspace, availability: 'active',
    description: 'Reset the relationship, set expectations and build trust from day one.',
  },
];
