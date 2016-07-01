## Events
---

### text-change

Emitted when the contents of Quill have changed. Details of the change, representation of the editor contents before the change, along with the source of the change are provided. The source will be `"user"` if it originates from the users. For example:

- User types into the editor
- User formats text using the toolbar
- User uses a hotkey to undo
- User uses OS spelling correction

Changes may occur through an API but as long as they originate from the user, the provided source will still be `"user"`. For example, when a user clicks on the toolbar, technically the toolbar module calls a Quill API to effect the change. But source is still `"user"` since the origin of the change was the user's click.

**Callback Signature**

```javascript
handler(delta: Delta, oldContents: Delta, source: String)
```

**Examples**

```javascript
quill.on('text-change', function(delta, oldDelta, source) {
  if (source == 'api') {
    console.log("An API call triggered this change.");
  } else if (source == 'user') {
    console.log("A user action triggered this change.");
  }
});
```

### selection-change

Emitted when a user or API causes the selection to change, with a range representing the selection boundaries along with the previous range before the change. A null range indicates selection loss (usually caused by loss of focus from the editor).

You can also use this event as a focus change event by just checking if the emitted range is null or not.

**Callback Signature**

```javascript
handler(range: { index: Number, length: Number },
        oldRange: { index: Number, length: Number },
        source: String)
```

**Examples**

```javascript
quill.on('selection-change', function(range, oldRange, source) {
  if (range) {
    if (range.start == range.end) {
      console.log('User cursor is on', range.start);
    } else {
      var text = quill.getText(range.start, range.end);
      console.log('User has highlighted', text);
    }
  } else {
    console.log('Cursor not in the editor');
  }
});
```

### off

Removes event listener. Returns Quill instance for chainability.

**Methods**

```javascript
off(name: String, listener: Function): Quill
```

**Examples**

```javascript
function handler() {
  console.log('Hello!');
}

quill.on('text-change', handler);
quill.off('text-change', handler);
```

### on

Adds event handler. Returns Quill instance for chainability.

**Methods**

```javascript
on(name: String, listener: Function): Quill
```

**Examples**

```javascript
quill.on('text-change', function() {
  console.log('Text change!');
});
```

### once

Adds handler for one emission of an event. Returns Quill instance for chainability.

**Methods**

```javascript
once(name: String, listener: Function): Quill
```

**Examples**

```javascript
quill.once('text-change', function() {
  console.log('First text change!');
});
```
