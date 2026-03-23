// components/artifactPanel.ts
import { iconEl, type IconName } from '../icons';
import {
  createEnvironmentDetailsCard,
  type EnvironmentDetailsCardOptions,
} from './environmentDetailsCard';
import { createArtifactThumbnail } from './artifactThumbnail';
import { createButton } from './button';

export type ArtifactTab = 'Preview' | 'Persona' | 'Scorecard' | 'Sources';

export const artifactTabs: ArtifactTab[] = ['Preview', 'Persona', 'Scorecard', 'Sources'];

export type ArtifactPanelOptions = EnvironmentDetailsCardOptions & {
  /** URL for the hero thumbnail image */
  thumbnailUrl?: string;
  /** Currently active tab */
  activeTab?: ArtifactTab;
  /** Callback when tab changes */
  onTabChange?: (tab: ArtifactTab) => void;
};

const tabIcons: Record<ArtifactTab, IconName> = {
  Preview: 'play-outline' as IconName,
  Persona: 'person-outline' as IconName,
  Scorecard: 'bar-chart-outline' as IconName,
  Sources: 'file-text-outline' as IconName,
};

export function createArtifactPanel(options: ArtifactPanelOptions): HTMLElement {
  const {
    thumbnailUrl,
    activeTab = 'Preview',
    onTabChange,
    primaryActionLabel = 'Test the chatbot',
    onPrimaryAction,
    ...cardOptions
  } = options;

  const panel = document.createElement('div');
  panel.className = 'artifact-panel';

  // — Top action bar (hidden by default, shown in edit mode) —
  const actionBar = document.createElement('div');
  actionBar.className = 'artifact-panel__action-bar';

  const cancelBtn = createButton({
    label: 'Cancel',
    variant: 'tertiary',
    size: 'sm',
  });
  actionBar.appendChild(cancelBtn);

  const saveBtn = createButton({
    label: 'Save changes',
    variant: 'primary',
    size: 'sm',
  });
  actionBar.appendChild(saveBtn);

  panel.appendChild(actionBar);

  // — Body (sidebar + content) —
  const body = document.createElement('div');
  body.className = 'artifact-panel__body';

  // — Left sidebar —
  const sidebar = document.createElement('nav');
  sidebar.className = 'artifact-panel__sidebar';

  const navItems: HTMLElement[] = [];
  let currentTab = activeTab;

  artifactTabs.forEach((tab, i) => {
    // Add divider before Sources
    if (tab === 'Sources') {
      const divider = document.createElement('div');
      divider.className = 'artifact-panel__sidebar-divider';
      sidebar.appendChild(divider);
    }

    const item = document.createElement('div');
    item.className = 'artifact-panel__nav-item';
    if (tab === currentTab) {
      item.classList.add('artifact-panel__nav-item--active');
    }

    const iconWrap = document.createElement('span');
    iconWrap.className = 'artifact-panel__nav-icon';
    iconWrap.appendChild(iconEl(tabIcons[tab], 'sb-icon'));
    item.appendChild(iconWrap);

    const label = document.createElement('span');
    label.className = 'artifact-panel__nav-label';
    label.textContent = tab;
    item.appendChild(label);

    item.addEventListener('click', () => {
      if (currentTab === tab) return;
      currentTab = tab;
      navItems.forEach((el, j) => {
        el.classList.toggle('artifact-panel__nav-item--active', artifactTabs[j] === tab);
      });
      showTabContent(tab);
      onTabChange?.(tab);
    });

    navItems.push(item);
    sidebar.appendChild(item);
  });

  body.appendChild(sidebar);

  // — Right content area —
  const content = document.createElement('div');
  content.className = 'artifact-panel__content';

  // Track current env card for edit mode
  let currentEnvCard: HTMLElement | null = null;

  // Build Preview tab content
  function buildPreviewContent(): HTMLElement {
    const frag = document.createElement('div');

    // Thumbnail
    const thumb = createArtifactThumbnail({ src: thumbnailUrl });
    frag.appendChild(thumb);

    // Card wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'artifact-panel__card-wrapper';

    const envCard = createEnvironmentDetailsCard(cardOptions);
    currentEnvCard = envCard;
    wrapper.appendChild(envCard);
    frag.appendChild(wrapper);

    // Primary action button (below the card)
    const actionSection = document.createElement('div');
    actionSection.className = 'artifact-panel__primary-action';

    const primaryBtn = createButton({
      label: primaryActionLabel,
      variant: 'special',
      size: 'lg',
    });
    if (onPrimaryAction) {
      primaryBtn.addEventListener('click', onPrimaryAction);
    }
    actionSection.appendChild(primaryBtn);
    frag.appendChild(actionSection);

    return frag;
  }

  // Build placeholder for tabs not yet implemented
  function buildPlaceholder(tab: ArtifactTab): HTMLElement {
    const el = document.createElement('div');
    el.className = 'artifact-panel__tab-placeholder';
    el.textContent = `${tab} tab coming soon`;
    return el;
  }

  function showTabContent(tab: ArtifactTab) {
    content.innerHTML = '';
    currentEnvCard = null;
    if (tab === 'Preview') {
      content.appendChild(buildPreviewContent());
    } else {
      content.appendChild(buildPlaceholder(tab));
    }
  }

  // — Edit mode management —
  function enterPanelEditMode() {
    panel.classList.add('artifact-panel--editing');
    if (currentEnvCard) {
      currentEnvCard.classList.add('env-card--editing');
    }
    // Hide the primary action button
    const primaryAction = content.querySelector('.artifact-panel__primary-action') as HTMLElement;
    if (primaryAction) {
      primaryAction.style.display = 'none';
    }
  }

  function exitPanelEditMode() {
    panel.classList.remove('artifact-panel--editing');
    if (currentEnvCard) {
      currentEnvCard.classList.remove('env-card--editing');
    }
    // Show the primary action button
    const primaryAction = content.querySelector('.artifact-panel__primary-action') as HTMLElement;
    if (primaryAction) {
      primaryAction.style.display = '';
    }
  }

  // Listen for edit-enter events from the env card
  panel.addEventListener('env-card:edit-enter', () => {
    enterPanelEditMode();
  });

  // Cancel — revert and exit
  cancelBtn.addEventListener('click', () => {
    if (currentEnvCard && (currentEnvCard as any).revertSnapshot) {
      (currentEnvCard as any).revertSnapshot();
    }
    exitPanelEditMode();
  });

  // Save — commit and exit
  saveBtn.addEventListener('click', () => {
    if (currentEnvCard && (currentEnvCard as any).commitEdit) {
      (currentEnvCard as any).commitEdit();
    }
    exitPanelEditMode();
  });

  showTabContent(currentTab);
  body.appendChild(content);
  panel.appendChild(body);

  return panel;
}
