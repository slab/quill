import Emitter from '../core/emitter';
import Theme from '../core/theme';
import Picker from '../ui/picker';
import icons from '../ui/icons';
import { bindKeys } from '../modules/keyboard';


class BaseTheme extends Theme {
  addModule(name, options) {
    let module = super.addModule(name, options);
    if (name === 'toolbar') {
      this.extendToolbar(module);
    }
    return module;
  }

  buildButtons(buttons) {
    buttons.forEach(function(button) {
      let className = button.getAttribute('class') || '';
      let names = className.split(/\s+/);
      for (let i in names) {
        let name = names[i].slice('ql-'.length);
        if (icons[name] == null) return;
        if (typeof icons[name] === 'string') {
          button.innerHTML = icons[name];
        } else {
          let value = button.getAttribute('data-value') || '';
          if (value != null && icons[name][value]) {
            button.innerHTML = icons[name][value];
          }
        }
      }
    });
  }
}
BaseTheme.DEFAULTS = {};


export default BaseTheme;
