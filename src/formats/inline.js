import Parchment from 'parchment';
import StyleAttributor from './attributor';


// Earlier means higher in the DOM tree
let order = [
  'link',               // Must be earlier
  'script', 'italic', 'bold', 'strike', 'underline', 'code',
  'inline', 'cursor'    // Must be later
];


Parchment.Inline.compare = function(self, other) {
  let selfIndex = order.indexOf(self);
  let otherIndex = order.indexOf(other);
  if (selfIndex !== otherIndex) {
    return selfIndex >= otherIndex;
  } else {
    return self >= other;
  }
};


class Bold extends Parchment.Inline { }
Bold.blotName = 'bold';
Bold.tagName = 'STRONG';

class Code extends Parchment.Inline { }
Code.blotName = 'code';
Code.tagName = 'CODE';

class Italic extends Parchment.Inline { }
Italic.blotName = 'italic';
Italic.tagName = 'EM';

class Strike extends Parchment.Inline { }
Strike.blotName = 'strike';
Strike.tagName = 'S';

class Underline extends Parchment.Inline { }
Underline.blotName = 'underline';
Underline.tagName = 'U';


class Link extends Parchment.Inline {
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


class Script extends Parchment.Inline {
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
