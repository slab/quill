import Emitter from '../core/emitter';
import BaseTheme from './base';
import LinkBlot from '../formats/link';
import Picker from '../ui/picker';
import { Range } from '../core/selection';
import Tooltip from '../ui/tooltip';


class SnowTheme extends BaseTheme {
  constructor(quill, options) {
    super(quill, options);
    this.quill.container.classList.add('ql-snow');
  }

  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-snow');
    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')));
    this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')));
    if (toolbar.container.querySelector('.ql-link')) {
      this.tooltip = new SnowTooltip(this.quill);
      this.quill.keyboard.addBinding({ key: 'K', shortKey: true }, function(range, context) {
        toolbar.handlers['link'].call(toolbar, !context.format.link);
      });
    }
  }
}
SnowTheme.DEFAULTS = {
  modules: {
    toolbar: {
      container: [
        [{ header: ['1', '2', '3', false] }],
        ['bold', 'italic', 'underline', 'link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean']
      ],
      handlers: {
        link: function(value) {
          if (value) {
            let savedRange = this.quill.selection.savedRange;
            this.quill.theme.tooltip.open(savedRange);
          } else {
            this.quill.format('link', false);
          }
        },
      }
    }
  }
}


class SnowTooltip extends Tooltip {
  constructor(quill, bounds) {
    super(quill, bounds);
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
    this.container.querySelector('a.ql-action').addEventListener('click', (event) => {
      if (this.container.classList.contains('ql-editing')) {
        this.save();
        event.preventDefault();
      } else {
        this.edit();
        event.preventDefault();
      }
    });
    this.container.querySelector('a.ql-remove').addEventListener('click', (event) => {
      this.remove();
      event.preventDefault();
    });
    quill.on(Emitter.events.SELECTION_CHANGE, (range) => {
      if (range == null) return;
      if (range.length === 0) {
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
    this.quill.formatText(this.range, 'link', false, Emitter.sources.USER);
    this.hide();
  }

  save() {
    let url = this.textbox.value;
    let scrollTop = this.quill.root.scrollTop;
    this.quill.formatText(this.range, 'link', url, Emitter.sources.USER);
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
SnowTooltip.TEMPLATE = [
  '<a class="ql-preview" target="_blank" href="about:blank"></a>',
  '<input type="text">',
  '<a class="ql-action"></a>',
  '<a class="ql-remove"></a>'
].join('');


export default SnowTheme;
