---
layout: docs
title: Editor - Quill
permalink: /docs/quickstart/
---

# Quickstart

The best way to get started is a simple example. Quill is initialized with a DOM element to contain the editor. The contents of that element will become the initial contents of Quill.

{% highlight html %}
<!-- Create the toolbar container -->
<div id="toolbar">
  <button class="ql-bold">Bold</button>
  <button class="ql-italic">Italic</button>
</div>

<!-- Create the editor container -->
<div id="editor">
  <div>Hello World!</div>
  <div>Some initial <b>bold</b> text</div>
  <div><br></div>
</div>

<!-- Include the Quill library -->
<script src="http://quilljs.com/js/quill.js"></script>

<!-- Initialize Quill editor -->
<script>
  var quill = new Quill('#editor');
  quill.addModule('toolbar', { container: '#toolbar' });
</script>
{% endhighlight %}

Quill also supports a powerful [API](/docs/editor/api/) for fine grain access and manipulation of the editor contents.

{% highlight html %}
<script>
  quill.on('text-change', function(delta, source) {
    console.log('Editor contents have changed', delta);
  });

  quill.insertText(11, ' Bilbo');
  console.log(quill.getText());   // Should output "Hello World Bilbo!\nSome initial bold text";
</script>
{% endhighlight %}

### Next Steps ###

That's all you need to do to set up a simple Quill editor! But the power of Quill is its flexibility and extensibility. Check out the [Examples](/examples/) to see this in action. Or start interacting with Quill with its flexible [API](/docs/editor/api/).
