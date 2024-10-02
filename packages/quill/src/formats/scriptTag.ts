import Block from '../blots/block.js';

class ScriptTag extends Block {
  static blotName = 'script';
  static tagName = 'SCRIPT';

  static insertAt() {
    return;
  }

  static insertBefore() {
    return;
  }

  static replaceWith() {
    return;
  }

  format() {
    return;
  }

  formatAt() {
    return;
  }
}

export default ScriptTag;
