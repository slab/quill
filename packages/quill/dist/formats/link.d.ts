import Inline from '../blots/inline.js';
declare class Link extends Inline {
    static blotName: string;
    static tagName: string;
    static SANITIZED_URL: string;
    static PROTOCOL_WHITELIST: string[];
    static create(value: string): HTMLElement;
    static formats(domNode: HTMLElement): string | null;
    static sanitize(url: string): string;
    format(name: string, value: unknown): void;
}
declare function sanitize(url: string, protocols: string[]): boolean;
export { Link as default, sanitize };
