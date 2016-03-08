---
layout: docs
title: API
permalink: /docs/api/
redirect_from: /docs/editor/api/
---

# API

Quill allows granular access to its contents.

#### Retrieval
- [Quill.prototype.getContents](#quillprototypegetcontents)
- [Quill.prototype.getLength](#quillprototypegetlength)
- [Quill.prototype.getText](#quillprototypegettext)

#### Manipulation
- [Quill.prototype.deleteText](#quillprototypedeletetext)
- [Quill.prototype.formatLine](#quillprototypeformatline)
- [Quill.prototype.formatText](#quillprototypeformattext)
- [Quill.prototype.insertText](#quillprototypeinserttext)
- [Quill.prototype.insertEmbed](#quillprototypeinsertembed)
- [Quill.prototype.setContents](#quillprototypesetcontents)
- [Quill.prototype.setText](#quillprototypesettext)
- [Quill.prototype.updateContents](#quillprototypeupdatecontents)

#### Selection
- [Quill.prototype.focus](#quillprototypefocus)
- [Quill.prototype.getBounds](#quillprototypegetbounds)
- [Quill.prototype.getSelection](#quillprototypegetselection)
- [Quill.prototype.setSelection](#quillprototypesetselection)

#### Customization
- [Quill.register](#quillregistermodule)
- [Quill.prototype.getModule](#quillprototypegetmodule)
- [Quill.prototype.addContainer](#quillprototypeaddcontainer)


### Quill.prototype.getContents

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


### Quill.prototype.getLength

Retrieves the length of the editor contents.

**Methods**

- `getLength()`

**Returns**

- *Number* of characters in the editor.

**Examples**

{% highlight javascript %}
var length = editor.getLength();
{% endhighlight %}


### Quill.prototype.getText

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


### Quill.prototype.deleteText

Deletes text from the editor.

**Methods**

- `deleteText(index, length)`
- `deleteText(index, length, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `start`   | _Number_ | Start index of deletion.
| `length`  | _Number_ | Length of deletion.
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.deleteText(0, 10);
{% endhighlight %}


### Quill.prototype.formatLine

Formats all lines in given range. See [formats](/docs/formats/) for a list of available formats. Has no effect when called with inline formats.

**Methods**

- `formatLine(index, length)`
- `formatLine(index, length, name, value)`
- `formatLine(index, length, formats)`
- `formatLine(index, length, source)`
- `formatLine(index, length, name, value, source)`
- `formatLine(index, length, formats, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Start index of formatting range.
| `length`  | _Number_ | Length of formatting range.
| `name`    | _String_ | Name of format to apply to text.
| `value`   | _String_ | Value of format to apply to text. A falsy value will remove the format.
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.setText('Hello\nWorld!\n');

editor.formatLine(1, 2, 'align', 'right');   // right aligns the first line
editor.formatLine(4, 4, 'align', 'center');  // center aligns both lines
{% endhighlight %}


### Quill.prototype.formatText

Formats text in the editor. For line level formats, such as text alignment, target the newline character or use the [`formatLine`](#quillprototypeformatline) helper. See [formats](/docs/formats/) for a list of available formats.

**Methods**

- `formatText(index)`
- `formatText(index, length, name, value)`
- `formatText(index, length, formats)`
- `formatText(index, length, source)`
- `formatText(index, length, name, value, source)`
- `formatText(index, length, formats, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Start index of formatting range.
| `length`  | _Number_ | Length of formatting range.
| `name`    | _String_ | Name of format to apply to text.
| `value`   | _String_ | Value of format to apply to text. A falsy value will remove the format.
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.setText('Hello\nWorld!\n');

editor.formatText(0, 5, 'bold', true);      // bolds 'hello'

editor.formatText(0, 5, {                   // unbolds 'hello' and set its color to blue
  'bold': false,
  'color': 'rgb(0, 0, 255)'
});

editor.formatText(5, 1, 'align', 'right');  // right aligns the 'hello' line
{% endhighlight %}


### Quill.prototype.insertText

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
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.insertText(0, 'Hello', 'bold', true);

editor.insertText(5, 'Quill', {
  'italic': true,
  'fore-color': '#ffff00'
});
{% endhighlight %}


### Quill.prototype.insertEmbed

Insert embedded content into the editor.

**Methods**

- `insertEmbed(index, type, url)`
- `insertEmbed(index, type, url, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Index where content should be inserted.
| `type`    | _String_ | Type of embed.
| `value`   | _String_ | Value of embed.
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.insertEmbed(10, 'image', 'http://quilljs.com/images/cloud.png');
{% endhighlight %}


### Quill.prototype.setContents

Overwrites editor with given contents.

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


### Quill.prototype.setText

Sets contents of editor with given text. Note Quill documents end with a newline so one will be added for you if omitted.

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


### Quill.prototype.updateContents

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


### Quill.prototype.focus

Focuses the editor.

**Methods**

- `focus()`

**Examples**

{% highlight javascript %}
editor.focus();
{% endhighlight %}


### Quill.prototype.getBounds

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

{% highlight javascript %}
editor.setText('Hello\nWorld\n');
editor.getBounds(7);    // Returns { height: 15, width: 0, left: 27, top: 31 }
{% endhighlight %}


### Quill.prototype.getSelection

Retrieves the user's selection range.

**Methods**

- `getSelection(focus = false)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `foucs`   | _Boolean | Whether to focus editor before checking selection. Defaults to false.

**Returns**

- *Range* with keys `index` and `length` representing user's selection range, or null if editor does not have focus.

**Examples**

{% highlight javascript %}
var range = editor.getSelection();
if (range) {
  if (range.index == range.length) {
    console.log('User cursor is at index', range.index);
  } else {
    var text = editor.getText(range.index, range.length);
    console.log('User has highlighted: ', text);
  }
} else {
  console.log('User cursor is not in editor');
}
{% endhighlight %}


### Quill.prototype.setSelection

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
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.setSelection(0, 5);
{% endhighlight %}


### Quill.prototype.getModule

Retrieves a module that has been added to the editor.

**Methods**

- `getModule(name)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `name`    | _String_ | Name of module to retrieve.

**Returns**

- *Object* Instance of the module that was added.

**Examples**

{% highlight javascript %}
var toolbar = editor.getModule('toolbar');
{% endhighlight %}


### Quill.prototype.addContainer

Add a div container inside the Quill container, sibling to the editor itself. By convention, Quill modules should have a class name prefixed with `ql-`.

**Methods**

- `addContainer(cssClass, before)`

**Parameters**

| Parameter  | Type      | Description
|------------|-----------|------------
| `cssClass` | _String_  | CSS class to add to created container.
| `before`   | _Boolean_ | If `true`, will insert before the editor container, otherwise it will be appended after.

**Returns**

- *DOMElement* DIV container that was added.

**Examples**

{% highlight javascript %}
var container = editor.addContainer('ql-custom');
{% endhighlight %}
