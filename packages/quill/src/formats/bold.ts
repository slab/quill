import Inline from '../blots/inline';

class Bold extends Inline {
  static blotName = 'bold';
  static tagName = ['STRONG', 'B'];

  static create() {
    return super.create();
  }

  static formats() {
    return true;
  }

  optimize(context: { [key: string]: any }) {
    super.optimize(context);
    if (this.domNode.tagName !== this.statics.tagName[0]) {
      this.replaceWith(this.statics.blotName);
    }
  }
}

export default Bold;
