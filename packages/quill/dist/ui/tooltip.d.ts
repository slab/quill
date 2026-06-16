import type Quill from '../core.js';
import type { Bounds } from '../core/selection.js';
declare class Tooltip {
    quill: Quill;
    boundsContainer: HTMLElement;
    root: HTMLDivElement;
    constructor(quill: Quill, boundsContainer?: HTMLElement);
    hide(): void;
    position(reference: Bounds): number;
    show(): void;
}
export default Tooltip;
