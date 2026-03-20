// components/environmentDetailsCard.ts
import { iconEl, type IconName } from '../icons';
import { createButton } from './button';
import { createAiAvatar } from './aiAvatar';
import { createLevelChip, type LevelChipTheme, levelConfigs, levelNames } from './levelChip';
import { createCategoryChip, type CategoryType, categoryTypes } from './categoryChip';
import { createInstructionField, type InstructionItem } from './instructionField';

export type SimulationType = 'chatbot' | 'roleplay';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type { InstructionItem } from './instructionField';

export type EnvironmentDetailsCardOptions = {
  /** Badge simulation type */
  simulationType?: SimulationType;
  /** Card title */
  title: string;
  /** Avatar image URL (optional, falls back to placeholder) */
  avatarUrl?: string;
  /** Character role (e.g. "Senior Staff Auditor") */
  role: string;
  /** Character name */
  name: string;
  /** Level/personality chip label (e.g. "Dismissive") */
  levelLabel: string;
  /** Level chip theme */
  levelTheme?: LevelChipTheme;
  /** Difficulty level */
  difficulty?: DifficultyLevel;
  /** Category type */
  category?: CategoryType;
  /** Category chip label (e.g. "Management") — kept for backward compat */
  categoryLabel: string;
  /** Instruction block header text */
  instructionHeader?: string;
  /** Ordered list of instructions */
  instructions: InstructionItem[];
  /** Primary action button label */
  primaryActionLabel?: string;
  /** Callback for primary action */
  onPrimaryAction?: () => void;
};

const simulationIcons: Record<SimulationType, IconName> = {
  chatbot: 'chat-ai' as IconName,
  roleplay: 'persona' as IconName,
};

function createChipDropdown(
  chip: HTMLElement,
  textEl: HTMLElement,
  chevron: HTMLElement,
  dropdownOptions: string[],
): void {
  let dropdown: HTMLElement | null = null;

  function closeDropdown() {
    if (dropdown) {
      dropdown.remove();
      dropdown = null;
      chip.classList.remove('env-card__chip--open');
    }
  }

  function openDropdown() {
    if (dropdown) { closeDropdown(); return; }
    chip.classList.add('env-card__chip--open');

    dropdown = document.createElement('div');
    dropdown.className = 'env-card__dropdown';

    dropdownOptions.forEach((opt) => {
      const item = document.createElement('div');
      item.className = 'env-card__dropdown-item';
      if (opt === textEl.textContent) {
        item.classList.add('env-card__dropdown-item--selected');
      }
      item.textContent = opt;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        textEl.textContent = opt;
        closeDropdown();
      });
      dropdown!.appendChild(item);
    });

    chip.style.position = 'relative';
    chip.appendChild(dropdown);

    // Close on outside click
    const onOutside = (e: MouseEvent) => {
      if (!chip.contains(e.target as Node)) {
        closeDropdown();
        document.removeEventListener('click', onOutside, true);
      }
    };
    requestAnimationFrame(() => {
      document.addEventListener('click', onOutside, true);
    });
  }

  chip.addEventListener('click', openDropdown);
}

export function createEnvironmentDetailsCard(options: EnvironmentDetailsCardOptions): HTMLElement {
  const {
    simulationType = 'chatbot',
    title,
    avatarUrl,
    role,
    name,
    levelLabel,
    levelTheme = 'yellow',
    category = 'Management',
    categoryLabel,
    instructionHeader = 'Read instructions',
    instructions,
    primaryActionLabel = 'Test the chatbot',
    onPrimaryAction,
  } = options;

  const card = document.createElement('div');
  card.className = 'env-card';

  // — Description section —
  const descSection = document.createElement('div');
  descSection.className = 'env-card__description';

  // Badge
  const badge = document.createElement('div');
  badge.className = 'env-card__badge';

  const badgeIcon = document.createElement('span');
  badgeIcon.className = 'env-card__badge-icon';
  badgeIcon.appendChild(iconEl(simulationIcons[simulationType], 'sb-icon'));
  badge.appendChild(badgeIcon);

  const badgeLabel = document.createElement('span');
  badgeLabel.className = 'env-card__badge-label';
  badgeLabel.textContent = simulationType.charAt(0).toUpperCase() + simulationType.slice(1);
  badge.appendChild(badgeLabel);

  descSection.appendChild(badge);

  // Title (editable on click)
  const titleEl = document.createElement('h2');
  titleEl.className = 'env-card__title env-card__editable';
  titleEl.contentEditable = 'true';
  titleEl.textContent = title;
  descSection.appendChild(titleEl);

  // Chatbot details
  const details = document.createElement('div');
  details.className = 'env-card__details';

  // Left: avatar + identity
  const detailsLeft = document.createElement('div');
  detailsLeft.className = 'env-card__details-left';

  const avatar = createAiAvatar({ size: 'lg', src: avatarUrl, alt: name });
  detailsLeft.appendChild(avatar);

  const identity = document.createElement('div');
  identity.className = 'env-card__identity';

  const roleEl = document.createElement('span');
  roleEl.className = 'env-card__role env-card__editable';
  roleEl.contentEditable = 'true';
  roleEl.textContent = role;
  identity.appendChild(roleEl);

  const nameEl = document.createElement('span');
  nameEl.className = 'env-card__name env-card__editable';
  nameEl.contentEditable = 'true';
  nameEl.textContent = name;
  identity.appendChild(nameEl);

  detailsLeft.appendChild(identity);
  details.appendChild(detailsLeft);

  // Divider
  const divider1 = document.createElement('div');
  divider1.className = 'env-card__divider';
  details.appendChild(divider1);

  // Right: level + divider + category
  const detailsRight = document.createElement('div');
  detailsRight.className = 'env-card__details-right';

  // Level column
  const levelCol = document.createElement('div');
  levelCol.className = 'env-card__meta-col';

  const levelLabel2 = document.createElement('span');
  levelLabel2.className = 'env-card__meta-label';
  levelLabel2.textContent = 'Level';
  levelCol.appendChild(levelLabel2);

  // Build level chip with dropdown that swaps theme/dots on selection
  let currentLevelLabel = levelLabel;

  function buildLevelChip(label: string, theme: LevelChipTheme): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'env-card__chip-wrapper env-card__chip--interactive';

    const el = createLevelChip({ label, theme });

    const chevron = document.createElement('span');
    chevron.className = 'env-card__chip-chevron';
    chevron.appendChild(iconEl('chevron-down-sm' as IconName, 'sb-icon'));

    wrapper.appendChild(el);
    wrapper.appendChild(chevron);

    let dropdown: HTMLElement | null = null;

    function closeDropdown() {
      if (dropdown) {
        dropdown.remove();
        dropdown = null;
        wrapper.classList.remove('env-card__chip--open');
      }
    }

    function openDropdown() {
      if (dropdown) { closeDropdown(); return; }
      wrapper.classList.add('env-card__chip--open');

      dropdown = document.createElement('div');
      dropdown.className = 'env-card__dropdown';

      levelNames.forEach((opt) => {
        const item = document.createElement('div');
        item.className = 'env-card__dropdown-item';
        if (opt === currentLevelLabel) {
          item.classList.add('env-card__dropdown-item--selected');
        }
        item.textContent = opt;
        item.addEventListener('click', (ev) => {
          ev.stopPropagation();
          closeDropdown();
          currentLevelLabel = opt;
          const cfg = levelConfigs[opt];
          const newChip = buildLevelChip(opt, cfg.theme);
          levelCol.replaceChild(newChip, levelCol.querySelector('.env-card__chip-wrapper')!);
        });
        dropdown!.appendChild(item);
      });

      wrapper.appendChild(dropdown);

      const onOutside = (e: MouseEvent) => {
        if (!wrapper.contains(e.target as Node)) {
          closeDropdown();
          document.removeEventListener('click', onOutside, true);
        }
      };
      requestAnimationFrame(() => {
        document.addEventListener('click', onOutside, true);
      });
    }

    wrapper.addEventListener('click', openDropdown);
    return wrapper;
  }

  levelCol.appendChild(buildLevelChip(levelLabel, levelTheme));
  detailsRight.appendChild(levelCol);

  // Divider
  const divider2 = document.createElement('div');
  divider2.className = 'env-card__divider';
  detailsRight.appendChild(divider2);

  // Category column
  const catCol = document.createElement('div');
  catCol.className = 'env-card__meta-col';

  const catLabelEl = document.createElement('span');
  catLabelEl.className = 'env-card__meta-label';
  catLabelEl.textContent = 'Category';
  catCol.appendChild(catLabelEl);

  const catWrapper = document.createElement('div');
  catWrapper.className = 'env-card__chip-wrapper env-card__chip--interactive';

  const catChipEl = createCategoryChip({ category });

  const catText = catChipEl.querySelector('.category-chip__label') as HTMLElement;

  const catChevron = document.createElement('span');
  catChevron.className = 'env-card__chip-chevron';
  catChevron.appendChild(iconEl('chevron-down-sm' as IconName, 'sb-icon'));

  catWrapper.appendChild(catChipEl);
  catWrapper.appendChild(catChevron);

  createChipDropdown(catWrapper, catText, catChevron, categoryTypes.filter(c => c !== 'Empty'));

  catCol.appendChild(catWrapper);
  detailsRight.appendChild(catCol);
  details.appendChild(detailsRight);
  descSection.appendChild(details);

  // Instruction block — using the InstructionField component
  const instrField = createInstructionField({
    header: instructionHeader,
    items: instructions,
  });
  descSection.appendChild(instrField);

  card.appendChild(descSection);

  // — Action section —
  const actions = document.createElement('div');
  actions.className = 'env-card__actions';

  const primaryBtn = createButton({
    label: primaryActionLabel,
    variant: 'special',
    size: 'lg',
  });
  if (onPrimaryAction) {
    primaryBtn.addEventListener('click', onPrimaryAction);
  }
  actions.appendChild(primaryBtn);

  card.appendChild(actions);

  return card;
}
