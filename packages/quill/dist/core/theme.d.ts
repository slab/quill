import type Quill from '../core.js';
import type Clipboard from '../modules/clipboard.js';
import type History from '../modules/history.js';
import type Keyboard from '../modules/keyboard.js';
import type { ToolbarProps } from '../modules/toolbar.js';
import type Uploader from '../modules/uploader.js';
export interface ThemeOptions {
    modules: Record<string, unknown> & {
        toolbar?: null | ToolbarProps;
    };
}
declare class Theme {
    protected quill: Quill;
    protected options: ThemeOptions;
    static DEFAULTS: ThemeOptions;
    static themes: {
        default: typeof Theme;
    };
    modules: ThemeOptions['modules'];
    constructor(quill: Quill, options: ThemeOptions);
    init(): void;
    addModule(name: 'clipboard'): Clipboard;
    addModule(name: 'keyboard'): Keyboard;
    addModule(name: 'uploader'): Uploader;
    addModule(name: 'history'): History;
    addModule(name: string): unknown;
}
export interface ThemeConstructor {
    new (quill: Quill, options: unknown): Theme;
    DEFAULTS: ThemeOptions;
}
export default Theme;
