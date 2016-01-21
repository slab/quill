import Inline from '../blots/inline';
import Parchment from 'parchment';
import StyleAttributor from './attributor';


class Bold extends Inline { }
Bold.blotName = 'bold';
Bold.tagName = 'STRONG';

class Code extends Inline { }
Code.blotName = 'code';
Code.tagName = 'CODE';

class Italic extends Inline { }
Italic.blotName = 'italic';
Italic.tagName = 'EM';

class Strike extends Inline { }
Strike.blotName = 'strike';
Strike.tagName = 'S';

class Underline extends Inline { }
Underline.blotName = 'underline';
Underline.tagName = 'U';


class Link extends Inline {
  formats() {
    let format = super.formats();
    format.link = this.domNode.getAttribute('href') || true;
    return format;
  }
}
Link.blotName = 'link';
Link.tagName = 'A';
Link.create = function(value) {
  let node = Parchment.Inline.create.call();
  if (typeof value === 'string') {
    this.domNode.setAttribute('href', value);
  }
  return node;
}


class Script extends Inline {
  formats() {
    let format = super.formats();
    format.script = this.domNode.tagName === 'SUP' ? 'super' : 'sub';
    return format;
  }
}
Script.blotName = 'script';
Script.tagName = ['SUB', 'SUP'];
Script.create = function(value) {
  if (value === 'super') {
    return document.createElement('sup');
  } else if (value === 'sub') {
    return document.createElement('sub');
  } else {
    return Parchment.Inline.create(value);
  }
}


Parchment.register(Bold);
Parchment.register(Code);
Parchment.register(Italic);
Parchment.register(Strike);
Parchment.register(Underline);
Parchment.register(Link);
Parchment.register(Script);

export { Bold, Italic, Strike, Underline, Link, Code, Script };
