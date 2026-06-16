import { EmbedBlot } from 'parchment';
declare class Image extends EmbedBlot {
    static blotName: string;
    static tagName: string;
    static create(value: string): Element;
    static formats(domNode: Element): Record<string, string | null>;
    static match(url: string): boolean;
    static sanitize(url: string): string;
    static value(domNode: Element): string | null;
    domNode: HTMLImageElement;
    format(name: string, value: string): void;
}
export default Image;
