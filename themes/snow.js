import Theme from '../core/theme';
import ColorPicker from '../ui/color-picker';
import Picker from '../ui/picker';

let icons = {
  'bold'      : require('../assets/icons/bold.svg'),
  'italic'    : require('../assets/icons/italic.svg'),
  'image'     : require('../assets/icons/image.svg'),
  'link'      : require('../assets/icons/link.svg'),
  'strike'    : require('../assets/icons/strike.svg'),
  'underline' : require('../assets/icons/underline.svg')
};


const COLORS = [
  "#000000", "#e60000", "#ff9900", "#ffff00", "#008A00", "#0066cc", "#9933ff",
  "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff",
  "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff",
  "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2",
  "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"
];

class SnowTheme extends Theme {
  constructor(quill, options) {
    super(quill);
    this.quill.container.classList.add('ql-snow');
    this.pickers = [];
    document.body.addEventListener('click', (e) => {
      this.pickers.forEach(function(picker) {
        if (picker.container !== e.target.parentNode) {
          picker.close();
        }
      });
    });
    this.quill.on(Quill.events.SELECTION_CHANGE, this.updatePickers, this)
              .on(Quill.events.TEXT_CHANGE, this.updatePickers, this);
  }

  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-snow');
    [].forEach.call(toolbar.container.querySelectorAll('select'), (select) => {
      if (select.classList.contains('ql-align')) {
        this.pickers.push(new Picker(select));
      } else if (select.classList.contains('ql-background') || select.classList.contains('ql-color')) {
        if (select.querySelector('option') == null) {
          let defaultColor = select.classList.contains('ql-background') ? '#ffffff' : '#000000';
          COLORS.forEach(function(color) {
            let option = document.createElement('option');
            if (color === defaultColor) {
              option.setAttribute('selected', 'selected');
            } else {
              option.setAttribute('value', color);
            }
            select.appendChild(option);
          });
        }
        let picker = new ColorPicker(select);
        let options = [].slice.call(picker.container.querySelectorAll('.ql-picker-item'), 0, 7);
        options.forEach(function(item) {
          item.classList.add('ql-primary');
        });
        this.pickers.push(picker);
      } else if (select.classList.contains('ql-font')) {
        this.pickers.push(new Picker(select));
      } else if (select.classList.contains('ql-size')) {
        this.pickers.push(new Picker(select));
      }
    });
    [].forEach.call(toolbar.container.querySelectorAll('button'), (button) => {
      let names = button.className.split(/\s+/);
      for (let i in names) {
        let format = names[i].slice('ql-'.length);
        if (icons[format] != null) {
          button.innerHTML = icons[format];
        }
      }
    });
  }

  updatePickers() {
    this.pickers.forEach(function(picker) {
      picker.update();
    });
  }
}


export default SnowTheme;
