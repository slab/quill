import Parchment from 'parchment';

let config = {
  scope: Parchment.Scope.INLINE,
  whitelist: ['serif', 'monospace']
};

let FontClass = new Parchment.Attributor.Class('font', 'ql-font', config);

class FontStyleAttributor extends Parchment.Attributor.Style {
  value(node) {
    return super.value(node).replace(/["']/g, '');
  }
}

let FontStyle = new FontStyleAttributor('font', 'font-family', config);

export { FontStyle, FontClass };
