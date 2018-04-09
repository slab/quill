import hljs from 'highlight.js';
import Delta from 'quill-delta';
import Quill from '../../../core/quill';
import CodeBlock, { CodeBlockContainer } from '../../../formats/code';
import Syntax from '../../../modules/syntax';

const HIGHLIGHT_INTERVAL = 10;

fdescribe('Syntax', function() {
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
      setTimeout(() => {
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
      }, HIGHLIGHT_INTERVAL + 1);
    });
  });
});
