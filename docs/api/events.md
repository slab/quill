---
layout: docs
title: Events - Scribe
permalink: /docs/api/events/
---

# Events

Scribe inherits from [EventEmitter](https://github.com/asyncly/EventEmitter2) and allows you access to listen to the following events:

1. [text-change](#text-change)
1. [selection-change](#selection-change)
1. [focus-change](#focus-change)

### Text Change

Emitted when the contents of Scribe have changed. Details of the change, along with the source of the change are provided. The source will be `"user"` if it originates from the users. For example:

- \- User types into the editor
- \- User formats text using the toolbar
- \- User uses a hotkey to undo
- \- User uses OS spelling correction

Changes may occur through an API but as long as they originate from the user, the provided source will still be `"user"`. For example, when a user clicks on the toolbar, technically the toolbar module calls a Scribe API to effect the change. But source is still `"user"` since the origin of the change was the user's click.

**Callback Parameters**

| Parameter | Type                         | Description
|-----------|------------------------------|------------
| `delta`   | [_Delta_](/docs/api/deltas/) | Represention of change.
| `source`  | _String_                     | Source of change. Will be either `"user"` or `"api"`.

**Examples**

{% highlight javascript %}
editor.on('text-change', function(delta, source) {
  if (source == 'api') {
    console.log("An API call triggered this change.");
  } else if (source == 'user') {
    console.log("A user action triggered this change.");
  } else {
    console.log("This shouldn't happen...");
  }
});
{% endhighlight %}

### Selection Change

Emitted when a user or API causes the selection to change.

**Callback Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `range`   | _Object_ | Object with **start** and **end** keys indicating the corresponding positions where the selection exists.

**Examples**

{% highlight javascript %}
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
{% endhighlight %}

### Focus Change

Emitted when the editor gains or loses focus. This is different from just listening on `selection-change` and checking for a null value since modern browsers allow the loss of focus without the loss of selection (when you refocus, your old selection still exists).

**Callback Parameters**

| Parameter  | Type      | Description
|------------|-----------|------------
| `hasFocus` | _Boolean_ | Whether or not the editor has focus.

**Examples**

{% highlight javascript %}
editor.on('focus-change', function(hasFocus) {
  if (hasFocus) {
    console.log("Editor has focus.");
  } else {
    console.log("Editor lost focus.");
  }
});
{% endhighlight %}
