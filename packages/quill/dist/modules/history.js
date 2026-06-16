import { Scope } from 'parchment';
import Module from '../core/module.js';
import Quill from '../core/quill.js';
class History extends Module {
  static DEFAULTS = {
    delay: 1000,
    maxStack: 100,
    userOnly: false
  };
  lastRecorded = 0;
  ignoreChange = false;
  stack = {
    undo: [],
    redo: []
  };
  currentRange = null;
  constructor(quill, options) {
    super(quill, options);
    this.quill.on(Quill.events.EDITOR_CHANGE, (eventName, value, oldValue, source) => {
      if (eventName === Quill.events.SELECTION_CHANGE) {
        if (value && source !== Quill.sources.SILENT) {
          this.currentRange = value;
        }
      } else if (eventName === Quill.events.TEXT_CHANGE) {
        if (!this.ignoreChange) {
          if (!this.options.userOnly || source === Quill.sources.USER) {
            this.record(value, oldValue);
          } else {
            this.transform(value);
          }
        }
        this.currentRange = transformRange(this.currentRange, value);
      }
    });
    this.quill.keyboard.addBinding({
      key: 'z',
      shortKey: true
    }, this.undo.bind(this));
    this.quill.keyboard.addBinding({
      key: ['z', 'Z'],
      shortKey: true,
      shiftKey: true
    }, this.redo.bind(this));
    if (/Win/i.test(navigator.platform)) {
      this.quill.keyboard.addBinding({
        key: 'y',
        shortKey: true
      }, this.redo.bind(this));
    }
    this.quill.root.addEventListener('beforeinput', event => {
      if (event.inputType === 'historyUndo') {
        this.undo();
        event.preventDefault();
      } else if (event.inputType === 'historyRedo') {
        this.redo();
        event.preventDefault();
      }
    });
  }
  change(source, dest) {
    if (this.stack[source].length === 0) return;
    const item = this.stack[source].pop();
    if (!item) return;
    const base = this.quill.getContents();
    const inverseDelta = item.delta.invert(base);
    this.stack[dest].push({
      delta: inverseDelta,
      range: transformRange(item.range, inverseDelta)
    });
    this.lastRecorded = 0;
    this.ignoreChange = true;
    this.quill.updateContents(item.delta, Quill.sources.USER);
    this.ignoreChange = false;
    this.restoreSelection(item);
  }
  clear() {
    this.stack = {
      undo: [],
      redo: []
    };
  }
  cutoff() {
    this.lastRecorded = 0;
  }
  record(changeDelta, oldDelta) {
    if (changeDelta.ops.length === 0) return;
    this.stack.redo = [];
    let undoDelta = changeDelta.invert(oldDelta);
    let undoRange = this.currentRange;
    const timestamp = Date.now();
    if (
    // @ts-expect-error Fix me later
    this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
      const item = this.stack.undo.pop();
      if (item) {
        undoDelta = undoDelta.compose(item.delta);
        undoRange = item.range;
      }
    } else {
      this.lastRecorded = timestamp;
    }
    if (undoDelta.length() === 0) return;
    this.stack.undo.push({
      delta: undoDelta,
      range: undoRange
    });
    // @ts-expect-error Fix me later
    if (this.stack.undo.length > this.options.maxStack) {
      this.stack.undo.shift();
    }
  }
  redo() {
    this.change('redo', 'undo');
  }
  transform(delta) {
    transformStack(this.stack.undo, delta);
    transformStack(this.stack.redo, delta);
  }
  undo() {
    this.change('undo', 'redo');
  }
  restoreSelection(stackItem) {
    if (stackItem.range) {
      this.quill.setSelection(stackItem.range, Quill.sources.USER);
    } else {
      const index = getLastChangeIndex(this.quill.scroll, stackItem.delta);
      this.quill.setSelection(index, Quill.sources.USER);
    }
  }
}
function transformStack(stack, delta) {
  let remoteDelta = delta;
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const oldItem = stack[i];
    stack[i] = {
      delta: remoteDelta.transform(oldItem.delta, true),
      range: oldItem.range && transformRange(oldItem.range, remoteDelta)
    };
    remoteDelta = oldItem.delta.transform(remoteDelta);
    if (stack[i].delta.length() === 0) {
      stack.splice(i, 1);
    }
  }
}
function endsWithNewlineChange(scroll, delta) {
  const lastOp = delta.ops[delta.ops.length - 1];
  if (lastOp == null) return false;
  if (lastOp.insert != null) {
    return typeof lastOp.insert === 'string' && lastOp.insert.endsWith('\n');
  }
  if (lastOp.attributes != null) {
    return Object.keys(lastOp.attributes).some(attr => {
      return scroll.query(attr, Scope.BLOCK) != null;
    });
  }
  return false;
}
function getLastChangeIndex(scroll, delta) {
  const deleteLength = delta.reduce((length, op) => {
    return length + (op.delete || 0);
  }, 0);
  let changeIndex = delta.length() - deleteLength;
  if (endsWithNewlineChange(scroll, delta)) {
    changeIndex -= 1;
  }
  return changeIndex;
}
function transformRange(range, delta) {
  if (!range) return range;
  const start = delta.transformPosition(range.index);
  const end = delta.transformPosition(range.index + range.length);
  return {
    index: start,
    length: end - start
  };
}
export { History as default, getLastChangeIndex };
//# sourceMappingURL=history.js.map