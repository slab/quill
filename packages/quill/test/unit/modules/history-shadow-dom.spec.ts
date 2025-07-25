import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';
import { sleep } from '../__helpers__/utils.js';

describe('History Module Shadow DOM Integration', () => {
  let container: HTMLElement;
  let shadowHost: HTMLElement;
  let shadowRoot: ShadowRoot;

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

  test('History module initializes correctly in regular DOM', () => {
    const quill = new Quill(container, {
      modules: {
        history: { delay: 0 },
      },
    });

    // Verify we're in regular DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(false);
    expect(quill.domRoot.getRoot()).toBe(document);

    // Verify history module exists and is properly initialized
    expect(quill.history).toBeDefined();
    expect(quill.history.stack).toBeDefined();
    expect(quill.history.stack.undo).toEqual([]);
    expect(quill.history.stack.redo).toEqual([]);
  });

  test('History module initializes correctly in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 0 },
      },
    });

    // Verify we're in shadow DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(true);
    expect(quill.domRoot.getRoot()).toBe(shadowRoot);

    // Verify history module exists and is properly initialized
    expect(quill.history).toBeDefined();
    expect(quill.history.stack).toBeDefined();
    expect(quill.history.stack.undo).toEqual([]);
    expect(quill.history.stack.redo).toEqual([]);
  });

  test('Undo/redo operations work in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 0 },
      },
    });

    // Set initial content
    quill.setContents([{ insert: 'Hello\n' }]);

    // Clear history stack after initial setup
    quill.history.clear();
    const originalContent = quill.getContents();

    // Make a change
    quill.insertText(5, ' World');
    const modifiedContent = quill.getContents();

    // Verify change was made
    expect(modifiedContent).not.toEqual(originalContent);
    expect(quill.getText()).toBe('Hello World\n');

    // Verify undo stack has one item
    expect(quill.history.stack.undo.length).toBe(1);
    expect(quill.history.stack.redo.length).toBe(0);

    // Test undo
    quill.history.undo();
    expect(quill.getContents()).toEqual(originalContent);
    expect(quill.getText()).toBe('Hello\n');

    // Verify stacks updated
    expect(quill.history.stack.undo.length).toBe(0);
    expect(quill.history.stack.redo.length).toBe(1);

    // Test redo
    quill.history.redo();
    expect(quill.getContents()).toEqual(modifiedContent);
    expect(quill.getText()).toBe('Hello World\n');

    // Verify stacks updated
    expect(quill.history.stack.undo.length).toBe(1);
    expect(quill.history.stack.redo.length).toBe(0);
  });

  test('Keyboard shortcuts work in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 0 },
      },
    });

    // Set initial content
    quill.setContents([{ insert: 'Test\n' }]);

    // Clear history stack after initial setup
    quill.history.clear();
    const originalContent = quill.getContents();

    // Make a change
    quill.insertText(4, ' Content');
    expect(quill.getText()).toBe('Test Content\n');

    // Verify undo keyboard binding exists
    const undoBindings = quill.keyboard.bindings['z'];
    expect(undoBindings).toBeDefined();
    expect(undoBindings.length).toBeGreaterThan(0);

    // Find the undo binding with shortKey (check for actual property name)
    const undoBinding = undoBindings.find((binding) => {
      // Check if this binding has the correct shortkey setup
      const shortKeyProp = /Mac/i.test(navigator.platform)
        ? 'metaKey'
        : 'ctrlKey';
      return binding[shortKeyProp] === true && !binding.shiftKey;
    });
    expect(undoBinding).toBeDefined();

    // Test programmatic undo (simulating keyboard shortcut)
    quill.history.undo();
    expect(quill.getContents()).toEqual(originalContent);
    expect(quill.getText()).toBe('Test\n');

    // Verify redo keyboard bindings exist (check for Z or y depending on platform)
    let redoBinding;
    if (/Win/i.test(navigator.platform)) {
      // Windows uses Ctrl+Y for redo
      const redoBindings = quill.keyboard.bindings['y'];
      if (redoBindings) {
        redoBinding = redoBindings.find((binding) => binding.ctrlKey === true);
      }
    } else {
      // Mac/Linux use Cmd/Ctrl+Shift+Z for redo
      const redoBindings =
        quill.keyboard.bindings['z'] || quill.keyboard.bindings['Z'];
      if (redoBindings) {
        const shortKeyProp = /Mac/i.test(navigator.platform)
          ? 'metaKey'
          : 'ctrlKey';
        redoBinding = redoBindings.find(
          (binding) =>
            binding[shortKeyProp] === true && binding.shiftKey === true,
        );
      }
    }
    expect(redoBinding).toBeDefined();

    // Test programmatic redo
    quill.history.redo();
    expect(quill.getText()).toBe('Test Content\n');
  });

  test('Multiple operations and undo/redo stack in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 400 },
      },
    });

    // Set initial content
    quill.setContents([{ insert: 'Start\n' }]);

    // Clear history stack after initial setup
    quill.history.clear();

    // Make first change
    quill.insertText(5, ' First');
    expect(quill.history.stack.undo.length).toBe(1);

    // Wait for delay to separate operations
    await sleep(500);

    // Make second change
    quill.insertText(11, ' Second');
    expect(quill.history.stack.undo.length).toBe(2);

    // Wait for delay to separate operations
    await sleep(500);

    // Make third change
    quill.insertText(18, ' Third');
    expect(quill.history.stack.undo.length).toBe(3);

    // Verify final content
    expect(quill.getText()).toBe('Start First Second Third\n');

    // Undo operations one by one
    quill.history.undo();
    expect(quill.getText()).toBe('Start First Second\n');
    expect(quill.history.stack.undo.length).toBe(2);
    expect(quill.history.stack.redo.length).toBe(1);

    quill.history.undo();
    expect(quill.getText()).toBe('Start First\n');
    expect(quill.history.stack.undo.length).toBe(1);
    expect(quill.history.stack.redo.length).toBe(2);

    quill.history.undo();
    expect(quill.getText()).toBe('Start\n');
    expect(quill.history.stack.undo.length).toBe(0);
    expect(quill.history.stack.redo.length).toBe(3);

    // Redo operations
    quill.history.redo();
    expect(quill.getText()).toBe('Start First\n');

    quill.history.redo();
    expect(quill.getText()).toBe('Start First Second\n');

    quill.history.redo();
    expect(quill.getText()).toBe('Start First Second Third\n');
  });

  test('Format changes work with history in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 0 },
      },
    });

    // Set initial content
    quill.setContents([{ insert: 'Bold text\n' }]);

    // Clear history stack after initial setup
    quill.history.clear();
    const originalContent = quill.getContents();

    // Apply bold formatting
    quill.formatText(0, 4, 'bold', true);

    // Verify formatting was applied
    const formattedContent = quill.getContents();
    expect(formattedContent.ops[0].attributes?.bold).toBe(true);
    expect(formattedContent).not.toEqual(originalContent);

    // Verify undo stack
    expect(quill.history.stack.undo.length).toBe(1);

    // Test undo
    quill.history.undo();
    expect(quill.getContents()).toEqual(originalContent);
    expect(quill.getContents().ops[0].attributes?.bold).toBeUndefined();

    // Test redo
    quill.history.redo();
    expect(quill.getContents()).toEqual(formattedContent);
    expect(quill.getContents().ops[0].attributes?.bold).toBe(true);
  });

  test('Embed operations work with history in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 0 },
      },
    });

    // Set initial content
    quill.setContents([{ insert: 'Image: \n' }]);

    // Clear history stack after initial setup
    quill.history.clear();
    const originalContent = quill.getContents();

    // Insert image embed
    quill.insertEmbed(7, 'image', 'https://example.com/test.jpg');

    // Verify embed was inserted
    const embedContent = quill.getContents();
    const hasImage = embedContent.ops.some(
      (op) =>
        typeof op.insert === 'object' &&
        op.insert?.image === 'https://example.com/test.jpg',
    );
    expect(hasImage).toBe(true);
    expect(embedContent).not.toEqual(originalContent);

    // Verify undo stack
    expect(quill.history.stack.undo.length).toBe(1);

    // Test undo
    quill.history.undo();
    expect(quill.getContents()).toEqual(originalContent);

    // Verify image is removed
    const imageElements = shadowContainer.querySelectorAll('img');
    expect(imageElements.length).toBe(0);

    // Test redo
    quill.history.redo();
    expect(quill.getContents()).toEqual(embedContent);

    // Verify image is restored
    const restoredImages = shadowContainer.querySelectorAll('img');
    expect(restoredImages.length).toBe(1);
    expect(restoredImages[0].getAttribute('src')).toBe(
      'https://example.com/test.jpg',
    );
  });

  test('History stack limits work in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 0, maxStack: 3 },
      },
    });

    // Set initial content
    quill.setContents([{ insert: 'Test\n' }]);

    // Make changes that exceed maxStack
    ['A', 'B', 'C', 'D', 'E'].forEach((letter, index) => {
      quill.insertText(4 + index, letter);
    });

    // Verify stack is limited to maxStack
    expect(quill.history.stack.undo.length).toBe(3);

    // Test that we can still undo the last 3 operations
    quill.history.undo(); // Remove E
    expect(quill.getText()).toBe('TestABCD\n');

    quill.history.undo(); // Remove D
    expect(quill.getText()).toBe('TestABC\n');

    quill.history.undo(); // Remove C
    expect(quill.getText()).toBe('TestAB\n');

    // Should not be able to undo further
    expect(quill.history.stack.undo.length).toBe(0);
  });

  test('User-only history mode works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 0, userOnly: true },
      },
    });

    // Set initial content
    quill.setContents([{ insert: 'Start\n' }]);

    // Make user change
    quill.insertText(5, ' USER', Quill.sources.USER);
    expect(quill.history.stack.undo.length).toBe(1);

    // Make API change (should not be recorded)
    quill.insertText(10, ' API', Quill.sources.API);
    expect(quill.history.stack.undo.length).toBe(1); // Should still be 1

    // Verify content
    expect(quill.getText()).toBe('Start USER API\n');

    // Undo should only remove USER change
    quill.history.undo();
    expect(quill.getText()).toBe('Start API\n');

    // Redo should restore USER change
    quill.history.redo();
    expect(quill.getText()).toBe('Start USER API\n');
  });

  test('Multiple Quill instances have independent history', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    const regularQuill = new Quill(container, {
      modules: {
        history: { delay: 0 },
      },
    });
    const shadowQuill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 0 },
      },
    });

    // Set different content in each
    regularQuill.setContents([{ insert: 'Regular\n' }]);
    shadowQuill.setContents([{ insert: 'Shadow\n' }]);

    // Clear history stacks after initial setup
    regularQuill.history.clear();
    shadowQuill.history.clear();

    // Make changes
    regularQuill.insertText(7, ' Content');
    shadowQuill.insertText(6, ' Content');

    // Verify independent history stacks
    expect(regularQuill.history.stack.undo.length).toBe(1);
    expect(shadowQuill.history.stack.undo.length).toBe(1);

    // Verify different contexts
    expect(regularQuill.domRoot.isInShadowDOM()).toBe(false);
    expect(shadowQuill.domRoot.isInShadowDOM()).toBe(true);

    // Test independent undo operations
    regularQuill.history.undo();
    expect(regularQuill.getText()).toBe('Regular\n');
    expect(shadowQuill.getText()).toBe('Shadow Content\n'); // Unchanged

    shadowQuill.history.undo();
    expect(regularQuill.getText()).toBe('Regular\n'); // Still unchanged
    expect(shadowQuill.getText()).toBe('Shadow\n');
  });

  test('History works with Delta transformations in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 0, userOnly: true },
      },
    });

    // Set initial content
    quill.setContents([{ insert: 'Test\n' }]);

    // Make user change
    quill.insertText(0, 'A', Quill.sources.USER);
    expect(quill.getText()).toBe('ATest\n');

    // Make API change that transforms the position
    quill.insertText(0, 'B', Quill.sources.API);
    expect(quill.getText()).toBe('BATest\n');

    // Undo should correctly handle transformed position
    quill.history.undo();
    expect(quill.getText()).toBe('BTest\n');

    // Redo should also handle transformed position
    quill.history.redo();
    expect(quill.getText()).toBe('BATest\n');
  });

  test('Selection is restored correctly after undo/redo in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 0 },
      },
    });

    // Set initial content and selection
    quill.setContents([{ insert: 'Hello World\n' }]);
    quill.setSelection(6, 5); // Select "World"

    // Apply formatting
    quill.formatText(6, 5, 'bold', true);

    // Verify formatting was applied
    const range = quill.getSelection();
    expect(range?.index).toBe(6);
    expect(range?.length).toBe(5);

    // Undo formatting
    quill.history.undo();

    // Verify selection is restored
    const restoredRange = quill.getSelection();
    expect(restoredRange?.index).toBe(6);
    expect(restoredRange?.length).toBe(5);

    // Verify formatting is removed
    const format = quill.getFormat();
    expect(format.bold).toBeUndefined();
  });

  test('beforeinput event handlers work in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      modules: {
        history: { delay: 0 },
      },
    });

    // Set initial content
    quill.setContents([{ insert: 'Test\n' }]);

    // Clear history stack after initial setup
    quill.history.clear();

    // Make a change
    quill.insertText(4, ' Content');
    expect(quill.history.stack.undo.length).toBe(1);

    // Create beforeinput event for undo
    const undoEvent = new InputEvent('beforeinput', {
      inputType: 'historyUndo',
      cancelable: true,
    });

    // Dispatch to editor root
    quill.root.dispatchEvent(undoEvent);

    // Verify event was prevented and undo occurred
    expect(undoEvent.defaultPrevented).toBe(true);
    expect(quill.getText()).toBe('Test\n');

    // Test redo event
    const redoEvent = new InputEvent('beforeinput', {
      inputType: 'historyRedo',
      cancelable: true,
    });

    quill.root.dispatchEvent(redoEvent);

    // Verify event was prevented and redo occurred
    expect(redoEvent.defaultPrevented).toBe(true);
    expect(quill.getText()).toBe('Test Content\n');
  });
});
