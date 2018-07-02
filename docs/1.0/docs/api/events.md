## Events

### text-change

Emitted when the contents of Quill have changed. Details of the change, representation of the editor contents before the change, along with the source of the change are provided. The source will be `"user"` if it originates from the users. For example:

- User types into the editor
- User formats text using the toolbar
- User uses a hotkey to undo
- User uses OS spelling correction

Changes may occur through an API but as long as they originate from the user, the provided source should still be `"user"`. For example, when a user clicks on the toolbar, technically the toolbar module calls a Quill API to effect the change. But source is still `"user"` since the origin of the change was the user's click.

APIs causing text to change may also be called with a `"silent"` source, in which case `text-change` will not be emitted. This is not recommended as it will likely break the undo stack and other functions that rely on a full record of text changes.

Changes to text may cause changes to the selection (ex. typing advances the cursor), however during the `text-change` handler, the selection is not yet updated, and native browser behavior may place it in an inconsistent state. Use [`selection-change`](#selection-change) or [`editor-change`](#editor-change) for reliable selection updates.

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

Emitted when a user or API causes the selection to change, with a range representing the selection boundaries. A null range indicates selection loss (usually caused by loss of focus from the editor). You can also use this event as a focus change event by just checking if the emitted range is null or not.

APIs causing the selection to change may also be called with a `"silent"` source, in which case `selection-change` will not be emitted. This is useful if `selection-change` is a side effect. For example, typing causes the selection to change but would be very noisy to also emit a `selection-change` event on every character.

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
    if (range.length == 0) {
      console.log('User cursor is on', range.index);
    } else {
      var text = quill.getText(range.index, range.length);
      console.log('User has highlighted', text);
    }
  } else {
    console.log('Cursor not in the editor');
  }
});
```

### editor-change

Emitted when either `text-change` or `selection-change` would be emitted, even when the source is `"silent"`. The first parameter is the event name, either `text-change` or `selection-change`, followed by the arguments normally passed to those respective handlers.

**Callback Signature**

```javascript
handler(name: String, ...args)
```

**Examples**

```javascript
quill.on('editor-change', function(eventName, ...args) {
  if (eventName === 'text-change') {
    // args[0] will be delta
  } else if (eventName === 'selection-change') {
    // args[0] will be old range
  }
});
```

### on

Adds event handler. See [text-change](#text-change) or [selection-change](#selection-change) for more details on the events themselves.

**Methods**

```javascript
on(name: String, handler: Function): Quill
```

**Examples**

```javascript
quill.on('text-change', function() {
  console.log('Text change!');
});
```

### once

Adds handler for one emission of an event. See [text-change](#text-change) or [selection-change](#selection-change) for more details on the events themselves.


**Methods**

```javascript
once(name: String, handler: Function): Quill
```

**Examples**

```javascript
quill.once('text-change', function() {
  console.log('First text change!');
});
```

### off

Removes event handler.

**Methods**

```javascript
off(name: String, handler: Function): Quill
```

**Examples**

```javascript
function handler() {
  console.log('Hello!');
}

quill.on('text-change', handler);
quill.off('text-change', handler);
```
