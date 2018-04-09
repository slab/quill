import hljs from 'highlight.js';
import Delta from 'quill-delta';
import Quill from '../../../core/quill';
import CodeBlock, { CodeBlockContainer } from '../../../formats/code';
import Syntax from '../../../modules/syntax';

const HIGHLIGHT_INTERVAL = 10;

describe('Syntax', function() {
  beforeEach(function() {
    const container = this.initialize(
      HTMLElement,
      `<pre data-language="javascript">var test = 1;<br>var bugz = 0;<br></pre>
      <p><br></p>`,
    );
    Syntax.register();
    Syntax.DEFAULTS.languages = [
      { key: 'javascript', label: 'Javascript' },
      { key: 'ruby', label: 'Ruby' },
    ];
    this.quill = new Quill(container, {
      modules: {
        syntax: {
          hljs,
          interval: HIGHLIGHT_INTERVAL,
        },
      },
    });
  });

  afterEach(function() {
    Quill.register(CodeBlock, true);
    Quill.register(CodeBlockContainer, true);
  });

  describe('highlighting', function() {
    it('initialize', function() {
      expect(this.quill.root).toEqualHTML(
        `<div class="ql-code-block-container" spellcheck="false">
          <select contenteditable="false">
            <option value="javascript">Javascript</option>
            <option value="ruby">Ruby</option>
          </select>
          <div class="ql-code-block" data-language="javascript">var test = 1;</div>
          <div class="ql-code-block" data-language="javascript">var bugz = 0;</div>
        </div>
        <p><br></p>`,
      );
      expect(this.quill.getContents()).toEqual(
        new Delta()
          .insert('var test = 1;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('var bugz = 0;')
          .insert('\n', { 'code-block': 'javascript' })
          .insert('\n'),
      );
    });

    it('adds token', function(done) {
      setTimeout(() => {
        expect(this.quill.root).toEqualHTML(
          `<div class="ql-code-block-container" spellcheck="false">
            <select contenteditable="false">
              <option value="javascript">Javascript</option>
              <option value="ruby">Ruby</option>
            </select>
            <div class="ql-code-block" data-language="javascript"><span class="hljs-keyword ql-token">var</span> test = <span class="hljs-number ql-token">1</span>;</div>
            <div class="ql-code-block" data-language="javascript"><span class="hljs-keyword ql-token">var</span> bugz = <span class="hljs-number ql-token">0</span>;</div>
          </div>
          <p><br></p>`,
        );
        expect(this.quill.getContents()).toEqual(
          new Delta()
            .insert('var test = 1;')
            .insert('\n', { 'code-block': 'javascript' })
            .insert('var bugz = 0;')
            .insert('\n', { 'code-block': 'javascript' })
            .insert('\n'),
        );
        done();
      }, HIGHLIGHT_INTERVAL + 1);
    });

    it('tokens do not escape', function(done) {
      this.quill.deleteText(22, 6);
      setTimeout(() => {
        expect(this.quill.root).toEqualHTML(`
          <div class="ql-code-block-container" spellcheck="false">
            <select contenteditable="false">
              <option value="javascript">Javascript</option>
              <option value="ruby">Ruby</option>
            </select>
            <div class="ql-code-block" data-language="javascript"><span class="hljs-keyword ql-token">var</span> test = <span class="hljs-number ql-token">1</span>;</div>
          </div>
          <p>var bugz</p>`);
        expect(this.quill.getContents()).toEqual(
          new Delta()
            .insert('var test = 1;')
            .insert('\n', { 'code-block': 'javascript' })
            .insert('var bugz\n'),
        );
        done();
      }, HIGHLIGHT_INTERVAL + 1);
    });

    it('change language', function(done) {
      this.quill.formatLine(0, 20, 'code-block', 'ruby');
      setTimeout(() => {
        expect(this.quill.root).toEqualHTML(`
          <div class="ql-code-block-container" spellcheck="false">
            <select contenteditable="false">
              <option value="javascript">Javascript</option>
              <option value="ruby">Ruby</option>
            </select>
            <div class="ql-code-block" data-language="ruby">var test = <span class="hljs-number ql-token">1</span>;</div>
            <div class="ql-code-block" data-language="ruby">var bugz = <span class="hljs-number ql-token">0</span>;</div>
          </div>
          <p><br></p>`);
        expect(this.quill.getContents()).toEqual(
          new Delta()
            .insert('var test = 1;')
            .insert('\n', { 'code-block': 'ruby' })
            .insert('var bugz = 0;')
            .insert('\n', { 'code-block': 'ruby' })
            .insert('\n'),
        );
        done();
      }, HIGHLIGHT_INTERVAL + 1);
    });

    it('unformat first line', function(done) {
      this.quill.formatLine(0, 1, 'code-block', false);
      setTimeout(() => {
        expect(this.quill.root).toEqualHTML(`
          <p>var test = 1;</p>
          <div class="ql-code-block-container" spellcheck="false">
            <select contenteditable="false">
              <option value="javascript">Javascript</option>
              <option value="ruby">Ruby</option>
            </select>
            <div class="ql-code-block" data-language="javascript"><span class="hljs-keyword ql-token">var</span> bugz = <span class="hljs-number ql-token">0</span>;</div>
          </div>
          <p><br></p>`);
        expect(this.quill.getContents()).toEqual(
          new Delta()
            .insert('var test = 1;\nvar bugz = 0;')
            .insert('\n', { 'code-block': 'javascript' })
            .insert('\n'),
        );
        done();
      }, HIGHLIGHT_INTERVAL + 1);
    });

    it('split container', function(done) {
      this.quill.updateContents(new Delta().retain(14).insert('\n'));
      setTimeout(() => {
        expect(this.quill.root).toEqualHTML(`
          <div class="ql-code-block-container" spellcheck="false">
            <select contenteditable="false">
              <option value="javascript">Javascript</option>
              <option value="ruby">Ruby</option>
            </select>
            <div class="ql-code-block" data-language="javascript"><span class="hljs-keyword ql-token">var</span> test = <span class="hljs-number ql-token">1</span>;</div>
          </div>
          <p><br></p>
          <div class="ql-code-block-container" spellcheck="false">
            <select contenteditable="false">
              <option value="javascript">Javascript</option>
              <option value="ruby">Ruby</option>
            </select>
            <div class="ql-code-block" data-language="javascript"><span class="hljs-keyword ql-token">var</span> bugz = <span class="hljs-number ql-token">0</span>;</div>
          </div>
          <p><br></p>`);
        expect(this.quill.getContents()).toEqual(
          new Delta()
            .insert('var test = 1;')
            .insert('\n', { 'code-block': 'javascript' })
            .insert('\nvar bugz = 0;')
            .insert('\n', { 'code-block': 'javascript' })
            .insert('\n'),
        );
        done();
      }, HIGHLIGHT_INTERVAL + 1);
    });

    it('merge containers', function(done) {
      this.quill.updateContents(new Delta().retain(14).insert('\n'));
      setTimeout(() => {
        this.quill.deleteText(14, 1);
        setTimeout(() => {
          expect(this.quill.root).toEqualHTML(`
            <div class="ql-code-block-container" spellcheck="false">
              <select contenteditable="false">
                <option value="javascript">Javascript</option>
                <option value="ruby">Ruby</option>
              </select>
              <div class="ql-code-block" data-language="javascript"><span class="hljs-keyword ql-token">var</span> test = <span class="hljs-number ql-token">1</span>;</div>
              <div class="ql-code-block" data-language="javascript"><span class="hljs-keyword ql-token">var</span> bugz = <span class="hljs-number ql-token">0</span>;</div>
            </div>
            <p><br></p>`);
          expect(this.quill.getContents()).toEqual(
            new Delta()
              .insert('var test = 1;')
              .insert('\n', { 'code-block': 'javascript' })
              .insert('var bugz = 0;')
              .insert('\n', { 'code-block': 'javascript' })
              .insert('\n'),
          );
          done();
        }, HIGHLIGHT_INTERVAL + 1);
      }, HIGHLIGHT_INTERVAL + 1);
    });
  });
});
