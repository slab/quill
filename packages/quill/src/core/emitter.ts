import { EventEmitter } from 'eventemitter3';
import instances from './instances.js';
import logger from './logger.js';
import { isShadowRoot } from './dom-root.js';

const debug = logger('quill:events');
const EVENTS = ['selectionchange', 'mousedown', 'mouseup', 'click'];
// selectionchange is only ever fired at the document.
const SHADOW_ROOT_EVENTS = ['mousedown', 'mouseup', 'click'];

// document.querySelectorAll() does not find editors inside shadow roots, so
// the shadow roots that contain editors are tracked separately.
const shadowRoots = new Set<WeakRef<ShadowRoot>>();
const listenedShadowRoots = new WeakSet<ShadowRoot>();
// Shadow roots whose own listener has already dispatched an event.
const dispatchedShadowRoots = new WeakMap<Event, Set<ShadowRoot>>();

const dispatch = (root: Document | ShadowRoot, event: Event) => {
  Array.from(root.querySelectorAll('.ql-container')).forEach((node) => {
    const quill = instances.get(node);
    if (quill && quill.emitter) {
      quill.emitter.handleDOM(event);
    }
  });
};

EVENTS.forEach((eventName) => {
  document.addEventListener(eventName, (event) => {
    dispatch(document, event);
    // Events from outside a shadow root (and selectionchange) never reach the
    // listener of that shadow root, so dispatch them to its editors here.
    const dispatched = dispatchedShadowRoots.get(event);
    shadowRoots.forEach((ref) => {
      const root = ref.deref();
      if (root == null) {
        shadowRoots.delete(ref);
      } else if (root.host.isConnected && !dispatched?.has(root)) {
        dispatch(root, event);
      }
    });
  });
});

// Like Node#contains(), but also matches nodes inside nested shadow roots.
const containsComposed = (parent: Node, node: Node | null) => {
  let current = node;
  while (current != null) {
    if (parent.contains(current)) return true;
    const rootNode = current.getRootNode();
    current = isShadowRoot(rootNode) ? rootNode.host : null;
  }
  return false;
};

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
      if (
        event.target === node ||
        containsComposed(node, event.target as Node)
      ) {
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

  // Events inside a shadow root are retargeted to its host by the time they
  // reach the document, so editors in a shadow root also listen on the root
  // itself to see the original targets.
  static listenShadowRoot(root: ShadowRoot) {
    if (listenedShadowRoots.has(root)) return;
    listenedShadowRoots.add(root);
    shadowRoots.add(new WeakRef(root));
    SHADOW_ROOT_EVENTS.forEach((eventName) => {
      root.addEventListener(eventName, (event) => {
        let dispatched = dispatchedShadowRoots.get(event);
        if (dispatched == null) {
          dispatched = new Set();
          dispatchedShadowRoots.set(event, dispatched);
        }
        dispatched.add(root);
        dispatch(root, event);
      });
    });
  }
}

export type EmitterSource =
  (typeof Emitter.sources)[keyof typeof Emitter.sources];

export default Emitter;
