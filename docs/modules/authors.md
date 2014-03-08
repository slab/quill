---
layout: docs
title: Authors Module - Scribe
permalink: /docs/modules/authors/
stability: yellow
---

# Authors

The Authors module highlights the background of text to show who wrote what.

# TODO add demo

Enabling this module will also add a new format `author` to the list of recognized [formats]({{ site.baseurl }}/docs/editor/formats/). The value of the `author` format is the id of the author. Changes made to the Scribe editor will also attach the local author metadata.

### Configuration

| Parameter  | Description
|------------|-------------
| `authorId` | _String_ id of current author
| `button`   | _String_ CSS selector for button that toggles authorship colors on/off
| `color`    | _String_ Color to correspond with current author. Can be any valid CSS color.


### Methods

- `addAuthor(id, color)`

| Parameter | Description
|-----------|-------------
| `id`      | _String_ id of author to add
| `color`   | _String_ Color to correspond with author id. Can be any valid CSS color.


### Example

{% highlight javascript %}

var editor = new Scribe('#editor');

var module = editor.addModule('attribution', {
  authorId: 'id-1234',
  button: '#author-button',
  color: '#ff00ff'
});

module.addAuthor('id-5678', '#ffff00'); // Set external authors

editor.on('text-update', function(delta) {
  // If the user types an 'a' into the editor, normally we would get:
  //   delta.ops = [{ 'a' }]
  // But with the author module enabled we would now get:
  //   delta.ops = [{ value: 'a', attributes: { author: 'id-1234' } }]
});

{% endhighlight %}
