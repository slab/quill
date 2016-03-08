---
layout: docs
title: Events
permalink: /docs/events/
redirect_from: /docs/editor/events/
---

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
