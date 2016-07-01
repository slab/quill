import Emitter from '../core/emitter';
import BaseTheme from './base';
import LinkTooltip from '../ui/link-tooltip';
import Picker from '../ui/picker';


class SnowTheme extends BaseTheme {
  constructor(quill, options) {
    super(quill, options);
    this.quill.container.classList.add('ql-snow');
  }

  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-snow');
    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')));
    this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')));
    if (toolbar.container.querySelector('.ql-link')) {
      this.linkTooltip = new LinkTooltip(this.quill);
      this.quill.keyboard.addBinding({ key: 'K', shortKey: true }, function(range, context) {
        toolbar.handlers['link'].call(toolbar, !context.format.link);
      });
    }
  }
}
SnowTheme.DEFAULTS = {
  modules: {
    toolbar: {
      container: [
        [{ header: ['1', '2', '3', false] }],
        ['bold', 'italic', 'underline', 'link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean']
      ],
      handlers: {
        link: function(value) {
          if (value) {
            let savedRange = this.quill.selection.savedRange;
            this.quill.theme.linkTooltip.open(savedRange);
          } else {
            this.quill.format('link', false);
          }
        },
      }
    }
  }
}


export default SnowTheme;
