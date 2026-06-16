import Module from '../core/module.js';
import Quill from '../core/quill.js';
declare class Input extends Module {
    constructor(quill: Quill, options: Record<string, never>);
    private deleteRange;
    private replaceText;
    private handleBeforeInput;
    private handleCompositionStart;
}
export default Input;
