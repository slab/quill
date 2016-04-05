import extend from 'extend';


class Module {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = typeof options === 'object' ? extend({}, this.constructor.DEFAULTS, options) : options;
  }
}
Module.DEFAULTS = {};


export default Module;
