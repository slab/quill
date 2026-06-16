import { ClassAttributor, Scope, StyleAttributor } from 'parchment';
const config = {
  scope: Scope.INLINE,
  whitelist: ['serif', 'monospace']
};
const FontClass = new ClassAttributor('font', 'ql-font', config);
class FontStyleAttributor extends StyleAttributor {
  value(node) {
    return super.value(node).replace(/["']/g, '');
  }
}
const FontStyle = new FontStyleAttributor('font', 'font-family', config);
export { FontStyle, FontClass };
//# sourceMappingURL=font.js.map