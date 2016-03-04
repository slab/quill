import Emitter from '../core/emitter';
import ImageBlot from '../formats/image';
import { bindKeys } from './keyboard';
import Module from '../core/module';


class ImageTooltip extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.tooltip = this.quill.addContainer('ql-image-tooltip');
    this.tooltip.classList.add('ql-hidden');
    this.tooltip.classList.add('ql-tooltip');
    this.tooltip.innerHTML = options.template;
    this.preview = this.tooltip.querySelector('.ql-preview');
    this.textbox = this.tooltip.querySelector('input[type=text]');
    bindKeys(this.textbox, {
      'enter': this.save.bind(this),
      'escape': this.hide.bind(this)
    });
    this.tooltip.querySelector('a.ql-action').addEventListener('click', this.save.bind(this));
    this.tooltip.querySelector('a.ql-cancel').addEventListener('click', this.hide.bind(this));
    this.textbox.addEventListener('input', this.update.bind(this));
  }

  center() {
    this.tooltip.style.left = (this.quill.container.offsetWidth/2 - this.tooltip.offsetWidth/2) + 'px';
    this.tooltip.style.top = (this.quill.container.offsetHeight/2 - this.tooltip.offsetHeight/2) + 'px';
  }

  hide() {
    this.tooltip.classList.add('ql-hidden');
    if (this.preview.firstChild != null) {
      this.preview.removeChild(this.preview.firstChild);
      this.preview.classList.add('ql-empty');
    }
    this.quill.focus();
  }

  save() {
    let range = this.quill.getSelection(true);
    let index = range.index + range.length;
    this.quill.insertEmbed(index, ImageBlot.blotName, this.textbox.value, Emitter.sources.USER);
    this.quill.setSelection(index + 1, Emitter.sources.SILENT);
    this.hide();
  }

  show() {
    this.tooltip.classList.remove('ql-hidden');
    this.textbox.focus();
    this.center();
    return true;
  }

  update() {
    if (!ImageBlot.match(this.textbox.value)) return;
    let url = ImageBlot.sanitize(this.textbox.value);
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
  template: [
    '<input class="input" type="text">',
    '<div class="ql-empty ql-preview"></div>',
    '<a class="ql-cancel"></a>',
    '<a class="ql-action"></a>'
  ].join('')
};


export default ImageTooltip;
