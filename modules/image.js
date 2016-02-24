import extend from 'extend';
import Emitter from '../core/emitter';
import ImageBlot from '../formats/image';
import { bindKeys } from './keyboard';
import Tooltip from '../ui/tooltip';
import Module from '../core/module';


class ImageTooltip extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.container = this.quill.addContainer('ql-image-tooltip');
    this.tooltip = new Tooltip(this.container);
    this.container.innerHTML = this.options.template;
    this.preview = this.container.querySelector('.ql-preview');
    this.textbox = this.container.querySelector('input[type=text]');
    bindKeys(this.textbox, {
      'enter': this.save.bind(this),
      'escape': this.tooltip.hide.bind(this.tooltip)
    });
    this.container.querySelector('a.ql-action').addEventListener('click', this.save.bind(this));
    this.container.querySelector('a.ql-cancel').addEventListener('click', this.hide.bind(this));
    this.textbox.addEventListener('input', this.update.bind(this));
    quill.controls.image = (range, format, value) => {
      this.show();
    };
  }

  hide() {
    this.tooltip.hide();
    if (this.preview.firstChild != null) {
      this.preview.removeChild(this.preview.firstChild);
      this.preview.classList.add('ql-empty');
    }
    this.quill.focus();
  }

  save() {
    // TODO insert at correct location
    let url = this.options.sanitize(this.textbox.value);
    this.quill.insertEmbed(0, ImageBlot.blotName, url, Emitter.sources.USER);
    this.quill.setSelection(1, 1, Emitter.sources.SILENT);
    this.hide();
  }

  show() {
    let [left, top] = this.tooltip.center(this.container, this.quill.container);
    this.tooltip.show(left, top);
  }

  update() {
    if (!this.options.match(this.textbox.value)) return;
    let url = this.options.sanitize(this.textbox.value);
    if (this.preview.firstChild != null) {
      this.preview.firstChild.setAttribute('src', url);
    } else {
      let img = document.createElement('img');
      img.setAttribute('src', url);
      this.preview.appendChild(img);
      this.preview.classList.remove('ql-empty');
    }
  }
}
ImageTooltip.DEFAULTS = {
  match: function(url) {
    return /^https?:\/\/.+\.(jpe?g|gif|png)$/.test(url);
  },
  sanitize: function(url) {
    if (!/^https?:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  },
  template: [
    '<input class="input" type="text">',
    '<div class="ql-empty ql-preview"></div>',
    '<a class="ql-cancel"></a>',
    '<a class="ql-action"></a>'
  ].join('')
};


export default ImageTooltip;
