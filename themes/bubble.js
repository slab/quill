import Emitter from '../core/emitter';
import Keyboard from '../modules/keyboard';
import BaseTheme from './base';
import icons from '../ui/icons';
import { Range } from '../core/selection';
import Tooltip from '../ui/tooltip';


class BubbleTheme extends BaseTheme {
  constructor(quill, options) {
    super(quill, options);
    this.quill.container.classList.add('ql-bubble');
  }

  buildLinkEditor(toolbar) {
    let container = document.createElement('div');
    container.classList.add('ql-link-editor');
    let arrow = document.createElement('span');
    arrow.classList.add('ql-tooltip-arrow');
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    let close = document.createElement('a');
    container.appendChild(input);
    container.appendChild(close);
    this.tooltip.root.appendChild(arrow);
    this.tooltip.root.appendChild(container);
    this.quill.on(Emitter.events.SELECTION_CHANGE, (range) => {
      if (range != null && range.length > 0) {
        this.tooltip.root.classList.remove('ql-editing');
        this.tooltip.show();
        // Lock our width so we will expand beyond our offsetParent boundaries
        this.tooltip.root.style.left = '0px';
        this.tooltip.root.style.width = '';
        this.tooltip.root.style.width = this.tooltip.root.offsetWidth + 'px';
        let lines = this.quill.scroll.lines(range.index, range.length);
        if (lines.length === 1) {
          this.tooltip.position(this.quill.getBounds(range));
        } else {
          let lastLine = lines[lines.length - 1];
          let index = lastLine.offset(this.quill.scroll);
          let length = Math.min(lastLine.length() - 1, range.index + range.length - index);
          let bounds = this.quill.getBounds(new Range(index, length));
          this.tooltip.position(bounds);
        }
      } else if (document.activeElement !== input && !!this.quill.hasFocus()) {
        this.tooltip.hide();
      }
    });
    this.quill.on(Emitter.events.SCROLL_OPTIMIZE, () => {
      // Let selection be restored by toolbar handlers before repositioning
      setTimeout(() => {
        if (this.tooltip.root.classList.contains('ql-hidden')) return;
        let range = this.quill.getSelection();
        this.tooltip.position(this.quill.getBounds(range));
      }, 1);
    });
    toolbar.handlers['link'] = (value) => {
      if (!value) {
        this.quill.format('link', false);
      } else {
        this.tooltip.root.classList.add('ql-editing');
        input.focus();
      }
    };
    ['mousedown', 'touchstart'].forEach((name) => {
      close.addEventListener(name, (event) => {
        this.tooltip.root.classList.remove('ql-editing');
        event.preventDefault();
      });
    });
    input.addEventListener('keydown', (event) => {
      if (Keyboard.match(event, 'enter')) {
        let scrollTop = this.quill.root.scrollTop;
        this.quill.focus();
        this.quill.root.scrollTop = scrollTop;
        this.quill.format('link', input.value);
        this.tooltip.hide();
        input.value = '';
        event.preventDefault();
      } else if (Keyboard.match(event, 'escape')) {
        this.tooltip.classList.remove('ql-editing');
        event.preventDefault();
      }
    });
  }

  extendToolbar(toolbar) {
    let container = this.quill.addContainer('ql-tooltip', this.quill.root);
    this.tooltip = new Tooltip(container, {
      bounds: this.options.bounds,
      scroll: this.quill.root
    });
    this.buildLinkEditor(toolbar);
    container.appendChild(toolbar.container);
    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')));
    this.tooltip.hide();
  }
}
BubbleTheme.DEFAULTS = {
  modules: {
    toolbar: {
      container: [
        ['bold', 'italic', 'link'],
        [{ header: 1 }, { header: 2 }, 'blockquote']
      ]
    }
  }
}


export default BubbleTheme;
