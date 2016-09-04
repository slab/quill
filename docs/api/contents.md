## Content

### deleteText

Deletes text from the editor.

**Methods**

- `deleteText(index, length, source = 'api')`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `start`   | _Number_ | Start index of deletion.
| `length`  | _Number_ | Length of deletion.
| `source`  | _String_ | [Source](/docs/api/#text-change) to be emitted.

**Examples**

```javascript
quill.deleteText(6, 4);
```


### disable

Shorthand for [`enable(false)`](#enable).


### enable

Set ability for user to edit, via input devices like the mouse or keyboard. Does not affect capabilities of API calls.

**Methods**

- `enable()`
- `enable(value)`

**Parameters**

| Parameter | Type      | Description
|-----------|-----------|------------
| `value`   | _Boolean_ | Whether to enable or disable user input.

**Examples**

```javascript
quill.enable();
quill.enable(false);   // Disables user input
```

### getContents

Retrieves contents of the editor, with formatting data, represented by a [Delta](/guides/working-with-deltas/) object.

**Methods**

- `getContents(index = 0, length = remaining)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Start index of retrieval.
| `length`  | _Number_ | Length of content to retrieve. Defaults to the remaining document.

**Returns**

- _Delta_ contents of the editor.

**Examples**

```javascript
var delta = quill.getContents();
```


### getLength

Retrieves the length of the editor contents. Note even when Quill is empty, there is still a blank line represented by '\n', so `getLength` will return 1.

**Methods**

- `getLength()`

**Returns**

- *Number* of characters in the editor.

**Examples**

```javascript
var length = quill.getLength();
```


### getText

Retrieves the string contents of the editor. Note even when Quill is empty, there is still a blank line in the editor, so `getText` will return '\n'.

**Methods**

- `getText(index = 0, length = remaining)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Start index of text retrieval.
| `length`  | _Number_ | Length of text to retrieve. Defaults to remaining document.

**Returns**

- *String* contents of the editor

**Examples**

```javascript
var text = quill.getText(0, 10);
```


### insertEmbed

Insert embedded content into the editor.

**Methods**

- `insertEmbed(index, type, value, source = 'api')`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Index where content should be inserted.
| `type`    | _String_ | Type of embed.
| `value`   | _String_ | Value of embed.
| `source`  | _String_ | [Source](/docs/api/#text-change) to be emitted.

**Examples**

```javascript
quill.insertEmbed(10, 'image', 'http://quilljs.com/images/cloud.png');
```


### insertText

Inserts text into the editor. See [formats](/docs/formats/) for a list of available formats.

**Methods**

- `insertText(index, text, source = 'api')`
- `insertText(index, text, name, value, source = 'api')`
- `insertText(index, text, formats, source = 'api')`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Index where text should be inserted.
| `text`    | _String_ | Text to be inserted.
| `name`    | _String_ | Name of format to apply to inserted text.
| `value`   | _String_ | Value of format to apply to inserted text.
| `formats` | _Object_ | Key/value pairs of formats to apply to inserted text.
| `source`  | _String_ | [Source](/docs/api/#text-change) to be emitted.

**Examples**

```javascript
quill.insertText(0, 'Hello', 'bold', true);

quill.insertText(5, 'Quill', {
  'color': '#ffff00',
  'italic': true
});
```


### pasteHTML

Inserts content into editor at a given index from an HTML snippet. The snippet is interpretted and cleaned by the [clipboard](/docs/modules/clipboard/) before being inserted into Quill. If no insertion index is provided, the editor will be overwritten.

**Methods**

- `pasteHTML(html, source = 'api')`
- `pasteHTML(index, html, source = 'api')`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Index where text should be inserted. If omitted, editor will be overwritten.
| `html`    | _String_ | HTML to convert into content by [clipboard](/docs/modules/clipboard/) and inserted into editor.
| `source`  | _String_ | [Source](/docs/api/#text-change) to be emitted.

**Examples**

```javascript
quill.setText('Hello!');

quill.pasteHTML(5, '&nbsp;<b>World</b>');
// Editor is now '<p>Hello&nbsp;<strong>World</strong>!</p>';

```


### setContents

Overwrites editor with given contents. Contents should end with a newline (see [Working with Deltas](/guides/working-with-deltas/)).

**Methods**

- `setContents(delta)`

**Parameters**

| Parameter | Type                     | Description
|-----------|--------------------------|------------
| `delta`   | [_Delta_](/guides/working-with-deltas/) | Delta editor should be set to.

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
| `delta`   | [_Delta_](/guides/working-with-deltas/) | Delta that will be applied.

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
