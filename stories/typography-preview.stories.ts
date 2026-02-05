import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  title: 'Chat/Typography Preview',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

function createTypographyPreview() {
  const container = document.createElement('div');
  container.style.maxWidth = '800px';
  container.style.padding = '40px';
  
  container.innerHTML = `
    <h1 class="page-title" style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">Typography System</h1>
    <p class="subtitle" style="color: var(--text-secondary); font-size: 17px; margin-bottom: 40px;">Nunito Sans font styles for chat interface</p>
    
    <div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
      <h1>Heading 1 - 24px Bold</h1>
      <p style="margin-bottom: 24px;">This is the largest heading style, used for major sections.</p>
      
      <h2>Heading 2 - 20px Bold</h2>
      <p style="margin-bottom: 24px;">This is the second-level heading style.</p>
      
      <h3>Heading 3 - 17px Semibold</h3>
      <p style="margin-bottom: 24px;">This is the third-level heading style.</p>
      
      <hr>
      
      <h3>Body Text Styles</h3>
      <p>This is regular body text at 15px with 400 weight. The quick brown fox jumps over the lazy dog. This is the primary text style for chat messages and general content throughout the interface.</p>
      
      <p><strong>This is bold text</strong> used for emphasis within paragraphs.</p>
      
      <p><em>This is italic text</em> used for subtle emphasis.</p>
      
      <p style="margin-bottom: 24px;"><a href="#">This is a link</a> in the chat interface with medium weight.</p>
      
      <hr>
      
      <h3>Code Styles</h3>
      <p>Inline code looks like this: <code>const message = "Hello World";</code></p>
      
      <p style="margin-bottom: 8px;">Code blocks look like this:</p>
      <pre><code>function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));</code></pre>
      
      <hr>
      
      <h3>Lists</h3>
      <p style="margin-bottom: 8px;">Unordered list:</p>
      <ul>
        <li>First item in the list</li>
        <li>Second item with more text to show line wrapping behavior</li>
        <li>Third item with nested list:
          <ul>
            <li>Nested item one</li>
            <li>Nested item two</li>
          </ul>
        </li>
        <li>Fourth item</li>
      </ul>
      
      <p style="margin-bottom: 8px;">Ordered list:</p>
      <ol>
        <li>First numbered item</li>
        <li>Second numbered item with more text</li>
        <li>Third numbered item with nested list:
          <ol>
            <li>Nested numbered item</li>
            <li>Another nested item</li>
          </ol>
        </li>
        <li>Fourth numbered item</li>
      </ol>
      
      <hr>
      
      <h3>Blockquote</h3>
      <blockquote>
        This is a blockquote. It uses italic styling and a left border to distinguish quoted content from regular text.
      </blockquote>
      
      <hr>
      
      <h3>Table</h3>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Typography</td>
            <td>Complete font system</td>
            <td>✓ Done</td>
          </tr>
          <tr>
            <td>Colors</td>
            <td>Design tokens</td>
            <td>✓ Done</td>
          </tr>
          <tr>
            <td>Components</td>
            <td>Chat interface</td>
            <td>In Progress</td>
          </tr>
        </tbody>
      </table>
      
      <hr>
      
      <p><small>Small text - 11px Regular. Used for timestamps and secondary information.</small></p>
    </div>
  `;
  
  return container;
}

export const Default: Story = {
  render: () => createTypographyPreview(),
};
