import type Quill from '../core.js';
import type { Bounds } from '../core/selection.js';
import { getSubscriber } from '../core/subscriber.js';

const isScrollable = (el: Element) => {
  const { overflowY } = getComputedStyle(el, null);
  return overflowY !== 'visible' && overflowY !== 'clip';
};

class Tooltip {
  quill: Quill;
  boundsContainer: HTMLElement;
  root: HTMLDivElement;

  constructor(quill: Quill, boundsContainer?: HTMLElement) {
    this.quill = quill;
    this.boundsContainer = boundsContainer || document.body;
    this.root = quill.addContainer('ql-tooltip');
    // @ts-expect-error
    this.root.innerHTML = this.constructor.TEMPLATE;
    if (isScrollable(this.quill.root)) {
      const subscriber = getSubscriber(this.quill.root);
      subscriber.on(this, this.quill.root, 'scroll', () => {
        this.root.style.marginTop = `${-1 * this.quill.root.scrollTop}px`;
      });
    }
    this.hide();
  }

  hide() {
    this.root.classList.add('ql-hidden');
  }

  position(reference: Bounds) {
    const left =
      reference.left + reference.width / 2 - this.root.offsetWidth / 2;
    // root.scrollTop should be 0 if scrollContainer !== root
    const top = reference.bottom + this.quill.root.scrollTop;
    this.root.style.left = `${left}px`;
    this.root.style.top = `${top}px`;
    this.root.classList.remove('ql-flip');
    const containerBounds = this.boundsContainer.getBoundingClientRect();
    const rootBounds = this.root.getBoundingClientRect();
    let shift = 0;
    if (rootBounds.right > containerBounds.right) {
      shift = containerBounds.right - rootBounds.right;
      this.root.style.left = `${left + shift}px`;
    }
    if (rootBounds.left < containerBounds.left) {
      shift = containerBounds.left - rootBounds.left;
      this.root.style.left = `${left + shift}px`;
    }
    if (rootBounds.bottom > containerBounds.bottom) {
      const height = rootBounds.bottom - rootBounds.top;
      const verticalShift = reference.bottom - reference.top + height;
      this.root.style.top = `${top - verticalShift}px`;
      this.root.classList.add('ql-flip');
    }
    return shift;
  }

  show() {
    this.root.classList.remove('ql-editing');
    this.root.classList.remove('ql-hidden');
  }
}

export default Tooltip;
