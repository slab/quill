import Quill from '../quill';
import keys from '../lib/keys';


const HIDE_MARGIN = '-10000px';

class Tooltip {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = options;
    this.container = this.quill.addContainer('ql-tooltip');
    this.container.innerHTML = this.options.template;
    this.hide();
    this.quill.on(Quill.events.TEXT_CHANGE, (delta, source) => {
      if (this.container.style.left !== HIDE_MARGIN) {
        this.hide();
      }
    });
  }

  initTextbox(textbox, enterCallback, escapeCallback) {
    textbox.addEventListener('keydown', (evt) => {
      if (evt.which !== keys.ENTER && evt.which !== keys.ESCAPE) return;
      let fn = evt.which === keys.ENTER ? enterCallback : escapeCallback;
      fn.call(this);
      evt.preventDefault();
    });
  }

  hide() {
    this.container.style.left = HIDE_MARGIN;
    this.quill.focus();
  }

  position(reference) {
    let left, top;
    if (reference != null) {
      let referenceBounds = reference.getBoundingClientRect();
      let parentBounds = this.quill.container.getBoundingClientRect();
      let offsetLeft = referenceBounds.left - parentBounds.left;
      let offsetTop = referenceBounds.top - parentBounds.top;
      let offsetBottom = referenceBounds.bottom - parentBounds.bottom;
      left = offsetLeft + referenceBounds.width / 2 - this.container.offsetWidth / 2;
      top = offsetTop + referenceBounds.height + this.options.offset;
      if (top + this.container.offsetHeight > this.quill.container.offsetHeight) {
        top = offsetTop - this.container.offsetHeight - this.options.offset;
      }
      left = Math.max(0, Math.min(left, this.quill.container.offsetWidth - this.container.offsetWidth));
      top = Math.max(0, Math.min(top, this.quill.container.offsetHeight - this.container.offsetHeight));
    } else {
      left = this.quill.container.offsetWidth / 2 - this.container.offsetWidth / 2;
      top = this.quill.container.offsetHeight / 2 - this.container.offsetHeight / 2;
    }
    top += this.quill.container.scrollTop;
    return [left, top];
  }

  show(reference) {
    let [left, top] = this.position(reference);
    this.container.style.left = left + "px";
    this.container.style.top = top + "px";
    this.container.focus();
  }
}
Tooltip.DEFAULTS = {
  offset: 10,
  template: ''
};


Quill.registerModule('tooltip', Tooltip);

export { Tooltip as default };