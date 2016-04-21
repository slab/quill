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

{% highlight javascript %}
editor.deleteText(6, 4);
{% endhighlight %}


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

{% highlight javascript %}
var delta = editor.getContents();
{% endhighlight %}


### getLength

Retrieves the length of the editor contents.

**Methods**

- `getLength()`

**Returns**

- *Number* of characters in the editor.

**Examples**

{% highlight javascript %}
var length = editor.getLength();
{% endhighlight %}


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

{% highlight javascript %}
var text = editor.getText(0, 10);
{% endhighlight %}


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

{% highlight javascript %}
editor.insertEmbed(10, 'image', 'http://quilljs.com/images/cloud.png');
{% endhighlight %}


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

{% highlight javascript %}
editor.insertText(0, 'Hello', 'bold', true);

editor.insertText(5, 'Quill', {
  'italic': true,
  'fore-color': '#ffff00'
});
{% endhighlight %}


### setContents

Overwrites editor with given contents. Contents should end with a newline (see [Working with Deltas](/guides/working-with-deltas/)).

**Methods**

- `setContents(delta)`

**Parameters**

| Parameter | Type                     | Description
|-----------|--------------------------|------------
| `delta`   | [_Delta_](/docs/deltas/) | Delta editor should be set to.

**Examples**

{% highlight javascript %}
editor.setContents([
  { insert: 'Hello ' },
  { insert: 'World!', attributes: { bold: true } },
  { insert: '\n' }
]);
{% endhighlight %}


### setText

Sets contents of editor with given text. Note Quill documents must end with a newline so one will be added for you if omitted.

**Methods**

- `setText(text)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `text`    | _String_ | Text to set editor contents to.

**Examples**

{% highlight javascript %}
editor.setText('Hello\n');
{% endhighlight %}


### updateContents

Applies Delta to editor contents.

**Methods**

- `updateContents(delta)`

**Parameters**

| Parameter | Type                     | Description
|-----------|--------------------------|------------
| `delta`   | [_Delta_](/docs/deltas/) | Delta that will be applied.

**Examples**

{% highlight javascript %}
// Assuming editor currently contains [{ insert: 'Hello World!' }]
editor.updateContents({
  ops: [
    { retain: 6 },        // Keep 'Hello '
    { delete: 5 },        // 'World' is deleted
    { insert: 'Quill' },  // Insert 'Quill'
    { retain: 1, attributes: { bold: true } }    // Apply bold to exclamation mark
  ]
});
// Editor should now be [{ insert: 'Hello Quill' }, { insert: '!', attributes: { bold: true} }]
{% endhighlight %}
