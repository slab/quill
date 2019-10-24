import EventEmitter from 'eventemitter3';
import logger from './logger';

const debug = logger('quill:events');
const EVENTS = ['selectionchange', 'mousedown', 'mouseup', 'click'];
const EMITTERS = [];

EVENTS.forEach(eventName => {
  document.addEventListener(eventName, (...args) => {
    EMITTERS.forEach(em => {
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
    const target = event.composedPath()[0];
    const containsNode = (node, child) => {
      if (child.getRootNode() === document) {
        return node.contains(child);
      }

      while (!node.contains(child)) {
        const root = child.getRootNode();
        if (!root || !root.host) {
          return false;
        }
        child = root.host;
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
