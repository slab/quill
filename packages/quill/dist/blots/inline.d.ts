import { InlineBlot } from 'parchment';
import type { BlotConstructor } from 'parchment';
declare class Inline extends InlineBlot {
    static allowedChildren: BlotConstructor[];
    static order: string[];
    static compare(self: string, other: string): number;
    formatAt(index: number, length: number, name: string, value: unknown): void;
    optimize(context: {
        [key: string]: any;
    }): void;
}
export default Inline;
