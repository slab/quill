import Emitter from '../core/emitter';
import Keyboard from '../modules/keyboard';
import BaseTheme from './base';
import icons from '../ui/icons';
import { Range } from '../core/selection';
import Tooltip from '../ui/tooltip';


class BubbleTooltip extends Tooltip {
  constructor(root, containers) {
    super(root, containers);
    this.root.innerHTML = [
      '<span class="ql-tooltip-arrow"></span>',
      '<div class="ql-link-editor">',
        '<input type="text">',
        '<a class="ql-close"></a>',
      '</div>'
    ].join('');
    this.input = this.root.querySelector('input');
    this.listen();
  }

  listen() {
    ['mousedown', 'touchstart'].forEach((name) => {
      this.root.querySelector('.ql-close').addEventListener(name, (event) => {
        this.root.classList.remove('ql-editing');
        event.preventDefault();
      });
    });
  }

  position(reference) {
    let shift = super.position(reference);
    if (shift === 0) return shift;
    let arrow = this.root.querySelector('.ql-tooltip-arrow');
    arrow.style.marginLeft = '';
    arrow.style.marginLeft = (-1*shift - arrow.offsetWidth/2) + 'px';
  }
}


class BubbleTheme extends BaseTheme {
  constructor(quill, options) {
    super(quill, options);
    this.quill.container.classList.add('ql-bubble');
  }

  buildLinkEditor(input) {
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
        if (range != null) {
          this.tooltip.position(this.quill.getBounds(range));
        }
      }, 1);
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
        this.tooltip.root.classList.remove('ql-editing');
        event.preventDefault();
      }
    });
  }

  extendToolbar(toolbar) {
    let container = this.quill.addContainer('ql-tooltip', this.quill.root);
    this.tooltip = new BubbleTooltip(container, {
      bounds: this.options.bounds,
      scroll: this.quill.root
    });
    this.buildLinkEditor(container.querySelector('input'));
    container.appendChild(toolbar.container);
    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')));
    this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')));
    this.tooltip.hide();
  }
}
BubbleTheme.DEFAULTS = {
  modules: {
    toolbar: {
      container: [
        ['bold', 'italic', 'link'],
        [{ header: 1 }, { header: 2 }, 'blockquote']
      ],
      handlers: {
        link: function(value) {
          if (!value) {
            this.quill.format('link', false);
          } else {
            let tooltip = this.quill.theme.tooltip;
            tooltip.root.classList.add('ql-editing');
            tooltip.input.focus();
          }
        }
      }
    }
  }
}


export default BubbleTheme;
