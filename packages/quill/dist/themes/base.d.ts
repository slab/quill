import type Quill from '../core/quill.js';
import Theme from '../core/theme.js';
import type { ThemeOptions } from '../core/theme.js';
import Picker from '../ui/picker.js';
import Tooltip from '../ui/tooltip.js';
import type { Range } from '../core/selection.js';
import type Clipboard from '../modules/clipboard.js';
import type History from '../modules/history.js';
import type Keyboard from '../modules/keyboard.js';
import type Uploader from '../modules/uploader.js';
import type Selection from '../core/selection.js';
declare class BaseTheme extends Theme {
    pickers: Picker[];
    tooltip?: Tooltip;
    constructor(quill: Quill, options: ThemeOptions);
    addModule(name: 'clipboard'): Clipboard;
    addModule(name: 'keyboard'): Keyboard;
    addModule(name: 'uploader'): Uploader;
    addModule(name: 'history'): History;
    addModule(name: 'selection'): Selection;
    addModule(name: string): unknown;
    buildButtons(buttons: NodeListOf<HTMLElement>, icons: Record<string, Record<string, string> | string>): void;
    buildPickers(selects: NodeListOf<HTMLSelectElement>, icons: Record<string, string | Record<string, string>>): void;
}
declare class BaseTooltip extends Tooltip {
    textbox: HTMLInputElement | null;
    linkRange?: Range;
    constructor(quill: Quill, boundsContainer?: HTMLElement);
    listen(): void;
    cancel(): void;
    edit(mode?: string, preview?: string | null): void;
    restoreFocus(): void;
    save(): void;
}
export { BaseTooltip, BaseTheme as default };
