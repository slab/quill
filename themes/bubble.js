import Emitter from '../core/emitter';
import Keyboard from '../modules/keyboard';
import BaseTheme from './base';
import icons from '../ui/icons';


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
    this.tooltip.appendChild(arrow);
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
    input.addEventListener('keydown', (evt) => {
      if (Keyboard.match(evt, 'enter')) {
        this.quill.focus();
        this.quill.format('link', input.value);
        this.tooltip.classList.add('ql-hidden');
        input.value = '';
      } else if (Keyboard.match(evt, 'escape')) {
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

  position(reference) {
    let arrow = this.tooltip.querySelector('.ql-tooltip-arrow');
    let left = reference.left + reference.width/2 - this.tooltip.offsetWidth/2;
    let top = reference.bottom + 10;
    arrow.style.marginLeft = '';
    // Lock our width since we can expand beyond our offsetParent
    this.tooltip.style.left = '0px';
    this.tooltip.style.width = '';
    this.tooltip.style.width = this.tooltip.offsetWidth + 'px';
    this.tooltip.style.left = left + 'px';
    this.tooltip.style.top = top + 'px';
    let containerBounds = this.options.bounds.getBoundingClientRect();
    let tooltipBounds = this.tooltip.getBoundingClientRect();
    let shift = 0;
    if (tooltipBounds.right > containerBounds.right) {
      shift = containerBounds.right - tooltipBounds.right;
      this.tooltip.style.left = (left + shift) + 'px';
    }
    if (tooltipBounds.left < containerBounds.left) {
      shift = containerBounds.left - tooltipBounds.left;
      this.tooltip.style.left = (left + shift) + 'px';
    }
    if (shift !== 0) {
      arrow.style.marginLeft = (-1*shift - arrow.offsetWidth/2) + 'px';
    }
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
