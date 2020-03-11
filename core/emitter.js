import EventEmitter from 'eventemitter3';
import instances from './instances';
import logger from './logger';
import { SHADOW_SELECTIONCHANGE } from './shadow-selection-polyfill';

const debug = logger('quill:events');
const EVENTS = [SHADOW_SELECTIONCHANGE, 'mousedown', 'mouseup', 'click'];
const EMITTERS = [];
const supportsRootNode = ('getRootNode' in document);

EVENTS.forEach(eventName => {
  document.addEventListener(eventName, (...args) => {
    EMITTERS.forEach((em) => {
      em.handleDOM(...args);
    });
  });
});

class Emitter extends EventEmitter {
  constructor() {
    super();
    this.listeners = {};
    EMITTERS.push(this);
    this.on('error', debug.error);
  }

  emit(...args) {
    debug.log.call(debug, ...args);
    super.emit(...args);
  }

  handleDOM(event, ...args) {
    const target = (event.composedPath ? event.composedPath()[0] : event.target);
    const containsNode = (node, target) => {
      if (!supportsRootNode || target.getRootNode() === document) {
        return node.contains(target);
      }

      while (!node.contains(target)) {
        const root = target.getRootNode();
        if (!root || !root.host) {
          return false;
        }
        target = root.host;
      }
      return true;
    };

    (this.listeners[event.type] || []).forEach(({ node, handler }) => {
      if (target === node || containsNode(node, target)) {
        handler(event, ...args);
      }
    });
  }

  listenDOM(eventName, node, handler) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push({ node, handler });
  }
}

Emitter.events = {
  EDITOR_CHANGE: 'editor-change',
  SCROLL_BEFORE_UPDATE: 'scroll-before-update',
  SCROLL_BLOT_MOUNT: 'scroll-blot-mount',
  SCROLL_BLOT_UNMOUNT: 'scroll-blot-unmount',
  SCROLL_OPTIMIZE: 'scroll-optimize',
  SCROLL_UPDATE: 'scroll-update',
  SELECTION_CHANGE: 'selection-change',
  TEXT_CHANGE: 'text-change',
};
Emitter.sources = {
  API: 'api',
  SILENT: 'silent',
  USER: 'user',
};

export default Emitter;
