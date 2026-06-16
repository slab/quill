import Quill, { Parchment, Range } from './core/quill.js';
import type { Bounds, DebugLevel, EmitterSource, ExpandedQuillOptions, QuillOptions } from './core/quill.js';
import Delta from 'quill-delta';
declare const Op: typeof import("quill-delta").Op, OpIterator: typeof import("quill-delta").OpIterator, AttributeMap: typeof import("quill-delta").AttributeMap;
export { default as Module } from './core/module.js';
export { Delta, Op, OpIterator, AttributeMap, Parchment, Range };
export type { Bounds, DebugLevel, EmitterSource, ExpandedQuillOptions, QuillOptions, };
export default Quill;
