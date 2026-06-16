import { AttributorStore, BlockBlot, EmbedBlot } from 'parchment';
import type { Blot, Parent } from 'parchment';
import Delta from 'quill-delta';
declare class Block extends BlockBlot {
    cache: {
        delta?: Delta | null;
        length?: number;
    };
    delta(): Delta;
    deleteAt(index: number, length: number): void;
    formatAt(index: number, length: number, name: string, value: unknown): void;
    insertAt(index: number, value: string, def?: unknown): void;
    insertBefore(blot: Blot, ref?: Blot | null): void;
    length(): number;
    moveChildren(target: Parent, ref?: Blot | null): void;
    optimize(context: {
        [key: string]: any;
    }): void;
    path(index: number): [Blot, number][];
    removeChild(child: Blot): void;
    split(index: number, force?: boolean | undefined): Blot | null;
    private optimizeChildren;
}
declare class BlockEmbed extends EmbedBlot {
    attributes: AttributorStore;
    domNode: HTMLElement;
    attach(): void;
    delta(): Delta;
    format(name: string, value: unknown): void;
    formatAt(index: number, length: number, name: string, value: unknown): void;
    insertAt(index: number, value: string, def?: unknown): void;
}
declare function blockDelta(blot: BlockBlot, filter?: boolean): Delta;
declare function bubbleFormats(blot: Blot | null, formats?: Record<string, unknown>, filter?: boolean): Record<string, unknown>;
export { blockDelta, bubbleFormats, BlockEmbed, Block as default };
