import Quill from './quill';

class Module {
  static DEFAULTS = {};

  constructor(protected quill: Quill, protected options = {}) {}
}

export default Module;
