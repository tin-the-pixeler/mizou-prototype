// components/instructionField.ts

export type InstructionItem = {
  title: string;
  body: string;
};

export type InstructionFieldOptions = {
  /** Header text */
  header?: string;
  /** List of instruction items (title + body) */
  items?: InstructionItem[];
};

export function createInstructionField(options: InstructionFieldOptions): HTMLElement {
  const {
    header = 'Read instructions',
    items = [],
  } = options;

  const root = document.createElement('div');
  root.className = 'instruction-field';

  // — Header —
  const headerEl = document.createElement('div');
  headerEl.className = 'instruction-field__header';

  const titleEl = document.createElement('span');
  titleEl.className = 'instruction-field__header-title';
  titleEl.textContent = header;
  headerEl.appendChild(titleEl);

  root.appendChild(headerEl);

  // — Body (editable area) —
  const body = document.createElement('div');
  body.className = 'instruction-field__body';

  const list = document.createElement('ul');
  list.className = 'instruction-field__list';
  list.setAttribute('contenteditable', 'true');
  list.setAttribute('spellcheck', 'false');

  for (const item of items) {
    const li = document.createElement('li');
    li.className = 'instruction-field__list-item';

    const itemTitle = document.createElement('strong');
    itemTitle.className = 'instruction-field__item-title';
    itemTitle.textContent = item.title;

    const itemBody = document.createElement('span');
    itemBody.className = 'instruction-field__item-body';
    itemBody.textContent = '\n' + item.body;

    li.appendChild(itemTitle);
    li.appendChild(itemBody);
    list.appendChild(li);
  }

  // If no items, add a placeholder
  if (items.length === 0) {
    const li = document.createElement('li');
    li.className = 'instruction-field__list-item';
    list.appendChild(li);
  }

  body.appendChild(list);
  root.appendChild(body);

  return root;
}
