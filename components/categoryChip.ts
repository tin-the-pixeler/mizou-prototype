// components/categoryChip.ts

export type CategoryType = 'Management' | 'Commercial' | 'Customer Support' | 'Recruitment' | 'Empty';

export type CategoryChipOptions = {
  /** Category to display */
  category?: CategoryType;
};

export const categoryTypes: CategoryType[] = ['Management', 'Commercial', 'Customer Support', 'Recruitment', 'Empty'];

export function createCategoryChip(options: CategoryChipOptions = {}): HTMLElement {
  const { category = 'Management' } = options;

  const chip = document.createElement('span');
  chip.className = `category-chip${category === 'Empty' ? ' category-chip--empty' : ''}`;

  // Label
  const label = document.createElement('span');
  label.className = 'category-chip__label';
  label.textContent = category === 'Empty' ? 'Category' : category;
  chip.appendChild(label);

  return chip;
}
