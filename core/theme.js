import extend from 'extend';
import Emitter from './emitter';
import logger from './logger';

let debug = logger('[quill:theme]');


class Theme {
  constructor(quill, options) {
    this.quill = quill;
    this.options = extend({}, this.constructor.DEFAULTS, options);
    this.options.modules = Object.keys(this.options.modules).reduce((modules, name) => {
      let value = this.options.modules[name];
      // allow new Quill('#editor', { modules: { myModule: true }});
      modules[name] = value === true ? {} : value;
      return modules;
    }, {});
    this.modules = {};
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
    if (typeof userOptions === 'object' && userOptions.constructor === Object) {
      let themeOptions = (this.constructor.DEFAULTS.modules || {})[name];
      userOptions = extend({}, moduleClass.DEFAULTS || {}, themeOptions, userOptions);
    }
    this.modules[name] = new moduleClass(this.quill, userOptions);
    return this.modules[name];
  }
}
Theme.DEFAULTS = {
  modules: {}
};
Theme.themes = {
  'default': Theme
};


export default Theme;
