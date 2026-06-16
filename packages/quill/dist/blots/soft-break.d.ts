import { EmbedBlot } from 'parchment';
export declare const SOFT_BREAK_CHARACTER = "\u2028";
export default class SoftBreak extends EmbedBlot {
    static tagName: string;
    static blotName: string;
    static className: string;
    length(): number;
    value(): string;
    optimize(): void;
}
