import type Quill from './quill.js';

abstract class Module<T extends {} = {}> {
  static DEFAULTS = {};

  constructor(
    public quill: Quill,
    protected options: Partial<T> = {},
  ) {}

  destroy?(): void;
}

export default Module;
