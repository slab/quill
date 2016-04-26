class Tooltip {
  constructor(root, container) {
    this.container = container;
    this.root = root;
  }

  position(reference) {
    let left = reference.left + reference.width/2 - this.root.offsetWidth/2;
    let top = reference.bottom + 10;
    // Lock our width so we will expand beyond our offsetParent boundaries
    this.root.style.left = '0px';
    this.root.style.width = '';
    this.root.style.width = this.root.offsetWidth + 'px';
    this.root.style.left = left + 'px';
    this.root.style.top = top + 'px';
    let containerBounds = this.container.getBoundingClientRect();
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
    let arrow = this.root.querySelector('.ql-tooltip-arrow');
    if (arrow == null) return;
    arrow.style.marginLeft = '';
    if (shift !== 0) {
      arrow.style.marginLeft = (-1*shift - arrow.offsetWidth/2) + 'px';
    }
  }

  show(reference) {
    this.root.classList.remove('ql-hidden');
    if (reference != null) {
      this.position(reference);
    }
  }

  hide() {
    this.root.classList.add('ql-hidden');
  }
}


export default Tooltip;
