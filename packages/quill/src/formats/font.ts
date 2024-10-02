import { ClassAttributor, Scope, StyleAttributor } from 'parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: [
    'arial',
    'comic-sans',
    'courier-new',
    'georgia',
    'helvetica',
    'lucida',
  ],
};

const FontClass = new ClassAttributor('font', 'ql-font', config);

class FontStyleAttributor extends StyleAttributor {
  value(node: HTMLElement) {
    return super.value(node).replace(/["']/g, '');
  }
}

const FontStyle = new FontStyleAttributor('font', 'font-family', config);

export { FontStyle, FontClass };
