import Module from '../core/module.js';
import Quill from '../core/quill.js';
export declare const TTL_FOR_VALID_SELECTION_CHANGE = 100;
declare class UINode extends Module {
    isListening: boolean;
    selectionChangeDeadline: number;
    constructor(quill: Quill, options: Record<string, never>);
    private handleArrowKeys;
    private handleNavigationShortcuts;
    /**
     * We only listen to the `selectionchange` event when
     * there is an intention of moving the caret to the beginning using shortcuts.
     * This is primarily implemented to prevent infinite loops, as we are changing
     * the selection within the handler of a `selectionchange` event.
     */
    private ensureListeningToSelectionChange;
    private handleSelectionChange;
}
export default UINode;
