import type { Meta, StoryObj } from '@storybook/html';
import { icons, iconNames, iconEl } from '../icons';

const meta: Meta = { title: 'Library/Icons' };
export default meta;

type Story = StoryObj;

export const AllIcons: Story = {
  render: () => {
    const wrapper = document.createElement('div');

    // Toolbar (search + count)
    const toolbar = document.createElement('div');
    toolbar.className = 'sb-icons-toolbar';

    const search = document.createElement('input');
    search.className = 'sb-icons-search';
    search.placeholder = 'Search icons…';

    const count = document.createElement('div');
    count.style.alignSelf = 'center';

    toolbar.append(search, count);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'sb-icons-grid';

    function renderGrid(filter = '') {
      grid.innerHTML = '';
      const q = filter.trim().toLowerCase();
      const names = iconNames.filter(n => n.toLowerCase().includes(q));
      count.textContent = `${names.length} icon${names.length === 1 ? '' : 's'}`;

      names.forEach(name => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'sb-icon-card';
        card.title = `${name} (click to copy name)`;

        const preview = document.createElement('span');
        preview.className = 'sb-icon-card__preview';
        preview.appendChild(iconEl(name));

        const label = document.createElement('span');
        label.className = 'sb-icon-card__name';
        label.textContent = name;

        card.append(preview, label);

        // Click to copy icon name to clipboard
        card.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(name);
            card.title = 'Copied!';
            setTimeout(() => (card.title = `${name} (click to copy name)`), 800);
          } catch {}
        });

        grid.appendChild(card);
      });
    }

    search.addEventListener('input', () => renderGrid(search.value));
    renderGrid();

    wrapper.append(toolbar, grid);
    return wrapper;
  },
};
