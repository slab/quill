import Quill from '../quill';
import Tooltip from '../ui/tooltip';
import extend from 'extend';

let Delta = Quill.import('delta');
let Range = Quill.import('range');


class ImageTooltip extends Tooltip {
  constructor(quill, options = {}) {
    options = extend({}, Tooltip.DEFAULTS, options);
    super(quill, options);
    this.preview = this.container.querySelector('.preview');
    this.textbox = this.container.querySelector('.input');
    this.container.classList.add('ql-image-tooltip');
    this.initListeners();
  }

  initListeners() {
    this.quill.root.addEventListener('focus', this.hide.bind(this));
    this.container.querySelector('.insert').addEventListener('click', this.insertImage.bind(this));
    this.container.querySelector('.cancel').addEventListener('click', this.hide.bind(this));
    this.textbox.addEventListener('input', this._preview.bind(this));
    this.initTextbox(this.textbox, this.insertImage, this.hide);
    this.quill.onModuleLoad('toolbar', (toolbar) => {
      this.toolbar = toolbar;
      toolbar.initFormat('image', this._onToolbar.bind(this));
    });
  }

  insertImage() {
    let url = this._normalizeURL(this.textbox.value);
    this.preview.innerHTML = '<span>Preview</span>';
    this.textbox.value = '';
    this.hide();
    let range = this.quill.getSelection();
    if (range != null) {
      this.quill.insertEmbed(range.start, 'image', url, 'user');
      this.quill.setSelection(range.start + 1, range.start + 1);
    }
  }

  _matchImageURL(url) {
    return /^https?:\/\/.+\.(jpe?g|gif|png)$/.test(url);
  }

  _normalizeURL(url) {
    // For now identical to link-tooltip but will change when we allow data uri
    if (!/^https?:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  _onToolbar(range, value) {
    if (value) {
      if (this.textbox.value.length === 0) {
        this.textbox.value = 'http://';
      }
      this.show();
      this.textbox.focus();
      setTimeout(() => {
        this.textbox.setSelectionRange(this.textbox.value.length, this.textbox.value.length);
      }, 0);
    } else {
      this.quill.deleteText(range, 'user');
      this.toolbar.setActive('image', false);
    }
  }

  _preview() {
    if (!this._matchImageURL(this.textbox.value)) return;
    if (this.preview.firstChild.tagName === 'IMG') {
      this.preview.firstChild.setAttribute('src', this.textbox.value);
    } else {
      let img = document.createElement('img');
      img.setAttribute('src', this.textbox.value);
      this.preview.replaceChild(img, this.preview.firstChild);
    }
  }
}
ImageTooltip.DEFAULTS = {
  template: `
    <input class="input" type="textbox">
    <div class="preview">
      <span>Preview</span>
    </div>
    <a href="javascript:;" class="cancel">Cancel</a>
    <a href="javascript:;" class="insert">Insert</a>`
};


Quill.registerModule('image-tooltip', ImageTooltip);

export { ImageTooltip as default };
