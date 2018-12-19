import { Scope } from 'parchment';
import Delta, { Op } from 'quill-delta';
import Quill from '../core/quill';
import Module from '../core/module';

const UNDO_CHANGE = 'undo';
const REDO_CHANGE = 'redo';

class History extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.lastRecorded = 0;
    this.changeType = false;
    this.clear();
    this.quill.on(
      Quill.events.EDITOR_CHANGE,
      (eventName, delta, oldDelta, source) => {
        if (eventName !== Quill.events.TEXT_CHANGE) return;
        if (!this.options.userOnly || source === Quill.sources.USER) {
          this.record(delta, oldDelta);
        } else if (!this.changeType) {
          this.transform(delta);
        }
      },
    );
    this.quill.keyboard.addBinding(
      { key: 'z', shortKey: true },
      this.undo.bind(this),
    );
    this.quill.keyboard.addBinding(
      { key: 'z', shortKey: true, shiftKey: true },
      this.redo.bind(this),
    );
    if (/Win/i.test(navigator.platform)) {
      this.quill.keyboard.addBinding(
        { key: 'y', shortKey: true },
        this.redo.bind(this),
      );
    }
  }

  change(source) {
    if (this.stack[source].length === 0) return;
    const delta = this.stack[source].pop();
    this.changeType = source;
    this.quill.updateContents(delta, Quill.sources.USER);
    this.changeType = false;
    const index = getLastChangeIndex(this.quill.scroll, delta);
    this.quill.setSelection(index);
  }

  clear() {
    this.stack = { undo: [], redo: [] };
  }

  cutoff() {
    this.lastRecorded = 0;
  }

  record(changeDelta, oldDelta) {
    if (changeDelta.ops.length === 0) return;
    if (!this.changeType) {
      this.stack.redo = [];
    }
    let undoDelta = guessUndoDelta(changeDelta);
    if (undoDelta == null) {
      undoDelta = this.quill.getContents().diff(oldDelta);
    }
    if (this.changeType) {
      this.stack[oppositeChange(this.changeType)].push(undoDelta);
      this.lastRecorded = 0;
      return;
    }
    const timestamp = Date.now();
    if (
      this.lastRecorded + this.options.delay > timestamp &&
      this.stack.undo.length > 0
    ) {
      const delta = this.stack.undo.pop();
      undoDelta = undoDelta.compose(delta);
    } else {
      this.lastRecorded = timestamp;
    }
    this.stack.undo.push(undoDelta);
    if (this.stack.undo.length > this.options.maxStack) {
      this.stack.undo.shift();
    }
  }

  redo() {
    this.change(REDO_CHANGE);
  }

  transform(delta) {
    let stackedUndoDelta = delta;
    let stackedRedoDelta = delta;

    for (let i = this.stack.undo.length; i; i -= 1) {
      const change = this.stack.undo[i - 1];
      this.stack.undo[i - 1] = stackedUndoDelta.transform(change, true);
      stackedUndoDelta = change.transform(stackedUndoDelta);
    }
    for (let i = this.stack.redo.length; i; i -= 1) {
      const change = this.stack.redo[i - 1];
      this.stack.redo[i - 1] = stackedRedoDelta.transform(change, true);
      stackedRedoDelta = change.transform(stackedRedoDelta);
    }
    // clear any undo/redos no longer available (i.e. other user deletes the inserted character)
    this.stack.undo = this.stack.undo.filter(opNotEmpty);
    this.stack.redo = this.stack.redo.filter(opNotEmpty);
  }

  undo() {
    this.change(UNDO_CHANGE);
  }
}
History.DEFAULTS = {
  delay: 1000,
  maxStack: 100,
  userOnly: false,
};

function oppositeChange(change) {
  return change === UNDO_CHANGE ? REDO_CHANGE : UNDO_CHANGE;
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

function opNotEmpty(op) {
  return !!op.ops.length;
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

function guessUndoDelta(delta) {
  const undoDelta = new Delta();
  let failed = false;
  delta.forEach(op => {
    if (op.insert) {
      undoDelta.delete(Op.length(op));
    } else if (op.retain && op.attributes == null) {
      undoDelta.retain(op.retain);
    } else {
      failed = true;
      return false;
    }
    return true;
  });
  return failed ? null : undoDelta;
}

export { History as default, getLastChangeIndex };
