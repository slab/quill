---
layout: docs
title: Cursors Module - Scribe
permalink: /docs/modules/multi-cursors/
stability: yellow
---

# Multi-Cursors

The Multi-Cursors modules enables the display of multiple external cursors inside the Scribe editor.

# TODO add demo

# Methods

- `setCursor(id, index, text, color)`

| Parameter | Description
|-----------|-------------
| `id`      | _String_ id of cursor
| `index`   | _Number_ position to place the cursor
| `text`    | _String_ text to place above cursor
| `color`   | _String_ Color of cursor. Can be any valid CSS color.

# Example

{% highlight javascript %}

var editor = new Scribe('#editor');
var module = editor.addModule('multi-cursor');

module.setCursor('id-1234', 10, 'Frodo', '#ff00ff');

{% endhighlight %}
