import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = { title: 'Example/Hello' };
export default meta;

export const Hello: StoryObj = {
  render: () => {
    const el = document.createElement('div');
    el.textContent = 'Hello';
    el.style.padding = '16px';
    return el;
  },
};
