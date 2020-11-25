import merge from 'lodash.merge';
import Emitter from '../core/emitter';
import BaseTheme, { BaseTooltip } from './base';
import { Range } from '../core/selection';
import icons from '../ui/icons';

const TOOLBAR_CONFIG = [
  ['bold', 'italic', 'link'],
  [{ header: 1 }, { header: 2 }, 'blockquote'],
];

class BubbleTooltip extends BaseTooltip {
  constructor(quill, bounds) {
    super(quill, bounds);
    this.quill.on(
      Emitter.events.EDITOR_CHANGE,
      (type, range, oldRange, source) => {
        if (type !== Emitter.events.SELECTION_CHANGE) return;
        if (
          range != null &&
          range.length > 0 &&
          source === Emitter.sources.USER
        ) {
          this.show();
          // Lock our width so we will expand beyond our offsetParent boundaries
          this.root.style.left = '0px';
          this.root.style.width = '';
          this.root.style.width = `${this.root.offsetWidth}px`;
          const rangePosition = this.calculateRangePosition(range);
          this.position(rangePosition);
        } else if (
          document.activeElement !== this.textbox &&
          this.quill.hasFocus()
        ) {
          this.hide();
        }
      },
    );
  }

  listen() {
    super.listen();
    this.root.querySelector('.ql-close').addEventListener('click', () => {
      this.root.classList.remove('ql-editing');
    });
    this.quill.on(Emitter.events.SCROLL_OPTIMIZE, () => {
      // Let selection be restored by toolbar handlers before repositioning
      setTimeout(() => {
        if (this.root.classList.contains('ql-hidden')) return;
        const range = this.quill.getSelection();
        if (range != null && range.length > 0) {
          const rangePosition = this.calculateRangePosition(range);
          this.position(rangePosition);
        }
      }, 1);
    });
  }

  cancel() {
    this.show();
  }

  calculateRangePosition(range) {
    const lines = this.quill.getLines(range.index, range.length);
    if (lines.length < 2) {
      return this.quill.getBounds(range);
    }

    const lastLine = lines[lines.length - 1];
    const index = this.quill.getIndex(lastLine);
    const length = Math.min(
      lastLine.length() - 1,
      range.index + range.length - index,
    );
    return this.quill.getBounds(new Range(index, length));
  }

  position(reference) {
    const shift = super.position(reference);
    const arrow = this.root.querySelector('.ql-tooltip-arrow');
    arrow.style.marginLeft = '';
    if (shift !== 0) {
      arrow.style.marginLeft = `${-1 * shift - arrow.offsetWidth / 2}px`;
    }
    return shift;
  }
}
BubbleTooltip.TEMPLATE = [
  '<span class="ql-tooltip-arrow"></span>',
  '<div class="ql-tooltip-editor">',
  '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
  '<a class="ql-close"></a>',
  '</div>',
].join('');

class BubbleTheme extends BaseTheme {
  constructor(quill, options) {
    if (
      options.modules.toolbar != null &&
      options.modules.toolbar.container == null
    ) {
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    super(quill, options);
    this.quill.container.classList.add('ql-bubble');
  }

  extendToolbar(toolbar) {
    this.tooltip = new BubbleTooltip(this.quill, this.options.bounds);
    this.tooltip.root.appendChild(toolbar.container);
    this.buildButtons(toolbar.container.querySelectorAll('button'), icons);
    this.buildPickers(toolbar.container.querySelectorAll('select'), icons);
  }
}
BubbleTheme.DEFAULTS = merge({}, BaseTheme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(value) {
          if (!value) {
            this.quill.format('link', false);
          } else {
            this.quill.theme.tooltip.edit();
          }
        },
      },
    },
  },
});

export { BubbleTooltip, BubbleTheme as default };
