import Parchment from 'parchment';


class StyleAttributor extends Parchment.Style {
  constructor(attrName, styleName, options = {}) {
    super(attrName, styleName);
    this.options = options;
  }

  add(node, value) {
    if (this.options.default != null && value === this.options.default) {
      this.remove(node);
    } else if (this.options.whitelist == null || this.options.whitelist.indexOf(value) > -1) {
      super.add(node, value);
    }
  }
}


export { StyleAttributor as default };
