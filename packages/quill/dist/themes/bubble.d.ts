import BaseTheme, { BaseTooltip } from './base.js';
import type { Bounds } from '../core/selection.js';
import Quill from '../core/quill.js';
import type { ThemeOptions } from '../core/theme.js';
import type Toolbar from '../modules/toolbar.js';
declare class BubbleTooltip extends BaseTooltip {
    static TEMPLATE: string;
    constructor(quill: Quill, bounds?: HTMLElement);
    listen(): void;
    cancel(): void;
    position(reference: Bounds): number;
}
declare class BubbleTheme extends BaseTheme {
    tooltip: BubbleTooltip;
    constructor(quill: Quill, options: ThemeOptions);
    extendToolbar(toolbar: Toolbar): void;
}
export { BubbleTooltip, BubbleTheme as default };
