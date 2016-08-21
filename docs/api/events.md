## Events

### off

Removes event listener.

**Methods**

- `off(name, listener)`

**Parameters**

| Parameter  | Type       | Description
|------------|------------|------------
| `name`     | _String_   | Name of event.
| `listener` | _Function_ | Handler function.

**Returns**

- `Quill` Reference to Quill instance for chaining.

**Examples**

```javascript
function handler() {
  console.log('Hello!');
}

quill.on('text-change', handler);
quill.off('text-change', handler);
```


### on

Adds event handler. See [text-change](#text-change) or [selection-change](#selection-change) for more details on the events themselves.

**Methods**

- `on(name, listener)`

**Parameters**

| Parameter  | Type       | Description
|------------|------------|------------
| `name`     | _String_   | Name of event.
| `listener` | _Function_ | Handler function.

**Returns**

- `Quill` Reference to Quill instance for chaining.

**Examples**

```javascript
quill.on('text-change', function() {
  console.log('Text change!');
});
```


### once

Adds handler for one emission of an event. See [text-change](#text-change) or [selection-change](#selection-change) for more details on the events themselves.

**Methods**

- `once(name, listener)`

**Parameters**

| Parameter  | Type       | Description
|------------|------------|------------
| `name`     | _String_   | Name of event.
| `listener` | _Function_ | Handler function.

**Returns**

- `Quill` Reference to Quill instance for chaining.

**Examples**

```javascript
quill.once('text-change', function() {
  console.log('First text change!');
});
```


### Text Change

Emitted when the contents of Quill have changed. Details of the change, along with the source of the change are provided. The source disambiguates whether the local user caused the change. For example:

- \- User types into the editor
- \- User formats text using the toolbar
- \- User uses a hotkey to undo
- \- User uses OS spelling correction

Changes may occur through an API but as long as they originate from the user, the provided source should still be `"user"`. For example, when a user clicks on the toolbar, technically the toolbar module calls a Quill API to effect the change. But source is still `"user"` since the origin of the change was the user's click.

APIs causing text to change may also be called with a `"silent"` source, in which case `text-change` will not be emitted. This is not recommended as it will likely break the undo stack and other functions that rely on a full record of text changes.

**Callback Parameters**

| Parameter  | Type                       | Description
|------------|----------------------------|------------
| `delta`    | [_Delta_](/guides/working-with-deltas/)   | Represention of change.
| `oldDelta` | [_Delta_](/guides/working-with-deltas/)   | Represention of old document.
| `source`   | _String_                   | Source of change. Will be either `"user"` or `"api"`.

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


### Selection Change

Emitted when a user or API causes the selection to change, with a range representing the selection boundaries. A null range indicates selection loss (usually caused by loss of focus from the editor). You can also use this event as a focus change event by just checking if the emitted range is null or not.

APIs causing the selection to change may also be called with a `"silent"` source, in which case `selection-change` will not be emitted. This is useful if `selection-change` is a side effect. For example, typing causes the selection to change but would be very noisy to also emit a `selection-change` event on every character.

**Callback Parameters**

| Parameter  | Type     | Description
|------------|----------|------------
| `range`    | _Object_ | Object with **index** and **length** keys indicating where the selection exists.
| `oldRange` | _Object_ | Object with **index** and **length** keys indicating where the previous selection was.
| `source`   | _String_ | Source of change. Will be either `"user"` or `"api"`.

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

### Editor Change

Emitted when either `text-change` or `selection-change` would be emitted, even when the source is `"silent"`. The first parameter is the event name, either `text-change` or `selection-change`, followed by the arguments normally passed to those respective handlers.

**Callback Parameters**

| Parameter      | Type     | Description
|----------------|----------|------------
| `eventName`    | _String_ | Either `text-change` or `selection-change`
| `...arguments` | _Array_  | Arguments normally passed to those respective handlers

**Examples**

```javascript
quill.on('editor-change', function(eventName, ...arguments) {
  if (eventName === 'text-change') {
    // arguments[0] will be delta
  } else if (eventName === 'selection-change') {
    // arguments[0] will be old range
  }
});
```
