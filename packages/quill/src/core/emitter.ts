import { EventEmitter } from 'eventemitter3';
import instances from './instances.js';
import logger from './logger.js';

const debug = logger('quill:events');
const EVENTS = ['selectionchange', 'mousedown', 'mouseup', 'click'];

// Documents where we've already registered Quill's global event listeners.
// WeakSet so entries are dropped when a document is GC'd (e.g. JSDOM teardown).
const registeredDocuments = new WeakSet<Document>();

// Registers global event listeners on the given document if not already present.
// Called lazily from the Quill constructor to avoid touching `document` at import
// time, which would crash in non-browser environments (Node, SSR).
function ensureDocumentListeners(doc: Document) {
  if (registeredDocuments.has(doc)) return;
  registeredDocuments.add(doc);

  // Queries are scoped to `doc` rather than the global `document` so
  // listeners stay correct in multi-document scenarios (iframes, JSDOM).
  EVENTS.forEach((eventName) => {
    doc.addEventListener(eventName, (...args) => {
      Array.from(doc.querySelectorAll('.ql-container')).forEach((node) => {
        const quill = instances.get(node);
        if (quill && quill.emitter) {
          quill.emitter.handleDOM(...args);
        }
      });
    });
  });
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
}

export type EmitterSource =
  (typeof Emitter.sources)[keyof typeof Emitter.sources];

export { ensureDocumentListeners };
export default Emitter;
