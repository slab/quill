import Inline from '../blots/inline';

class Script extends Inline {
  static create(value) {
    if (value === 'super') {
      return document.createElement('sup');
    } else if (value === 'sub') {
      return document.createElement('sub');
    } else {
      return super.create(value);
    }
  }

  formats() {
    let format = super.formats();
    format.script = this.domNode.tagName === 'SUP' ? 'super' : 'sub';
    return format;
  }
}
Script.blotName = 'script';
Script.tagName = ['SUB', 'SUP'];

export default Script;
