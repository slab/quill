import type Quill from './quill.js';
declare abstract class Module<T extends {} = {}> {
    quill: Quill;
    protected options: Partial<T>;
    static DEFAULTS: {};
    constructor(quill: Quill, options?: Partial<T>);
}
export default Module;
