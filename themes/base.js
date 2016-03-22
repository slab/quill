import Emitter from '../core/emitter';
import Theme from '../core/theme';
import Picker from '../ui/picker';
import icons from '../ui/icons';


class BaseTheme extends Theme {
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
        name = name.slice('ql-'.length);
        if (icons[name] == null) return;
        if (typeof icons[name] === 'string') {
          button.innerHTML = icons[name];
        } else {
          let value = button.getAttribute('data-value') || '';
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
