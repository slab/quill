import extend from 'extend';
import Emitter from './emitter';
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

  addModule(name) {
    let moduleClass = this.quill.constructor.import(`modules/${name}`);
    if (moduleClass == null) {
      return debug.error(`Cannot load ${name} module. Are you sure you registered it?`);
    }
    let userOptions = this.options.modules[name] || {};
    if (userOptions === true) {
      // allow new Quill('#editor', { modules: { myModule: true }});
      userOptions = {};
    }
    if (typeof userOptions === 'object' && userOptions.constructor === Object) {
      let themeOptions = (this.constructor.DEFAULTS.modules || {})[name];
      userOptions = extend({}, moduleClass.DEFAULTS || {}, themeOptions, userOptions);
    }
    this.modules[name] = new moduleClass(this.quill, userOptions);
    return this.modules[name];
  }
}
Theme.DEFAULTS = {};
Theme.themes = {
  'default': Theme
};


export default Theme;
