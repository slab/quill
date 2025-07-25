import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
} from 'vitest';
import hljs from 'highlight.js';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';
import Syntax, { CodeBlock, CodeToken } from '../../../src/modules/syntax.js';
import Bold from '../../../src/formats/bold.js';
import { createRegistry } from '../__helpers__/factory.js';
import { normalizeHTML, sleep } from '../__helpers__/utils.js';

const HIGHLIGHT_INTERVAL = 10;

describe('Syntax Module Shadow DOM Integration', () => {
  let container: HTMLElement;
  let shadowHost: HTMLElement;
  let shadowRoot: ShadowRoot;

  beforeAll(() => {
    Quill.register({ 'modules/syntax': Syntax }, true);
    Syntax.register();
    Syntax.DEFAULTS.languages = [
      { key: 'javascript', label: 'JavaScript' },
      { key: 'ruby', label: 'Ruby' },
      { key: 'python', label: 'Python' },
    ];
  });

  beforeEach(() => {
    // Create regular DOM container
    container = document.createElement('div');
    container.id = 'regular-container';
    document.body.appendChild(container);

    // Create shadow DOM setup
    shadowHost = document.createElement('div');
    shadowHost.id = 'shadow-host';
    document.body.appendChild(shadowHost);
    shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    const shadowContainer = document.createElement('div');
    shadowContainer.id = 'shadow-container';
    shadowRoot.appendChild(shadowContainer);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(shadowHost);
  });

  const createRegularQuill = () => {
    container.innerHTML = normalizeHTML(
      `<pre data-language="javascript">var test = 1;<br>var bugz = 0;<br></pre>
       <p><br></p>`,
    );
    const quill = new Quill(container, {
      modules: {
        syntax: {
          hljs,
          interval: HIGHLIGHT_INTERVAL,
        },
      },
      registry: createRegistry([
        Bold,
        CodeToken,
        CodeBlock,
        Quill.import('formats/code-block-container'),
      ]),
    });
    return quill;
  };

  const createShadowQuill = () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    shadowContainer.innerHTML = normalizeHTML(
      `<pre data-language="javascript">var test = 1;<br>var bugz = 0;<br></pre>
       <p><br></p>`,
    );
    const quill = new Quill(shadowContainer, {
      modules: {
        syntax: {
          hljs,
          interval: HIGHLIGHT_INTERVAL,
        },
      },
      registry: createRegistry([
        Bold,
        CodeToken,
        CodeBlock,
        Quill.import('formats/code-block-container'),
      ]),
    });
    return quill;
  };

  test('Syntax module initializes correctly in regular DOM', () => {
    const quill = createRegularQuill();

    // Verify we're in regular DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(false);
    expect(quill.domRoot.getRoot()).toBe(document);

    // Verify syntax module exists and is properly initialized
    expect(quill.getModule('syntax')).toBeDefined();

    // Verify initial code block structure
    expect(quill.root).toEqualHTML(
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block" data-language="javascript">var test = 1;</div>
        <div class="ql-code-block" data-language="javascript">var bugz = 0;</div>
      </div>
      <p><br></p>`,
    );
  });

  test('Syntax module initializes correctly in shadow DOM', () => {
    const quill = createShadowQuill();

    // Verify we're in shadow DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(true);
    expect(quill.domRoot.getRoot()).toBe(shadowRoot);

    // Verify syntax module exists and is properly initialized
    expect(quill.getModule('syntax')).toBeDefined();

    // Verify initial code block structure
    expect(quill.root).toEqualHTML(
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block" data-language="javascript">var test = 1;</div>
        <div class="ql-code-block" data-language="javascript">var bugz = 0;</div>
      </div>
      <p><br></p>`,
    );
  });

  test('Syntax highlighting works in shadow DOM', async () => {
    const quill = createShadowQuill();

    // Wait for highlighting to occur
    await sleep(HIGHLIGHT_INTERVAL + 1);

    // Verify highlighting tokens are applied
    expect(quill.root).toEqualHTML(
      `<div class="ql-code-block-container" spellcheck="false">
          <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> test = <span class="ql-token hljs-number">1</span>;</div>
          <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> bugz = <span class="ql-token hljs-number">0</span>;</div>
        </div>
        <p><br></p>`,
    );
  });

  test('Language selector dropdown works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    shadowContainer.innerHTML = normalizeHTML(
      `<pre data-language="javascript">function test() {<br>  return 42;<br>}<br></pre>`,
    );

    const quill = new Quill(shadowContainer, {
      modules: {
        syntax: {
          hljs,
          interval: HIGHLIGHT_INTERVAL,
        },
      },
      registry: createRegistry([
        Bold,
        CodeToken,
        CodeBlock,
        Quill.import('formats/code-block-container'),
      ]),
    });

    // Add a paragraph to trigger container mounting
    quill.updateContents(quill.getContents().insert('\n'));
    await sleep(HIGHLIGHT_INTERVAL + 1);

    // Verify language selector is created within shadow DOM
    const selectors = shadowContainer.querySelectorAll('select.ql-ui');
    expect(selectors.length).toBeGreaterThanOrEqual(1);

    // Verify selector has correct options
    const selector = selectors[0] as HTMLSelectElement;
    expect(selector.ownerDocument).toBe(document);
    expect(selector.options.length).toBe(3);
    expect(selector.options[0].value).toBe('javascript');
    expect(selector.options[0].textContent).toBe('JavaScript');
    expect(selector.options[1].value).toBe('ruby');
    expect(selector.options[1].textContent).toBe('Ruby');
    expect(selector.options[2].value).toBe('python');
    expect(selector.options[2].textContent).toBe('Python');
  });

  test('Language changes work in shadow DOM', async () => {
    const quill = createShadowQuill();

    // Change language to Ruby
    quill.formatLine(0, 20, 'code-block', 'ruby');
    await sleep(HIGHLIGHT_INTERVAL + 1);

    // Verify language change is applied and highlighting updated
    expect(quill.root).toEqualHTML(
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block" data-language="ruby">var test = <span class="ql-token hljs-number">1</span>;</div>
        <div class="ql-code-block" data-language="ruby">var bugz = <span class="ql-token hljs-number">0</span>;</div>
      </div>
      <p><br></p>`,
    );

    // Verify Delta content
    const contents = quill.getContents();
    expect(contents.ops[1].attributes?.['code-block']).toBe('ruby');
    expect(contents.ops[3].attributes?.['code-block']).toBe('ruby');
  });

  test('Invalid language fallback works in shadow DOM', async () => {
    const quill = createShadowQuill();

    // Set invalid language
    quill.formatLine(0, 20, 'code-block', 'nonexistent');
    await sleep(HIGHLIGHT_INTERVAL + 1);

    // Verify fallback to 'plain' language
    expect(quill.root).toEqualHTML(
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block" data-language="plain">var test = 1;</div>
        <div class="ql-code-block" data-language="plain">var bugz = 0;</div>
      </div>
      <p><br></p>`,
    );

    // Verify no highlighting tokens (plain text)
    const tokens = shadowRoot.querySelectorAll('.ql-token');
    expect(tokens.length).toBe(0);
  });

  test('Code block splitting works in shadow DOM', async () => {
    const quill = createShadowQuill();

    // Split the code block by inserting a newline
    quill.updateContents(quill.getContents().retain(14).insert('\n'));
    await sleep(HIGHLIGHT_INTERVAL + 1);

    // Verify that splitting creates separate containers
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const containers = shadowContainer.querySelectorAll(
      '.ql-code-block-container',
    );
    expect(containers.length).toBeGreaterThanOrEqual(2);

    // Verify selectors are created within shadow DOM
    const selectors = shadowContainer.querySelectorAll('select.ql-ui');
    expect(selectors.length).toBeGreaterThanOrEqual(2);
    selectors.forEach((selector) => {
      expect(selector.ownerDocument).toBe(document);
    });

    // Verify both code blocks still have highlighting
    const tokens = shadowContainer.querySelectorAll('.ql-token');
    expect(tokens.length).toBeGreaterThan(0);
  });

  test('Code block merging works in shadow DOM', async () => {
    const quill = createShadowQuill();

    // First split the blocks
    quill.updateContents(quill.getContents().retain(14).insert('\n'));
    await sleep(HIGHLIGHT_INTERVAL + 1);

    // Verify split occurred
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    let containers = shadowContainer.querySelectorAll(
      '.ql-code-block-container',
    );
    const initialContainerCount = containers.length;
    expect(initialContainerCount).toBeGreaterThanOrEqual(2);

    // Then merge them back by removing the newline
    quill.deleteText(14, 1);
    await sleep(HIGHLIGHT_INTERVAL + 1);

    // Verify blocks are merged back - should have fewer or equal containers than before
    containers = shadowContainer.querySelectorAll('.ql-code-block-container');
    expect(containers.length).toBeLessThanOrEqual(initialContainerCount);

    // Verify highlighting still works
    const tokens = shadowContainer.querySelectorAll('.ql-token');
    expect(tokens.length).toBeGreaterThan(0);

    // Verify both code lines are present
    const text = quill.getText();
    expect(text).toContain('var test = 1;');
    expect(text).toContain('var bugz = 0;');
  });

  test('Formatting within code blocks works in shadow DOM', async () => {
    const quill = createShadowQuill();

    // Allow bold formatting in code blocks for this test
    CodeBlock.allowedChildren.push(Bold);

    try {
      // Apply bold formatting to part of the code
      quill.formatText(2, 3, 'bold', true);
      await sleep(HIGHLIGHT_INTERVAL + 1);

      // Verify formatting is preserved with highlighting
      expect(quill.root).toEqualHTML(
        `<div class="ql-code-block-container" spellcheck="false">
          <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">va</span><strong><span class="ql-token hljs-keyword">r</span> t</strong>est = <span class="ql-token hljs-number">1</span>;</div>
          <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> bugz = <span class="ql-token hljs-number">0</span>;</div>
        </div>
        <p><br></p>`,
      );
    } finally {
      // Clean up: remove Bold from allowedChildren
      CodeBlock.allowedChildren.pop();
    }
  });

  test('Converting from code block to regular text works in shadow DOM', async () => {
    const quill = createShadowQuill();

    // Apply bold formatting first
    CodeBlock.allowedChildren.push(Bold);
    quill.formatText(2, 3, 'bold', true);
    await sleep(HIGHLIGHT_INTERVAL + 1);

    try {
      // Remove code block formatting from first line
      quill.formatLine(0, 1, 'code-block', false);

      // Verify first line becomes regular paragraph with preserved formatting
      expect(quill.root).toEqualHTML(
        `<p>va<strong>r t</strong>est = 1;</p>
         <div class="ql-code-block-container" spellcheck="false">
           <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> bugz = <span class="ql-token hljs-number">0</span>;</div>
         </div>
         <p><br></p>`,
      );
    } finally {
      CodeBlock.allowedChildren.pop();
    }
  });

  test('Multiple Quill instances with syntax work independently', async () => {
    const regularQuill = createRegularQuill();
    const shadowQuill = createShadowQuill();

    // Set different languages for each instance
    regularQuill.formatLine(0, 20, 'code-block', 'ruby');
    shadowQuill.formatLine(0, 20, 'code-block', 'python');

    await sleep(HIGHLIGHT_INTERVAL + 1);

    // Verify each instance has correct language
    const regularContents = regularQuill.getContents();
    const shadowContents = shadowQuill.getContents();

    expect(regularContents.ops[1].attributes?.['code-block']).toBe('ruby');
    expect(shadowContents.ops[1].attributes?.['code-block']).toBe('python');

    // Verify different contexts
    expect(regularQuill.domRoot.isInShadowDOM()).toBe(false);
    expect(shadowQuill.domRoot.isInShadowDOM()).toBe(true);

    // Verify highlighting is applied correctly in both
    const regularTokens = container.querySelectorAll('.ql-token');
    const shadowTokens = shadowRoot.querySelectorAll('.ql-token');

    expect(regularTokens.length).toBeGreaterThan(0);
    expect(shadowTokens.length).toBeGreaterThan(0);
  });

  test('Syntax module HTML export works in shadow DOM', async () => {
    const quill = createShadowQuill();
    await sleep(HIGHLIGHT_INTERVAL + 1);

    // Verify semantic HTML export includes language data
    const html = quill.getSemanticHTML();
    expect(html).toContain('data-language="javascript"');
  });

  test('Element creation uses correct document context in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    shadowContainer.innerHTML = normalizeHTML(
      `<pre data-language="javascript">console.log('test');</pre>`,
    );

    const quill = new Quill(shadowContainer, {
      modules: {
        syntax: {
          hljs,
          interval: HIGHLIGHT_INTERVAL,
        },
      },
      registry: createRegistry([
        Bold,
        CodeToken,
        CodeBlock,
        Quill.import('formats/code-block-container'),
      ]),
    });

    // Trigger container mounting to create selector
    quill.updateContents(quill.getContents().insert('\n'));
    await sleep(HIGHLIGHT_INTERVAL + 1);

    // Verify all created elements have correct document context
    const selector = shadowContainer.querySelector('select.ql-ui');
    expect(selector?.ownerDocument).toBe(document);

    const options = shadowContainer.querySelectorAll('option');
    options.forEach((option) => {
      expect(option.ownerDocument).toBe(document);
    });

    // Verify highlighting container elements
    const tokens = shadowContainer.querySelectorAll('.ql-token');
    tokens.forEach((token) => {
      expect(token.ownerDocument).toBe(document);
    });
  });

  test('Tokens do not escape code blocks in shadow DOM', async () => {
    const quill = createShadowQuill();

    // Delete the second line of code (moving text outside code block)
    quill.deleteText(22, 6);
    await sleep(HIGHLIGHT_INTERVAL + 1);

    // Verify tokens don't escape to regular paragraph
    expect(quill.root).toEqualHTML(
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> test = <span class="ql-token hljs-number">1</span>;</div>
      </div>
      <p>var bugz</p>`,
    );

    // Verify the escaped text has no highlighting tokens
    const paragraph = shadowRoot.querySelector('p');
    const tokensInParagraph = paragraph?.querySelectorAll('.ql-token');
    expect(tokensInParagraph?.length).toBe(0);
  });
});
