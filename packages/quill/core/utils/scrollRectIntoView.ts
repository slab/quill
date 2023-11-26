export type Rect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const getParentElement = (element: Node): Element | null =>
  element.parentElement || (element.getRootNode() as ShadowRoot).host || null;

const getElementRect = (element: Element): Rect => {
  const rect = element.getBoundingClientRect();
  const scaleX =
    ('offsetWidth' in element &&
      Math.abs(rect.width) / (element as HTMLElement).offsetWidth) ||
    1;
  const scaleY =
    ('offsetHeight' in element &&
      Math.abs(rect.height) / (element as HTMLElement).offsetHeight) ||
    1;
  return {
    top: rect.top,
    right: rect.left + element.clientWidth * scaleX,
    bottom: rect.top + element.clientHeight * scaleY,
    left: rect.left,
  };
};

const paddingValueToInt = (value: string) => {
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? 0 : number;
};

// Follow the steps described in https://www.w3.org/TR/cssom-view-1/#element-scrolling-members,
// assuming that the scroll option is set to 'nearest'.
const getScrollDistance = (
  targetStart: number,
  targetEnd: number,
  scrollStart: number,
  scrollEnd: number,
  scrollPaddingStart: number,
  scrollPaddingEnd: number,
) => {
  if (targetStart < scrollStart && targetEnd > scrollEnd) {
    return 0;
  }

  if (targetStart < scrollStart) {
    return -(scrollStart - targetStart + scrollPaddingStart);
  }

  if (targetEnd > scrollEnd) {
    return targetEnd - targetStart > scrollEnd - scrollStart
      ? targetStart + scrollPaddingStart - scrollStart
      : targetEnd - scrollEnd + scrollPaddingEnd;
  }
  return 0;
};

const scrollRectIntoView = (root: HTMLElement, targetRect: Rect) => {
  const document = root.ownerDocument;

  let rect = targetRect;

  let current: Element | null = root;
  while (current) {
    const isDocumentBody: boolean = current === document.body;
    const bounding = isDocumentBody
      ? {
          top: 0,
          right:
            window.visualViewport?.width ??
            document.documentElement.clientWidth,
          bottom:
            window.visualViewport?.height ??
            document.documentElement.clientHeight,
          left: 0,
        }
      : getElementRect(current);

    const style = getComputedStyle(current);
    const scrollDistanceX = getScrollDistance(
      rect.left,
      rect.right,
      bounding.left,
      bounding.right,
      paddingValueToInt(style.scrollPaddingLeft),
      paddingValueToInt(style.scrollPaddingRight),
    );
    const scrollDistanceY = getScrollDistance(
      rect.top,
      rect.bottom,
      bounding.top,
      bounding.bottom,
      paddingValueToInt(style.scrollPaddingTop),
      paddingValueToInt(style.scrollPaddingBottom),
    );
    if (scrollDistanceX || scrollDistanceY) {
      if (isDocumentBody) {
        document.defaultView?.scrollBy(scrollDistanceX, scrollDistanceY);
      } else {
        const { scrollLeft, scrollTop } = current;
        if (scrollDistanceY) {
          current.scrollTop += scrollDistanceY;
        }
        if (scrollDistanceX) {
          current.scrollLeft += scrollDistanceX;
        }
        const scrolledLeft = current.scrollLeft - scrollLeft;
        const scrolledTop = current.scrollTop - scrollTop;
        rect = {
          left: rect.left - scrolledLeft,
          top: rect.top - scrolledTop,
          right: rect.right - scrolledLeft,
          bottom: rect.bottom - scrolledTop,
        };
      }
    }

    current =
      isDocumentBody || style.position === 'fixed'
        ? null
        : getParentElement(current);
  }
};

export default scrollRectIntoView;
