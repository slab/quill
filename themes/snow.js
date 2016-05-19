import Emitter from '../core/emitter';
import BaseTheme from './base';
import ColorPicker from '../ui/color-picker';
import IconPicker from '../ui/icon-picker';
import ImageTooltip from '../ui/image-tooltip';
import icons from '../ui/icons';
import LinkTooltip from '../ui/link-tooltip';
import Picker from '../ui/picker';


const ALIGNS = [ false, 'center', 'right', 'justify' ];

const COLORS = [
  "#000000", "#e60000", "#ff9900", "#ffff00", "#008A00", "#0066cc", "#9933ff",
  "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff",
  "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff",
  "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2",
  "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"
];

const FONTS = [ false, 'serif', 'monospace' ];

const HEADERS = [ '1', '2', '3', false ];

const SIZES = [ 'small', false, 'large', 'huge' ];

class SnowTheme extends BaseTheme {
  constructor(quill, options) {
    super(quill, options);
    this.quill.container.classList.add('ql-snow');
  }

  buildPickers(selects) {
    let pickers = selects.map((select) => {
      let picker;
      if (select.classList.contains('ql-align')) {
        if (select.querySelector('option') == null) {
          fillSelect(select, ALIGNS);
        }
        picker = new IconPicker(select, icons.align);
      } else if (select.classList.contains('ql-background') || select.classList.contains('ql-color')) {
        let format = select.classList.contains('ql-background') ? 'background' : 'color';
        if (select.querySelector('option') == null) {
          fillSelect(select, COLORS, format === 'background' ? '#ffffff' : '#000000');
        }
        picker = new ColorPicker(select, icons[format]);
      } else {
        if (select.querySelector('option') == null) {
          if (select.classList.contains('ql-font')) {
            fillSelect(select, FONTS);
          } else if (select.classList.contains('ql-header')) {
            fillSelect(select, HEADERS);
          } else if (select.classList.contains('ql-size')) {
            fillSelect(select, SIZES);
          }
        }
        picker = new Picker(select);
      }
      return picker;
    });
    let update = function() {
      pickers.forEach(function(picker) {
        picker.update();
      });
    };
    this.quill.on(Emitter.events.SELECTION_CHANGE, update)
              .on(Emitter.events.TEXT_CHANGE, update);
    document.body.addEventListener('click', (e) => {
      pickers.forEach(function(picker) {
        if (!(e.target.compareDocumentPosition(picker.container) & Node.DOCUMENT_POSITION_CONTAINS)) {
          picker.close();
        }
      });
    });
  }

  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-snow');
    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')));
    this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')));
    if (toolbar.container.querySelector('.ql-image')) {
      this.imageTooltip = new ImageTooltip(this.quill);
    }
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
    'toolbar': {
      container: [
        [{ header: HEADERS }],
        ['bold', 'italic', 'underline', 'link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean']
      ],
      handlers: {
        'image': function() {
          this.quill.theme.imageTooltip.show();
        },
        'link': function(value) {
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

function fillSelect(select, values, defaultValue = false) {
  values.forEach(function(value) {
    let option = document.createElement('option');
    if (value === defaultValue) {
      option.setAttribute('selected', 'selected');
    } else {
      option.setAttribute('value', value);
    }
    select.appendChild(option);
  });
}


export default SnowTheme;
