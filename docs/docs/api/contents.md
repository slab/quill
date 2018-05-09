## Content

### deleteText

Deletes text from the editor, returning a [Delta](/guides/working-with-deltas/) representing the change. [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`. Calls where the `source` is `"user"` when the editor is [disabled](#disable) are ignored.

**Methods**

```javascript
deleteText(index: Number, length: Number, source: String = 'api'): Delta
```

**Examples**

```javascript
quill.deleteText(6, 4);
```

### getContents

Retrieves contents of the editor, with formatting data, represented by a [Delta](/docs/delta/) object.

**Methods**

```javascript
getContents(index: Number = 0, length: Number = remaining): Delta
```

**Examples**

```javascript
var delta = quill.getContents();
```

### getLength

Retrieves the length of the editor contents. Note even when Quill is empty, there is still a blank line represented by '\n', so `getLength` will return 1.

**Methods**

```javascript
getLength(): Number
```

**Examples**

```javascript
var length = quill.getLength();
```

### getText

Retrieves the string contents of the editor. Non-string content are omitted, so the returned string's length may be shorter than the editor's as returned by [`getLength`](#getlength). Note even when Quill is empty, there is still a blank line in the editor, so in these cases `getText` will return '\n'.

The `length` parameter defaults to the length of the remaining document.

**Methods**

```javascript
getText(index: Number = 0, length: Number = remaining): String
```

**Examples**

```javascript
var text = quill.getText(0, 10);
```

### insertEmbed

Insert embedded content into the editor, returning a [Delta](/guides/working-with-deltas/) representing the change. [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`. Calls where the `source` is `"user"` when the editor is [disabled](#disable) are ignored.

**Methods**

```javascript
insertEmbed(index: Number, type: String, value: any, source: String = 'api'): Delta
```

**Examples**

```javascript
quill.insertEmbed(10, 'image', 'https://quilljs.com/images/cloud.png');
```

### insertText

Inserts text into the editor, optionally with a specified format or multiple [formats](/docs/formats/). Returns a [Delta](/guides/working-with-deltas/) representing the change. [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`. Calls where the `source` is `"user"` when the editor is [disabled](#disable) are ignored.

**Methods**

```javascript
insertText(index: Number, text: String, source: String = 'api'): Delta
insertText(index: Number, text: String, format: String, value: any,
           source: String = 'api'): Delta
insertText(index: Number, text: String, formats: { [String]: any },
           source: String = 'api'): Delta
```

**Examples**

```javascript
quill.insertText(0, 'Hello', 'bold', true);

quill.insertText(5, 'Quill', {
  'color': '#ffff00',
  'italic': true
});
```

### setContents

Overwrites editor with given contents. Contents should end with a [newline](/docs/delta/#line-formatting). Returns a Delta representing the change. This will be the same as the Delta passed in, if given Delta had no invalid operations. [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`. Calls where the `source` is `"user"` when the editor is [disabled](#disable) are ignored.

**Methods**

```javascript
setContents(delta: Delta, source: String = 'api'): Delta
```

**Examples**

```javascript
quill.setContents([
  { insert: 'Hello ' },
  { insert: 'World!', attributes: { bold: true } },
  { insert: '\n' }
]);
```

### setText

Sets contents of editor with given text, returing a [Delta](/guides/working-with-deltas/) representing the change. Note Quill documents must end with a newline so one will be added for you if omitted.  [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`. Calls where the `source` is `"user"` when the editor is [disabled](#disable) are ignored.

**Methods**

```javascript
setText(text: String, source: String = 'api'): Delta
```

**Examples**

```javascript
quill.setText('Hello\n');
```

### updateContents

Applies Delta to editor contents, returing a [Delta](/guides/working-with-deltas/) representing the change. These Deltas will be the same if the Delta passed in had no invalid operations. [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`. Calls where the `source` is `"user"` when the editor is [disabled](#disable) are ignored.

**Methods**

```javascript
updateContents(delta: Delta, source: String = 'api'): Delta
```

**Examples**

```javascript
// Assuming editor currently contains [{ insert: 'Hello World!' }]
quill.updateContents(new Delta()
  .retain(6)                  // Keep 'Hello '
  .delete(5)                  // 'World' is deleted
  .insert('Quill')
  .retain(1, { bold: true })  // Apply bold to exclamation mark
);
// Editor should now be [
//  { insert: 'Hello Quill' },
//  { insert: '!', attributes: { bold: true} }
// ]
```
