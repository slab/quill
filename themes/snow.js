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
    this.tooltip = new SnowTooltip(this.quill, this.options.bounds);
    if (toolbar.container.querySelector('.ql-link')) {
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
        formula: function(value) {
          this.quill.theme.tooltip.edit('formula');
        },
        link: function(value) {
          if (value) {
            let range = this.quill.getSelection();
            if (range == null || range.length == 0) return;
            let preview = this.quill.getText(range);
            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
              preview = 'mailto:' + preview;
            }
            let tooltip = this.quill.theme.tooltip;
            tooltip.textbox.value = preview;
            tooltip.edit('link');
          } else {
            this.quill.format('link', false);
          }
        },
        video: function(value) {
          this.quill.theme.tooltip.edit('video');
        }
      }
    }
  }
}


class SnowTooltip extends Tooltip {
  constructor(quill, bounds) {
    super(quill, bounds);
    this.preview = this.root.querySelector('a.ql-preview');
  }

  listen() {
    super.listen();
    this.root.querySelector('a.ql-action').addEventListener('click', (event) => {
      if (this.root.classList.contains('ql-editing')) {
        this.save();
      } else {
        this.edit('link');
      }
    });
    this.root.querySelector('a.ql-remove').addEventListener('click', (event) => {
      this.hide();
      if (this.linkRange != null) {
        this.quill.focus();
        this.quill.formatText(this.linkRange, 'link', false, Emitter.sources.USER);
        delete this.linkRange;
      }
    });
    this.quill.on(Emitter.events.SELECTION_CHANGE, (range) => {
      if (range == null) return;
      if (range.length === 0) {
        let [link, offset] = this.quill.scroll.descendant(LinkBlot, range.index);
        if (link != null) {
          this.linkRange = new Range(range.index - offset, link.length());
          let preview = LinkBlot.formats(link.domNode);
          this.preview.textContent = preview;
          this.preview.setAttribute('href', preview);
          this.show();
          this.position(this.quill.getBounds(this.linkRange));
          return;
        }
      }
      this.hide();
    });
  }

  edit(mode) {
    super.edit();
    switch(mode) {
      case 'formula':
        if (mode != 'formula') this.textbox.value = '';
        this.textbox.setAttribute('placeholder', 'e = mc^2');
        break;
      case 'link':
        this.textbox.setAttribute('placeholder', '');
        this.textbox.setSelectionRange(0, this.textbox.value.length);
        break;
      case 'video':
        if (mode != 'video') this.textbox.value = '';
        this.textbox.setAttribute('placeholder', 'Video embed URL');
        break;
      default:
        return this.hide();
    }
    this.root.dataset.mode = mode;
    this.position(this.quill.getBounds(this.quill.selection.savedRange));
  }

  cancel() {
    this.hide();
  }

  save() {
    switch(this.root.dataset.mode) {
      case 'link':
        let url = this.textbox.value;
        let scrollTop = this.quill.root.scrollTop;
        if (this.linkRange) {
          this.quill.formatText(this.linkRange, 'link', url, Emitter.sources.USER);
          delete this.linkRange;
        } else {
          this.quill.focus();
          this.quill.format('link', url, Emitter.sources.USER);
        }
        this.quill.root.scrollTop = scrollTop;
        break;
      case 'formula':  // fallthrough
      case 'video':
        let range = this.quill.getSelection(true);
        let index = range.index + range.length;
        if (range != null) {
          this.quill.insertEmbed(index, this.root.dataset.mode, this.textbox.value, Emitter.sources.USER);
          if (this.root.dataset.mode === 'formula') {
            this.quill.insertText(index + 1, ' ', Emitter.sources.USER);
          }
          this.quill.setSelection(index + 2, Emitter.sources.USER);
        }
        break;
      default:
    }
    this.textbox.value = '';
    this.hide();
  }
}
SnowTooltip.TEMPLATE = [
  '<a class="ql-preview" target="_blank" href="about:blank"></a>',
  '<input type="text">',
  '<a class="ql-action"></a>',
  '<a class="ql-remove"></a>'
].join('');


export default SnowTheme;
