---
layout: docs
title: Text Manipulation - Scribe
permalink: /docs/api/editor/
---

# Editor

## Text Manipulation

- getAt
- insertAt
- deleteAt
- formatAt

## Delta Operations

- getContents
- setContents
- update


#### getAt

Retrieves copy of text contents from the editor starting from given index.

**Methods**

- getAt()
- getAt(index)
- getAt(index, length)

**Parameters**

- index (Number) - Starting position of text retrieval. Defaults to 0.
- length (Number) - Number of characters to retrieve. Defaults to the rest of the document.

**Examples**

```javascript
editor.get(0, 10);
```


#### insertAt

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


#### deleteAt

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


#### formatAt

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
