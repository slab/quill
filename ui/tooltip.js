import Keyboard from '../modules/keyboard';
import Emitter from '../core/emitter';


class Tooltip {
  constructor(quill, boundsContainer) {
    this.quill = quill;
    this.boundsContainer = boundsContainer;
    this.root = quill.addContainer('ql-tooltip');
    this.root.innerHTML = this.constructor.TEMPLATE;
    let offset = parseInt(window.getComputedStyle(this.root).marginTop);
    this.quill.root.addEventListener('scroll', () => {
      this.root.style.marginTop = (-1*this.quill.root.scrollTop) + offset + 'px';
      this.checkBounds();
    });
    this.textbox = this.root.querySelector('input[type="text"]');
    this.listen();
    this.hide();
  }

  checkBounds() {
    this.root.classList.toggle('ql-out-top', this.root.offsetTop <= 0);
    this.root.classList.remove('ql-out-bottom');
    this.root.classList.toggle('ql-out-bottom', this.root.offsetTop + this.root.offsetHeight >= this.quill.root.offsetHeight);
  }

  listen() {
    this.textbox.addEventListener('keydown', (event) => {
      if (Keyboard.match(event, 'enter')) {
        this.save();
        event.preventDefault();
      } else if (Keyboard.match(event, 'escape')) {
        this.cancel();
        event.preventDefault();
      }
    });
  }

  cancel() {
    this.hide();
  }

  edit(mode = 'link', preview = null) {
    this.root.classList.remove('ql-hidden');
    this.root.classList.add('ql-editing');
    if (preview != null) {
      this.textbox.value = preview;
    } else if (mode !== this.root.dataset.mode) {
      this.textbox.value = '';
    }
    this.textbox.select();
    this.textbox.setAttribute('placeholder', this.textbox.dataset[mode] || '');
    this.root.dataset.mode = mode;
    this.position(this.quill.getBounds(this.quill.selection.savedRange));
  }

  hide() {
    this.root.classList.add('ql-hidden');
  }

  position(reference) {
    let left = reference.left + reference.width/2 - this.root.offsetWidth/2;
    let top = reference.bottom + this.quill.root.scrollTop;
    this.root.style.left = left + 'px';
    this.root.style.top = top + 'px';
    let containerBounds = this.boundsContainer.getBoundingClientRect();
    let rootBounds = this.root.getBoundingClientRect();
    let shift = 0;
    if (rootBounds.right > containerBounds.right) {
      shift = containerBounds.right - rootBounds.right;
      this.root.style.left = (left + shift) + 'px';
    }
    if (rootBounds.left < containerBounds.left) {
      shift = containerBounds.left - rootBounds.left;
      this.root.style.left = (left + shift) + 'px';
    }
    this.checkBounds();
    return shift;
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

  show() {
    this.root.classList.remove('ql-editing');
    this.root.classList.remove('ql-hidden');
  }
}


export default Tooltip;
