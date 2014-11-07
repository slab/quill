---
layout: docs
title: API
permalink: /docs/api/
redirect_from: /docs/editor/api/
---

# API

Quill allows granular access to its contents.

#### Retrieval
- [Quill.prototype.getText](#quillprototypegettext)
- [Quill.prototype.getLength](#quillprototypegetlength)
- [Quill.prototype.getContents](#quillprototypegetcontents)
- [Quill.prototype.getHTML](#quillprototypegethtml)

#### Manipulation
- [Quill.prototype.insertText](#quillprototypeinserttext)
- [Quill.prototype.deleteText](#quillprototypedeletetext)
- [Quill.prototype.formatText](#quillprototypeformattext)
- [Quill.prototype.insertEmbed](#quillprototypeinsertembed)
- [Quill.prototype.updateContents](#quillprototypeupdatecontents)
- [Quill.prototype.setContents](#quillprototypesetcontents)
- [Quill.prototype.setHTML](#quillprototypesethtml)

#### Selection
- [Quill.prototype.getSelection](#quillprototypegetselection)
- [Quill.prototype.setSelection](#quillprototypesetselection)
- [Quill.prototype.prepareFormat](#quillprototypeprepareformat)
- [Quill.prototype.focus](#quillprototypefocus)

#### Customization
- [Quill.registerModule](#quillregistermodule)
- [Quill.prototype.addModule](#quillprototypeaddmodule)
- [Quill.prototype.getModule](#quillprototypegetmodule)
- [Quill.prototype.onModuleLoad](#quillprototypeonmoduleload)
- [Quill.prototype.addFormat](#quillprototypeaddformat)
- [Quill.prototype.addContainer](#quillprototypeaddcontainer)


### Quill.prototype.getText

Retrieves the string contents of the editor.

**Methods**

- `getText()`
- `getText(start)`
- `getText(start, end)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `start`   | _Number_ | Start index of text retrieval. Defaults to 0.
| `end`     | _Number_ | End index of text retrieval. Defaults to end of the document.

**Returns**

- *String* contents of the editor

**Examples**

{% highlight javascript %}
var text = editor.getText(0, 10);
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


### Quill.prototype.getContents

Retrieves contents of the editor, with formatting data, represented by a [Delta](/docs/deltas/) object.

**Methods**

- `getContents()`
- `getContents(start)`
- `getContents(start, end)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `start`   | _Number_ | Start index of retrieval. Defaults to 0.
| `end`     | _Number_ | End index of retrieval. Defaults to the rest of the document.

**Returns**

- _Delta_ contents of the editor.

**Examples**

{% highlight javascript %}
var delta = editor.getContents();
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


### Quill.prototype.deleteText

Deletes text from the editor.

**Methods**

- `deleteText(start, end)`
- `deleteText(start, end, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `start`   | _Number_ | Start index of deletion.
| `end`     | _Number_ | End index of deletion.
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.deleteText(0, 10);
{% endhighlight %}


### Quill.prototype.formatText

Formats text in the editor. See [formats](/docs/formats/) for a list of available formats.

**Methods**

- `formatText(start, end)`
- `formatText(start, end, name, value)`
- `formatText(start, end, formats)`
- `formatText(start, end, source)`
- `formatText(start, end, name, value, source)`
- `formatText(start, end, formats, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `start`   | _Number_ | Start index of formatting range.
| `end`     | _Number_ | End index of formatting range.
| `name`    | _String_ | Name of format to apply to text.
| `value`   | _String_ | Value of format to apply to text. A falsy value will remove the format.
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.formatText(0, 10, 'bold', false);

editor.formatText(5, 6, {
  'italic': false,
  'color': 'rgb(0, 0, 255)'
});
{% endhighlight %}


### Quill.prototype.insertEmbed

Insert embedded content into the editor. Currently only images are supported.

**Methods**

- `insertEmbed(index, type, url)`
- `insertEmbed(index, type, url, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `index`   | _Number_ | Index where content should be inserted.
| `type`    | _String_ | Type of content. Currently accepts only `image`.
| `url`     | _String_ | URL where content is located.
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.insertEmbed(10, 'image', 'http://quilljs.com/images/cloud.png');
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
// Assuming editor currently contains [{ value: 'Hello World!' }]
editor.update({
  startLength: 12,
  endLength: 13,
  ops: [
    { start: 0, end: 6 }, // Keep 'Hello '
    { value: 'Quill' },   // Insert 'Quill'
                          // Since there is no retain for index 6-10, 'World' is deleted
    { start: 11, end: 12, attributes: { bold: true } }    // Apply bold to exclamation mark
  ]
});
// Editor should now be [{ value: 'Hello Quill' }, { value: '!', attributes: { bold: true} }]
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
  { value: 'Hello ' },
  { value: 'World!', attributes: { bold: true } },
  { value: '\n' }
]);
{% endhighlight %}


### Quill.prototype.setHTML

Sets contents of editor with given HTML. Note the editor will normalize the input to the subset it recognizes. For example `strong` tags will be converted to `b` tags.

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


### Quill.prototype.getSelection

Retrieves the user's selection range.

**Methods**

- `getSelection()`

**Returns**

- *String* contents of the editor

**Examples**

{% highlight javascript %}
var range = editor.getSelection();
if (range) {
  if (range.start == range.end) {
    console.log('User cursor is at index', range.start);
  } else {
    var text = editor.getText(range.start, range.end);
    console.log('User has highlighted: ', text);
  }
} else {
  console.log('User cursor is not in editor');
}
{% endhighlight %}


### Quill.prototype.setSelection

Sets user selection to given range. Will also focus the editor. If `null`, will blur the editor.

**Methods**

- `setSelection(start, end)`
- `setSelection(start, end, source)`
- `setSelection(range)`
- `setSelection(range, source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `start`   | _Number_ | Start index of selection range.
| `end`     | _Number_ | End index of selection range.
| `range`   | _Object_ | Object with **start** and **end** keys indicating the corresponding indexes where the selection exists.
| `source`  | _String_ | [Source](/docs/events/#text-change) to be emitted. Defaults to `api`.

**Examples**

{% highlight javascript %}
editor.setSelection(0, 5);
{% endhighlight %}


### Quill.prototype.prepareFormat

Sets the format at the current cursor position. Thus subsequent typing will result in those characters being set to the given format value. For example, setting bold and then typing 'a' will result in a bolded 'a'.

Has no effect if current selection does not exist or is not a cursor.

**Methods**

- `prepareFormat(format, value)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `format`  | _String_ | Name of format to set. See [formats](/docs/formats/) for a list of available formats.
| `value`   | _String_ | Value of format to apply to set. A falsy value will unset the format.

**Examples**

{% highlight javascript %}
editor.prepareFormat('bold', true);
{% endhighlight %}


### Quill.prototype.focus

Focuses the editor.

**Methods**

- `focus()`

**Examples**

{% highlight javascript %}
editor.focus();
{% endhighlight %}


### Quill.registerModule

Registers a module, making it available to be added to an editor. See [Modules](/docs/modules/) for more details.

**Methods**

- `registerModule(name, function)`

**Parameters**

| Parameter | Type       | Description
|-----------|------------|------------
| `name`    | _String_   | Name of module to register.
| `options` | _Function_ | Options to be passed into module constructor.

**Examples**

{% highlight javascript %}
Quill.registerModule('custom-module', function(quill, options) {
  console.log(options);
});
{% endhighlight %}


### Quill.prototype.addModule

Add module to editor. The module should have been previously registered with [registerModule](#quillregistermodule). See [Modules](/docs/modules/) for more details.

**Methods**

- `addModule(name, options)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `name`    | _String_ | Name of module to add.
| `options` | _Object_ | Options to be passed into module constructor.

**Returns**

- *Object* Instance of the module that was added.

**Examples**

{% highlight javascript %}
var toolbar = editor.addModule('toolbar', {
  container: '#toolbar-container'
});
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


### Quill.prototype.onModuleLoad

Calls a given callback when given module is added. If the module is already added, the callback is called immediately.

**Methods**

- `onModuleLoad(name, callback)`

**Parameters**

| Parameter  | Type       | Description
|------------|------------|------------
| `name`     | _String_   | Name of module.
| `callback` | _Function_ | Function to call.

**Examples**

{% highlight javascript %}
editor.onModuleLoad('toolbar', function(toolbar) {
  console.log('Toolbar has been added');
});
{% endhighlight %}


### Quill.prototype.addFormat

Add a custom defined format to editor.

**Methods**

- `addFormat(name, config)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `name`    | _String_ | Name of format to add. Will overwrite if name already exists.
| `config`  | _Object_ | Format configurations. See [formats](/docs/formats/) for more details.

**Examples**

{% highlight javascript %}
editor.addFormat('strike', { tag: 'S', prepare: 'strikeThrough' });
{% endhighlight %}


### Quill.prototype.addContainer

Add a div container inside the editor iframe, sibling to the editor itself. Remember to use the given container's ownerDocument to create additional DOM elements.

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
var container = editor.addContainer('custom-container');
{% endhighlight %}
