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
    this.hide();
  }

  checkBounds() {
    this.root.classList.toggle('ql-out-top', this.root.offsetTop <= 0);
    this.root.classList.remove('ql-out-bottom');
    this.root.classList.toggle('ql-out-bottom', this.root.offsetTop + this.root.offsetHeight >= this.quill.root.offsetHeight);
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

  show() {
    this.root.classList.remove('ql-editing');
    this.root.classList.remove('ql-hidden');
  }
}


export default Tooltip;
