import Emitter from './emitter';


class Theme {
  constructor(quill) {
    this.quill = quill;
    this.quill.container.classList.add('ql-container');
  }

  onModuleLoad(name, callback) {
    if (this.quill.modules[name]) {   // Module already loaded
      callback(this.quill.modules[name]);
    }
    this.quill.on(Emitter.events.MODULE_LOAD, function(moduleName, module) {
      if (moduleName === name) {
        return callback(module);
      }
    });
  }
}
Theme.OPTIONS = {};


export default Theme;
