import Delta from 'quill-delta';
import type Quill from '../core/quill.js';
import Emitter from '../core/emitter.js';
import Module from '../core/module.js';
import type { Range } from '../core/selection.js';

interface UploaderOptions {
  mimetypes: string[];
  handler?: (this: { quill: Quill }, range: Range, files: File[]) => void;
  handlers?: Array<UploaderHandler<any>>;
}

class Uploader extends Module<UploaderOptions> {
  static DEFAULTS: UploaderOptions;

  constructor(quill: Quill, options: Partial<UploaderOptions>) {
    super(quill, options);
    options.handlers?.forEach((handler) => handler.setQuill(quill));
    quill.root.addEventListener('drop', (e) => {
      e.preventDefault();
      let native: ReturnType<typeof document.createRange> | null = null;
      if (document.caretRangeFromPoint) {
        native = document.caretRangeFromPoint(e.clientX, e.clientY);
        // @ts-expect-error
      } else if (document.caretPositionFromPoint) {
        // @ts-expect-error
        const position = document.caretPositionFromPoint(e.clientX, e.clientY);
        native = document.createRange();
        native.setStart(position.offsetNode, position.offset);
        native.setEnd(position.offsetNode, position.offset);
      }

      const normalized = native && quill.selection.normalizeNative(native);
      if (normalized) {
        const range = quill.selection.normalizedToRange(normalized);
        if (e.dataTransfer?.files) {
          this.upload(range, e.dataTransfer.files);
        }
      }
    });
  }

  upload(range: Range, files: FileList | File[]) {
    const uploads: File[] = [];
    Array.from(files).forEach((file) => {
      if (file && this.options.mimetypes?.includes(file.type)) {
        uploads.push(file);
      }
    });
    if (uploads.length > 0) {
      if (this.options.handlers) {
        const handlerFlag: Array<number> = [];
        uploads.forEach(() => handlerFlag.push(0));
        let rangLength = range.length;
        for (let index = 0; index < uploads.length; index++) {
          const file = uploads[index];
          const handler = this.options.handlers?.find((h) =>
            h.support(file.type),
          );
          if (!handler) continue;
          handler.handler(file).then((coverFile) => {
            const nodeCoverLength = rangLength;
            rangLength = 0;
            let beforeRangeLength = 0;
            for (let i = 0; i < index; i++) {
              beforeRangeLength += handlerFlag[i];
            }
            const nodeLength = handler.insert(
              {
                index: range.index + beforeRangeLength,
                length: nodeCoverLength,
              },
              file,
              coverFile,
            );
            handlerFlag[index] = nodeLength;
          });
        }
        return;
      }
      this.options.handler?.call(this, range, uploads);
    }
  }
}

export abstract class UploaderHandler<T> {
  quill: Quill;
  setQuill(quill: Quill): void {
    this.quill = quill;
  }
  abstract support(fileType: String): boolean;
  abstract handler(file: File): Promise<T>;
  abstract insert(range: Range, file: File, cover: T): number;
}
export abstract class AbstractUploaderHandler<T> extends UploaderHandler<T> {
  abstract support(fileType: String): boolean;
  abstract handler(file: File): Promise<T>;
  insert(range: Range, file: File, cover: T): number {
    const singleDelta = new Delta()
      .retain(range.index)
      .delete(range.length)
      .insert(this.deltaData(file, cover));
    this.quill.updateContents(singleDelta, Emitter.sources.USER);
    return 1;
  }
  protected abstract deltaData(file: File, cover: T): any;
}
export class ImageUploaderHandler extends AbstractUploaderHandler<String> {
  support(fileType: String) {
    if (!this.quill.scroll.query('image')) {
      return false;
    }
    return fileType.startsWith('image');
  }
  handler(file: File): Promise<String> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
  protected deltaData(file: File, cover: String): any {
    return { image: cover };
  }
}
Uploader.DEFAULTS = {
  mimetypes: ['image/png', 'image/jpeg'],
  handlers: [new ImageUploaderHandler()],
};

export default Uploader;
