import Quill, { Theme } from "quill-next";

export class NextTheme extends Theme {
  constructor(quill: Quill, options: unknown) {
    super(quill, options as any);
    this.quill.container.classList.add('ql-snow');
    this.quill.container.classList.add('ql-next');
  }
}
