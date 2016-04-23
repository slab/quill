## Selection

### focus

Focuses the editor and restores its last range.

**Methods**

- `focus()`

**Examples**

```javascript
editor.focus();
```


### getBounds

Retrieves the pixel position (relative to the editor container) and boundaries of a selection at a given location. The actual selection need not be at that index. Useful for calculating where to place tooltips.

**Methods**

- `getBounds(index, length = 0)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Index position to measure selection bounds.
| `length`  | _Number_ | Length of selection range. Defaults to 0 to represent cursor.

**Returns**

- *Object* Object with keys `height`, `width`, `left`, and `top`.

**Examples**

```javascript
quill.setText('Hello\nWorld\n');
quill.getBounds(7);    // Returns { height: 15, width: 0, left: 27, top: 31 }
```


### getSelection

Retrieves the user's selection range.

**Methods**

- `getSelection(focus = false)`

**Parameters**

| Parameter | Type      | Description
|-----------|-----------|------------
| `foucs`   | _Boolean_ | Whether to focus editor before checking selection. Defaults to false.

**Returns**

- *Range* with keys `index` and `length` representing user's selection range, or null if editor does not have focus.

**Examples**

```javascript
var range = quill.getSelection();
if (range) {
  if (range.index == range.length) {
    console.log('User cursor is at index', range.index);
  } else {
    var text = quill.getText(range.index, range.length);
    console.log('User has highlighted: ', text);
  }
} else {
  console.log('User cursor is not in editor');
}
```


### hasFocus

Checks if editor has focus. Note focus on toolbar, tooltips, does not count as the editor.

**Methods**

- `hasFocus()`

**Returns**

- *Boolean* Whether editor has focus.

**Examples**

```javascript
quill.hasFocus();
```


### setSelection

Sets user selection to given range. Will also focus the editor. If `null`, will blur the editor.

**Methods**

- `setSelection(index, length)`
- `setSelection(index, length, source)`
- `setSelection(range)`
- `setSelection(range, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Start index of selection range.
| `length`  | _Number_ | Length of selection range.
| `range`   | _Object_ | Object with **index** and **length** keys indicating the corresponding index where the selection starts and length of selection.
| `source`  | _String_ | [Source](/docs/api/#text-change) to be emitted. Defaults to `api`.

**Examples**

```javascript
quill.setSelection(0, 5);
```
