// components/feedbackDrawer.ts
// Feedback drawer — transcript column + two tabs:
//   Scorecard — "What You Demonstrated": overall score, skill breakdown
//               (Skill Cards of Criteria/Text Criteria Cards).
//   Delivery  — "How Well You Spoke": audio/video simulations only.
//               Metrics table + What Went Well / Areas to Improve / Try This
//               Next Time (all AI-generated per session, hence the per-section
//               word/char limits noted in the option docs below).
//
// Clicking a criterion's timestamp (select or play) expands the transcript
// column if it's hidden, then scrolls it to the matching message.

import { iconEl } from '../icons';
import { createTranscript, type TranscriptMessage, type Topic, type TranscriptFormat } from './feedbackTranscript';
import { createSkillCard } from './skillCard';
import { createCriteriaCard, type CriteriaCardVariant, type CriteriaExcerpt } from './criteriaCard';
import { createTextCriteriaCard } from './textCriteriaCard';
import { createMetricsTable, type MetricRow } from './metricsTable';

// ---------- data model ----------

/** A single criterion's excerpt. `time` is used for audio/video; omitted for text sims. */
export type CriterionExcerpt = { time?: string; text: string };

export type Criterion = {
  variant: CriteriaCardVariant;
  title: string;
  /** Transcript excerpts that qualify this criterion. Max 3. Positive criteria only. */
  excerpts?: CriterionExcerpt[];
};

export type SkillGroup = {
  name: string;
  expanded?: boolean;
  criteria: Criterion[];
};

export type DeliveryData = {
  metrics: MetricRow[];
  /** Max 4 bullets, one per metric that landed in range. Max 160 chars each. Omit array if none. */
  whatWentWell: string[];
  /** Max 4 bullets, one per metric out of range. Max 160 chars each. Omit array if none. */
  areasToImprove: string[];
};

export type FeedbackFormat = 'audiovideo' | 'text';

export type FeedbackData = {
  format: FeedbackFormat;
  title: string;
  submitted: string;
  status: string;
  learner: string;
  meta: { id: string; date: string; duration: string };
  /** Max 100 words: what the learner got right, what they missed, one actionable tip */
  summary: string;
  skills: SkillGroup[];
  topics: Topic[];
  transcript: TranscriptMessage[];
  /** Audio/video simulations only */
  delivery?: DeliveryData;
};

type Tab = 'scorecard' | 'delivery';

// ---------- score band ----------

type ScoreBand = 'needs-improvement' | 'strong-effort' | 'excellent';

function bandFor(score: number): ScoreBand {
  if (score <= 50) return 'needs-improvement';
  if (score <= 70) return 'strong-effort';
  return 'excellent';
}

const BAND_LABEL: Record<ScoreBand, string> = {
  'needs-improvement': 'Needs Improvement',
  'strong-effort': 'Strong Effort',
  excellent: 'Excellent Performance',
};

const BAND_EMOJI: Record<ScoreBand, string> = {
  'needs-improvement': '📈',
  'strong-effort': '👍',
  excellent: '🌟',
};

const BAND_COLOR_VAR: Record<ScoreBand, string> = {
  'needs-improvement': '--feedback-error',
  'strong-effort': '--feedback-warning',
  excellent: '--feedback-success',
};

function createScorePie(score: number, band: ScoreBand): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'feedback-drawer__pie';
  wrap.style.background = `conic-gradient(var(${BAND_COLOR_VAR[band]}) ${score}%, var(--surface-sunken) ${score}% 100%)`;

  const inner = document.createElement('div');
  inner.className = 'feedback-drawer__pie-inner';

  const val = document.createElement('span');
  val.className = 'feedback-drawer__pie-score';
  val.textContent = String(score);
  val.style.color = `var(${BAND_COLOR_VAR[band]})`;
  inner.appendChild(val);

  const max = document.createElement('span');
  max.className = 'feedback-drawer__pie-max';
  max.textContent = '/ 100';
  inner.appendChild(max);

  wrap.appendChild(inner);
  return wrap;
}

// ---------- score computation ----------
// Criteria are pass/fail: a positive criterion is met, a negative one is not.
// A skill's score is the share of its criteria that were met; the overall
// score is the average of the skill scores (each skill weighted equally).

function skillScore(group: SkillGroup): number {
  if (group.criteria.length === 0) return 0;
  const met = group.criteria.filter(c => c.variant === 'positive').length;
  return Math.round((met / group.criteria.length) * 100);
}

function overallScore(skills: SkillGroup[]): number {
  if (skills.length === 0) return 0;
  const total = skills.reduce((sum, g) => sum + skillScore(g), 0);
  return Math.round(total / skills.length);
}

// ---------- skill breakdown ----------

function createSkillBreakdown(
  format: FeedbackFormat,
  skills: SkillGroup[],
  onSeek: (excerpt: CriterionExcerpt) => void,
  onPlay: (excerpt: CriterionExcerpt) => void,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'feedback-drawer__skills';

  skills.forEach(group => {
    const children = group.criteria.map(c => {
      if (format === 'audiovideo') {
        return createCriteriaCard({
          title: c.title,
          variant: c.variant,
          excerpts: (c.excerpts ?? []).slice(0, 3) as CriteriaExcerpt[],
          onActiveChange: excerpt => onSeek(excerpt),
          onPlayClick: excerpt => onPlay(excerpt),
        });
      }
      return createTextCriteriaCard({
        title: c.title,
        variant: c.variant,
        excerpts: (c.excerpts ?? []).slice(0, 3).map(e => e.text),
        onActiveChange: text => onSeek({ text }),
      });
    });

    wrap.appendChild(
      createSkillCard({
        title: group.name,
        score: skillScore(group),
        expanded: group.expanded ?? false,
        children,
      }),
    );
  });

  return wrap;
}

// ---------- scorecard panel ----------

function createScorecardPanel(
  data: FeedbackData,
  onSeek: (excerpt: CriterionExcerpt) => void,
  onPlay: (excerpt: CriterionExcerpt) => void,
): HTMLElement {
  const panel = document.createElement('div');
  panel.className = 'feedback-drawer__panel';

  const h1 = document.createElement('h1');
  h1.className = 'feedback-drawer__panel-title';
  h1.textContent = 'What You Demonstrated';
  panel.appendChild(h1);

  const overall = overallScore(data.skills);
  const band = bandFor(overall);
  const scoreRow = document.createElement('div');
  scoreRow.className = 'feedback-drawer__score-row';
  scoreRow.appendChild(createScorePie(overall, band));

  const scoreBody = document.createElement('div');
  scoreBody.className = 'feedback-drawer__score-body';
  const bandTitle = document.createElement('div');
  bandTitle.className = 'feedback-drawer__band-title';
  bandTitle.textContent = `${BAND_EMOJI[band]} ${BAND_LABEL[band]}`;
  scoreBody.appendChild(bandTitle);
  const summary = document.createElement('p');
  summary.className = 'feedback-drawer__summary';
  summary.textContent = data.summary;
  scoreBody.appendChild(summary);
  scoreRow.appendChild(scoreBody);
  panel.appendChild(scoreRow);

  const label = document.createElement('div');
  label.className = 'feedback-drawer__section-label';
  label.textContent = 'Skill Breakdown';
  panel.appendChild(label);

  panel.appendChild(createSkillBreakdown(data.format, data.skills, onSeek, onPlay));

  return panel;
}

// ---------- delivery panel ----------

const DELIVERY_INTRO =
  "Each row below shows your value against the optimal range, highlighted in green. A checkmark means you landed in range; a flag means you didn't, and the further out, the more room to improve.";

function createBulletList(items: string[], iconName: Parameters<typeof iconEl>[0], modifier: string): HTMLElement {
  const list = document.createElement('ul');
  list.className = `feedback-drawer__bullets feedback-drawer__bullets--${modifier}`;
  items.forEach(text => {
    const li = document.createElement('li');
    li.className = 'feedback-drawer__bullet';
    li.appendChild(iconEl(iconName, 'feedback-drawer__bullet-icon'));
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);
    list.appendChild(li);
  });
  return list;
}

function createDeliveryPanel(delivery: DeliveryData): HTMLElement {
  const panel = document.createElement('div');
  panel.className = 'feedback-drawer__panel';

  const h1 = document.createElement('h1');
  h1.className = 'feedback-drawer__panel-title';
  h1.textContent = 'How Well You Spoke';
  panel.appendChild(h1);

  const intro = document.createElement('p');
  intro.className = 'feedback-drawer__intro';
  intro.textContent = DELIVERY_INTRO;
  panel.appendChild(intro);

  panel.appendChild(createMetricsTable({ metrics: delivery.metrics }));

  const hasWell = delivery.whatWentWell.length > 0;
  const hasImprove = delivery.areasToImprove.length > 0;

  if (hasWell || hasImprove) {
    const cols = document.createElement('div');
    cols.className = 'feedback-drawer__delivery-cols';

    if (hasWell) {
      const col = document.createElement('div');
      col.className = 'feedback-drawer__delivery-col';
      const h2 = document.createElement('h2');
      h2.className = 'feedback-drawer__subheading';
      h2.textContent = 'What went well:';
      col.appendChild(h2);
      col.appendChild(createBulletList(delivery.whatWentWell, 'check-circle', 'good'));
      cols.appendChild(col);
    }

    if (hasImprove) {
      const col = document.createElement('div');
      col.className = 'feedback-drawer__delivery-col';
      const h2 = document.createElement('h2');
      h2.className = 'feedback-drawer__subheading';
      h2.textContent = 'Areas to improve:';
      col.appendChild(h2);
      col.appendChild(createBulletList(delivery.areasToImprove, 'exclamation-circle', 'warn'));
      cols.appendChild(col);
    }

    panel.appendChild(cols);
  }

  return panel;
}

// ---------- root factory ----------

export function createFeedbackDrawer(data: FeedbackData): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'feedback-drawer-overlay';

  const modal = document.createElement('div');
  modal.className = 'feedback-drawer';
  overlay.appendChild(modal);

  // --- topbar — sits directly on the gradient page background, no card ---
  const topbar = document.createElement('div');
  topbar.className = 'feedback-drawer__topbar';
  const title = document.createElement('h1');
  title.className = 'feedback-drawer__title';
  title.textContent = data.title;
  topbar.appendChild(title);
  const spacer = document.createElement('div');
  spacer.className = 'feedback-drawer__topbar-spacer';
  topbar.appendChild(spacer);
  const submitted = document.createElement('span');
  submitted.className = 'feedback-drawer__submitted';
  submitted.textContent = data.submitted;
  topbar.appendChild(submitted);
  const statusChip = document.createElement('span');
  statusChip.className = 'feedback-drawer__status-chip';
  statusChip.appendChild(iconEl('check-circle', 'feedback-drawer__status-icon'));
  const statusText = document.createElement('span');
  statusText.textContent = data.status;
  statusChip.appendChild(statusText);
  topbar.appendChild(statusChip);
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'feedback-drawer__close-btn';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.appendChild(iconEl('x', 'feedback-drawer__close-icon'));
  topbar.appendChild(closeBtn);
  modal.appendChild(topbar);

  // --- metabar card ---
  const metabarCard = document.createElement('div');
  metabarCard.className = 'feedback-drawer__metabar-card';
  modal.appendChild(metabarCard);

  const metabar = document.createElement('div');
  metabar.className = 'feedback-drawer__metabar';
  const avatar = document.createElement('span');
  avatar.className = 'feedback-drawer__avatar';
  avatar.textContent = data.learner.charAt(0);
  metabar.appendChild(avatar);
  const learnerName = document.createElement('span');
  learnerName.className = 'feedback-drawer__learner-name';
  learnerName.textContent = data.learner;
  metabar.appendChild(learnerName);

  const metaItem = (icon: Parameters<typeof iconEl>[0], text: string, link = false) => {
    const item = document.createElement('span');
    item.className = `feedback-drawer__meta-item${link ? ' feedback-drawer__meta-item--link' : ''}`;
    item.appendChild(iconEl(icon, 'feedback-drawer__meta-icon'));
    const span = document.createElement('span');
    span.textContent = text;
    item.appendChild(span);
    return item;
  };

  // A vertical divider separates the learner name from the meta items, and
  // each meta item from the next.
  const sessionIcon = data.format === 'audiovideo' ? 'play-btn' : 'feedback';
  const metaEntries: { icon: Parameters<typeof iconEl>[0]; text: string; link?: boolean }[] = [
    { icon: sessionIcon, text: data.meta.id },
    { icon: 'session-list', text: data.meta.date },
    { icon: 'hourglass', text: data.meta.duration },
    { icon: 'arrow-up', text: 'Export', link: true },
  ];
  metaEntries.forEach(entry => {
    const divider = document.createElement('span');
    divider.className = 'feedback-drawer__metabar-divider';
    metabar.appendChild(divider);
    metabar.appendChild(metaItem(entry.icon, entry.text, entry.link));
  });

  const navSpacer = document.createElement('div');
  navSpacer.className = 'feedback-drawer__metabar-spacer';
  metabar.appendChild(navSpacer);

  const nav = document.createElement('div');
  nav.className = 'feedback-drawer__nav-group';
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'feedback-drawer__nav-btn';
  prevBtn.appendChild(iconEl('chevron-left-sm', 'sb-icon'));
  const prevLabel = document.createElement('span');
  prevLabel.textContent = 'Prev';
  prevBtn.appendChild(prevLabel);
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'feedback-drawer__nav-btn';
  const nextLabel = document.createElement('span');
  nextLabel.textContent = 'Next';
  nextBtn.appendChild(nextLabel);
  nextBtn.appendChild(iconEl('chevron-right-sm', 'sb-icon'));
  nav.append(prevBtn, nextBtn);
  metabar.appendChild(nav);
  metabarCard.appendChild(metabar);

  // --- main card (body: transcript + content) — same fill as the metabar card ---
  const mainCard = document.createElement('div');
  mainCard.className = 'feedback-drawer__main-card';
  modal.appendChild(mainCard);

  // body = [reopen pill (own row, only when transcript hidden)] then
  // [row: transcript column + feedback container]. The feedback container
  // always fills the row — it's the inner content that's capped at 800px
  // and centered.
  const body = document.createElement('div');
  body.className = 'feedback-drawer__body';
  mainCard.appendChild(body);

  let transcriptVisible = true;
  let transcript = createTranscript({
    format: data.format,
    messages: data.transcript,
    topics: data.topics,
    onHide: () => setTranscriptVisible(false),
  });
  let activeTab: Tab = 'scorecard';

  const reopenBtn = document.createElement('button');
  reopenBtn.type = 'button';
  reopenBtn.className = 'feedback-drawer__reopen-tab';
  reopenBtn.appendChild(iconEl('chevron-bar-right', 'sb-icon'));
  const reopenLabel = document.createElement('span');
  reopenLabel.textContent = 'Transcript';
  reopenBtn.appendChild(reopenLabel);
  reopenBtn.addEventListener('click', () => setTranscriptVisible(true));

  const bodyRow = document.createElement('div');
  bodyRow.className = 'feedback-drawer__body-row';

  const feedbackContainer = document.createElement('div');
  feedbackContainer.className = 'feedback-drawer__feedback-container';
  bodyRow.appendChild(feedbackContainer);

  const content = document.createElement('div');
  content.className = 'feedback-drawer__content-inner';
  feedbackContainer.appendChild(content);

  function onSeek(excerpt: CriterionExcerpt) {
    if (!transcriptVisible) setTranscriptVisible(true);
    let match = excerpt.time != null ? data.transcript.find(m => m.time === excerpt.time) : undefined;
    if (!match) {
      match = data.transcript.find(m => m.text.includes(excerpt.text) || excerpt.text.includes(m.text));
    }
    if (match) transcript.scrollTo(match.seconds);
  }

  function onPlay(excerpt: CriterionExcerpt) {
    // No audio engine in this prototype — jumping/expanding the transcript
    // is the observable behavior; playback itself is a visual affordance.
    onSeek(excerpt);
  }

  function setTranscriptVisible(visible: boolean) {
    transcriptVisible = visible;
    if (visible) {
      transcript = createTranscript({
        format: data.format,
        messages: data.transcript,
        topics: data.topics,
        onHide: () => setTranscriptVisible(false),
      });
      bodyRow.prepend(transcript.root);
    } else if (transcript.root.parentElement) {
      transcript.root.remove();
    }
    modal.classList.toggle('feedback-drawer--transcript-hidden', !visible);
    renderContent();
  }

  function renderContent() {
    content.innerHTML = '';

    // Only the panel scrolls — tabs (when present) stay fixed above it.
    const scrollArea = document.createElement('div');
    scrollArea.className = 'feedback-drawer__content-scroll';

    if (data.format === 'text' || !data.delivery) {
      scrollArea.appendChild(createScorecardPanel(data, onSeek, onPlay));
      content.appendChild(scrollArea);
      return;
    }

    const tabsSticky = document.createElement('div');
    tabsSticky.className = 'feedback-drawer__tabs-sticky';

    const tabs = document.createElement('div');
    tabs.className = 'feedback-drawer__tabs';
    const defs: { key: Tab; label: string }[] = [
      { key: 'scorecard', label: 'Scorecard' },
      { key: 'delivery', label: 'Delivery' },
    ];
    defs.forEach(d => {
      const tabBtn = document.createElement('button');
      tabBtn.type = 'button';
      tabBtn.className = `feedback-drawer__tab${activeTab === d.key ? ' is-active' : ''}`;
      tabBtn.textContent = d.label;
      tabBtn.addEventListener('click', () => {
        activeTab = d.key;
        renderContent();
      });
      tabs.appendChild(tabBtn);
    });
    tabsSticky.appendChild(tabs);
    content.appendChild(tabsSticky);

    if (activeTab === 'scorecard') {
      scrollArea.appendChild(createScorecardPanel(data, onSeek, onPlay));
    } else {
      scrollArea.appendChild(createDeliveryPanel(data.delivery));
    }
    content.appendChild(scrollArea);
  }

  body.appendChild(reopenBtn);
  body.appendChild(bodyRow);
  bodyRow.prepend(transcript.root);
  renderContent();

  return overlay;
}
