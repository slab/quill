import Quill from '../quill';
import clone from 'clone';
import equal from 'deep-equal';
import extend from 'extend';
import keys from '../lib/keys';
import * as platform from '../lib/platform';

let Delta = Quill.import('delta');


class Keyboard {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = extend({}, Keyboard.DEFAULTS, options);
    this.bindings = {};
    this.addBinding({ key: 'B', metaKey: true }, this._onFormat.bind(this, 'bold'));
    this.addBinding({ key: 'I', metaKey: true }, this._onFormat.bind(this, 'italic'));
    this.addBinding({ key: 'U', metaKey: true }, this._onFormat.bind(this, 'underline'));
    this.addBinding({ key: keys.ENTER, shiftKey: null }, this._onEnter.bind(this));
    // TODO manually handle CMD+delete
    this.addBinding({ key: keys.BACKSPACE }, this._onDelete.bind(this, true));
    this.addBinding({ key: keys.DELETE }, this._onDelete.bind(this, false));
    this.addBinding({ key: keys.TAB }, this._onTab.bind(this));
    this.options.bindings.forEach((def) => {
      this.addBinding(def.binding, def.callback);
    });
    this.quill.root.addEventListener('keydown', (evt) => {
      let which = evt.which || evt.keyCode;
      let range = undefined;
      let prevent = (this.bindings[which] || []).reduce((prevent, binding) => {
        let [key, callback] = binding;
        if (!match(evt, key)) return prevent;
        if (range === undefined) {
          range = this.quill.getSelection();
        }
        return !callback(range, key, evt) || prevent;
      }, false);
      if (prevent) {
        return evt.preventDefault();
      }
    });
  }

  addBinding(binding, callback) {
    binding = normalize(binding);
    if (binding == null) {
      return this.quill.emit(Quill.events.DEBUG, 'Attempted to add invalid keyboard binding', binding);
    }
    this.bindings[binding.key] = this.bindings[binding.key] || [];
    this.bindings[binding.key].push([binding, callback]);
  }

  removeBinding(binding, callback = null) {
    binding = normalize(binding);
    let removed = [];
    if ((binding != null) && (this.bindings[binding.key] != null)) {
      this.bindings[binding.key] = this.bindings[binding.key].filter(function(target) {
        if (equal(target[0], binding) && (callback == null || callback === target[1])) {
          removed.push(callback);
          return false;
        }
        return true;
      });
    }
    return removed;
  }

  _onDelete(backspace, range) {
    // TODO handle being on CursorBlot
    if (!range.isCollapsed()) {
      this.quill.deleteText(range, Quill.sources.USER);
    } else if (!backspace) {
      this.quill.deleteText(range.start, range.start + 1, Quill.sources.USER);
    } else {
      let pos = this.quill.editor.findLine(range.start);
      let formats = this.quill.getFormat(range.start);
      if (pos != null && pos.offset === 0 && (formats['list'] || formats['bullet'])) {
        let format = formats['list'] ? 'list' : 'bullet';
        this.quill.formatLine(range, format, formats[format] - 1, Quill.sources.USER);
      } else {
        this.quill.deleteText(range.start - 1, range.start, Quill.sources.USER);
        range.shift(range.start - 1, -1);
      }
    }
    this.quill.setSelection(range.start, Quill.sources.SILENT);
    return false;
  }

  _onEnter(range) {
    let pos = this.quill.editor.findLine(range.start, true);
    if (pos == null) return false;
    let delta = new Delta()
      .retain(range.start)
      .insert('\n', pos.blot.getFormat())
      .delete(range.start - range.end);
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(range.start + 1, Quill.sources.USER);
    return false;
  }

  _onFormat(format, range) {
    if (this.quill.options.formats.indexOf(format) < 0) return false;
    let formats = this.quill.getFormat(range);
    if (range.isCollapsed()) {
      this.quill.prepareFormat(format, !formats[format]);
    } else {
      this.quill.formatText(range, format, !formats[format], Quill.sources.USER);
    }
    return false;
  }

  _onTab(range, binding) {
    let pos = this.quill.editor.findLine(range.start);
    if (pos == null) return false;
    let formats = this.quill.getFormat(range.start);
    if (typeof formats['list'] === 'number' || typeof formats['bullet'] === 'number') {
      let format = formats['list'] ? 'list' : 'bullet';
      // We are in a list or bullet
      if (!range.isCollapsed() || pos.offset === 0) {
        let value = formats[format] + (binding.shiftKey ? 1 : -1);
        this.quill.formatLine(range, format, value, Quill.sources.USER);
        this.quill.setSelection(range, Quill.sources.SILENT);
        return false;
      }
    }
    let delta = new Delta().retain(range.start).insert('\t').delete(range.end - range.start);
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(range.start + 1, Quill.sources.SILENT);
    return false;
  }
}

Keyboard.DEFAULTS = {
  bindings: []
};


function match(evt, binding) {
  let metaKey = platform.isMac() ? evt.metaKey : evt.metaKey || evt.ctrlKey;
  if (!!binding.metaKey !== metaKey && binding.metaKey !== null) return false;
  if (!!binding.shiftKey !== evt.shiftKey && binding.shiftKey !== null) return false;
  if (!!binding.altKey !== evt.altKey && binding.altKey !== null) return false;
  return true;
}

function normalize(binding) {
  switch (typeof binding) {
    case 'string':
      if (Keyboard.bindings[binding.toUpperCase()] != null) {
        binding = clone(Keyboard.bindings[binding.toUpperCase()], false);
      } else if (binding.length === 1) {
        binding = { key: binding };
      } else {
        return null;
      }
      break;
    case 'number':
      binding = { key: binding };
      break;
    case 'object':
      binding = clone(binding, false);
      break;
    default:
      return null;
  }
  if (typeof binding.key === 'string') {
    binding.key = binding.key.toUpperCase().charCodeAt(0);
  }
  return binding;
}


Quill.registerModule('keyboard', Keyboard);

export { Keyboard as default };
