import extend from 'extend';
import Emitter from '../core/emitter';
import { bindKeys } from './keyboard';
import LinkBlot from '../formats/link';
import logger from '../core/logger';
import Module from '../core/module';
import { Range } from '../core/selection';
import Tooltip from '../ui/tooltip';


let debug = logger('[quill:link-toolitp]');

class LinkTooltip extends Module {
  constructor(quill, options = {}) {
    super(quill, options);
    this.container = this.quill.addContainer('ql-link-tooltip');
    this.tooltip = new Tooltip(this.container);
    this.container.innerHTML = this.options.template;
    this.preview = this.container.querySelector('a.ql-preview');
    this.textbox = this.container.querySelector('input[type=text]');
    bindKeys(this.textbox, {
      'enter': this.save.bind(this),
      'escape': this.tooltip.hide.bind(this.tooltip)
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
      if (range == null || range.length > 0) {
        this.hide();
      } else {
        [this.target, ] = this.quill.scroll.descendant(LinkBlot, range.index, true);
        this.show();
      }
    });
    quill.controls.link = (range, format, value) => {
      if (value === false) {
        // TODO handle highlight multiple links
        [this.target, ] = this.quill.scroll.descendant(LinkBlot, range.index, true);
        this.remove();
        this.quill.setSelection(range, Quill.events.SILENT);
      } else {
        this.target = range;
        this.show();
        this.edit();
      }
    };
  }

  edit() {
    this.container.classList.add('ql-editing');
    this.textbox.focus();
    this.textbox.setSelectionRange(0, this.textbox.value.length);
  }

  hide() {
    this.tooltip.hide();
    this.quill.focus();
  }

  remove() {
    if (this.target instanceof LinkBlot) {
      this.target.format(LinkBlot.blotName, null);
      this.quill.scroll.update();
    }
    this.tooltip.hide();
  }

  position() {
    // this.tooltip.style.left = (bounds.left + bounds.width/2 - this.tooltip.offsetWidth/2) + 'px';
    // this.tooltip.style.top = (bounds.bottom + 10) + 'px';
  }

  save() {
    let url = this.textbox.value;
    if (this.target instanceof LinkBlot) {
      target.format(LinkBlot.blotName, url);
    } else if (this.target instanceof Range) {
      this.quill.formatText(this.target, LinkBlot.blotName, url, Emitter.sources.USER);
      this.target = this.quill.scroll.descendant(LinkBlot, this.target.index + this.target.length, true);
    } else {
      debug.error('save can only be called with link or range');
    }
    this.preview.textContent = this.target.formats()[LinkBlot.blotName];
    this.show();
  }

  show() {
    if (this.target == null) return this.hide();
    this.container.classList.remove('ql-editing');
    let preview, bounds;
    if (this.target instanceof LinkBlot) {
      preview = this.target.domNode.getAttribute('href');
      bounds = this.target.domNode.getBoundingClientRect();
    } else if (this.target instanceof Range) {
      preview = this.quill.getText(this.target);
      bounds = this.quill.getBounds(this.target);
    } else {
      debug.error('show can only be called with link or range');
    }
    let [left, top] = this.tooltip.position(bounds, this.container, this.options.offset);
    this.preview.textContent = this.textbox.value = preview;
    this.tooltip.show(left, top);
  }
}
LinkTooltip.DEFAULTS = {
  offset: 10,
  template: [
    '<a class="ql-preview" target="_blank" href="about:blank"></a>',
    '<input type="text">',
    '<a class="ql-remove"></a>',
    '<a class="ql-action"></a>'
  ].join('')
};


export default LinkTooltip;
