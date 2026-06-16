import Delta from 'quill-delta';
import type Scroll from '../blots/scroll.js';
import { Range } from './selection.js';
type SelectionInfo = {
    newRange: Range;
    oldRange: Range;
};
declare class Editor {
    scroll: Scroll;
    delta: Delta;
    constructor(scroll: Scroll);
    applyDelta(delta: Delta): Delta;
    deleteText(index: number, length: number): Delta;
    formatLine(index: number, length: number, formats?: Record<string, unknown>): Delta;
    formatText(index: number, length: number, formats?: Record<string, unknown>): Delta;
    getContents(index: number, length: number): Delta;
    getDelta(): Delta;
    getFormat(index: number, length?: number): Record<string, unknown>;
    getHTML(index: number, length: number): string;
    getText(index: number, length: number): string;
    insertContents(index: number, contents: Delta): Delta;
    insertEmbed(index: number, embed: string, value: unknown): Delta;
    insertText(index: number, text: string, formats?: Record<string, unknown>): Delta;
    isBlank(): boolean;
    removeFormat(index: number, length: number): Delta;
    update(change: Delta | null, mutations?: MutationRecord[], selectionInfo?: SelectionInfo | undefined): Delta;
}
export default Editor;
