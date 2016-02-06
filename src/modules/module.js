import extend from 'extend';


class Module {
  constructor(quill, options = {}) {
    this.quill = quill;
    // TODO does this work with Babel?
    this.options = extend({}, this.constructor.DEFAULTS, options);
  }
}
Module.DEFAULTS = {};


export default Module;
