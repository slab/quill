## Content

### deleteText

Deletes text from the editor.

**Methods**

- `deleteText(index, length)`
- `deleteText(index, length, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `start`   | _Number_ | Start index of deletion.
| `length`  | _Number_ | Length of deletion.
| `source`  | _String_ | [Source](/docs/api/#text-change) to be emitted. Defaults to `api`.

**Examples**

```javascript
quill.deleteText(6, 4);
```


### getContents

Retrieves contents of the editor, with formatting data, represented by a [Delta](/docs/deltas/) object.

**Methods**

- `getContents()`
- `getContents(index)`
- `getContents(index, length)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Start index of retrieval. Defaults to 0.
| `length`  | _Number_ | Length of content to retrieve. Defaults to the rest of the document.

**Returns**

- _Delta_ contents of the editor.

**Examples**

```javascript
var delta = quill.getContents();
```


### getLength

Retrieves the length of the editor contents.

**Methods**

- `getLength()`

**Returns**

- *Number* of characters in the editor.

**Examples**

```javascript
var length = quill.getLength();
```


### getText

Retrieves the string contents of the editor.

**Methods**

- `getText()`
- `getText(index)`
- `getText(index, length)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Start index of text retrieval. Defaults to 0.
| `length`  | _Number_ | Length of text to retrieve. Defaults to end of the document.

**Returns**

- *String* contents of the editor

**Examples**

```javascript
var text = quill.getText(0, 10);
```


### insertEmbed

Insert embedded content into the editor.

**Methods**

- `insertEmbed(index, type, value)`
- `insertEmbed(index, type, value, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Index where content should be inserted.
| `type`    | _String_ | Type of embed.
| `value`   | _String_ | Value of embed.
| `source`  | _String_ | [Source](/docs/api/#text-change) to be emitted. Defaults to `api`.

**Examples**

```javascript
quill.insertEmbed(10, 'image', 'http://quilljs.com/images/cloud.png');
```


### insertText

Inserts text into the editor. See [formats](/docs/formats/) for a list of available formats.

**Methods**

- `insertText(index, text)`
- `insertText(index, text, name, value)`
- `insertText(index, text, formats)`
- `insertText(index, text, source)`
- `insertText(index, text, name, value, source)`
- `insertText(index, text, formats, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Index where text should be inserted.
| `text`    | _String_ | Text to be inserted.
| `name`    | _String_ | Name of format to apply to inserted text.
| `value`   | _String_ | Value of format to apply to inserted text.
| `formats` | _Object_ | Key/value pairs of formats to apply to inserted text.
| `source`  | _String_ | [Source](/docs/api/#text-change) to be emitted. Defaults to `api`.

**Examples**

```javascript
quill.insertText(0, 'Hello', 'bold', true);

quill.insertText(5, 'Quill', {
  'italic': true,
  'fore-color': '#ffff00'
});
```


### setContents

Overwrites editor with given contents. Contents should end with a newline (see [Working with Deltas](/guides/working-with-deltas/)).

**Methods**

- `setContents(delta)`

**Parameters**

| Parameter | Type                     | Description
|-----------|--------------------------|------------
| `delta`   | [_Delta_](/docs/deltas/) | Delta editor should be set to.

**Examples**

```javascript
quill.setContents([
  { insert: 'Hello ' },
  { insert: 'World!', attributes: { bold: true } },
  { insert: '\n' }
]);
```


### setText

Sets contents of editor with given text. Note Quill documents must end with a newline so one will be added for you if omitted.

**Methods**

- `setText(text)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `text`    | _String_ | Text to set editor contents to.

**Examples**

```javascript
quill.setText('Hello\n');
```


### updateContents

Applies Delta to editor contents.

**Methods**

- `updateContents(delta)`

**Parameters**

| Parameter | Type                     | Description
|-----------|--------------------------|------------
| `delta`   | [_Delta_](/docs/deltas/) | Delta that will be applied.

**Examples**

```javascript
// Assuming editor currently contains [{ insert: 'Hello World!' }]
quill.updateContents({
  ops: [
    { retain: 6 },        // Keep 'Hello '
    { delete: 5 },        // 'World' is deleted
    { insert: 'Quill' },  // Insert 'Quill'
    { retain: 1, attributes: { bold: true } }    // Apply bold to exclamation mark
  ]
});
// Editor should now be [{ insert: 'Hello Quill' }, { insert: '!', attributes: { bold: true} }]
```
