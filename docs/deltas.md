---
layout: docs
title: Deltas - Quill
permalink: /docs/deltas/
redirect_from: /docs/editor/deltas/
stability: yellow
---

# Deltas

Deltas are objects used by Quill to represent changes to the editor's contents. In most cases directly dealing with Deltas can be avoided. But it is available to provide a powerful interface to Quill.

Deltas can also be used to represent the contents of Quill. When used in this manner, think of it as the change from the blank editor.

1. [Operations](#operations)
1. [Delta.prototype.constructor](#deltaprototypeconstructor)
1. [Delta.prototype.apply](#deltaprototypeapply)
1. [Delta.prototype.compose](#deltaprototypecompose)
1. [Delta.prototype.decompose](#deltaprototypedecompose)

### Operations

An Array of operations are used to represent a Delta. Two types of operations are recognized: [insertions](#insert) and [retains](#retain). Insertions dequill text to be inserted. Retains dequill text to be kept. A delta and its operations dequill the entire editor's contents, so the absence of a retain over a portion of contents implies its deletion.

#### Insert

- An insert operation is an Object with the following properties:

| Parameter    | Type     | Description
|--------------|----------|------------
| `text`       | _String_ | The text to be inserted.
| `attributes` | _Object_ | Key/value pairs of formats to apply to text.

**Examples**

{% highlight javascript %}
// Insert a bold 'Hello'
var insert = {
  text: 'Hello!',
  attributes: { bold: true }
};
{% endhighlight %}

#### Retain

- A retain operation is an Object with the following properties:

| Parameter    | Type     | Description
|--------------|----------|------------
| `start`      | _Number_ | The start index of text that should be kept.
| `end`        | _Number_ | The exclusive end index of text that should be kept.
| `attributes` | _Object_ | Key/value pairs of formats to apply to text.

**Examples**

{% highlight javascript %}
// Keep the first 10 characters and apply the bold format to those characters
var retain = {
  start: 0,
  end: 10,
  attributes: { bold: true }
};
{% endhighlight %}

### Delta.prototype.constructor

Constructor for creating Deltas.

**Methods**

- `Delta(startLength, endLength, ops)`

**Parameters**

| Parameter     | Type     | Description
|---------------|----------|------------
| `startLength` | _Number_ | Characters in document before applying operations.
| `endLength`   | _Number_ | Characters in document after applying operations.
| `ops`         | _Array_  | Operations to be applied. See [operations](#operations) for more details.

**Examples**

{% highlight javascript %}
var delta = new Delta(5, 13, [
  { start: 0, end: 5 },                 // Keep the first 5 characters
  { text: 'Quill', { bold: true } }     // Insert a bolded 'Quill'
]);
{% endhighlight %}

### Delta.prototype.apply

Will call given insert, delete, and format functions based on the instructions of the current delta.

**Methods**

- `apply(insertFn)`
- `apply(insertFn, deleteFn)`
- `apply(insertFn, deleteFn, formatFn)`

**Parameters**

| Parameter                          | Type       | Description
|------------------------------------|------------|------------
| `insertFn(index, text, formats)`   | _Function_ | Called when text should be inserted.
| `deleteFn(index, length)`          | _Function_ | Called when text should be deleted.
| `formatFn(index, length, formats)` | _Function_ | Called when text should be formatted.

**Examples**

{% highlight javascript %}
delta.apply(function(index, text, formats) {
  // Insert text into editor
}, function(index, length) {
  // Delete text from editor
}, function(index, length, formats) {
  // Format text in editor
});
{% endhighlight %}

{% highlight javascript %}
var editor = new Quill('#editor');
delta.apply(editor.insertText, editor.deleteText, editor.formatText);
{% endhighlight %}

### Delta.prototype.compose

Determines the combination of the current delta with another delta. Neither delta will be altered. The endLength of the current delta must be equal to the startLength of the delta to be combined.

**Methods**

- `compose(other)`

**Parameter**

| Parameter | Type    | Description
|-----------|---------|------------
| `other`   | _Delta_ | Delta to compose with.

**Returns**

- The resulting composed Delta.

**Examples**

{% highlight javascript %}
var deltaA = new Delta(0, 6, [
  { text: 'Hello ' }
]);

var deltaB = new Delta(6, 12, [
  { start: 0, end: 6 },
  { text: 'World!' }
]);

// Should equal new Delta(0, 12, [{ text: 'Hello World!' }])
var composed = deltaA.compose(deltaB);
{% endhighlight %}

### Delta.prototype.decompose

Determines the difference between the current delta with another delta. Neither delta will be altered. The composition of the other delta with the resulting decomposed delta should produce the current delta.

**Methods**

- `decompose(other)`

**Parameter**

| Parameter | Type    | Description
|-----------|---------|------------
| `other`   | _Delta_ | Delta to decompose with.

**Returns**

- The resulting decomposed Delta.

**Examples**

{% highlight javascript %}
var deltaA = new Delta(0, 12, [
  { text: 'Hello World!' }
]);

var deltaB = new Delta(0, 6, [
  { text: 'Hello ' }
]);

// Should equal new Delta(6, 12, [{ start: 0, end: 6 }, { text: 'World!' }])
var decomposed = deltaA.decompose(deltaB);
{% endhighlight %}
