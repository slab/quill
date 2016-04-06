import Quill from 'quill/core';
import Module from 'quill/core/module';
import { Range } from 'quill/core/selection';
import LinkBlot from 'quill/formats/link';
import { bindKeys } from 'quill/modules/keyboard';


class LinkTooltip extends Module {
  constructor(quill, options = {}) {
    super(quill, options);
    this.container = this.quill.addContainer('ql-link-tooltip');
    this.container.classList.add('ql-tooltip');
    this.hide();
    this.container.innerHTML = this.options.template;
    this.preview = this.container.querySelector('a.ql-preview');
    this.textbox = this.container.querySelector('input[type=text]');
    bindKeys(this.textbox, {
      'enter': this.save.bind(this),
      'escape': this.hide.bind(this)
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
    this.container.classList.add('ql-hidden');
  }

  position(bounds) {
    this.container.style.left = (bounds.left + bounds.width/2 - this.container.offsetWidth/2) + 'px';
    this.container.style.top = (bounds.bottom + this.options.offset) + 'px';
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
    this.container.classList.remove('ql-hidden');
    let preview, bounds;
    let range = this.quill.selection.savedRange;
    if (this.link != null) {
      preview = this.link.formats()['link'];
    } else {
      preview = this.quill.getText(range);
    }
    this.preview.textContent = this.textbox.value = preview;
    this.preview.setAttribute('href', preview);
    this.position(this.quill.getBounds(this.range));
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
