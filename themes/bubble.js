import Emitter from '../core/emitter';
import Theme from '../core/theme';
import Picker from '../ui/picker';
import Tooltip from '../ui/tooltip';
import icons from '../ui/icons';
import { bindKeys } from '../modules/keyboard';


class BubbleTheme extends Theme {
  constructor(quill, options) {
    super(quill, options);
    this.quill.container.classList.add('ql-bubble');
  }

  extendToolbar(toolbar) {
    let container = this.quill.addContainer('ql-tooltip', this.quill.root);
    let tooltip = new Tooltip(container);
    container.innerHTML = '<div class="ql-link-editor"><input type="text"><a></a></div>';
    container.appendChild(toolbar.container);
    [].forEach.call(toolbar.container.querySelectorAll('button'), (button) => {
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
    container.classList.add('ql-hidden');
    this.quill.on(Emitter.events.SELECTION_CHANGE, (range) => {
      if (range != null && range.length > 0) {
        container.classList.remove('ql-hidden');
        let bounds = this.quill.getBounds(range);
        container.style.left = (bounds.left + bounds.width/2 - container.offsetWidth/2) + 'px';
        container.style.top = (bounds.bottom + 10) + 'px';
      } else {
        container.classList.add('ql-hidden');
      }
    });
    this.quill.controls['link'] = function(format, value) {
      if (value) {
        console.log('remove link');
      } else {
        console.log('toggle editor');
      }
    };
  }
}
BubbleTheme.DEFAULTS = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'link'],
      [{ header: 1 }, { header: 2 }, 'blockquote']
    ]
  }
}


export default BubbleTheme;
