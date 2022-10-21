## Selection

### getBounds

Retrieves the pixel position (relative to the editor container) and dimensions of a selection at a given location. The user's current selection need not be at that index. Useful for calculating where to place tooltips.

**Methods**

```javascript
getBounds(index: Number, length: Number = 0):
  { left: Number, top: Number, height: Number, width: Number }
```

**Examples**

```javascript
quill.setText('Hello\nWorld\n');
quill.getBounds(7);  // Returns { height: 15, width: 0, left: 27, top: 31 }
```

### getSelection

Retrieves the user's selection range, optionally to focus the editor first. Otherwise `null` may be returned if editor does not have focus.

**Methods**

```javascript
getSelection(focus = false): { index: Number, length: Number }
```

**Examples**

```javascript
var range = quill.getSelection();
if (range) {
  if (range.length == 0) {
    console.log('User cursor is at index', range.index);
  } else {
    var text = quill.getText(range.index, range.length);
    console.log('User has highlighted: ', text);
  }
} else {
  console.log('User cursor is not in editor');
}
```

### setSelection

Sets user selection to given range, which will also focus the editor. Providing `null` as the selection range will blur the editor. [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`.

**Methods**

```javascript
setSelection(index: Number, length: Number = 0, source: String = 'api')
setSelection(range: { index: Number, length: Number },
             source: String = 'api')
```

**Examples**

```javascript
quill.setSelection(0, 5);
```
