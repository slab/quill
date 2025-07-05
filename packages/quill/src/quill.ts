/**
 * This is entry point for ESM.
 */

import Quill from './main.js';
import type {
  Bounds,
  DebugLevel,
  EmitterSource,
  ExpandedQuillOptions,
  QuillOptions,
} from './core.js';

export {
  AttributeMap,
  Delta,
  Module,
  Op,
  OpIterator,
  Parchment,
  Range,
} from './core.js';
export type {
  Bounds,
  DebugLevel,
  EmitterSource,
  ExpandedQuillOptions,
  QuillOptions,
};

export default Quill;
