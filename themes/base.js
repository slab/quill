import Emitter from '../core/emitter';
import Theme from '../core/theme';
import Picker from '../ui/picker';
import icons from '../ui/icons';


class BaseTheme extends Theme {
  constructor(quill, options) {
    super(quill, options);
    if (this.options.modules.toolbar != null &&
        this.options.modules.toolbar.constructor !== Object) {
      this.options.modules.toolbar = { container: this.options.modules.toolbar };
    }
  }

  addModule(name) {
    let module = super.addModule(name);
    if (name === 'toolbar') {
      this.extendToolbar(module);
    }
    return module;
  }

  buildButtons(buttons) {
    buttons.forEach(function(button) {
      let className = button.getAttribute('class') || '';
      className.split(/\s+/).forEach((name) => {
        if (!name.startsWith('ql-')) return;
        name = name.slice('ql-'.length);
        if (icons[name] == null) return;
        if (name === 'direction') {
          button.innerHTML = icons[name][''] + icons[name]['rtl'];
        } else if (typeof icons[name] === 'string') {
          button.innerHTML = icons[name];
        } else {
          let value = button.value || '';
          if (value != null && icons[name][value]) {
            button.innerHTML = icons[name][value];
          }
        }
      });
    });
  }
}
BaseTheme.DEFAULTS = {};


export default BaseTheme;
