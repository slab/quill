import Quill from '../core/quill.js';
import Module from '../core/module.js';
import type { Range } from '../core/selection.js';
type Handler = (this: Toolbar, value: any) => void;
export type ToolbarConfig = Array<string[] | Array<string | Record<string, unknown>>>;
export interface ToolbarProps {
    container?: HTMLElement | ToolbarConfig | null;
    handlers?: Record<string, Handler>;
    option?: number;
    module?: boolean;
    theme?: boolean;
}
declare class Toolbar extends Module<ToolbarProps> {
    static DEFAULTS: ToolbarProps;
    container?: HTMLElement | null;
    controls: [string, HTMLElement][];
    handlers: Record<string, Handler>;
    constructor(quill: Quill, options: Partial<ToolbarProps>);
    addHandler(format: string, handler: Handler): void;
    attach(input: HTMLElement): void;
    update(range: Range | null): void;
}
declare function addControls(container: HTMLElement, groups: (string | Record<string, unknown>)[][] | (string | Record<string, unknown>)[]): void;
export { Toolbar as default, addControls };
