// components/feedbackTranscript.ts
// Transcript column for the feedback drawer: header with a hide toggle, a
// compact audio player (audio/video simulations only), a topics-discussed
// legend, and the message list. Exposes scrollTo() so criteria cards can
// jump the transcript to a cited excerpt.

import { iconEl } from '../icons';

export type TranscriptMessage = {
  speaker: string;
  /** Display timestamp, e.g. "00:01" */
  time: string;
  /** Seconds, used to match a timestamp to the nearest message */
  seconds: number;
  text: string;
  /** The learner being evaluated — tinted speaker name */
  learner?: boolean;
};

export type Topic = { label: string; color: string; weight: number };

export type TranscriptFormat = 'audiovideo' | 'text';

export type TranscriptOptions = {
  format: TranscriptFormat;
  messages: TranscriptMessage[];
  topics?: Topic[];
  onHide: () => void;
};

export type TranscriptHandle = {
  root: HTMLElement;
  /** Scrolls to and highlights the message nearest the given time */
  scrollTo: (seconds: number) => void;
};

const SPEEDS = ['1X', '1.5X', '2X', '0.5X'];

function createAudioPlayer(): HTMLElement {
  const bar = document.createElement('div');
  bar.className = 'feedback-transcript__audio';

  const speed = document.createElement('button');
  speed.type = 'button';
  speed.className = 'feedback-transcript__audio-speed';
  speed.textContent = SPEEDS[0];
  let speedIdx = 0;
  speed.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    speed.textContent = SPEEDS[speedIdx];
  });

  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'feedback-transcript__audio-play';
  play.appendChild(iconEl('play', 'feedback-transcript__audio-play-icon'));
  play.addEventListener('click', () => {
    const playing = play.classList.toggle('is-playing');
    play.innerHTML = '';
    play.appendChild(iconEl(playing ? 'stop' : 'play', 'feedback-transcript__audio-play-icon'));
  });

  const volume = document.createElement('button');
  volume.type = 'button';
  volume.className = 'feedback-transcript__audio-volume';
  volume.appendChild(iconEl('volume-up-fill', 'feedback-transcript__audio-volume-icon'));

  const track = document.createElement('div');
  track.className = 'feedback-transcript__audio-track';
  const fill = document.createElement('div');
  fill.className = 'feedback-transcript__audio-fill';
  fill.style.width = '35%';
  track.appendChild(fill);

  bar.append(speed, play, volume, track);
  return bar;
}

function createTopics(topics: Topic[]): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'feedback-transcript__topics';

  const label = document.createElement('div');
  label.className = 'feedback-transcript__topics-label';
  label.textContent = 'Topics Discussed';
  wrap.appendChild(label);

  const bar = document.createElement('div');
  bar.className = 'feedback-transcript__topics-bar';
  topics.forEach(t => {
    const seg = document.createElement('div');
    seg.className = 'feedback-transcript__topics-seg';
    seg.style.flex = String(t.weight);
    seg.style.background = t.color;
    bar.appendChild(seg);
  });
  wrap.appendChild(bar);

  const legend = document.createElement('div');
  legend.className = 'feedback-transcript__topics-legend';
  topics.forEach(t => {
    const item = document.createElement('div');
    item.className = 'feedback-transcript__topics-item';
    const swatch = document.createElement('span');
    swatch.className = 'feedback-transcript__topics-swatch';
    swatch.style.background = t.color;
    const label2 = document.createElement('span');
    label2.textContent = t.label;
    item.append(swatch, label2);
    legend.appendChild(item);
  });
  wrap.appendChild(legend);

  return wrap;
}

export function createTranscript(options: TranscriptOptions): TranscriptHandle {
  const { format, messages, topics = [], onHide } = options;

  const root = document.createElement('aside');
  root.className = 'feedback-transcript';

  // header — "Transcript" label + hide toggle
  const header = document.createElement('div');
  header.className = 'feedback-transcript__header';
  const label = document.createElement('span');
  label.className = 'feedback-transcript__label';
  label.textContent = 'Transcript';
  header.appendChild(label);

  const hideBtn = document.createElement('button');
  hideBtn.type = 'button';
  hideBtn.className = 'feedback-transcript__hide-btn';
  hideBtn.textContent = 'Hide';
  hideBtn.addEventListener('click', onHide);
  header.appendChild(hideBtn);
  root.appendChild(header);

  if (format === 'audiovideo') {
    root.appendChild(createAudioPlayer());
  }

  if (topics.length > 0) {
    root.appendChild(createTopics(topics));
  }

  // messages
  const list = document.createElement('div');
  list.className = 'feedback-transcript__messages';
  const bySeconds: { seconds: number; el: HTMLElement }[] = [];

  messages.forEach(m => {
    const msg = document.createElement('div');
    msg.className = `feedback-transcript__message${m.learner ? ' feedback-transcript__message--learner' : ''}`;

    const head = document.createElement('div');
    head.className = 'feedback-transcript__message-head';
    const name = document.createElement('span');
    name.className = 'feedback-transcript__message-name';
    name.textContent = m.speaker;
    const time = document.createElement('span');
    time.className = 'feedback-transcript__message-time';
    time.textContent = m.time;
    head.append(name, time);
    msg.appendChild(head);

    const text = document.createElement('p');
    text.className = 'feedback-transcript__message-text';
    text.textContent = m.text;
    msg.appendChild(text);

    list.appendChild(msg);
    bySeconds.push({ seconds: m.seconds, el: msg });
  });
  root.appendChild(list);

  const scrollTo = (seconds: number) => {
    let best: HTMLElement | null = null;
    let bestDelta = Infinity;
    bySeconds.forEach(({ seconds: s, el }) => {
      const delta = Math.abs(s - seconds);
      if (s <= seconds + 1 && delta < bestDelta) {
        bestDelta = delta;
        best = el;
      }
    });
    if (!best) return;
    const target: HTMLElement = best;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('is-highlight');
    setTimeout(() => target.classList.remove('is-highlight'), 1600);
  };

  return { root, scrollTo };
}
