import Block from '../blots/block.js';
import Inline from '../blots/inline.js';
import Container from '../blots/container.js';
declare class CodeBlockContainer extends Container {
    static create(value: string): Element;
    code(index: number, length: number): string;
    html(index: number, length: number): string;
}
declare class CodeBlock extends Block {
    static TAB: string;
    static register(): void;
}
declare class Code extends Inline {
}
export { Code, CodeBlockContainer, CodeBlock as default };
