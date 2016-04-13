import Emitter from 'quill/core/emitter';
import Theme from 'quill/core/theme';
import Picker from 'quill/ui/picker';
import icons from 'quill/ui/icons';


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
      className.split(/\s+/).map((n) => n.indexOf('ql-') === 0 ? n.slice('ql-'.length) : null).forEach((name) => {
        if ((name == null) || (icons[name] == null)) return;
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
