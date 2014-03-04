---
layout: docs
title: Events - Scribe
permalink: /docs/api/events/
---

# Events

Scribe inherits from [EventEmitter](https://github.com/asyncly/EventEmitter2) and allowing you access to listen to the following events:

- [api-text-change](#api-text-change)
- [user-text-change](#user-text-change)
- [selection-change](#selection-change)

### API Text Change

Emitted when the [Scribe API]({{ site.baseurl }}/docs/api/manipulation/) is used to modify the editor contents. This event is mutually exclusive with the [user-text-change](#user-text-change) event.

**Callback Parameters**

| Parameter | Description
|-----------|-------------
| `delta`   | _Delta_ representing the change.

**Examples**

```javascript
var listener = function(delta) {
  console.log(delta);
};
editor.on('api-text-change', listener);

editor.insertText(0, 'Hello!');   // Should trigger listener

```

### User Text Change

Emitted when a user action causes the editor contents to change. For example:

- - User types into the editor
- - User formats text using the toolbar
- - User uses a hotkey to undo
- - User uses OS spelling correction

These changes may occur through an API but they always originate from the user. For example, when a user clicks on the toolbar, technically the toolbar module calls a Scribe API to effect the change. But this will still trigger the `user-text-change` event since the origin was the user's click.

This event is mutually exclusive with the [api-text-change](#api-text-change) event.

**Callback Parameters**

| Parameter | Description
|-----------|-------------
| `delta`   | _Delta_ representing the change.

**Examples**

```javascript
editor.on('user-text-change', function(delta) {
  // User changed the contents
});

```

### Selection Change

Emitted when a user or API causes the selection to change.

**Callback Parameters**

| Parameter | Description
|-----------|-------------
| `range`   | _Object_ with start and end keys indicating the corresponding positions in the document where the selection exists.

**Examples**

```javascript
editor.on('selection-change', function(range) {
  if (range) {
    if (range.start == range.end) {
      console.log('User cursor is on', range.start);
    } else {
      var text = editor.getText(range.start, range.end - range.start);
      console.log('User has highlighted', text);
    }
  } else {
    console.log('Cursor not in the editor');
  }
});

```
