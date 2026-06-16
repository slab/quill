import { merge } from 'lodash-es';
import Emitter from '../core/emitter.js';
import BaseTheme, { BaseTooltip } from './base.js';
import LinkBlot from '../formats/link.js';
import { Range } from '../core/selection.js';
import icons from '../ui/icons.js';
import Quill from '../core/quill.js';
const TOOLBAR_CONFIG = [[{
  header: ['1', '2', '3', false]
}], ['bold', 'italic', 'underline', 'link'], [{
  list: 'ordered'
}, {
  list: 'bullet'
}], ['clean']];
class SnowTooltip extends BaseTooltip {
  static TEMPLATE = ['<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>', '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">', '<a class="ql-action"></a>', '<a class="ql-remove"></a>'].join('');
  preview = this.root.querySelector('a.ql-preview');
  listen() {
    super.listen();
    // @ts-expect-error Fix me later
    this.root.querySelector('a.ql-action').addEventListener('click', event => {
      if (this.root.classList.contains('ql-editing')) {
        this.save();
      } else {
        // @ts-expect-error Fix me later
        this.edit('link', this.preview.textContent);
      }
      event.preventDefault();
    });
    // @ts-expect-error Fix me later
    this.root.querySelector('a.ql-remove').addEventListener('click', event => {
      if (this.linkRange != null) {
        const range = this.linkRange;
        this.restoreFocus();
        this.quill.formatText(range, 'link', false, Emitter.sources.USER);
        delete this.linkRange;
      }
      event.preventDefault();
      this.hide();
    });
    this.quill.on(Emitter.events.SELECTION_CHANGE, (range, oldRange, source) => {
      if (range == null) return;
      if (range.length === 0 && source === Emitter.sources.USER) {
        const [link, offset] = this.quill.scroll.descendant(LinkBlot, range.index);
        if (link != null) {
          this.linkRange = new Range(range.index - offset, link.length());
          const preview = LinkBlot.formats(link.domNode);
          // @ts-expect-error Fix me later
          this.preview.textContent = preview;
          // @ts-expect-error Fix me later
          this.preview.setAttribute('href', preview);
          this.show();
          const bounds = this.quill.getBounds(this.linkRange);
          if (bounds != null) {
            this.position(bounds);
          }
          return;
        }
      } else {
        delete this.linkRange;
      }
      this.hide();
    });
  }
  show() {
    super.show();
    this.root.removeAttribute('data-mode');
  }
}
class SnowTheme extends BaseTheme {
  constructor(quill, options) {
    if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    super(quill, options);
    this.quill.container.classList.add('ql-snow');
  }
  extendToolbar(toolbar) {
    if (toolbar.container != null) {
      toolbar.container.classList.add('ql-snow');
      this.buildButtons(toolbar.container.querySelectorAll('button'), icons);
      this.buildPickers(toolbar.container.querySelectorAll('select'), icons);
      // @ts-expect-error
      this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
      if (toolbar.container.querySelector('.ql-link')) {
        this.quill.keyboard.addBinding({
          key: 'k',
          shortKey: true
        }, (_range, context) => {
          toolbar.handlers.link.call(toolbar, !context.format.link);
        });
      }
    }
  }
}
SnowTheme.DEFAULTS = merge({}, BaseTheme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(value) {
          if (value) {
            const range = this.quill.getSelection();
            if (range == null || range.length === 0) return;
            let preview = this.quill.getText(range);
            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
              preview = `mailto:${preview}`;
            }
            // @ts-expect-error
            const {
              tooltip
            } = this.quill.theme;
            tooltip.edit('link', preview);
          } else {
            this.quill.format('link', false, Quill.sources.USER);
          }
        }
      }
    }
  }
});
export default SnowTheme;
//# sourceMappingURL=snow.js.map