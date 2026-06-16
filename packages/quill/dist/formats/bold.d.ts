import Inline from '../blots/inline.js';
declare class Bold extends Inline {
    static blotName: string;
    static tagName: string[];
    static create(): HTMLElement;
    static formats(): boolean;
    optimize(context: {
        [key: string]: any;
    }): void;
}
export default Bold;
