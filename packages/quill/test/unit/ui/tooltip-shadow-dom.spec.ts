import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';
import { sleep } from '../__helpers__/utils.js';

describe('Tooltip Shadow DOM Integration', () => {
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

  test('Tooltip initializes correctly in regular DOM', () => {
    const quill = new Quill(container, {
      theme: 'snow',
    });

    // Verify we're in regular DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(false);
    expect(quill.domRoot.getRoot()).toBe(document);

    // Verify tooltip exists
    const tooltip = container.querySelector('.ql-tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList.contains('ql-hidden')).toBe(true);
  });

  test('Tooltip initializes correctly in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
    });

    // Verify we're in shadow DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(true);
    expect(quill.domRoot.getRoot()).toBe(shadowRoot);

    // Verify tooltip exists within shadow DOM
    const tooltip = shadowRoot.querySelector('.ql-tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList.contains('ql-hidden')).toBe(true);
  });

  test('Tooltip positioning works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
    });

    // Insert a link to trigger tooltip
    quill.setText('Click this link to edit');
    quill.formatText(11, 4, 'link', 'https://example.com');

    // Get the link and simulate selection
    const link = shadowRoot.querySelector('.ql-editor a') as HTMLAnchorElement;
    expect(link).toBeTruthy();

    // Select the link text
    quill.setSelection(11, 4);

    // Trigger link editing
    const linkButton = shadowRoot.querySelector(
      '.ql-link',
    ) as HTMLButtonElement;
    if (linkButton) {
      linkButton.click();
      await sleep(10);
    }

    const tooltip = shadowRoot.querySelector('.ql-tooltip');
    expect(tooltip).toBeTruthy();

    // Check if tooltip has positioning styles
    const tooltipEl = tooltip as HTMLElement;
    if (tooltipEl.classList.contains('ql-editing')) {
      // Tooltip should be positioned
      expect(tooltipEl.style.left).toBeTruthy();
      expect(tooltipEl.style.top).toBeTruthy();
    }
  });

  test('Tooltip bounds container is correct in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
    });

    // Access the tooltip instance through the theme
    const theme = quill.theme as any;
    if (theme.tooltip) {
      // In shadow DOM, bounds container should be the shadow host
      expect(theme.tooltip.boundsContainer).toBe(shadowHost);
    }
  });

  test('Tooltip link editing works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: ['link'],
      },
    });

    // Insert some text
    quill.setText('Edit this text');
    quill.setSelection(5, 4); // Select "this"

    // Click link button to show tooltip
    const linkButton = shadowRoot.querySelector(
      '.ql-link',
    ) as HTMLButtonElement;
    expect(linkButton).toBeTruthy();
    linkButton.click();
    await sleep(10);

    // Verify tooltip is in editing mode
    const tooltip = shadowRoot.querySelector('.ql-tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.classList.contains('ql-editing')).toBe(true);

    // Verify text input exists
    const textInput = tooltip?.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement;
    expect(textInput).toBeTruthy();
    expect(textInput?.getAttribute('data-link')).toBe('https://quilljs.com');
  });

  test('Tooltip save functionality works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: ['link'],
      },
    });

    // Insert some text
    quill.setText('Make this a link');
    quill.setSelection(5, 4); // Select "this"

    // Open link editor
    const linkButton = shadowRoot.querySelector(
      '.ql-link',
    ) as HTMLButtonElement;
    linkButton.click();
    await sleep(10);

    // Get the input and set a value
    const textInput = shadowRoot.querySelector(
      '.ql-tooltip input[type="text"]',
    ) as HTMLInputElement;
    expect(textInput).toBeTruthy();

    textInput.value = 'https://example.com';

    // Simulate Enter key to save
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    textInput.dispatchEvent(enterEvent);
    await sleep(10);

    // Verify link was applied
    const delta = quill.getContents();
    const linkOp = delta.ops.find((op) => op.attributes?.link);
    expect(linkOp).toBeTruthy();
    expect(linkOp?.attributes?.link).toBe('https://example.com');
  });

  test('Tooltip cancel functionality works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: ['link'],
      },
    });

    // Insert some text
    quill.setText('Cancel link edit');
    quill.setSelection(7, 4); // Select "link"

    // Open link editor
    const linkButton = shadowRoot.querySelector(
      '.ql-link',
    ) as HTMLButtonElement;
    linkButton.click();
    await sleep(10);

    // Verify tooltip is visible
    const tooltip = shadowRoot.querySelector('.ql-tooltip');
    expect(tooltip?.classList.contains('ql-editing')).toBe(true);

    // Get the input and trigger Escape
    const textInput = shadowRoot.querySelector(
      '.ql-tooltip input[type="text"]',
    ) as HTMLInputElement;
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    textInput.dispatchEvent(escapeEvent);
    await sleep(10);

    // Verify tooltip is hidden
    expect(tooltip?.classList.contains('ql-hidden')).toBe(true);
  });

  test('Tooltip preview functionality works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
    });

    // Insert a link
    quill.setText('Visit Quill website');
    quill.formatText(6, 5, 'link', 'https://quilljs.com');

    // Find the link
    const link = shadowRoot.querySelector('.ql-editor a') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.href).toBe('https://quilljs.com/');

    // Verify link preview element exists
    const tooltip = shadowRoot.querySelector('.ql-tooltip');
    const preview = tooltip?.querySelector('.ql-preview');
    expect(preview).toBeTruthy();
    expect(preview?.getAttribute('href')).toBe('about:blank');
  });

  test('Tooltip action buttons work in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
    });

    // Insert a link
    quill.setText('Edit or remove this link');
    quill.formatText(15, 4, 'link', 'https://example.com');

    // Select the link
    quill.setSelection(15, 4);

    // Verify action buttons exist
    const tooltip = shadowRoot.querySelector('.ql-tooltip');
    const editAction = tooltip?.querySelector('.ql-action');
    const removeAction = tooltip?.querySelector('.ql-remove');

    expect(editAction).toBeTruthy();
    expect(removeAction).toBeTruthy();
  });

  test('Multiple Quill instances with tooltips work independently', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    const regularQuill = new Quill(container, {
      theme: 'snow',
      modules: {
        toolbar: ['link'],
      },
    });

    const shadowQuill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: ['link'],
      },
    });

    // Verify different contexts
    expect(regularQuill.domRoot.isInShadowDOM()).toBe(false);
    expect(shadowQuill.domRoot.isInShadowDOM()).toBe(true);

    // Verify independent tooltips
    const regularTooltip = container.querySelector('.ql-tooltip');
    const shadowTooltip = shadowRoot.querySelector('.ql-tooltip');

    expect(regularTooltip).toBeTruthy();
    expect(shadowTooltip).toBeTruthy();

    // Open link editor in regular instance
    regularQuill.setText('Regular link');
    regularQuill.setSelection(0, 7);
    const regularLinkBtn = container.parentElement?.querySelector(
      '.ql-link',
    ) as HTMLButtonElement;
    regularLinkBtn?.click();
    await sleep(10);

    // Open link editor in shadow instance
    shadowQuill.setText('Shadow link');
    shadowQuill.setSelection(0, 6);
    const shadowLinkBtn = shadowRoot.querySelector(
      '.ql-link',
    ) as HTMLButtonElement;
    shadowLinkBtn?.click();
    await sleep(10);

    // Both should be in editing mode independently
    expect(regularTooltip?.classList.contains('ql-editing')).toBe(true);
    expect(shadowTooltip?.classList.contains('ql-editing')).toBe(true);
  });

  test('Tooltip scrolling behavior works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    // Make container scrollable
    shadowContainer.style.height = '100px';
    shadowContainer.style.overflow = 'auto';

    const quill = new Quill(shadowContainer, {
      theme: 'snow',
    });

    // Add enough content to make it scrollable
    const longText = 'Line\n'.repeat(20);
    quill.setText(longText);

    // Verify tooltip margin adjustment on scroll
    const tooltip = shadowRoot.querySelector('.ql-tooltip') as HTMLElement;
    expect(tooltip).toBeTruthy();

    // Simulate scroll
    shadowContainer.scrollTop = 50;
    shadowContainer.dispatchEvent(new Event('scroll'));
    await sleep(10);

    // For scrollable containers, tooltip should adjust margin
    // Note: The actual implementation only adjusts if quill.root is scrollable
    const editorEl = shadowRoot.querySelector('.ql-editor') as HTMLElement;
    if (getComputedStyle(editorEl).overflowY !== 'visible') {
      expect(tooltip.style.marginTop).toBeTruthy();
    }
  });

  test('Tooltip element creation uses correct document context', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
    });

    // Ensure quill context is available
    expect(quill).toBeTruthy();

    // Verify tooltip elements have correct document context
    const tooltip = shadowRoot.querySelector('.ql-tooltip');
    const preview = tooltip?.querySelector('.ql-preview');
    const textInput = tooltip?.querySelector('input[type="text"]');
    const actionBtn = tooltip?.querySelector('.ql-action');
    const removeBtn = tooltip?.querySelector('.ql-remove');

    expect(tooltip?.ownerDocument).toBe(document);
    expect(preview?.ownerDocument).toBe(document);
    expect(textInput?.ownerDocument).toBe(document);
    expect(actionBtn?.ownerDocument).toBe(document);
    expect(removeBtn?.ownerDocument).toBe(document);

    // All should exist within shadow root
    expect(shadowRoot.contains(tooltip)).toBe(true);
  });
});
