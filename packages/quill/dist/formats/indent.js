import { ClassAttributor, Scope } from 'parchment';
class IndentAttributor extends ClassAttributor {
  add(node, value) {
    let normalizedValue = 0;
    if (value === '+1' || value === '-1') {
      const indent = this.value(node) || 0;
      normalizedValue = value === '+1' ? indent + 1 : indent - 1;
    } else if (typeof value === 'number') {
      normalizedValue = value;
    }
    if (normalizedValue === 0) {
      this.remove(node);
      return true;
    }
    return super.add(node, normalizedValue.toString());
  }
  canAdd(node, value) {
    return super.canAdd(node, value) || super.canAdd(node, parseInt(value, 10));
  }
  value(node) {
    return parseInt(super.value(node), 10) || undefined; // Don't return NaN
  }
}
const IndentClass = new IndentAttributor('indent', 'ql-indent', {
  scope: Scope.BLOCK,
  // @ts-expect-error
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});
export default IndentClass;
//# sourceMappingURL=indent.js.map