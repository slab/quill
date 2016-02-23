import extend from 'extend';
import { bindKeys } from './keyboard';
import LinkFormat from '../formats/link';
import Module from '../core/module';
import Tooltip from '../ui/tooltip';


class LinkTooltip extends Module {
  constructor(quill, options = {}) {
    super(quill, options);
    this.container = this.quill.addContainer('ql-link-tooltip');
    this.tooltip = new Tooltip(this.container);
    this.container.innerHTML = this.options.template;
    this.preview = this.container.querySelector('a.preview');
    this.textbox = this.container.querySelector('input[type=text]');
    bindKeys(this.textbox, {
      'enter': this.save.bind(this),
      'escape': this.tooltip.hide.bind(this.tooltip)
    });
    this.container.querySelector('a.action').addEventListener('click', () => {
      if (this.container.classList.contains('ql-editing')) {
        this.save();
      } else {
        this.edit();
      }
    });
    this.container.querySelector('a.remove').addEventListener('click', this.remove.bind(this));
    quill.keyboard.addBinding({ key: 'K', metaKey: true}, this.toggle.bind(this));
    quill.on(Quill.events.SELECTION_CHANGE, this.toggle.bind(this));
  }

  edit() {
    this.container.classList.add('ql-editing');
    this.textbox.focus();
    this.textbox.setSelectionRange(0, this.textbox.value.length);
  }

  remove() {
    this.link.format('link', null);
    this.tooltip.hide();
  }

  save() {
    let url = this.options.sanitize(this.textbox.value);
    this.link.format('link', url);
    this.preview.textContent = this.link.formats()['link'];
    this.show();
  }

  show() {
    this.container.classList.remove('ql-editing');
    let url = this.options.sanitize(this.link.domNode.getAttribute('href'));
    this.textbox.value = url;
    this.preview.textContent = url;
    let [left, top] = this.tooltip.position(this.link.domNode, this.quill.container, this.options.offset);
    this.tooltip.show(left, top);
  }

  toggle(range) {
    if (range == null || range.length > 0) return;
    let [link, ] = this.quill.scroll.descendant(LinkFormat, range.index, true);
    if (link != null) {
      this.link = link;
      this.show();
    } else {
      this.tooltip.hide();
      this.quill.focus();
    }
  }
}
LinkTooltip.DEFAULTS = {
  offset: 10,
  sanitize: function(url) {
    if (!/^(https?:\/\/|mailto:)/.test(url)) {
      url = 'http://' + url;
    }
    return url;
  },
  template: [
    '<a class="preview" target="_blank" href="about:blank"></a>',
    '<input type="text">',
    '<a class="remove"></a>',
    '<a class="action"></a>'
  ].join('')
};


export default LinkTooltip;
