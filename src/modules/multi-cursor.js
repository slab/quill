import EventEmitter from 'eventemitter3';
import Quill from '../quill';


class MultiCursor extends EventEmitter {
  constructor(quill, options = {}) {
    super();
    this.quill = quill;
    this.options = options;
    this.cursors = {};
    this.container = this.quill.addContainer('ql-multi-cursor', true);
    this.quill.on(this.quill.constructor.events.TEXT_CHANGE, this._applyDelta, this);
  }

  clearCursors() {
    Object.keys(this.cursors).forEach(this.removeCursor.bind(this));
    this.cursors = {};
  };

  moveCursor(userId, index) {
    let cursor = this.cursors[userId];
    if (cursor == null) return;
    cursor.index = index;
    cursor.elem.classList.remove('hidden');
    clearTimeout(cursor.timer);
    cursor.timer = setTimeout(() => {
      cursor.elem.classList.add('hidden');
      cursor.timer = null;
    }, this.options.timeout);
    this._updateCursor(cursor);
    return cursor;
  };

  removeCursor(userId) {
    let cursor = this.cursors[userId];
    this.emit(MultiCursor.events.CURSOR_REMOVED, cursor);
    if (cursor != null) {
      cursor.elem.parentNode.removeChild(cursor.elem);
    }
    delete this.cursors[userId];
  };

  setCursor(userId, index, name, color) {
    if (this.cursors[userId] == null) {
      let cursor = this.cursors[userId] = {
        userId: userId,
        index: index,
        color: color,
        elem: this._buildCursor(name, color)
      };
      this.emit(MultiCursor.events.CURSOR_ADDED, cursor);
    }
    setTimeout(() => {
      this.moveCursor(userId, index);
    }, 0);
    return this.cursors[userId];
  };

  shiftCursors(index, length, authorId = null) {
    Object.keys(this.cursors).forEach((id) => {
      if (this.cursors[id] == null) return;
      let shift = Math.max(length, index - this.cursors[id].index);
      if (this.cursors[id].userId === authorId) {
        this.moveCursor(authorId, this.cursors[id].index + shift);
      } else if (this.cursors[id].index > index) {
        this.cursors[id].index += shift;
      }
    });
  };

  update() {
    Object.keys(this.cursors).forEach((id) => {
      if (this.cursors[id] != null) {
        this._updateCursor(this.cursors[id]);
      }
    });
  };

  _applyDelta(delta) {
    let index = 0;
    delta.ops.forEach((op) => {
      let length = 0;
      if (op.insert != null) {
        length = op.insert.length || 1;
        let author = op.attributes != null ? op.attributes.author : null;
        this.shiftCursors(index, length, author);
      } else if (op.delete != null) {
        this.shiftCursors(index, -1 * op.delete);
      } else if (op.retain != null) {
        this.shiftCursors(index, 0);
        length = op.retain;
      }
      index += length;
    });
    this.update();
  };

  _buildCursor(name, color) {
    let cursor = document.createElement('span');
    cursor.classList.add('cursor');
    cursor.innerHTML = this.options.template;
    let cursorFlag = cursor.querySelector('.cursor-flag');
    let cursorName = cursor.querySelector('.cursor-name');
    cursorName.textContent = name;
    let cursorCaret = cursor.querySelector('.cursor-caret');
    cursorCaret.style.backgroundColor = cursorName.style.backgroundColor = color;
    this.container.appendChild(cursor);
    return cursor;
  };

  _updateCursor(cursor) {
    let bounds = this.quill.getBounds(cursor.index);
    if (bounds == null) {
      return this.removeCursor(cursor.userId);
    }
    cursor.elem.style.top = (bounds.top + this.quill.container.scrollTop) + 'px';
    cursor.elem.style.left = bounds.left + 'px';
    cursor.elem.style.height = bounds.height + 'px';
    let flag = cursor.elem.querySelector('.cursor-flag');
    let isTop = parseInt(cursor.elem.style.top) <= flag.offsetHeight;
    let isLeft = parseInt(cursor.elem.style.top) <= flag.offsetHeight;
    let isRight = this.quill.root.offsetWidth - parseInt(cursor.elem.style.left) <= flag.offsetWidth;
    cursor.elem.classList.toggle('top', isTop);
    cursor.elem.classList.toggle('left', isLeft);
    cursor.elem.classList.toggle('right', isRight);
    this.emit(MultiCursor.events.CURSOR_MOVED, cursor);
  };
}
MultiCursor.DEFAULTS = {
  template: `
    <span class="cursor-flag">
      <span class="cursor-name"></span>
    </span>
    <span class="cursor-caret"></span>`,
  timeout: 2500
};
MultiCursor.events = {
  CURSOR_ADDED: 'cursor-added',
  CURSOR_MOVED: 'cursor-moved',
  CURSOR_REMOVED: 'cursor-removed'
};


Quill.registerModule('multi-cursor', MultiCursor);

export { MultiCursor as default };
