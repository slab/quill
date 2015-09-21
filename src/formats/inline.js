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

class Italic extends Parchment.Inline { }
Italic.blotName = 'italic';
Italic.tagName = 'EM';

class Strike extends Parchment.Inline { }
Strike.blotName = 'strike';
Strike.tagName = 'S';

class Underline extends Parchment.Inline { }
Underline.blotName = 'underline';
Underline.tagName = 'U';

class InlineCode extends Parchment.Inline { }
InlineCode.blotName = 'inline-code';
InlineCode.tagName = 'CODE';


class Link extends Parchment.Inline {
  constructor(value) {
    super(value);
    if (typeof value === 'string') {
      this.domNode.setAttribute('href', value);
    }
  }

  getFormat() {
    let formats = super.getFormat();
    formats.link = this.domNode.getAttribute('href');
    return formats;
  }
}
Link.blotName = 'link';
Link.tagName = 'A';


class Script extends Parchment.Inline {
  constructor(value) {
    if (value === 'super') {
      value = document.createElement('sup');
    } else if (value === 'sub') {
      value = document.createElement('sub');
    }
    super(value);
  }

  getFormat() {
    let formats = super.getFormat();
    formats.script = this.domNode.tagName === 'SUP' ? 'super' : 'sub';
    return formats;
  }
}
Script.blotName = 'script';
Script.tagName = ['SUB', 'SUP'];


class InlineAttributor extends StyleAttributor {
  add(node, value) {
    let blot = Parchment.findBlot(node);
    if (blot instanceof Parchment.Inline) {
      super.add(node, value);
    }
  }
}


let Background = new InlineAttributor('background', 'background-color');
let Color = new InlineAttributor('color', 'color');
let Font = new InlineAttributor('font', 'font-family');
let Size = new InlineAttributor('size', 'font-size');


Parchment.register(Bold);
Parchment.register(Italic);
Parchment.register(Strike);
Parchment.register(Underline);
Parchment.register(InlineCode);
Parchment.register(Link);
Parchment.register(Script);
Parchment.register(Background);
Parchment.register(Color);
Parchment.register(Font);
Parchment.register(Size);


export { Bold, Italic, Strike, Underline, Link, InlineCode, Script, Background, Color, Font, Size };
