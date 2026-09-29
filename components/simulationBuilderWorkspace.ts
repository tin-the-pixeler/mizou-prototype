// components/simulationBuilderWorkspace.ts
// Simulation Builder after the first prompt is submitted. Two states:
//  - 'plan':   chat thread with a plan overview awaiting confirmation
//  - 'create': chat thread (left) + populated artifact panel (right)

import { createSidebar } from './sidebar';
import { createChatPanelHeader } from './chatPanelHeader';
import { createChatThread, type ThreadMessage } from './chatThread';
import { createInputFieldChatThread } from './inputFieldChatThread';
import { createArtifactPanel } from './artifactPanel';
import { createButton } from './button';

export type SimBuilderWorkspaceView = 'plan' | 'create';

export type SimBuilderWorkspaceOptions = {
  view?: SimBuilderWorkspaceView;
};

const USER_PROMPT =
  'Give constructive feedback to an employee missing deadlines. Objective: motivate improvement without damaging trust.';

const PLAN_MESSAGES: ThreadMessage[] = [
  { role: 'user', content: USER_PROMPT },
  {
    role: 'assistant',
    content:
      "<p>Here's the plan I'd build. I filled the gaps with sensible defaults, so change anything that's off before I generate it.</p>",
  },
];

const CREATE_MESSAGES: ThreadMessage[] = [
  { role: 'user', content: USER_PROMPT },
  {
    role: 'task',
    state: 'finished',
    title: 'Simulation created',
    expanded: false,
    events: [],
  },
  {
    role: 'assistant',
    content: '<p>Your simulation is ready. Review the scenario on the right, or ask me to change anything.</p>',
    artifact: { title: 'Difficult feedback conversation', subtitle: 'Roleplay simulation' },
  },
];

const PLAN_ITEMS: { label: string; value: string }[] = [
  { label: 'Learner role', value: 'Manager giving feedback in a one-on-one' },
  { label: 'AI persona', value: 'Dana, an overwhelmed employee who feels unrecognized' },
  { label: 'Objective', value: 'Motivate improvement without damaging trust' },
  { label: 'Difficulty', value: 'Medium' },
  { label: 'Scorecard', value: 'Empathy, clarity of expectations, agreed next steps' },
];

function createPlanOverview(): HTMLElement {
  const card = document.createElement('div');
  card.className = 'sim-workspace__plan';

  const title = document.createElement('h3');
  title.className = 'sim-workspace__plan-title';
  title.textContent = 'Plan overview';
  card.appendChild(title);

  const list = document.createElement('dl');
  list.className = 'sim-workspace__plan-list';
  for (const item of PLAN_ITEMS) {
    const row = document.createElement('div');
    row.className = 'sim-workspace__plan-row';
    const dt = document.createElement('dt');
    dt.textContent = item.label;
    const dd = document.createElement('dd');
    dd.textContent = item.value;
    row.append(dt, dd);
    list.appendChild(row);
  }
  card.appendChild(list);

  const actions = document.createElement('div');
  actions.className = 'sim-workspace__plan-actions';
  actions.append(
    createButton({ label: 'Edit plan', variant: 'secondary', size: 'md' }),
    createButton({ label: 'Confirm and generate', variant: 'primary', size: 'md' }),
  );
  card.appendChild(actions);

  return card;
}

export function createSimulationBuilderWorkspace({
  view = 'plan',
}: SimBuilderWorkspaceOptions = {}): HTMLElement {
  const page = document.createElement('div');
  page.className = `sim-builder sim-workspace sim-workspace--${view}`;

  const bg = document.createElement('div');
  bg.className = 'sim-builder__bg';
  page.appendChild(bg);

  const layout = document.createElement('div');
  layout.className = 'sim-builder__layout';
  layout.appendChild(createSidebar({ variant: 'free' }));

  const main = document.createElement('div');
  main.className = 'sim-workspace__main';
  main.appendChild(
    createChatPanelHeader({
      type: 'Roleplay',
      title: view === 'plan' ? 'Draft plan' : 'Difficult feedback conversation',
    }),
  );

  const body = document.createElement('div');
  body.className = 'sim-workspace__body';

  const chat = document.createElement('div');
  chat.className = 'sim-workspace__chat';
  const thread = createChatThread({ messages: view === 'plan' ? PLAN_MESSAGES : CREATE_MESSAGES });
  chat.appendChild(thread);
  if (view === 'plan') thread.appendChild(createPlanOverview());
  chat.appendChild(
    createInputFieldChatThread({
      placeholder: view === 'plan' ? 'Tweak the plan or ask a question' : 'Ask for changes',
      state: 'default',
      mode: view === 'plan' ? 'plan' : 'create',
    }),
  );
  body.appendChild(chat);

  if (view === 'create') {
    const panel = document.createElement('div');
    panel.className = 'sim-workspace__artifact';
    panel.appendChild(
      createArtifactPanel({
        activeTab: 'Preview',
        simulationType: 'roleplay',
        title: 'Difficult feedback conversation',
        role: 'Employee',
        name: 'Dana Whitfield',
        levelLabel: 'Overwhelmed',
        levelTheme: 'yellow',
        difficulty: 'medium',
        category: 'Management',
        categoryLabel: 'Management',
        instructionHeader: 'Read instructions',
        instructions: [
          {
            title: 'Your role',
            body: 'You are a manager meeting Dana, who has missed several deadlines this quarter.',
          },
          {
            title: 'Your goal',
            body: 'Agree on a way forward that motivates improvement without damaging trust.',
          },
        ],
        primaryActionLabel: 'Test the roleplay',
      }),
    );
    body.appendChild(panel);
  }

  main.appendChild(body);
  layout.appendChild(main);
  page.appendChild(layout);
  return page;
}
