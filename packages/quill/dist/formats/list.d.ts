import Block from '../blots/block.js';
import Container from '../blots/container.js';
import type Scroll from '../blots/scroll.js';
declare class ListContainer extends Container {
}
declare class ListItem extends Block {
    static create(value: string): HTMLElement;
    static formats(domNode: HTMLElement): string | undefined;
    static register(): void;
    constructor(scroll: Scroll, domNode: HTMLElement);
    format(name: string, value: string): void;
}
export { ListContainer, ListItem as default };
