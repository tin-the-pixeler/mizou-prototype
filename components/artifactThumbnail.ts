// components/artifactThumbnail.ts

export type ArtifactThumbnailOptions = {
  /** Image URL for the thumbnail */
  src?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Height in pixels */
  height?: number;
};

export function createArtifactThumbnail(options: ArtifactThumbnailOptions = {}): HTMLElement {
  const {
    src,
    alt = 'Simulation preview',
    height = 175,
  } = options;

  const el = document.createElement('div');
  el.className = 'artifact-thumbnail';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', alt);
  el.style.height = `${height}px`;

  if (src) {
    el.style.backgroundImage = `url(${src})`;
  }

  return el;
}
