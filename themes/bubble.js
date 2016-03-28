import Emitter from 'quill/emitter';
import { bindKeys } from 'quill/modules/keyboard';
import BaseTheme from 'quill/themes/base';
import icons from 'quill/ui/icons';


class BubbleTheme extends BaseTheme {
  constructor(quill, options) {
    super(quill, options);
    this.quill.container.classList.add('ql-bubble');
  }

  buildLinkEditor(toolbar) {
    let container = document.createElement('div');
    container.classList.add('ql-link-editor');
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    let close = document.createElement('a');
    container.appendChild(input);
    container.appendChild(close);
    this.tooltip.appendChild(container);
    this.quill.on(Emitter.events.SELECTION_CHANGE, (range) => {
      if (range != null && range.length > 0) {
        this.tooltip.classList.remove('ql-editing');
        this.tooltip.classList.remove('ql-hidden');
        this.position(this.quill.getBounds(range));
      } else if (document.activeElement !== input) {
        this.tooltip.classList.add('ql-hidden');
      }
    });
    toolbar.handlers['link'] = (value) => {
      if (!value) return false;
      this.tooltip.classList.add('ql-editing');
      input.focus();
    };
    close.addEventListener('click', () => {
      this.tooltip.classList.remove('ql-editing');
    });
    bindKeys(input, {
      'enter': () => {
        this.quill.focus();
        this.quill.format('link', input.value);
        this.tooltip.classList.add('ql-hidden');
        input.value = '';
      },
      'escape': () => {
        this.tooltip.classList.remove('ql-editing');
      }
    });
  }

  extendToolbar(toolbar) {
    this.tooltip = this.quill.addContainer('ql-tooltip', this.quill.root);
    this.buildLinkEditor(toolbar);
    this.tooltip.appendChild(toolbar.container);
    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')));
    this.tooltip.classList.add('ql-hidden');
  }

  position(bounds) {
    this.tooltip.style.left = (bounds.left + bounds.width/2 - this.tooltip.offsetWidth/2) + 'px';
    this.tooltip.style.top = (bounds.bottom + 10) + 'px';
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
