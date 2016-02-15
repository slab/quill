import Theme from '../core/theme';
import ColorPicker from '../ui/color-picker';
import Picker from '../ui/picker';


class SnowTheme extends Theme {
  constructor(quill, options) {
    super(quill);
    this.quill.container.classList.add('ql-snow');
    this.pickers = [];
    this.quill.on(this.quill.constructor.events.SELECTION_CHANGE, (range) => {
      if (range == null) return;
      this.pickers.forEach(function(picker) {
        picker.close();
      });
    });
    this.onModuleLoad('toolbar', this.extendToolbar.bind(this));
  }

  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-snow');
    ['color', 'background', 'font', 'size', 'align'].forEach((format) => {
      let select = toolbar.container.querySelector(".ql-" + format);
      if (select == null) return;
      switch (format) {
        case 'font': case 'size': case 'align':
          this.pickers.push(new Picker(select));
          break;
        case 'color': case 'background':
          let picker = new ColorPicker(select);
          let options = [].slice.call(picker.container.querySelectorAll('.ql-picker-item'));
          options.forEach(function(item, i) {
            if (i < 7) {
              return item.classList.add('ql-primary-color');
            }
          });
          this.pickers.push(picker);
          break;
      }
    });
  }
}
SnowTheme.COLORS = [
  "#000000", "#e60000", "#ff9900", "#ffff00", "#008A00", "#0066cc", "#9933ff",
  "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff",
  "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff",
  "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2",
  "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"
];


export default SnowTheme;
