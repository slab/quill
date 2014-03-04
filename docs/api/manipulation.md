---
layout: docs
title: Text Manipulation - Scribe
permalink: /docs/api/manipulation/
---

# Manipulation

Scribe allows granular access to its contents through the following methods.

1. [Scribe.prototype.getText](#scribeprototypegettext)
1. [Scribe.prototype.insertText](#scribeprototypeinserttext)
1. [Scribe.prototype.deleteText](#scribeprototypedeletetext)
1. [Scribe.prototype.formatText](#scribeprototypeformattext)
1. [Scribe.prototype.getContents](#scribeprototypegetcontents)
1. [Scribe.prototype.setContents](#scribeprototypesetcontents)
1. [Scribe.prototype.updateContents](#scribeprototypeupdatecontents)


### Scribe.prototype.getText

Retrieves the string contents of the editor.

**Methods**

- `getText()`
- `getText(index)`
- `getText(index, length)`

**Parameters**

| Parameter | Description
|-----------|-------------
| `index`   | _Number_ Starting position of text retrieval. Defaults to 0.
| `length`  | _Number_ of characters to retrieve. Defaults to the rest of the document.


**Returns**

- *String* contents of the editor

**Examples**

{% highlight javascript %}
var text = editor.getText(0, 10);
{% endhighlight %}


### Scribe.prototype.insertText

Inserts text into the editor.

**Methods**

- `insertText(index, text)`
- `insertText(index, text, formats)`
- `insertText(index, text, name, value)`

**Parameters**

| Parameter | Description
|-----------|-------------
| `index`   | _Number_ Position where text should be inserted.
| `text`    | _String_ Text to be inserted.
| `name`    | _String_ Name of format to apply to inserted text.
| `value`   | _String_ Value of format to apply to inserted text.
| `formats` | _Object_ Key/value pairs of formats to apply to inserted text.

**Examples**

{% highlight javascript %}
editor.insertText(0, 'Hello', 'bold', true);

editor.insertText(5, 'Scribe', {
  'italic': true,
  'fore-color': '#ffff00'
});
{% endhighlight %}


### Scribe.prototype.deleteText

Deletes text from the editor.

**Methods**

- `deleteText(index, length)`

**Parameters**

| Parameter | Description
|-----------|-------------
| `index`   | _Number_ Starting position of deletion.
| `length`  | _Number_ of characters to delete.

**Examples**

{% highlight javascript %}
editor.deleteText(0, 10);
{% endhighlight %}


### Scribe.prototype.formatText

Formats text in the editor.

**Methods**

- `formatText(index, length)`
- `formatText(index, length, formats)`
- `formatText(index, length, name, value)`

**Parameters**

| Parameter | Description
|-----------|-------------
| `index`   | _Number_ Starting position of formatting.
| `name`    | _String_ Name of format to apply to text.
| `value`   | _String_ Value of format to apply to text.
| `formats` | _Object_ Key/value pairs of formats to apply to text.

**Examples**

{% highlight javascript %}
editor.formatText(0, 10, 'bold', false);

editor.formatText(5, 6, {
  'italic': false,
  'fore-color': '#000fff'
});
{% endhighlight %}


### Scribe.prototype.getContents

Retrieves contents of the editor, with formatting data, represented by a Delta object.

**Methods**

- `getContents()`
- `getContents(index)`
- `getContents(index, length)`

**Parameters**

| Parameter | Description
|-----------|-------------
| `index`   | _Number_ Starting position of retrieval. Defaults to 0.
| `length`  | _Number_ of characters to retrieve. Defaults to the rest of the document.

**Returns**

- _Delta_ contents of the editor.

**Examples**

{% highlight javascript %}
var delta = editor.getContents();
{% endhighlight %}


### Scribe.prototype.setContents

Overwrites editor with given contents.

**Methods**

- `setContents(contents)`
- `setContents(delta)`

**Parameters**

| Parameter  | Description
|------------|-------------
| `contents` | _Array_ Contents editor will be set to, represented by an Array of objects with text and attribute keys.
| `delta`    | _Delta_ editor should be set to, represented by a Delta object.

**Examples**

{% highlight javascript %}
editor.setContents([
  { text: 'Hello ' },
  { text: 'World!', attributes: { bold: true } },
  { text: '\n' }
])
{% endhighlight %}


### Scribe.prototype.updateContents

Applies Delta to editor contents.

**Methods**

- `updateContents(delta)`

**Parameters**

| Parameter | Description
|-----------|-------------
| `delta`   | _Delta_ that will be applied.

**Examples**

{% highlight javascript %}
// Assuming editor is currently contains [{ text: 'Hello World!' }]
editor.update({
  startLength: 12,
  endLength: 13,
  ops: [
    { start: 0, end: 6 }, // Keep 'Hello '
    { text: 'Scribe' },   // Insert 'Scribe'
                          // Since there is no retain for index 6-10, 'World' is deleted
    { start: 11, end: 12, attributes: { bold: true } }    // Apply bold to exclamation mark
  ]
});
// Editor should now be [{ text: 'Hello Scribe' }, { text: '!', attributes: { bold: true} }]
{% endhighlight %}
