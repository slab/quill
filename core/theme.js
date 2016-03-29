import Emitter from './emitter';
import extend from 'extend';
import logger from './logger';

let debug = logger('[quill:theme]');


class Theme {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.modules = {};
    this.quill.once(Emitter.events.READY, this.init.bind(this));
  }

  init() {
    Object.keys(this.options.modules).forEach((name) => {
      if (this.modules[name] == null) {
        this.addModule(name);
      }
    });
  }

  destroy() {
    Object.keys(this.modules).forEach((name) => {
      let module = this.modules[name];
      if (typeof module.destroy === 'function') {
        module.destroy();
      }
    });
  }

  addModule(name) {
    let moduleClass = Theme.modules[name];
    if (moduleClass == null) {
      return debug.error(`Cannot load ${name} module. Are you sure you registered it?`);
    }
    let options = this.options.modules[name];
    if (options === true) {  // Allow addModule('module', true)
      options = {};
    } else if (typeof options !== 'object' && !(options instanceof HTMLElement)) {
      // Allow addModule('toolbar', '#toolbar');
      options = { container: options };
    }
    options = extend(true, {}, moduleClass.DEFAULTS || {}, options);
    this.modules[name] = new moduleClass(this.quill, options);
    return this.modules[name];
  }
}
Theme.DEFAULTS = {};
Theme.themes = {
  'default': Theme
};
Theme.modules = {};


export default Theme;
