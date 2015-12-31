import Quill from '../quill';
import extend from 'extend';

let Delta = Quill.import('delta');


class UndoManager {
  constructor(quill, options) {
    this.quill = quill;
    if (options == null) {
      options = {};
    }
    this.options = extend({}, UndoManager.DEFAULTS, options);
    this.lastRecorded = 0;
    this.ignoreChange = false;
    this.clear();
    this.quill.on(Quill.events.TEXT_CHANGE, (delta, source) => {
      if (this.ignoreChange) return;
      if (!this.options.userOnly || source === Quill.sources.USER) {
        this.record(delta, this.oldDelta);
      } else {
        this.transform(delta);
      }
      this.oldDelta = this.quill.getContents();
    });
  }

  change(source, dest) {
    if (this.stack[source].length === 0) return;
    let delta = this.stack[source].pop();
    this.lastRecorded = 0;
    this.ignoreChange = true;
    this.quill.updateContents(delta[source], Quill.sources.USER);
    this.ignoreChange = false;
    let index = getLastChangeIndex(delta[source]);
    this.quill.setSelection(index, index);
    this.oldDelta = this.quill.getContents();
    this.stack[dest].push(delta);
  }

  clear() {
    this.stack = { undo: [], redo: [] };
    this.oldDelta = this.quill.getContents();
  }

  record(changeDelta, oldDelta) {
    if (changeDelta.ops.length === 0) return;
    this.stack.redo = [];
    let undoDelta = this.quill.getContents().diff(this.oldDelta);
    let timestamp = Date.now();
    if (this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
      let delta = this.stack.undo.pop();
      undoDelta = undoDelta.compose(delta.undo);
      changeDelta = delta.redo.compose(changeDelta);
    } else {
      this.lastRecorded = timestamp;
    }
    this.stack.undo.push({
      redo: changeDelta,
      undo: undoDelta
    });
    if (this.stack.undo.length > this.options.maxStack) {
      this.stack.undo.unshift();
    }
  }

  redo() {
    this.change('redo', 'undo');
  }

  transform(delta) {
    this.oldDelta = delta.transform(this.oldDelta, true);
    this.stack.undo.forEach(function(change) {
      change.undo = delta.transform(change.undo, true);
      change.redo = delta.transform(change.redo, true);
    });
    this.stack.redo.forEach(function(change) {
      change.undo = delta.transform(change.undo, true);
      change.redo = delta.transform(change.redo, true);
    });
  }

  undo() {
    this.change('undo', 'redo');
  }
}
UndoManager.DEFAULTS = {
  delay: 1000,
  maxStack: 100,
  userOnly: false
};

function getLastChangeIndex(delta) {
  let index = 0, lastIndex = 0;
  delta.ops.forEach(function(op) {
    if (op.insert != null) {
      lastIndex = Math.max(index + (op.insert.length || 1), lastIndex);
    } else if (op["delete"] != null) {
      lastIndex = Math.max(index, lastIndex);
    } else if (op.retain != null) {
      if (op.attributes != null) {
        lastIndex = Math.max(index + op.retain, lastIndex);
      }
      index += op.retain;
    }
  });
  return lastIndex;
}


Quill.registerModule('undo-manager', UndoManager);

export { UndoManager as default };
