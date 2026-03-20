// components/environmentDetailsCard.ts
import { iconEl, type IconName } from '../icons';
import { createButton } from './button';
import { createAiAvatar } from './aiAvatar';

export type SimulationType = 'chatbot' | 'roleplay';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type InstructionItem = {
  title: string;
  body: string;
};

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
  /** Options for the level dropdown */
  levelOptions?: string[];
  /** Difficulty level */
  difficulty?: DifficultyLevel;
  /** Category chip label (e.g. "Management") */
  categoryLabel: string;
  /** Options for the category dropdown */
  categoryOptions?: string[];
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
    levelOptions = ['Dismissive', 'Cooperative', 'Aggressive', 'Passive'],
    categoryLabel,
    categoryOptions = ['Management', 'Sales', 'HR', 'Engineering'],
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

  const levelChip = document.createElement('span');
  levelChip.className = 'env-card__chip env-card__chip--warning env-card__chip--interactive';

  const levelText = document.createElement('span');
  levelText.textContent = levelLabel;
  levelChip.appendChild(levelText);

  const levelChevron = document.createElement('span');
  levelChevron.className = 'env-card__chip-chevron';
  levelChevron.appendChild(iconEl('chevron-down-sm' as IconName, 'sb-icon'));
  levelChip.appendChild(levelChevron);

  createChipDropdown(levelChip, levelText, levelChevron, levelOptions);

  levelCol.appendChild(levelChip);
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

  const catChip = document.createElement('span');
  catChip.className = 'env-card__chip env-card__chip--info env-card__chip--interactive';

  const catText = document.createElement('span');
  catText.textContent = categoryLabel;
  catChip.appendChild(catText);

  const catChevron = document.createElement('span');
  catChevron.className = 'env-card__chip-chevron';
  catChevron.appendChild(iconEl('chevron-down-sm' as IconName, 'sb-icon'));
  catChip.appendChild(catChevron);

  createChipDropdown(catChip, catText, catChevron, categoryOptions);

  catCol.appendChild(catChip);
  detailsRight.appendChild(catCol);
  details.appendChild(detailsRight);
  descSection.appendChild(details);

  // Instruction block
  const instrBlock = document.createElement('div');
  instrBlock.className = 'env-card__instructions';

  // Header
  const instrHeader = document.createElement('div');
  instrHeader.className = 'env-card__instructions-header';

  const instrTitle = document.createElement('span');
  instrTitle.className = 'env-card__instructions-header-title';
  instrTitle.textContent = instructionHeader;
  instrHeader.appendChild(instrTitle);

  instrBlock.appendChild(instrHeader);

  // Body — single unified editable text field
  const instrBody = document.createElement('div');
  instrBody.className = 'env-card__instructions-body env-card__editable';
  instrBody.contentEditable = 'true';

  // Build initial HTML content from instructions
  const htmlParts = instructions.map((item) => {
    let html = `<div class="env-card__list-item"><div class="env-card__list-item-header"><div class="env-card__list-bullet"><div class="env-card__list-bullet-dot"></div></div><span class="env-card__list-item-title">${item.title}</span></div>`;
    if (item.body) {
      html += `<div class="env-card__list-item-body">${item.body}</div>`;
    }
    html += '</div>';
    return html;
  });
  instrBody.innerHTML = `<div class="env-card__instructions-list">${htmlParts.join('')}</div>`;

  instrBlock.appendChild(instrBody);
  descSection.appendChild(instrBlock);

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
