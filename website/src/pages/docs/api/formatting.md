## Formatting

### format

Format text at user's current selection, returning a [Delta](/guides/working-with-deltas/) representing the change. If the user's selection length is 0, i.e. it is a cursor, the format will be set active, so the next character the user types will have that formatting. [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`. Calls where the `source` is `"user"` when the editor is [disabled](#disable) are ignored.

**Methods**

```javascript
format(name: String, value: any, source: String = 'api'): Delta
```

**Examples**

```javascript
quill.format('color', 'red');
quill.format('align', 'right');
```

### formatLine

Formats all lines in given range, returning a [Delta](/guides/working-with-deltas/) representing the change. See [formats](/docs/formats/) for a list of available formats. Has no effect when called with inline formats. To remove formatting, pass `false` for the value argument. The user's selection may not be preserved. [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`. Calls where the `source` is `"user"` when the editor is [disabled](#disable) are ignored.

**Methods**

```javascript
formatLine(index: Number, length: Number, source: String = 'api'): Delta
formatLine(index: Number, length: Number, format: String, value: any,
           source: String = 'api'): Delta
formatLine(index: Number, length: Number, formats: { [String]: any },
           source: String = 'api'): Delta
```

**Examples**

```javascript
quill.setText('Hello\nWorld!\n');

quill.formatLine(1, 2, 'align', 'right');   // right aligns the first line
quill.formatLine(4, 4, 'align', 'center');  // center aligns both lines
```

### formatText

Formats text in the editor, returning a [Delta](/guides/working-with-deltas/) representing the change. For line level formats, such as text alignment, target the newline character or use the [`formatLine`](#formatline) helper. See [formats](/docs/formats/) for a list of available formats. To remove formatting, pass `false` for the value argument. The user's selection may not be preserved. [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`. Calls where the `source` is `"user"` when the editor is [disabled](#disable) are ignored.

**Methods**

```javascript
formatText(index: Number, length: Number, source: String = 'api'): Delta
formatText(index: Number, length: Number, format: String, value: any,
           source: String = 'api'): Delta
formatText(index: Number, length: Number, formats: { [String]: any },
           source: String = 'api'): Delta
```

**Examples**

```javascript
quill.setText('Hello\nWorld!\n');

quill.formatText(0, 5, 'bold', true);      // bolds 'hello'

quill.formatText(0, 5, {                   // unbolds 'hello' and set its color to blue
  'bold': false,
  'color': 'rgb(0, 0, 255)'
});

quill.formatText(5, 1, 'align', 'right');  // right aligns the 'hello' line
```

### getFormat

Retrieves common formatting of the text in the given range. For a format to be reported, all text within the range must have a truthy value. If there are different truthy values, an array with all truthy values will be reported. If no range is supplied, the user's current selection range is used. May be used to show which formats have been set on the cursor. If called with no arguments, the user's current selection range will be used.

**Methods**

```javascript
getFormat(range: Range = current): { [String]: any }
getFormat(index: Number, length: Number = 0): { [String]: any }
```

**Examples**

```javascript
quill.setText('Hello World!');
quill.formatText(0, 2, 'bold', true);
quill.formatText(1, 2, 'italic', true);
quill.getFormat(0, 2);   // { bold: true }
quill.getFormat(1, 1);   // { bold: true, italic: true }

quill.formatText(0, 2, 'color', 'red');
quill.formatText(2, 1, 'color', 'blue');
quill.getFormat(0, 3);   // { color: ['red', 'blue'] }

quill.setSelection(3);
quill.getFormat();       // { italic: true, color: 'blue' }

quill.format('strike', true);
quill.getFormat();       // { italic: true, color: 'blue', strike: true }

quill.formatLine(0, 1, 'align', 'right');
quill.getFormat();       // { italic: true, color: 'blue', strike: true,
                         //   align: 'right' }
```

### removeFormat

Removes all formatting and embeds within given range, returning a [Delta](/guides/working-with-deltas/) representing the change. Line formatting will be removed if any part of the line is included in the range. The user's selection may not be preserved. [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`. Calls where the `source` is `"user"` when the editor is [disabled](#disable) are ignored.

**Methods**

```javascript
removeFormat(index: Number, length: Number, source: String = 'api'): Delta
```

**Examples**

```javascript
quill.setContents([
  { insert: 'Hello', { bold: true } },
  { insert: '\n', { align: 'center' } },
  { insert: { formula: 'x^2' } },
  { insert: '\n', { align: 'center' } },
  { insert: 'World', { italic: true }},
  { insert: '\n', { align: 'center' } }
]);

quill.removeFormat(3, 7);
// Editor contents are now
// [
//   { insert: 'Hel', { bold: true } },
//   { insert: 'lo\n\nWo' },
//   { insert: 'rld', { italic: true }},
//   { insert: '\n', { align: 'center' } }
// ]

```
