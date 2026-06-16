import type Quill from '../core/quill.js';
import Module from '../core/module.js';
import type { Range } from '../core/selection.js';
interface UploaderOptions {
    mimetypes: string[];
    handler: (this: {
        quill: Quill;
    }, range: Range, files: File[]) => void;
}
declare class Uploader extends Module<UploaderOptions> {
    static DEFAULTS: UploaderOptions;
    constructor(quill: Quill, options: Partial<UploaderOptions>);
    upload(range: Range, files: FileList | File[]): void;
}
export default Uploader;
