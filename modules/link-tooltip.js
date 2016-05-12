import Quill from '../core/quill';
import Module from '../core/module';
import { Range } from '../core/selection';
import LinkBlot from '../formats/link';
import Keyboard from './keyboard';
import Tooltip from '../ui/tooltip';


class LinkTooltip extends Module {
  constructor(quill, options = {}) {
    super(quill, options);
    this.container = this.quill.addContainer('ql-link-tooltip');
    this.container.innerHTML = this.options.template;
    this.tooltip = new Tooltip(this.container, {
      bounds: quill.theme.options.bounds,
      scroll: quill.root
    });
    this.hide();
    this.preview = this.container.querySelector('a.ql-preview');
    this.textbox = this.container.querySelector('input[type=text]');
    this.textbox.addEventListener('keydown', (evt) => {
      if (Keyboard.match(evt, 'enter')) {
        this.save();
        evt.preventDefault();
      } else if (Keyboard.match(evt, 'escape')) {
        this.hide();
        evt.preventDefault();
      }
    });
    this.container.querySelector('a.ql-action').addEventListener('click', () => {
      if (this.container.classList.contains('ql-editing')) {
        this.save();
      } else {
        this.edit();
      }
    });
    this.container.querySelector('a.ql-remove').addEventListener('click', this.remove.bind(this));
    // quill.keyboard.addBinding({ key: 'K', metaKey: true }, this.show.bind(this));
    quill.on(Quill.events.SELECTION_CHANGE, (range) => {
      if (range != null && range.length === 0) {
        let offset;
        [this.link, offset] = this.quill.scroll.descendant(LinkBlot, range.index);
        if (this.link != null) {
          this.range = new Range(range.index - offset, this.link.length());
          return this.show();
        }
      }
      this.hide();
    });
  }

  edit() {
    this.container.classList.add('ql-editing');
    this.textbox.focus();
    this.textbox.setSelectionRange(0, this.textbox.value.length);
  }

  open() {
    this.range = new Range(this.quill.selection.savedRange.index, this.quill.selection.savedRange.length);
    this.show();
    this.edit();
  }

  hide() {
    this.range = this.link = null;
    this.tooltip.hide();
  }

  remove() {
    this.quill.formatText(this.range, 'link', false, Quill.sources.USER);
    this.quill.setSelection(this.range, Quill.sources.SILENT);
    this.hide();
  }

  save() {
    let url = this.textbox.value;
    this.quill.formatText(this.range, 'link', url, Quill.sources.USER);
    this.quill.setSelection(this.range, Quill.sources.SILENT);
    this.hide();
  }

  show() {
    this.container.classList.remove('ql-editing');
    this.tooltip.show();
    let preview, bounds;
    let range = this.quill.selection.savedRange;
    if (this.link != null) {
      preview = this.link.formats()['link'];
    } else {
      preview = this.quill.getText(range);
      if (/^\S+@\S+\.\S+$/.test(preview)) {
        preview = 'mailto:' + preview;
      }
    }
    this.preview.textContent = this.textbox.value = preview;
    this.preview.setAttribute('href', preview);
    this.tooltip.position(this.quill.getBounds(this.range), this.options.offset);
  }
}
LinkTooltip.DEFAULTS = {
  offset: 10,
  template: [
    '<a class="ql-preview" target="_blank" href="about:blank"></a>',
    '<input type="text">',
    '<a class="ql-action"></a>',
    '<a class="ql-remove"></a>'
  ].join('')
};


export default LinkTooltip;
