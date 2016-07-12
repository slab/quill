import Quill from '../core/quill';
import { Range } from '../core/selection';
import Keyboard from '../modules/keyboard';
import LinkBlot from '../formats/link';
import Tooltip from './tooltip';


class LinkTooltip {
  constructor(quill) {
    this.quill = quill;
    this.container = this.quill.addContainer('ql-link-tooltip');
    this.container.innerHTML = this.constructor.TEMPLATE;
    this.tooltip = new Tooltip(this.container, {
      bounds: quill.theme.options.bounds,
      scroll: quill.root
    });
    this.hide();
    this.preview = this.container.querySelector('a.ql-preview');
    this.textbox = this.container.querySelector('input[type=text]');
    this.textbox.addEventListener('keydown', (event) => {
      if (Keyboard.match(event, 'enter')) {
        this.save();
        event.preventDefault();
      } else if (Keyboard.match(event, 'escape')) {
        this.hide();
        event.preventDefault();
      }
    });
    ['mousedown', 'touchstart'].forEach((name) => {
      this.container.querySelector('a.ql-action').addEventListener(name, (event) => {
        if (this.container.classList.contains('ql-editing')) {
          this.save();
          event.preventDefault();
        } else {
          this.edit();
          event.preventDefault();
        }
      });
      this.container.querySelector('a.ql-remove').addEventListener(name, (event) => {
        this.remove();
        event.preventDefault();
      });
    });
    quill.on(Quill.events.SELECTION_CHANGE, (range) => {
      if (range == null && document.activeElement == this.textbox) return;
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
    this.hide();
  }

  save() {
    let url = this.textbox.value;
    let scrollTop = this.quill.root.scrollTop;
    this.quill.formatText(this.range, 'link', url, Quill.sources.USER);
    this.quill.root.scrollTop = scrollTop;
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
    this.tooltip.position(this.quill.getBounds(this.range));
  }
}
LinkTooltip.TEMPLATE = [
  '<a class="ql-preview" target="_blank" href="about:blank"></a>',
  '<input type="text">',
  '<a class="ql-action"></a>',
  '<a class="ql-remove"></a>'
].join('');


export default LinkTooltip;
