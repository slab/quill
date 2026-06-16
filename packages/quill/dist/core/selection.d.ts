import Emitter from './emitter.js';
import type { EmitterSource } from './emitter.js';
import type Cursor from '../blots/cursor.js';
import type Scroll from '../blots/scroll.js';
type NativeRange = AbstractRange;
interface NormalizedRange {
    start: {
        node: NativeRange['startContainer'];
        offset: NativeRange['startOffset'];
    };
    end: {
        node: NativeRange['endContainer'];
        offset: NativeRange['endOffset'];
    };
    native: NativeRange;
}
export interface Bounds {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
}
export declare class Range {
    index: number;
    length: number;
    constructor(index: number, length?: number);
}
declare class Selection {
    scroll: Scroll;
    emitter: Emitter;
    composing: boolean;
    mouseDown: boolean;
    root: HTMLElement;
    cursor: Cursor;
    savedRange: Range;
    lastRange: Range | null;
    lastNative: NormalizedRange | null;
    constructor(scroll: Scroll, emitter: Emitter);
    handleComposition(): void;
    handleDragging(): void;
    focus(): void;
    format(format: string, value: unknown): void;
    getBounds(index: number, length?: number): DOMRect | {
        bottom: number;
        height: number;
        left: number;
        right: number;
        top: number;
        width: number;
    } | null;
    getNativeRange(): NormalizedRange | null;
    getRange(): [Range, NormalizedRange] | [null, null];
    hasFocus(): boolean;
    normalizedToRange(range: NormalizedRange): Range;
    normalizeNative(nativeRange: NativeRange): {
        start: {
            node: Node;
            offset: number;
        };
        end: {
            node: Node;
            offset: number;
        };
        native: AbstractRange;
    } | null;
    rangeToNative(range: Range): [Node | null, number, Node | null, number];
    setNativeRange(startNode: Node | null, startOffset?: number, endNode?: Node | null, endOffset?: number | undefined, force?: boolean): void;
    setRange(range: Range | null, force: boolean, source?: EmitterSource): void;
    setRange(range: Range | null, source?: EmitterSource): void;
    update(source?: EmitterSource): void;
}
export default Selection;
