---
layout: docs
title: API
permalink: /docs/api/
---

# API

TODO: Review

Quill allows granular access to its contents.

#### Manipulation
- [Quill.prototype.deleteText](#quillprototypedeletetext)
- [Quill.prototype.formatLine](#quillprototypeformatline)
- [Quill.prototype.formatText](#quillprototypeformattext)
- [Quill.prototype.insertEmbed](#quillprototypeinsertembed)
- [Quill.prototype.insertText](#quillprototypeinserttext)
- [Quill.prototype.setContents](#quillprototypesetcontents)
- [Quill.prototype.setText](#quillprototypesettext)
- [Quill.prototype.updateContents](#quillprototypeupdatecontents)

#### Editor
- [Quill.prototype.disable](#quillprototypedisable)
- [Quill.prototype.enable](#quillprototypeenable)
- [Quill.prototype.getContents](#quillprototypegetcontents)
- [Quill.prototype.getLength](#quillprototypegetlength)
- [Quill.prototype.getFormat](#quillprototypegetformat)
- [Quill.prototype.getText](#quillprototypegettext)
- [Quill.prototype.update](#quillprototypeupdate)

#### Selection
- [Quill.prototype.focus](#quillprototypefocus)
- [Quill.prototype.format](#quillprototypeformat)
- [Quill.prototype.getBounds](#quillprototypegetbounds)
- [Quill.prototype.getSelection](#quillprototypegetselection)
- [Quill.prototype.hasFocus](#quillprototypehasfocus)
- [Quill.prototype.setSelection](#quillprototypesetselection)

#### Customization
- [Quill.register](#quillregister)
- [Quill.prototype.addContainer](#quillprototypeaddcontainer)
- [Quill.prototype.getModule](#quillprototypegetmodule)


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


### Quill.prototype.insertEmbed

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
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.insertEmbed(10, 'image', 'http://quilljs.com/images/cloud.png');
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


### Quill.prototype.disable

Shorthand for [`enable(false)`](#quillprototypeenable).


### Quill.prototype.enable

Set ability for user to edit, via input devices like the mouse or keyboard. Does not affect capabilities of API calls.

**Methods**

- `enable()`
- `enable(value)`

**Parameters**

| Parameter | Type      | Description
|-----------|-----------|------------
| `value`   | _Boolean_ | Whether to enable or disable user input.

**Examples**

{% highlight javascript %}
editor.enable();
editor.enable(false);   // Disables user input
{% endhighlight %}


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


### Quill.prototype.getFormat

Retrieves common formatting of the text in the given range. For a format to be reported, all text within the range must have a value. If there are different values, an array with all values will be reported. If no range is supplied, the user's current selection range is used. May be used to show which formats have been set on the cursor.

**Methods**

- `getFormat()`
- `getFormat(index)`
- `getFormat(index, length)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Start index of retrieval.
| `length`  | _Number_ | Length of range.

**Returns**

- _Object_ Formats common to the range.

**Examples**

{% highlight javascript %}
editor.setText('Hello World!');
editor.formatText(0, 2, 'bold', true);
editor.formatText(1, 2, 'italic', true);
editor.getFormat(0, 2);   // { bold: true }
editor.getFormat(1, 1);   // { bold: true, italic: true }

editor.formatText(0, 2, 'color', 'red');
editor.formatText(2, 1, 'color', 'blue');
editor.getFormat(0, 3);   // { color: ['red', 'blue'] }

editor.setSelection(3);
editor.getFormat();       // { italic: true, color: 'blue' }

editor.format('underline', true);
editor.getFormat();       // { italic: true, color: 'blue', underline: 'true' }

editor.formatLine(0, 1, 'align', 'right');
editor.getFormat();       // { italic: true, color: 'blue', underline: 'true', align: 'right' }
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


### Quill.prototype.update

Synchronously check editor for user updates and fires events, if changes have occurred.

**Methods**

- `update()`
- `update(source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `user`.

**Examples**

{% highlight javascript %}
editor.update();
{% endhighlight %}


### Quill.prototype.focus

Focuses the editor.

**Methods**

- `focus()`

**Examples**

{% highlight javascript %}
editor.focus();
{% endhighlight %}


### Quill.prototype.format

Format text at user's current selection. If the user's selection length is 0, i.e. it is a cursor, the format will be set, so next character user types will have that formatting.

**Methods**

- `format(name, value)`
- `format(name, value, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `name`    | _String_ | Name of format to apply.
| `value`   | _String_ | Value of format to apply. A falsy value will remove the format.
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.format('color', 'red');
editor.format('align', 'right');
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


### Quill.prototype.hasFocus

Checks if editor has focus. Note focus on toolbar, tooltips, does not count as the editor.

**Methods**

- `hasFocus()`

**Returns**

- *Boolean* Whether editor has focus.

**Examples**

{% highlight javascript %}
editor.hasFocus();
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


### Quill.register

Registers a module, theme, format or formats, making them available to be added to an editor. See their respective documentation for more details on definitions.

**Methods**

- `register(name, module)`
- `register(name, theme)`
- `register(format)`
- `register(format1, format2, ...formatN)`

**Parameters**

| Parameter | Type       | Description
|-----------|------------|------------
| `name`    | _String_   | Name of theme or module to register.
| `module`  | _Function_ | Module to register.
| `theme`   | _Function_ | Theme to register.
| `format`  | _Function_ | Format to register

**Examples**

{% highlight javascript %}
Quill.register('custom-module', function(quill, options) {
  console.log(options);
});
{% endhighlight %}


### Quill.prototype.addContainer

Adds a container inside the Quill container, sibling to the editor itself. By convention, Quill modules should have a class name prefixed with `ql-`.

**Methods**

- `addContainer(className, refNode)`
- `addContainer(domNode, refNode)`

**Parameters**

| Parameter   | Type          | Description
|-------------|---------------|------------
| `className` | _String_      | Class name to add to created container.
| `domNode`   | _HTMLElement_ | Container to be inserted.
| `refNode`   | _HTMLElement_ | Insert container before this reference node, if null container will be appended.

**Returns**

- *DOMElement* Container that was inserted.

**Examples**

{% highlight javascript %}
var container = editor.addContainer('ql-custom');
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

# Events

Quill exposes `on`, `once`, and `off` of its [EventEmitter](https://github.com/primus/eventemitter3) and allows you access to the following events:

1. [text-change](#text-change)
1. [selection-change](#selection-change)

### Text Change

Emitted when the contents of Quill have changed. Details of the change, along with the source of the change are provided. The source will be `"user"` if it originates from the users. For example:

- \- User types into the editor
- \- User formats text using the toolbar
- \- User uses a hotkey to undo
- \- User uses OS spelling correction

Changes may occur through an API but as long as they originate from the user, the provided source will still be `"user"`. For example, when a user clicks on the toolbar, technically the toolbar module calls a Quill API to effect the change. But source is still `"user"` since the origin of the change was the user's click.

**Callback Parameters**

| Parameter  | Type                       | Description
|------------|----------------------------|------------
| `delta`    | [_Delta_](/docs/deltas/)   | Represention of change.
| `oldDelta` | [_Delta_](/docs/deltas/)   | Represention of old document.
| `source`   | _String_                   | Source of change. Will be either `"user"` or `"api"`.

**Examples**

{% highlight javascript %}
editor.on('text-change', function(delta, oldDelta, source) {
  if (source == 'api') {
    console.log("An API call triggered this change.");
  } else if (source == 'user') {
    console.log("A user action triggered this change.");
  }
});
{% endhighlight %}

### Selection Change

Emitted when a user or API causes the selection to change, with a range representing the selection boundaries. A null range indicates selection loss (usually caused by loss of focus from the editor).

You can also use this event as a focus change event by just checking if the emitted range is null or not.

**Callback Parameters**

| Parameter  | Type     | Description
|------------|----------|------------
| `range`    | _Object_ | Object with **index** and **length** keys indicating where the selection exists.
| `oldRange` | _Object_ | Object with **index** and **length** keys indicating where the previous selection was.
| `source`   | _String_ | Source of change. Will be either `"user"` or `"api"`.

**Examples**

{% highlight javascript %}
editor.on('selection-change', function(range, oldRange, source) {
  if (range) {
    if (range.start == range.end) {
      console.log('User cursor is on', range.start);
    } else {
      var text = editor.getText(range.start, range.end);
      console.log('User has highlighted', text);
    }
  } else {
    console.log('Cursor not in the editor');
  }
});
{% endhighlight %}
