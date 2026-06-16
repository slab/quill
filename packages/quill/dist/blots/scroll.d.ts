import { LeafBlot, ScrollBlot } from 'parchment';
import type { Blot, Registry } from 'parchment';
import Delta from 'quill-delta';
import Emitter from '../core/emitter.js';
import type { EmitterSource } from '../core/emitter.js';
import Block, { BlockEmbed } from './block.js';
import Container from './container.js';
declare class Scroll extends ScrollBlot {
    static blotName: string;
    static className: string;
    static tagName: string;
    static defaultChild: typeof Block;
    static allowedChildren: (typeof Block | typeof BlockEmbed | typeof Container)[];
    emitter: Emitter;
    batch: false | MutationRecord[];
    constructor(registry: Registry, domNode: HTMLDivElement, { emitter }: {
        emitter: Emitter;
    });
    batchStart(): void;
    batchEnd(): void;
    emitMount(blot: Blot): void;
    emitUnmount(blot: Blot): void;
    emitEmbedUpdate(blot: Blot, change: unknown): void;
    deleteAt(index: number, length: number): void;
    enable(enabled?: boolean): void;
    formatAt(index: number, length: number, format: string, value: unknown): void;
    insertAt(index: number, value: string, def?: unknown): void;
    insertBefore(blot: Blot, ref?: Blot | null): void;
    insertContents(index: number, delta: Delta): void;
    isEnabled(): boolean;
    leaf(index: number): [LeafBlot | null, number];
    line(index: number): [Block | BlockEmbed | null, number];
    lines(index?: number, length?: number): (Block | BlockEmbed)[];
    optimize(context?: {
        [key: string]: any;
    }): void;
    optimize(mutations?: MutationRecord[], context?: {
        [key: string]: any;
    }): void;
    path(index: number): [Blot, number][];
    remove(): void;
    update(source?: EmitterSource): void;
    update(mutations?: MutationRecord[]): void;
    updateEmbedAt(index: number, key: string, change: unknown): void;
    protected handleDragStart(event: DragEvent): void;
    private deltaToRenderBlocks;
    private createBlock;
}
export default Scroll;
