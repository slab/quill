import Quill from '../core/quill';
import ImageBlot from '../formats/image';
import Keyboard from '../modules/keyboard';


class ImageTooltip {
  constructor(quill) {
    this.quill = quill;
    this.container = this.quill.addContainer('ql-image-tooltip');
    this.container.classList.add('ql-hidden');
    this.container.classList.add('ql-tooltip');
    this.container.innerHTML = this.constructor.TEMPLATE;
    this.preview = this.container.querySelector('.ql-preview');
    this.textbox = this.container.querySelector('input[type=text]');
    this.textbox.addEventListener('keydown', (event) => {
      if (Keyboard.match(event, 'enter')) {
        this.save();
        event.preventDefault();
      } else if (Keyboard.match(event, 'escape')) {
        this.hide();
        event.preventDefault();
      }
    });
    ['mousedown', 'touchstart'].forEach((name) => {
      this.container.querySelector('a.ql-action').addEventListener(name, (event) => {
        this.save();
        event.preventDefault();
      });
      this.container.querySelector('a.ql-cancel').addEventListener(name, (event) => {
        this.hide();
        event.preventDefault();
      });
    });
    this.textbox.addEventListener('input', this.update.bind(this));
  }

  center() {
    this.container.style.left = (this.quill.container.offsetWidth/2 - this.container.offsetWidth/2) + 'px';
    this.container.style.top = (this.quill.container.offsetHeight/2 - this.container.offsetHeight/2) + 'px';
  }

  hide() {
    this.container.classList.add('ql-hidden');
    if (this.preview.firstChild != null) {
      this.preview.removeChild(this.preview.firstChild);
      this.preview.classList.add('ql-empty');
    }
    this.quill.focus();
  }

  save() {
    let range = this.quill.getSelection(true);
    let index = range.index + range.length;
    this.quill.insertEmbed(index, ImageBlot.blotName, this.textbox.value, Quill.sources.USER);
    this.quill.setSelection(index + 1, Quill.sources.SILENT);
    this.textbox.value = '';
    this.hide();
  }

  show() {
    this.container.classList.remove('ql-hidden');
    this.center();
    this.textbox.focus();
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
ImageTooltip.TEMPLATE = [
  '<input class="input" type="text">',
  '<div class="ql-empty ql-preview"></div>',
  '<a class="ql-cancel"></a>',
  '<a class="ql-action"></a>'
].join('');


export default ImageTooltip;
