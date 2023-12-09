import hljs from 'highlight.js';
import Delta from 'quill-delta';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import Quill from '../../../src/core';
import Bold from '../../../src/formats/bold';
import Syntax, { CodeBlock, CodeToken } from '../../../src/modules/syntax';
import { createRegistry } from '../__helpers__/factory';
import { normalizeHTML, sleep } from '../__helpers__/utils';

const HIGHLIGHT_INTERVAL = 10;

describe('Syntax', () => {
  beforeAll(() => {
    Quill.register({ 'modules/syntax': Syntax }, true);
    Syntax.register();
    Syntax.DEFAULTS.languages = [
      { key: 'javascript', label: 'JavaScript' },
      { key: 'ruby', label: 'Ruby' },
    ];
  });

  const createQuill = () => {
    const container = document.body.appendChild(document.createElement('div'));
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

  describe('highlighting', () => {
    test('initialize', () => {
      const quill = createQuill();
      expect(quill.root).toEqualHTML(
        `<div class="ql-code-block-container" spellcheck="false">
          <div class="ql-code-block" data-language="javascript">var test = 1;</div>
          <div class="ql-code-block" data-language="javascript">var bugz = 0;</div>
        </div>
        <p><br></p>`,
      );
      expect(quill.getContents()).toEqual(
        new Delta()
          .insert('var test = 1;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('var bugz = 0;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('\n'),
      );
    });

    test('adds token', async () => {
      const quill = createQuill();
      await sleep(HIGHLIGHT_INTERVAL + 1);
      expect(quill.root).toEqualHTML(
        `<div class="ql-code-block-container" spellcheck="false">
            <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> test = <span class="ql-token hljs-number">1</span>;</div>
            <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> bugz = <span class="ql-token hljs-number">0</span>;</div>
          </div>
          <p><br></p>`,
      );
      expect(quill.getContents()).toEqual(
        new Delta()
          .insert('var test = 1;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('var bugz = 0;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('\n'),
      );
    });

    test('tokens do not escape', async () => {
      const quill = createQuill();
      quill.deleteText(22, 6);
      await sleep(HIGHLIGHT_INTERVAL + 1);
      expect(quill.root).toEqualHTML(`
          <div class="ql-code-block-container" spellcheck="false">
            <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> test = <span class="ql-token hljs-number">1</span>;</div>
          </div>
          <p>var bugz</p>`);
      expect(quill.getContents()).toEqual(
        new Delta()
          .insert('var test = 1;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('var bugz\n'),
      );
    });

    test('change language', async () => {
      const quill = createQuill();
      quill.formatLine(0, 20, 'code-block', 'ruby');
      await sleep(HIGHLIGHT_INTERVAL + 1);
      expect(quill.root).toEqualHTML(`
          <div class="ql-code-block-container" spellcheck="false">
            <div class="ql-code-block" data-language="ruby">var test = <span class="ql-token hljs-number">1</span>;</div>
            <div class="ql-code-block" data-language="ruby">var bugz = <span class="ql-token hljs-number">0</span>;</div>
          </div>
          <p><br></p>`);
      expect(quill.getContents()).toEqual(
        new Delta()
          .insert('var test = 1;')
          .insert('\n', { 'code-block': 'ruby' })
          .insert('var bugz = 0;')
          .insert('\n', { 'code-block': 'ruby' })
          .insert('\n'),
      );
    });

    test('invalid language', async () => {
      const quill = createQuill();
      quill.formatLine(0, 20, 'code-block', 'invalid');
      await sleep(HIGHLIGHT_INTERVAL + 1);
      expect(quill.root).toEqualHTML(`
          <div class="ql-code-block-container" spellcheck="false">
            <div class="ql-code-block" data-language="plain">var test = 1;</div>
            <div class="ql-code-block" data-language="plain">var bugz = 0;</div>
          </div>
          <p><br></p>`);
      expect(quill.getContents()).toEqual(
        new Delta()
          .insert('var test = 1;')
          .insert('\n', { 'code-block': 'plain' })
          .insert('var bugz = 0;')
          .insert('\n', { 'code-block': 'plain' })
          .insert('\n'),
      );
    });

    test('unformat first line', async () => {
      const quill = createQuill();
      quill.formatLine(0, 1, 'code-block', false);
      await sleep(HIGHLIGHT_INTERVAL + 1);
      expect(quill.root).toEqualHTML(`
          <p>var test = 1;</p>
          <div class="ql-code-block-container" spellcheck="false">
            <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> bugz = <span class="ql-token hljs-number">0</span>;</div>
          </div>
          <p><br></p>`);
      expect(quill.getContents()).toEqual(
        new Delta()
          .insert('var test = 1;\nvar bugz = 0;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('\n'),
      );
    });

    test('split container', async () => {
      const quill = createQuill();
      quill.updateContents(new Delta().retain(14).insert('\n'));
      await sleep(HIGHLIGHT_INTERVAL + 1);
      expect(quill.root).toEqualHTML(
        `
          <div class="ql-code-block-container" spellcheck="false">
            <select class="ql-ui" contenteditable="false">
              <option value="javascript">JavaScript</option>
              <option value="ruby">Ruby</option>
            </select>
            <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> test = <span class="ql-token hljs-number">1</span>;</div>
          </div>
          <p><br></p>
          <div class="ql-code-block-container" spellcheck="false">
            <select class="ql-ui" contenteditable="false">
              <option value="javascript">JavaScript</option>
              <option value="ruby">Ruby</option>
            </select>
            <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> bugz = <span class="ql-token hljs-number">0</span>;</div>
          </div>
          <p><br></p>`,
      );
      expect(quill.getContents()).toEqual(
        new Delta()
          .insert('var test = 1;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('\nvar bugz = 0;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('\n'),
      );
    });

    test('merge containers', async () => {
      const quill = createQuill();
      quill.updateContents(new Delta().retain(14).insert('\n'));
      await sleep(HIGHLIGHT_INTERVAL + 1);
      quill.deleteText(14, 1);
      await sleep(HIGHLIGHT_INTERVAL + 1);
      expect(quill.root).toEqualHTML(
        `
            <div class="ql-code-block-container" spellcheck="false">
              <select class="ql-ui" contenteditable="false">
                <option value="javascript">JavaScript</option>
                <option value="ruby">Ruby</option>
              </select>
              <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> test = <span class="ql-token hljs-number">1</span>;</div>
              <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> bugz = <span class="ql-token hljs-number">0</span>;</div>
            </div>
            <p><br></p>`,
      );
      expect(quill.getContents()).toEqual(
        new Delta()
          .insert('var test = 1;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('var bugz = 0;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('\n'),
      );
    });

    describe('allowedChildren', () => {
      beforeAll(() => {
        CodeBlock.allowedChildren.push(Bold);
      });

      afterAll(() => {
        CodeBlock.allowedChildren.pop();
      });

      test('modification', async () => {
        const quill = createQuill();
        // @ts-expect-error
        quill.formatText(2, 3, 'bold', true);
        await sleep(HIGHLIGHT_INTERVAL + 1);
        expect(quill.root).toEqualHTML(`
          <div class="ql-code-block-container" spellcheck="false">
            <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">va</span><strong><span class="ql-token hljs-keyword">r</span> t</strong>est = <span class="ql-token hljs-number">1</span>;</div>
            <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">var</span> bugz = <span class="ql-token hljs-number">0</span>;</div>
          </div>
          <p><br></p>`);
        expect(quill.getContents()).toEqual(
          new Delta()
            .insert('va')
            .insert('r t', { bold: true })
            .insert('est = 1;')
            .insert('\n', { 'code-block': 'javascript' })
            .insert('var bugz = 0;')
            .insert('\n', { 'code-block': 'javascript' })
            .insert('\n'),
        );
      });

      test('removal', async () => {
        const quill = createQuill();
        // @ts-expect-error
        quill.formatText(2, 3, 'bold', true);
        await sleep(HIGHLIGHT_INTERVAL + 1);
        quill.formatLine(0, 15, 'code-block', false);
        expect(quill.root).toEqualHTML(
          `<p>va<strong>r t</strong>est = 1;</p><p>var bugz = 0;</p><p><br></p>`,
        );
        expect(quill.getContents()).toEqual(
          new Delta()
            .insert('va')
            .insert('r t', { bold: true })
            .insert('est = 1;\nvar bugz = 0;\n\n'),
        );
      });

      test('addition', async () => {
        const quill = createQuill();
        quill.setText('var test = 1;\n');
        // @ts-expect-error
        quill.formatText(2, 3, 'bold', true);
        quill.formatLine(0, 1, 'code-block', 'javascript');
        await sleep(HIGHLIGHT_INTERVAL + 1);
        expect(quill.root).toEqualHTML(`
            <div class="ql-code-block-container" spellcheck="false">
            <div class="ql-code-block" data-language="javascript"><span class="ql-token hljs-keyword">va</span><strong><span class="ql-token hljs-keyword">r</span> t</strong>est = <span class="ql-token hljs-number">1</span>;</div>
          </div>`);
        expect(quill.getContents()).toEqual(
          new Delta()
            .insert('va')
            .insert('r t', { bold: true })
            .insert('est = 1;')
            .insert('\n', { 'code-block': 'javascript' }),
        );
      });
    });
  });

  describe('html', () => {
    test('code language', () => {
      const quill = createQuill();
      expect(quill.getSemanticHTML()).toContain('data-language="javascript"');
    });
  });
});
