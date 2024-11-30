function isElement(value: any): value is Element {
  return (
    value instanceof Element ||
    value instanceof (value?.ownerDocument?.defaultView?.Element ?? Element)
  );
}

function isHTMLElement(value: any): value is HTMLElement {
  return (
    value instanceof HTMLElement ||
    value instanceof
      (value?.ownerDocument?.defaultView?.HTMLElement ?? HTMLElement)
  );
}

export { isElement, isHTMLElement };
