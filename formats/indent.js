import { ClassAttributor, Scope } from 'parchment';

class IndentAttributor extends ClassAttributor {
  add(node, value) {
    if (value === '+1' || value === '-1') {
      const indent = this.value(node) || 0;
      value = value === '+1' ? indent + 1 : indent - 1;
    }
    if (value === 0) {
      this.remove(node);
      return true;
    }
    return super.add(node, value);
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
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8],
});

export default IndentClass;
