class Tooltip {
  constructor(root, containers = {}) {
    this.containers = containers;
    this.root = root;
    this.root.classList.add('ql-tooltip');
    if (this.containers.scroll instanceof HTMLElement) {
      let offset = parseInt(window.getComputedStyle(this.root).marginTop);
      this.containers.scroll.addEventListener('scroll', () => {
        this.root.style.marginTop = (-1*this.containers.scroll.scrollTop) + offset + 'px';
      });
    }
  }

  position(reference) {
    let left = reference.left + reference.width/2 - this.root.offsetWidth/2;
    let top = reference.bottom;
    if (this.containers.scroll instanceof HTMLElement) {
      top += this.containers.scroll.scrollTop;
    }
    this.root.style.left = left + 'px';
    this.root.style.top = top + 'px';
    if (!(this.containers.bounds instanceof HTMLElement)) return;
    let containerBounds = this.containers.bounds.getBoundingClientRect();
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
    return shift;
  }

  show() {
    this.root.classList.remove('ql-hidden');
  }

  hide() {
    this.root.classList.add('ql-hidden');
  }
}


export default Tooltip;
