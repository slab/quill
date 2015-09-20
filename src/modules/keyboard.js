import Quill from '../quill';
import clone from 'clone';
import equal from 'deep-equal';
import platform from '../lib/platform';

let Delta = Quill.require('delta');


class Keyboard {
  // TODO allow passing in hotkeys in options
  constructor(quill, options = {}) {
    this.quill = quill;
    this.hotkeys = {};
    this.quill.root.addEventListener('keydown', (evt) => {
      let which = evt.which || evt.keyCode;
      let range = this.quill.getSelection();
      let prevent = (this.hotkeys[which] || []).reduce(function(prevent, hotkey) {
        let [key, callback] = hotkey;
        if (!match(evt, key)) return prevent;
        return callback(range, key, evt) || prevent;
      }, false);
      if (prevent) {
        return evt.preventDefault();
      }
    });
  }

  addHotkey(hotkeys, callback) {
    if (!Array.isArray(hotkeys)) {
      hotkeys = [hotkeys];
    }
    hotkeys.forEach((hotkey) => {
      hotkey = coerce(hotkey);
      if (hotkey == null) {
        return this.quill.emit(Quill.events.DEBUG, 'Attempted to add invalid hotkey', hotkey);
      }
      this.hotkeys[hotkey.key] = this.hotkeys[hotkey.key] || [];
      this.hotkeys[hotkey.key].push([hotkey, callback]);
    });
  }

  removeHotkey(hotkeys, callback) {
    if (!Array.isArray(hotkeys)) {
      hotkeys = [hotkeys];
    }
    return hotkeys.reduce((removed, query) => {
      query = coerce(query);
      if ((query != null) && (this.hotkeys[query.key] != null)) {
        this.hotkeys[query.key] = this.hotkeys[query.key].filter(function(target) {
          if (equal(target[0], query) && ((callback == null) || callback === target[1])) {
            removed.push(target[1]);
            return false;
          }
          return true;
        });
      }
      return removed;
    });
  }
}

function corce(hotkey) {
  switch (typeof hotkey) {
    case 'string':
      if (Keyboard.hotkeys[hotkey.toUpperCase()] != null) {
        hotkey = clone(Keyboard.hotkeys[hotkey.toUpperCase()], false);
      } else if (hotkey.length === 1) {
        hotkey = { key: hotkey };
      } else {
        return null;
      }
      break;
    case 'number':
      hotkey = { key: hotkey };
      break;
    case 'object':
      hotkey = clone(hotkey, false);
      break;
    default:
      return null;
  }
  if (typeof hotkey.key === 'string') {
    hotkey.key = hotkey.key.toUpperCase().charCodeAt(0);
  }
  return hotkey;
}

function match(evt, hotkey) {
  let metaKey = platform.isMac() ? evt.metaKey : evt.metaKey || evt.ctrlKey;
  if (hotkey.metaKey !== metaKey && hotkey.metaKey !== null) return false;
  if (hotkey.shiftKey !== evt.shiftKey && hotkey.shiftKey !== null) return false;
  if (hotkey.altKey !== evt.altKey && hotkey.altKey !== null) return false;
  return true;
}


Quill.registerModule('keyboard', Keyboard);

export { Keyboard as default };
