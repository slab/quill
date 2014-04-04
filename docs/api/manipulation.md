---
layout: docs
title: Text Manipulation - Quill
permalink: /docs/api/manipulation/
---

# Manipulation

Quill allows granular access to its contents through the following methods.

1. [Quill.prototype.getText](#quillprototypegettext)
1. [Quill.prototype.insertText](#quillprototypeinserttext)
1. [Quill.prototype.deleteText](#quillprototypedeletetext)
1. [Quill.prototype.formatText](#quillprototypeformattext)
1. [Quill.prototype.getHTML](#quillprototypegethtml)
1. [Quill.prototype.setHTML](#quillprototypesethtml)
1. [Quill.prototype.getContents](#quillprototypegetcontents)
1. [Quill.prototype.setContents](#quillprototypesetcontents)
1. [Quill.prototype.updateContents](#quillprototypeupdatecontents)


### Quill.prototype.getText

Retrieves the string contents of the editor.

**Methods**

- `getText()`
- `getText(index)`
- `getText(index, length)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Starting position of text retrieval. Defaults to 0.
| `length`  | _Number_ | Number of characters to retrieve. Defaults to the rest of the document.


**Returns**

- *String* contents of the editor

**Examples**

{% highlight javascript %}
var text = editor.getText(0, 10);
{% endhighlight %}


### Quill.prototype.insertText

Inserts text into the editor. See [formats](/docs/editor/formats/) for a list of available formats.

**Methods**

- `insertText(index, text)`
- `insertText(index, text, name, value)`
- `insertText(index, text, formats)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Position where text should be inserted.
| `text`    | _String_ | Text to be inserted.
| `name`    | _String_ | Name of format to apply to inserted text.
| `value`   | _String_ | Value of format to apply to inserted text.
| `formats` | _Object_ | Key/value pairs of formats to apply to inserted text.

**Examples**

{% highlight javascript %}
editor.insertText(0, 'Hello', 'bold', true);

editor.insertText(5, 'Quill', {
  'italic': true,
  'fore-color': '#ffff00'
});
{% endhighlight %}


### Quill.prototype.deleteText

Deletes text from the editor.

**Methods**

- `deleteText(index, length)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Starting position of deletion.
| `length`  | _Number_ | Number of characters to delete.

**Examples**

{% highlight javascript %}
editor.deleteText(0, 10);
{% endhighlight %}


### Quill.prototype.formatText

Formats text in the editor. See [formats](/docs/editor/formats/) for a list of available formats.

**Methods**

- `formatText(index, length)`
- `formatText(index, length, name, value)`
- `formatText(index, length, formats)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Starting position of formatting.
| `length`  | _Number_ | Number of characters following index to apply formatting.
| `name`    | _String_ | Name of format to apply to text.
| `value`   | _String_ | Value of format to apply to text. A falsy value will remove the format.
| `formats` | _Object_ | Key/value pairs of formats to apply to text.

**Examples**

{% highlight javascript %}
editor.formatText(0, 10, 'bold', false);

editor.formatText(5, 6, {
  'italic': false,
  'fore-color': '#000fff'
});
{% endhighlight %}


### Quill.prototype.getHTML

Retrieves the HTML contents of the editor.

**Methods**

- `getHTML()`

**Returns**

- *String* HTML contents of the editor

**Examples**

{% highlight javascript %}
var html = editor.getHTML();
{% endhighlight %}


### Quill.prototype.setHTML

Sets contents of editor with given HTML. Note the editor will be normalize the input to the subset it recognizes.

**Methods**

- `setHTML(html)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `html`    | _String_ | HTML to set editor contents to.

**Examples**

{% highlight javascript %}
editor.setHTML('<div>Hello</div>');
{% endhighlight %}


### Quill.prototype.getContents

Retrieves contents of the editor, with formatting data, represented by a [Delta](/docs/api/deltas/) object.

**Methods**

- `getContents()`
- `getContents(index)`
- `getContents(index, length)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Starting position of retrieval. Defaults to 0.
| `length`  | _Number_ | Number of characters to retrieve. Defaults to the rest of the document.

**Returns**

- _Delta_ contents of the editor.

**Examples**

{% highlight javascript %}
var delta = editor.getContents();
{% endhighlight %}


### Quill.prototype.setContents

Overwrites editor with given contents.

**Methods**

- `setContents(delta)`

**Parameters**

| Parameter | Type                         | Description
|-----------|------------------------------|------------
| `delta`   | [_Delta_](/docs/api/deltas/) | Delta editor should be set to.

**Examples**

{% highlight javascript %}
editor.setContents([
  { text: 'Hello ' },
  { text: 'World!', attributes: { bold: true } },
  { text: '\n' }
]);
{% endhighlight %}


### Quill.prototype.updateContents

Applies Delta to editor contents.

**Methods**

- `updateContents(delta)`

**Parameters**

| Parameter | Type                         | Description
|-----------|------------------------------|------------
| `delta`   | [_Delta_](/docs/api/deltas/) | Delta that will be applied.

**Examples**

{% highlight javascript %}
// Assuming editor currently contains [{ text: 'Hello World!' }]
editor.update({
  startLength: 12,
  endLength: 13,
  ops: [
    { start: 0, end: 6 }, // Keep 'Hello '
    { text: 'Quill' },   // Insert 'Quill'
                          // Since there is no retain for index 6-10, 'World' is deleted
    { start: 11, end: 12, attributes: { bold: true } }    // Apply bold to exclamation mark
  ]
});
// Editor should now be [{ text: 'Hello Quill' }, { text: '!', attributes: { bold: true} }]
{% endhighlight %}
