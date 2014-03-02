---
layout: docs
title: Text Manipulation - Scribe
permalink: /docs/api/manipulation/
---

# Editor

## Text Manipulation

- [getAt](#getAt)
- [insertAt](#insertAt)
- [deleteAt](#deleteAt)
- [formatAt](#formatAt)

## Delta Operations

- [getContents](#getContents)
- [setContents](#setContents)
- [updateContents](#updateContents)


### getAt

Retrieves string contents of the editor.

**Methods**

- getAt()
- getAt(index)
- getAt(index, length)

**Parameters**

- index (Number) - Starting position of text retrieval. Defaults to 0.
- length (Number) - Number of characters to retrieve. Defaults to the rest of the document.

**Return***

- String - String contents of the editor

**Examples**

```javascript
var text = editor.get(0, 10);
```


### insertAt

Inserts text into the editor.

**Methods**

- insertAt(index, text)
- insertAt(index, text, formats)
- insertAt(index, text, name, value)

**Parameters**

- index (Number) - Starting position of text retrieval. Defaults to 0.
- text (String) - Number of characters to retrieve. If omitted, will return to the end of the document.
- name (String) - Name of format to apply to inserted text.
- value (String) - Value of format to apply to inserted text.
- formats (Object) - Key/value pairs of formats to apply to inserted text.

**Examples**

```javascript
editor.insertAt(0, 'Hello', 'bold', true);

editor.insertAt(5, 'Scribe', {
  'italic': true,
  'fore-color': '#ffff00'
});
```


### deleteAt

Deletes text from the editor.

**Methods**

- deleteAt(index, length)

**Parameters**

- index (Number) - Starting position of deletion.
- length (Number) - Number of characters to delete.

**Examples**

```javascript
editor.deleteAt(0, 10);
```


### formatAt

Formats text in the editor.

**Methods**

- formatAt(index, length)
- formatAt(index, length, formats)
- formatAt(index, length, name, value)

**Parameters**

- index (Number) - Starting position of formatting.
- name (String) - Name of format to apply to text.
- value (String) - Value of format to apply to text.
- formats (Object) - Key/value pairs of formats to apply to text.

```javascript
editor.formatAt(0, 10, 'bold', false);

editor.formatAt(5, 6, {
  'italic': false,
  'fore-color': '#000fff'
});
```


### getContents

Retrieves contents of the editor, with formatting data, represented by a Delta object.

**Methods**

- getContents()
- getContents(index)
- getContents(index, length)

**Parameters**

- index (Number) - Starting position of retrieval. Defaults to 0.
- length (Number) - Number of characters to retrieve. Defaults to the rest of the document.

**Return***

- Object - Contents of the editor.

**Examples**

```javascript
var delta = editor.getContents();
```


### setContents

Overwrites editor with given contents.

**Methods**

- setContents(contents)
- setContents(delta)

**Parameters**

- contents (Array) - Contents editor will be set to, represented by an Array of objects with keys `text` representing the text and `attributes` representing the formatting corresponding to that `text`
- delta (Object) - Contents editor will be set to, represented by a Delta object.

**Examples**

```javascript
editor.setContents([
  { text: 'Hello ' },
  { text: 'World!', attributes: { bold: true } },
  { text: '\n' }
])
```


### updateContents

Applies Delta to editor contents.

**Methods**

- updateContents(delta)

**Parameters**

- delta (Object) - Delta that will be applied.

**Examples**

```javascript
// Assuming editor is currently contains [{ text: 'Hello World!' }]
editor.update({
  startLength: 12,
  endLength: 13,
  ops: [
    { start: 0, end: 6 }, // Keep 'Hello '
    { text: 'Scribe' },   // Insert 'Scribe'
                          // Since there is no retain for index 6-10, 'World' is deleted
    { start: 11, end: 12, attributes: { bold: true } }    // Bold exclamation mark
  ]
});
// Editor should now be [{ text: 'Hello Scribe' }, { text: '!', attributes: { bold: true} }]
```
