// components/aiAvatar.ts
import avatarSrc from '../assets/ai-avatar.png';

export type AiAvatarSize = 'sm' | 'md' | 'lg';

export type AiAvatarOptions = {
  /** Avatar size: sm=40, md=56, lg=88 */
  size?: AiAvatarSize;
  /** Custom image URL (overrides default) */
  src?: string;
  /** Alt text */
  alt?: string;
};

const sizeMap: Record<AiAvatarSize, number> = {
  sm: 40,
  md: 56,
  lg: 88,
};

export function createAiAvatar(options: AiAvatarOptions = {}): HTMLElement {
  const { size = 'lg', src, alt = 'AI Avatar' } = options;
  const px = sizeMap[size];

  const wrapper = document.createElement('div');
  wrapper.className = `ai-avatar ai-avatar--${size}`;

  const img = document.createElement('img');
  img.className = 'ai-avatar__img';
  img.src = src || avatarSrc;
  img.alt = alt;
  img.width = px;
  img.height = px;

  wrapper.appendChild(img);
  return wrapper;
}
