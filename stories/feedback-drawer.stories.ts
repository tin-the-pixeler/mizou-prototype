import type { Meta, StoryObj } from '@storybook/html';
import { createFeedbackDrawer, type FeedbackData } from '../components/feedbackDrawer';

const meta: Meta = {
  title: 'Pages/Feedback Drawer',
};
export default meta;
type Story = StoryObj;

// ---------- shared audio/video sample data ----------

const TOPICS = [
  { label: 'Opening', color: '#fbbf24', weight: 2 },
  { label: 'Needs Assessment', color: '#34d399', weight: 3 },
  { label: 'Establishing Trust', color: '#a3e635', weight: 2 },
  { label: 'Product Pitch', color: '#ec4899', weight: 2 },
  { label: 'Next Steps', color: '#38bdf8', weight: 2 },
  { label: 'Closing', color: '#64748b', weight: 2 },
];

const TRANSCRIPT = [
  { speaker: 'Amy', time: '00:01', seconds: 1, learner: true,
    text: 'Hi Alexandra, thank you so much for taking the time to speak with me today. How are you doing?' },
  { speaker: 'Alexandra', time: '00:03', seconds: 3,
    text: "I'm doing well, thanks, Amy. Busy as usual, but happy to connect. How about you?" },
  { speaker: 'Amy', time: '00:08', seconds: 8, learner: true,
    text: "I'm doing great, thank you! I know your time is valuable, so I'll dive right in. As I understand, Acme Corp. has been looking for ways to streamline your sales processes and improve your customer data management. Is that correct?" },
  { speaker: 'Alexandra', time: '00:17', seconds: 17,
    text: "Yes, that's right. We've been facing some challenges with keeping track of customer interactions across teams, and it's slowing down our sales cycles." },
  { speaker: 'Amy', time: '00:23', seconds: 23, learner: true,
    text: "That makes a lot of sense — a lot of our customers were in a similar spot before switching over. Can you tell me a bit more about how this shows up day to day for your team?" },
  { speaker: 'Alexandra', time: '00:30', seconds: 30,
    text: "Honestly, it's the handoffs. When a lead moves from marketing to sales, context gets lost and we end up asking the customer the same questions twice." },
  { speaker: 'Amy', time: '01:03', seconds: 63, learner: true,
    text: "That's really helpful context. I completely understand your caution here — one thing our platform does well is give full visibility across teams in real time, so nobody re-treads old ground." },
  { speaker: 'Alexandra', time: '01:19', seconds: 79,
    text: "That would help a lot, honestly. What would that actually look like day to day for my reps?" },
  { speaker: 'Amy', time: '02:13', seconds: 133, learner: true,
    text: "Great question — every rep gets a shared timeline of the account, so when a deal changes hands the next person can see exactly what's already been discussed." },
];

const DELIVERY = {
  metrics: [
    { key: 'pace', label: 'Speaking pace', value: 147, unit: 'wpm', status: 'pass' as const,
      scaleMin: 70, scaleMax: 210, goodMin: 120, goodMax: 160,
      tooltip: 'How optimal your speaking tempo is. Speak at 120-160 Words Per Minute to make sure you are well understood.' },
    { key: 'silence', label: 'Silence', value: 5, unit: '%', status: 'pass' as const,
      scaleMin: 0, scaleMax: 100, goodMin: 5, goodMax: 10,
      tooltip: 'How effectively you allow reflection or pauses. Leave 5%-10% of silence in your conversation to provide time for processing and reflection.' },
    { key: 'speaker-ratio', label: 'Speaker ratio', value: 74, unit: '%', status: 'warning' as const,
      scaleMin: 0, scaleMax: 100, goodMin: 40, goodMax: 60,
      tooltip: 'How balanced your speaking contribution is. Aim for a speaker ratio of 40%-60% to foster a balanced and engaging conversation.' },
    { key: 'interruptions', label: 'Interruption rate', value: 33, unit: '%', status: 'warning' as const,
      scaleMin: 0, scaleMax: 100, goodMin: 0, goodMax: 20, goodRangeLabel: '<20%',
      tooltip: 'How respectful your conversation flow is. Maintain an interruption rate of less than 20% to ensure smoother communication.' },
  ],
  whatWentWell: [
    'Speaking pace was strong at 147 wpm, right in the ideal 120-160 range, easy to follow and absorb.',
    'Silence sat at 5%, the low end of the healthy 5-10% range. A touch more pause would give the other person room to reflect.',
  ],
  areasToImprove: [
    'Speaker ratio was 74%, well above the 40-60% target. Aim to hand over more of the conversation.',
    'Interruptions ran at 33%, higher than the 20% target. Practice waiting a full beat after the other person stops talking.',
  ],
};

const audioVideoData: FeedbackData = {
  format: 'audiovideo',
  title: 'Enterprise Sales Discovery Call – Acme Corp',
  submitted: 'Submitted on 16 November 2025',
  status: 'Completed',
  learner: 'Amy Iverson',
  meta: { id: 'Session Feedback #2301', date: '3 Jan 2025 @ 14:32', duration: '06:13 minutes' },
  summary:
    "The conversation demonstrated strong professionalism and empathy, with the advisor effectively acknowledging the customer's pain points around data management. The advisor maintained a consultative, needs-based approach throughout. A missed opportunity: quantifying the cost of the current problem earlier, and defining next steps more clearly before closing.",
  skills: [
    {
      name: 'Building Trust & Rapport',
      expanded: false,
      criteria: [
        { variant: 'negative', title: 'Proactively introduced next steps before the customer asked' },
        { variant: 'negative', title: 'Referenced prior interactions to show continuity' },
      ],
    },
    {
      name: 'Needs Assessment',
      expanded: true,
      criteria: [
        {
          variant: 'positive',
          title: 'Asked open-ended questions to uncover pain points',
          excerpts: [
            { time: '00:23', text: 'That makes a lot of sense — a lot of our customers were in a similar spot before switching over. Can you tell me a bit more about how this shows up day to day for your team?' },
          ],
        },
        {
          variant: 'positive',
          title: 'Confirmed understanding by summarizing back to the customer',
          excerpts: [
            { time: '01:03', text: "That's really helpful context. I completely understand your caution here — one thing our platform does well is give full visibility across teams in real time, so nobody re-treads old ground." },
            { time: '02:13', text: "Great question — every rep gets a shared timeline of the account, so when a deal changes hands the next person can see exactly what's already been discussed." },
          ],
        },
      ],
    },
    {
      name: 'Product Pitch & Value',
      expanded: false,
      criteria: [
        {
          variant: 'positive',
          title: "Connected product capabilities to the customer's stated pain points",
          excerpts: [
            { time: '01:03', text: "That's really helpful context. I completely understand your caution here — one thing our platform does well is give full visibility across teams in real time, so nobody re-treads old ground." },
          ],
        },
        {
          variant: 'positive',
          title: 'Explained how the solution works in practical day-to-day terms',
          excerpts: [
            { time: '02:13', text: "Great question — every rep gets a shared timeline of the account, so when a deal changes hands the next person can see exactly what's already been discussed." },
          ],
        },
        { variant: 'negative', title: 'Quantified the cost or ROI of solving the problem' },
      ],
    },
    {
      name: 'Objection Handling',
      expanded: false,
      criteria: [
        {
          variant: 'positive',
          title: "Acknowledged the customer's hesitation before responding",
          excerpts: [
            { time: '01:03', text: "That's really helpful context. I completely understand your caution here — one thing our platform does well is give full visibility across teams in real time, so nobody re-treads old ground." },
          ],
        },
        { variant: 'negative', title: 'Backed the response with concrete proof points or evidence' },
      ],
    },
  ],
  topics: TOPICS,
  transcript: TRANSCRIPT,
  delivery: DELIVERY,
};

// ---------- text simulation sample data ----------

const TEXT_TRANSCRIPT = [
  { speaker: 'Amy', time: '00:23', seconds: 23, learner: true,
    text: "I hear you, Dr. Miller, and I want to make sure we're addressing your concerns properly before moving forward." },
  { speaker: 'Dr. Miller', time: '00:45', seconds: 45,
    text: "I appreciate that. I've had good results with the current protocol, so I'm cautious about changing course." },
  { speaker: 'Amy', time: '01:03', seconds: 63, learner: true,
    text: "Your current protocol has clearly been working well for your patients, this is more about giving you an additional option to consider." },
  { speaker: 'Dr. Miller', time: '01:20', seconds: 80,
    text: "Fair enough. What does the trial data actually show?" },
  { speaker: 'Amy', time: '01:45', seconds: 105, learner: true,
    text: "Based on the phase III trial data, efficacy was demonstrated across the full patient population we discussed." },
];

const textData: FeedbackData = {
  format: 'text',
  title: 'Pharma Discovery Chat – Dr. Miller',
  submitted: 'Submitted on 16 November 2025',
  status: 'Completed',
  learner: 'Amy Iverson',
  meta: { id: 'Session Feedback #2302', date: '4 Jan 2025 @ 09:10', duration: '12 messages' },
  summary:
    "The conversation demonstrated strong professionalism and empathy, with the advisor effectively acknowledging Dr. Miller's expertise and concerns. The advisor maintained a respectful, science-based approach and avoided any criticism of current protocols. A missed opportunity: proactively introducing the trial setup earlier in the conversation.",
  skills: [
    {
      name: 'Building Trust & Rapport',
      expanded: false,
      criteria: [
        { variant: 'negative', title: 'Proactively introduced trial setup coordination' },
        { variant: 'negative', title: 'Referenced current clinical trends to support the discussion' },
      ],
    },
    {
      name: 'Product Knowledge & Positioning',
      expanded: true,
      criteria: [
        {
          variant: 'positive',
          title: 'Maintained a science-based approach when discussing the product',
          excerpts: [
            { text: "I hear you, Dr. Miller, and I want to make sure we're addressing your concerns properly before moving forward." },
            { text: 'Based on the phase III trial data, efficacy was demonstrated across the full patient population we discussed.' },
          ],
        },
        {
          variant: 'positive',
          title: 'Avoided criticizing current protocols or existing treatment approaches',
          excerpts: [
            { text: 'Your current protocol has clearly been working well for your patients, this is more about giving you an additional option to consider.' },
          ],
        },
      ],
    },
  ],
  topics: [
    { label: 'Rapport Building', color: '#fbbf24', weight: 2 },
    { label: 'Clinical Data', color: '#34d399', weight: 3 },
    { label: 'Objection Handling', color: '#a3e635', weight: 2 },
    { label: 'Trial Setup', color: '#ec4899', weight: 2 },
    { label: 'Next Steps', color: '#38bdf8', weight: 1 },
  ],
  transcript: TEXT_TRANSCRIPT,
};

export const AudioVideo: Story = {
  name: 'Audio / Video',
  render: () => createFeedbackDrawer(audioVideoData),
};

export const TextSimulation: Story = {
  name: 'Text Simulation',
  render: () => createFeedbackDrawer(textData),
};
