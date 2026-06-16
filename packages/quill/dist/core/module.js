class Module {
  static DEFAULTS = {};
  constructor(quill) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.quill = quill;
    this.options = options;
  }
}
export default Module;
//# sourceMappingURL=module.js.map