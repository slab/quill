import Delta from 'quill-delta';
import type { Blot, ScrollBlot } from 'parchment';
import Inline from '../blots/inline.js';
import Quill from '../core/quill.js';
import Module from '../core/module.js';
import CodeBlock, { CodeBlockContainer } from '../formats/code.js';
declare class CodeToken extends Inline {
    static formats(node: Element, scroll: ScrollBlot): any;
    constructor(scroll: ScrollBlot, domNode: Node, value: unknown);
    format(format: string, value: unknown): void;
    optimize(...args: unknown[]): void;
}
declare class SyntaxCodeBlock extends CodeBlock {
    static create(value: unknown): HTMLElement;
    static formats(domNode: Node): any;
    static register(): void;
    format(name: string, value: unknown): void;
    replaceWith(name: string | Blot, value?: any): Blot;
}
declare class SyntaxCodeBlockContainer extends CodeBlockContainer {
    forceNext?: boolean;
    cachedText?: string | null;
    attach(): void;
    format(name: string, value: unknown): void;
    formatAt(index: number, length: number, name: string, value: unknown): void;
    highlight(highlight: (text: string, language: string) => Delta, forced?: boolean): void;
    html(index: number, length: number): string;
    optimize(context: Record<string, any>): void;
}
interface SyntaxOptions {
    interval: number;
    languages: {
        key: string;
        label: string;
    }[];
    hljs: any;
}
declare class Syntax extends Module<SyntaxOptions> {
    static DEFAULTS: SyntaxOptions & {
        hljs: any;
    };
    static register(): void;
    languages: Record<string, true>;
    constructor(quill: Quill, options: Partial<SyntaxOptions>);
    initListener(): void;
    initTimer(): void;
    highlight(blot?: SyntaxCodeBlockContainer | null, force?: boolean): void;
    highlightBlot(text: string, language?: string): Delta;
}
export { SyntaxCodeBlock as CodeBlock, CodeToken, Syntax as default };
