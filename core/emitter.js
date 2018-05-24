import EventEmitter from 'eventemitter3';
import logger from './logger';

let debug = logger('quill:events');

const EVENTS = [ 'selectionchange', 'mousedown', 'mouseup', 'click' ];

const setGlobalListeners = (emitter, doc) => {
  return EVENTS.reduce((acc, eventName) => {
    const handler = (...args) => emitter.handleDOM(...args);

    // set the listener on the correctly scoped document. This allows callers to pass the correct document to the emitter b/c document can be window.document or shadowRoot
    // In addition, this fixes a hack where the quill instance was being stored in the DOM instead of closure scope.
    doc.addEventListener(eventName, handler);

    return acc.concat({ eventName, doc, handler });
  });
};


class Emitter extends EventEmitter {
  constructor({ document = window.document }) {
    super();
    this.listeners = {};
    this.on('error', debug.error);
    this.document = document;
    this.globalListeners = setGlobalListeners(this, document);
  }

  destroy() {
    this.globalListeners.forEach(({ eventName, doc, handler }) => doc.removeEventListener(eventName, handler));
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
