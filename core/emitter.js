import EventEmitter from 'eventemitter3';
import logger from './logger';

let debug = logger('quill:events');

const EVENTS = [ 'selectionchange', 'mousedown', 'mouseup', 'click' ];

const setGlobalListeners = (emitter, documentOrShadow) => {
  const selectionRoot = resolveSelectionRoot(documentOrShadow);

  return EVENTS.reduce((acc, eventName) => {
    const handler = (...args) => emitter.handleDOM(...args);

    // set the listener on the correctly scoped document. This allows callers to pass the correct document to the emitter b/c document can be window.document or shadowRoot
    // In addition, this fixes a hack where the quill instance was being stored in the DOM instead of closure scope.
    selectionRoot.addEventListener(eventName, handler);

    return acc.concat({ eventName, target: selectionRoot, handler });
  }, []);
};

const resolveSelectionRoot = (selectionRoot) => {
  if (selectionRoot && typeof selectionRoot.getSelection === 'function') {
    return selectionRoot;
  } else if (selectionRoot) {
    return selectionRoot.ownerDocument || window.document;
  }

  return window.document;
}

class Emitter extends EventEmitter {
  constructor({ selectionRoot = window.document }) {
    super();
    this.listeners = {};
    this.on('error', debug.error);
    this.selectionRoot = selectionRoot;
    this.globalListeners = setGlobalListeners(this, selectionRoot);
  }

  destroy() {
    this.globalListeners.forEach(({ eventName, target, handler }) => target.removeEventListener(eventName, handler));
  }

  emit() {
    debug.log.apply(debug, arguments);
    super.emit.apply(this, arguments);
  }

  handleDOM(event, ...args) {
    (this.listeners[event.type] || []).forEach(function({ node, handler }) {
      if (event.target === node || node.contains(event.target)) {
        handler(event, ...args);
      }
    });
  }

  listenDOM(eventName, node, handler) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push({ node, handler })
  }
}

Emitter.events = {
  EDITOR_CHANGE        : 'editor-change',
  SCROLL_BEFORE_UPDATE : 'scroll-before-update',
  SCROLL_OPTIMIZE      : 'scroll-optimize',
  SCROLL_UPDATE        : 'scroll-update',
  SELECTION_CHANGE     : 'selection-change',
  TEXT_CHANGE          : 'text-change'
};
Emitter.sources = {
  API    : 'api',
  SILENT : 'silent',
  USER   : 'user'
};


export default Emitter;
