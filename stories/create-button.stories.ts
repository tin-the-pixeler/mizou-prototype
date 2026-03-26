import type { Meta, StoryObj } from '@storybook/html';
import { createCreateButton, type CreateButtonOptions } from '../components/createButton';

const meta: Meta<CreateButtonOptions> = {
  title: 'Components/Create Button',
  render: (args) => createCreateButton(args),
  argTypes: {
    state: { control: 'select', options: ['expanded', 'minimized'] },
  },
};

export default meta;
type Story = StoryObj<CreateButtonOptions>;

export const Expanded: Story = {
  args: { state: 'expanded' },
};

export const Minimized: Story = {
  args: { state: 'minimized' },
};

export const BothStates: Story = {
  name: 'Both States',
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '24px';

    const expandedWrap = document.createElement('div');
    expandedWrap.style.width = '212px';
    expandedWrap.appendChild(createCreateButton({ state: 'expanded' }));

    const minimizedWrap = document.createElement('div');
    minimizedWrap.appendChild(createCreateButton({ state: 'minimized' }));

    wrapper.append(expandedWrap, minimizedWrap);
    return wrapper;
  },
};
