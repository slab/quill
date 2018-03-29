import Parchment from 'parchment';

const config = {
  scope: Parchment.Scope.INLINE,
  whitelist: ['serif', 'monospace'],
};

const FontClass = new Parchment.Attributor.Class('font', 'ql-font', config);

class FontStyleAttributor extends Parchment.Attributor.Style {
  value(node) {
    return super.value(node).replace(/["']/g, '');
  }
}

const FontStyle = new FontStyleAttributor('font', 'font-family', config);

export { FontStyle, FontClass };
