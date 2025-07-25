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

interface ScrollOffsetRecord {
  element: Element | Window;
  left: number;
  top: number;
}

export interface ScrollRectIntoViewOptions {
  smooth?: boolean;
}

const scrollRectIntoView = (
  root: HTMLElement,
  targetRect: Rect,
  options: ScrollRectIntoViewOptions = {},
) => {
  const document = root.ownerDocument;

  let rect = targetRect;

  const records: ScrollOffsetRecord[] = [];

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
        if (document.defaultView) {
          records.push({
            element: document.defaultView,
            left: scrollDistanceX,
            top: scrollDistanceY,
          });
          document.defaultView.scrollBy(scrollDistanceX, scrollDistanceY);
        }
      } else {
        const { scrollLeft, scrollTop } = current;
        if (scrollDistanceY) {
          current.scrollTop += scrollDistanceY;
        }
        if (scrollDistanceX) {
          current.scrollLeft += scrollDistanceX;
        }

        records.push({
          element: current,
          left: scrollDistanceX,
          top: scrollDistanceY,
        });

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

  if (options.smooth) {
    // Revert all the changes in the scroll position
    // and then scroll to the target position with smooth animation
    records.forEach(({ element, top, left }) => {
      element.scrollBy({ top: -top, left: -left, behavior: 'instant' });
      element.scrollBy({ top, left, behavior: 'smooth' });
    });
  }
};

export default scrollRectIntoView;
