import type { Meta, StoryObj } from '@storybook/html';
import { createFeedbackModal, type FeedbackData } from '../components/feedbackModal';
import '../styles/feedback-modal.css';

const meta: Meta = {
  title: 'Pages/Feedback',
};
export default meta;
type Story = StoryObj;

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
  { speaker: 'Amy', time: '00:30', seconds: 30, learner: true,
    text: "That makes sense. You're definitely not alone in facing that. Many of our clients were in a similar situation before adopting our CRM solution." },
  { speaker: 'Amy', time: '00:54', seconds: 54, learner: true,
    text: "Reps often duplicate outreach and we lose visibility once a deal moves between teams — can you tell me a bit more about how this shows up day to day for your team?" },
  { speaker: 'Alexandra', time: '01:03', seconds: 63,
    text: "Honestly, it's the handoffs. When a lead moves from marketing to sales, context gets lost and we end up asking the customer the same questions twice." },
  { speaker: 'Amy', time: '02:13', seconds: 133, learner: true,
    text: "That's helpful context. One thing our platform does well is give full visibility across teams in real time, so nobody re-treads old ground." },
];

const HARD_GROUPS = [
  {
    name: 'Needs Assessment', score: 67, open: true,
    criteria: [
      { title: 'Asked open-ended questions to uncover pain points', passed: true,
        excerpt: 'Can you tell me a bit more about how this shows up day to day for your team?',
        time: '01:03', seconds: 63 },
      { title: 'Identified the business impact of the problem', passed: false },
      { title: 'Confirmed understanding by summarizing back to the customer', passed: true,
        excerpt: "That's helpful context. One thing our platform does well is give full visibility across teams in real time.",
        time: '02:13', seconds: 133 },
    ],
  },
  {
    name: 'Product Pitch', score: 72, open: false,
    criteria: [
      { title: 'Tied features to the customer’s stated needs', passed: true,
        excerpt: 'Our platform gives full visibility across teams in real time.', time: '02:13', seconds: 133 },
      { title: 'Provided concrete proof points or metrics', passed: false },
    ],
  },
  {
    name: 'Objection Handling', score: 58, open: false,
    criteria: [
      { title: 'Acknowledged the objection before responding', passed: true,
        excerpt: 'That makes sense, you’re definitely not alone in facing that.', time: '00:30', seconds: 30 },
      { title: 'Resolved the concern with a clear next step', passed: false },
    ],
  },
];

const SOFT_METRICS = [
  { title: 'Speaker Ratio', grade: 'warn' as const, value: '30%',
    desc: 'How balanced your speaking contribution is. Aim for a speaker ratio of 40%–60% to foster a balanced and engaging conversation.' },
  { title: 'Pace', grade: 'bad' as const, value: '181mpm',
    desc: 'How optimal your speaking tempo is. Speak at 130–180 words per minute to make sure you are well understood.' },
  { title: 'Silence', grade: 'good' as const, value: '33%',
    desc: 'How effectively you allow reflection or pauses. Leave 5–10% of silence in your conversation to provide time for processing and reflection.' },
  { title: 'Interruptions', grade: 'good' as const, value: '3%',
    desc: 'How respectful your conversation flow is. Maintain an interruption rate of less than 20% to ensure smoother communication.' },
];

const OVERALL_SUMMARY =
  "The conversation demonstrated strong professionalism and empathy, with the advisor effectively acknowledging the customer's pain points around data management. The advisor maintained a consultative, needs-based approach throughout and avoided being overly pushy. While the discussion was generally well-structured, there was a missed opportunity to quantify the cost of the current problem earlier, and next steps could have been more clearly defined before closing.";

const audioVideoData: FeedbackData = {
  format: 'audiovideo',
  title: 'Enterprise Sales Discovery Call – Acme Corp',
  submitted: 'Submitted on 16 November 2025',
  status: 'Completed',
  learner: 'Amy Iverson',
  meta: { id: 'Session Feedback #2301', date: '3 Jan 2025 @ 14:32', duration: '06:13 minutes' },
  overall: { score: 70, grade: 'pass', label: 'Excellent 🌟', summary: OVERALL_SUMMARY },
  hard: {
    score: 75, grade: 'pass',
    summary: 'Overall, hard skills were solid, with particularly strong needs assessment. The advisor consistently tied questions back to business impact, though product pitch and objection handling could be sharpened with more concrete proof points and clearer resolutions.',
    groups: HARD_GROUPS,
  },
  soft: {
    score: 70, grade: 'warn',
    summary: 'Delivery was clear and respectful, with low interruptions and a comfortable pace throughout. The main area to work on is speaker balance — the advisor spoke more than the customer, which limited how much space Alexandra had to elaborate on her needs.',
    metrics: SOFT_METRICS,
  },
  topics: TOPICS,
  transcript: TRANSCRIPT,
};

const textData: FeedbackData = {
  ...audioVideoData,
  format: 'text',
  title: 'Enterprise Sales Discovery Call – Acme Corp (Chat)',
  overall: {
    score: 70, grade: 'pass', label: 'Excellent 🌟',
    summary: "The conversation demonstrated strong professionalism and empathy, with the advisor effectively acknowledging Dr. Miller's expertise and concerns. The advisor maintained a respectful, science-based approach and avoided any criticism of current protocols. While the discussion was generally well-structured and supportive, there was a missed opportunity to proactively introduce the trial setup and to reference current clinical trends earlier in the conversation.",
  },
};

export const AudioVideoRolePlay: Story = {
  name: 'Audio / Video Role Play',
  render: () => createFeedbackModal(audioVideoData),
};

export const TextChatbot: Story = {
  name: 'Text Chatbot',
  render: () => createFeedbackModal(textData),
};
