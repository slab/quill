import { EventEmitter } from 'eventemitter3';
import instances from './instances.js';
import logger from './logger.js';

const debug = logger('quill:events');
const EVENTS = ['selectionchange', 'mousedown', 'mouseup', 'click'];

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

  private static registeredDocuments = new WeakMap<Document, boolean>();

  static registerEventsOnDocument(doc: Document) {
    if (Emitter.registeredDocuments.get(doc)) return;
    Emitter.registeredDocuments.set(doc, true);

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
    Emitter.registerEventsOnDocument(node.ownerDocument ?? document);
    if (!this.domListeners[eventName]) {
      this.domListeners[eventName] = [];
    }
    this.domListeners[eventName].push({ node, handler });
  }
}

export type EmitterSource =
  (typeof Emitter.sources)[keyof typeof Emitter.sources];

export default Emitter;
