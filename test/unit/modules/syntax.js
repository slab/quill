import hljs from 'highlight.js';
import Delta from 'quill-delta';
import Quill from '../../../core/quill';
import CodeBlock from '../../../formats/code';
import Syntax from '../../../modules/syntax';

const HIGHLIGHT_INTERVAL = 10;

describe('Syntax', function() {
  beforeEach(function() {
    const container = this.initialize(
      HTMLElement,
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">var test = 1;</div>
        <div class="ql-code-block">var bugz = 0;</div>
      </div>
      <p><br></p>`,
    );
    Syntax.register();
    this.quill = new Quill(container, {
      modules: {
        syntax: {
          highlight: (function() {
            return function(text) {
              const result = hljs.highlightAuto(text);
              return result.value;
            };
          })(),
          interval: HIGHLIGHT_INTERVAL,
        },
      },
    });
  });

  afterEach(function() {
    Quill.register(CodeBlock, true);
  });

  describe('highlighting', function() {
    it('adds token', function(done) {
      setTimeout(() => {
        expect(this.quill.root).toEqualHTML(
          `<div class="ql-code-block-container" spellcheck="false">
            <div class="ql-code-block"><span class="hljs-attribute ql-token">var test</span> = 1;</div>
            <div class="ql-code-block"><span class="hljs-attribute ql-token">var bugz</span> = 0;</div>
          </div>
          <p><br></p>`,
        );
        expect(this.quill.getContents()).toEqual(
          new Delta()
            .insert('var test = 1;')
            .insert('\n', { 'code-block': true })
            .insert('var bugz = 0;')
            .insert('\n', { 'code-block': true })
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
              <div class="ql-code-block"><span class="hljs-attribute ql-token">var test</span> = 1;</div>
            </div>
            <p>var bugz</p>`);
          expect(this.quill.getContents()).toEqual(
            new Delta()
              .insert('var test = 1;')
              .insert('\n', { 'code-block': true })
              .insert('var bugz\n'),
          );
          done();
        }, HIGHLIGHT_INTERVAL + 1);
      }, HIGHLIGHT_INTERVAL + 1);
    });
  });
});
