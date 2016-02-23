const HIDE_MARGIN = '-10000px';

class Tooltip {
  constructor(container) {
    this.container = container;
    this.container.classList.add('ql-tooltip');
    this.hide();
  }

  center(target, container) {
    let left = container.offsetWidth / 2 - target.offsetWidth / 2;
    let top = container.offsetHeight / 2 - target.offsetHeight / 2;
    return [left, top];
  }

  hide() {
    this.container.style.left = HIDE_MARGIN;
  }

  position(target, container, offset = 10) {
    let targetBounds = target.getBoundingClientRect();
    let containerBounds = container.getBoundingClientRect();
    let offsetLeft = targetBounds.left - containerBounds.left;
    let offsetTop = targetBounds.top - containerBounds.top;
    let offsetBottom = targetBounds.bottom - containerBounds.bottom;
    let left = offsetLeft + targetBounds.width / 2 - this.container.offsetWidth / 2;
    let top = offsetTop + targetBounds.height + offset;
    if (top + this.container.offsetHeight > container.offsetHeight) {
      top = offsetTop - this.container.offsetHeight - offset;
    }
    left = Math.max(0, Math.min(left, container.offsetWidth - this.container.offsetWidth));
    top = Math.max(0, Math.min(top, container.offsetHeight - this.container.offsetHeight));
    top += container.scrollTop;
    return [left, top];
  }

  show(left, top) {
    this.container.style.left = left + "px";
    this.container.style.top = top + "px";
    this.container.focus();
  }
}


export default Tooltip;
