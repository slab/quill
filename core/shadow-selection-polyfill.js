/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

// NOTE: copied from https://github.com/GoogleChromeLabs/shadow-selection-polyfill

export const SHADOW_SELECTIONCHANGE = '-shadow-selectionchange';

const hasShadow = 'attachShadow' in Element.prototype && 'getRootNode' in Element.prototype;
const hasSelection = !!(hasShadow && document.createElement('div').attachShadow({ mode: 'open' }).getSelection);
const hasShady = window.ShadyDOM && window.ShadyDOM.inUse;
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const useDocument = !hasShadow || hasShady || (!hasSelection && !isSafari);

const validNodeTypes = [Node.ELEMENT_NODE, Node.TEXT_NODE, Node.DOCUMENT_FRAGMENT_NODE];
function isValidNode(node) {
  return validNodeTypes.includes(node.nodeType);
}

function findNode(s, parentNode, isLeft) {
  const nodes = parentNode.childNodes || parentNode.children;
  if (!nodes) {
    return parentNode; // found it, probably text
  }

  for (let i = 0; i < nodes.length; ++i) {
    const j = isLeft ? i : (nodes.length - 1 - i);
    const childNode = nodes[j];
    if (!isValidNode(childNode)) {
      continue; // eslint-disable-line no-continue
    }

    if (s.containsNode(childNode, true)) {
      if (s.containsNode(childNode, false)) {
        return childNode;
      }
      return findNode(s, childNode, isLeft);
    }
  }
  return parentNode;
}

/**
 * @param {function(!Event)} fn to add to selectionchange internals
 */
const addInternalListener = (() => {
  if (hasSelection || useDocument) {
    // getSelection exists or document API can be used
    document.addEventListener('selectionchange', () => {
      document.dispatchEvent(new CustomEvent(SHADOW_SELECTIONCHANGE));
    });
    return () => {};
  }

  let withinInternals = false;
  const handlers = [];

  document.addEventListener('selectionchange', (ev) => {
    if (withinInternals) {
      return;
    }
    document.dispatchEvent(new CustomEvent(SHADOW_SELECTIONCHANGE));
    withinInternals = true;
    window.setTimeout(() => {
      withinInternals = false;
    }, 2); // FIXME: should be > 1 to prevent infinite Selection.update() loop
    handlers.forEach((fn) => fn(ev));
  });

  return (fn) => handlers.push(fn);
})();

let wasCaret = false;
let resolveTask = null;
addInternalListener(() => {
  const s = window.getSelection();
  if (s.type === 'Caret') {
    wasCaret = true;
  } else if (wasCaret && !resolveTask) {
    resolveTask = Promise.resolve(true).then(() => {
      wasCaret = false;
      resolveTask = null;
    });
  }
});


/**
 * @param {!Selection} s the window selection to use
 * @param {!Node} node the node to walk from
 * @param {boolean} walkForward should this walk in natural direction
 * @return {boolean} whether the selection contains the following node (even partially)
 */
function containsNextElement(s, node, walkForward) {
  const start = node;
  while (node = walkFromNode(node, walkForward)) { // eslint-disable-line no-cond-assign
    // walking (left) can contain our own parent, which we don't want
    if (!node.contains(start)) {
      break;
    }
  }
  if (!node) {
    return false;
  }
  // we look for Element as .containsNode says true for _every_ text node, and we only care about
  // elements themselves
  return node instanceof Element && s.containsNode(node, true);
}


/**
 * @param {!Selection} s the window selection to use
 * @param {!Node} leftNode the left node
 * @param {!Node} rightNode the right node
 * @return {boolean|undefined} whether this has natural direction
 */
function getSelectionDirection(s, leftNode, rightNode) {
  if (s.type !== 'Range') {
    return undefined;  // no direction
  }
  const measure = () => s.toString().length;

  const initialSize = measure();

  if (initialSize === 1 && wasCaret && leftNode === rightNode) {
    // nb. We need to reset a single selection as Safari _always_ tells us the cursor was dragged
    // left to right (maybe RTL on those devices).
    // To be fair, Chrome has the same bug.
    s.extend(leftNode, 0);
    s.collapseToEnd();
    return undefined;
  }

  let updatedSize;

  // Try extending forward and seeing what happens.
  s.modify('extend', 'forward', 'character');
  updatedSize = measure();

  if (updatedSize > initialSize || containsNextElement(s, rightNode, true)) {
    s.modify('extend', 'backward', 'character');
    return true;
  } else if (updatedSize < initialSize || !s.containsNode(leftNode)) {
    s.modify('extend', 'backward', 'character');
    return false;
  }

  // Maybe we were at the end of something. Extend backwards.
  // TODO(samthor): We seem to be able to get away without the 'backwards' case.
  s.modify('extend', 'backward', 'character');
  updatedSize = measure();

  if (updatedSize > initialSize || containsNextElement(s, leftNode, false)) {
    s.modify('extend', 'forward', 'character');
    return false;
  } else if (updatedSize < initialSize || !s.containsNode(rightNode)) {
    s.modify('extend', 'forward', 'character');
    return true;
  }

  // This is likely a select-all.
  return undefined;
}

/**
 * Returns the next valid node (element or text). This is needed as Safari doesn't support
 * TreeWalker inside Shadow DOM. Don't escape shadow roots.
 *
 * @param {!Node} node to start from
 * @param {boolean} walkForward should this walk in natural direction
 * @return {Node} node found, if any
 */
function walkFromNode(node, walkForward) {
  if (!walkForward) {
    return node.previousSibling || node.parentNode || null;
  }
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
  return null;
}

/**
 * @param {!Node} node to check for initial space
 * @return {number} count of initial space
 */
function initialSpace(node) {
  if (node.nodeType !== Node.TEXT_NODE) {
    return 0;
  }
  return /^\s*/.exec(node.textContent)[0].length;
}

/**
 * @param {!Node} node to check for trailing space
 * @return {number} count of ignored trailing space
 */
function ignoredTrailingSpace(node) {
  if (node.nodeType !== Node.TEXT_NODE) {
    return 0;
  }
  const trailingSpaceCount =  /\s*$/.exec(node.textContent)[0].length;
  if (!trailingSpaceCount) {
    return 0;
  }
  return trailingSpaceCount - 1; // always allow single last
}

const cachedRange = new Map();
export function getRange(root) {
  if (hasSelection || useDocument) {
    const s = (useDocument ? document : root).getSelection();
    return s.rangeCount ? s.getRangeAt(0) : null;
  }

  const thisFrame = cachedRange.get(root);
  if (thisFrame) {
    return thisFrame;
  }

  const result = internalGetShadowSelection(root);

  cachedRange.set(root, result.range);
  window.setTimeout(() => {
    cachedRange.delete(root);
  }, 0);
  return result.range;
}

const fakeSelectionNode = document.createTextNode('');
export function internalGetShadowSelection(root) {
  const range = document.createRange();

  const s = window.getSelection();
  if (!s.containsNode(root.host, true)) {
    return {range: null, mode: 'none'};
  }

  // TODO: inserting fake nodes isn't ideal, but containsNode doesn't work on nearby adjacent
  // text nodes (in fact it returns true for all text nodes on the page?!).

  // insert a fake 'before' node to see if it's selected
  root.insertBefore(fakeSelectionNode, root.childNodes[0]);
  const includesBeforeRoot = s.containsNode(fakeSelectionNode);
  fakeSelectionNode.remove();
  if (includesBeforeRoot) {
    return {range: null, mode: 'outside-before'};
  }

  // insert a fake 'after' node to see if it's selected
  root.appendChild(fakeSelectionNode);
  const includesAfterRoot = s.containsNode(fakeSelectionNode);
  fakeSelectionNode.remove();
  if (includesAfterRoot) {
    return {range: null, mode: 'outside-after'};
  }

  const measure = () => s.toString().length;
  if (!(s.type === 'Caret' || s.type === 'Range')) {
    throw new TypeError('unexpected type: ' + s.type);
  }

  const leftNode = findNode(s, root, true);
  let rightNode;
  let isNaturalDirection;
  if (s.type === 'Range') {
    rightNode = findNode(s, root, false);  // get right node here _before_ getSelectionDirection
    isNaturalDirection = getSelectionDirection(s, leftNode, rightNode);
    // isNaturalDirection means "going right"
  }

  if (s.type === 'Caret') {
    // we might transition to being a caret, so don't check initial value
    s.extend(leftNode, 0);
    const at = measure();
    s.collapseToEnd();

    range.setStart(leftNode, at);
    range.setEnd(leftNode, at);
    return {range, mode: 'caret'};
  } else if (isNaturalDirection === undefined) {
    if (s.type !== 'Range') {
      throw new TypeError('unexpected type: ' + s.type);
    }
    // This occurs when we can't move because we can't extend left or right to measure the
    // direction we're moving in. Good news though: we don't need to _change_ the selection
    // to measure it, so just return immediately.
    range.setStart(leftNode, 0);
    range.setEnd(rightNode, rightNode.length);
    return {range, mode: 'all'};
  }

  const size = measure();
  let offsetLeft, offsetRight;

  // only one newline/space char is cared about
  const validRightLength = rightNode.length - ignoredTrailingSpace(rightNode);

  if (isNaturalDirection) {
    // walk in the opposite direction first
    s.extend(leftNode, 0);
    offsetLeft = measure() + initialSpace(leftNode);  // measure doesn't include initial space

    // then in our actual direction
    s.extend(rightNode, validRightLength);
    offsetRight = validRightLength - (measure() - size);

    // then revert to the original position
    s.extend(rightNode, offsetRight);
  } else {
    // walk in the opposite direction first
    s.extend(rightNode, validRightLength);
    offsetRight = validRightLength - measure();

    // then in our actual direction
    s.extend(leftNode, 0);
    offsetLeft = measure() - size + initialSpace(leftNode);  // doesn't include initial space

    // then revert to the original position
    s.extend(leftNode, offsetLeft);
  }

  range.setStart(leftNode, offsetLeft);
  range.setEnd(rightNode, offsetRight);
  return {
    mode: isNaturalDirection ? 'right' : 'left',
    range,
  };
}
