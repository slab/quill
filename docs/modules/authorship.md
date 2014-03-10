---
layout: docs
title: Authorship Module - Scribe
permalink: /docs/modules/authorship/
stability: yellow
---

# Authorship

The Authorship module highlights the background of text to show who wrote what.

<div class='scribe-wrapper'>
  <div id='authorship-editor'></div>
</div>

<script src="http://stypi.github.io/scribe/js/scribe.js"></script>
<script>
var editor = new Scribe('#authorship-editor');

var module = editor.addModule('authorship', {
  authorId: 'frodo',
  color: 'rgba(153,0,153,0.4)'
});

module.addAuthor('jrr', 'rgba(0,153,255,0.4)');
module.addAuthor('tolkien', 'rgba(255,153,51,0.4)');
module.enable();

editor.setContents({
  startLength: 0,
  ops: [
    { value: 'The ', attributes: { author: 'tolkien' } },
    { value: 'Balrog', attributes: { author: 'jrr' } },
    { value: ' reached the bridge. ', attributes: { author: 'tolkien' } },
    { value: 'Gandalf stood in the middle of the span, leaning on the staff in his left hand, but in his other hand Glamdring gleamed, cold and white. ', attributes: { author: 'tolkien' } },
    { value: 'His enemy halted again, facing him, and the shadow about it reached out like two vast wings. It raised the whip, and the thongs whined and cracked. Fire came from its nostrils.', attributes: { author: 'jrr' } },
    { value: ' But Gandalf stood firm.', attributes: { author: 'tolkien' } }
  ]
});
</script>

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

var module = editor.addModule('authorship', {
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
