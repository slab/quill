import { EventEmitter } from 'eventemitter3';
import instances from './instances.js';
import logger from './logger.js';
import type { DOMRootType } from './dom-root.js';

const debug = logger('quill:events');
const EVENTS = ['selectionchange', 'mousedown', 'mouseup', 'click'];

// Delegate events to the Quill editors in the document or shadow root.
const initializedRoots = new WeakSet<Document | ShadowRoot>();

// Initialize global event delegation for a specific root context
function initializeGlobalEvents(domRoot: DOMRootType) {
  const root = domRoot.getRoot();

  // Avoid duplicate initialization
  if (initializedRoots.has(root)) {
    return;
  }
  initializedRoots.add(root);

  EVENTS.forEach((eventName) => {
    root.addEventListener(eventName, (...args) => {
      // Find all Quill containers within this root's scope
      const containers = domRoot.querySelectorAll('.ql-container');
      containers.forEach((node) => {
        const quill = instances.get(node);
        if (quill && quill.emitter) {
          quill.emitter.handleDOM(...args);
        }
      });
    });
  });
}

// Initialize global events for the document (backward compatibility)
if (typeof document !== 'undefined') {
  EVENTS.forEach((eventName) => {
    document.addEventListener(eventName, (...args) => {
      Array.from(document.querySelectorAll('.ql-container')).forEach((node) => {
        const quill = instances.get(node);
        if (quill && quill.emitter) {
          quill.emitter.handleDOM(...args);
        }
      });
    });
  });
  initializedRoots.add(document);
}

class Emitter extends EventEmitter<string> {
  static events = {
    EDITOR_CHANGE: 'editor-change',
    SCROLL_BEFORE_UPDATE: 'scroll-before-update',
    SCROLL_BLOT_MOUNT: 'scroll-blot-mount',
    SCROLL_BLOT_UNMOUNT: 'scroll-blot-unmount',
    SCROLL_OPTIMIZE: 'scroll-optimize',
    SCROLL_UPDATE: 'scroll-update',
    SCROLL_EMBED_UPDATE: 'scroll-embed-update',
    SELECTION_CHANGE: 'selection-change',
    TEXT_CHANGE: 'text-change',
    COMPOSITION_BEFORE_START: 'composition-before-start',
    COMPOSITION_START: 'composition-start',
    COMPOSITION_BEFORE_END: 'composition-before-end',
    COMPOSITION_END: 'composition-end',
  } as const;

  static sources = {
    API: 'api',
    SILENT: 'silent',
    USER: 'user',
  } as const;

  protected domListeners: Record<string, { node: Node; handler: Function }[]>;

  constructor() {
    super();
    this.domListeners = {};
    this.on('error', debug.error);
  }

  emit(...args: unknown[]): boolean {
    debug.log.call(debug, ...args);
    // @ts-expect-error
    return super.emit(...args);
  }

  handleDOM(event: Event, ...args: unknown[]) {
    (this.domListeners[event.type] || []).forEach(({ node, handler }) => {
      if (event.target === node || node.contains(event.target as Node)) {
        handler(event, ...args);
      }
    });
  }

  listenDOM(eventName: string, node: Node, handler: EventListener) {
    if (!this.domListeners[eventName]) {
      this.domListeners[eventName] = [];
    }
    this.domListeners[eventName].push({ node, handler });
  }

  // Initialize global events for a DOMRoot context
  static initializeGlobalEvents(domRoot: DOMRootType) {
    initializeGlobalEvents(domRoot);
  }
}

export type EmitterSource =
  (typeof Emitter.sources)[keyof typeof Emitter.sources];

export { initializeGlobalEvents };
export default Emitter;
