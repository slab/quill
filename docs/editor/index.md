---
layout: docs
title: Editor - Quill
permalink: /docs/editor/
---

# Editor

Welcome to Quill!

Quill was built to address the problem that existing WYSIWYG editors are themselves WYSIWYG. If the editor was not exactly the way you want it, it was difficult or impossible to customize it to fit your needs.

Quill aims to solve this by organizing itself into [modules](/docs/modules/) and offering a powerful [API](/docs/editor/api/) to build additional modules. It also imposes no styles (though reasonable defaults are available) to allow you to skin the editor however you wish.

Quill also provides all of what you've come to expect from a rich text editor, including a lightweight package, numerous [formatting](/docs/editor/formats/) options, and wide [cross platform](https://saucelabs.com/u/quill) support.

### Quickstart

The best way to get started is a simple example:

{% highlight html %}
<!-- Create the toolbar container -->
<div id="toolbar">
  <button class="ql-bold">Bold</button>
  <button class="ql-italic">Italic</button>
</div>

<!-- Create the editor container -->
<div id="editor">
  <p>Hello World!</p>
  <p>Some initial <b>bold</b> text</p>
  <p><br></p>
</div>

<!-- Include the Quill library -->
<script src="http://quilljs.com/js/quill.js"></script>

<!-- Initialize Quill editor -->
<script>
  var editor = new Quill('#editor');
  editor.addModule('toolbar', { container: '#toolbar' });
</script>

{% endhighlight %}

Quill is initialized with a DOM element to contain the editor. The contents of that element will become the initial contents of Quill.

Only a subset of HTML is recognized for security (`<script>` tags are stripped) and consistency (`<strong>` tags are converted to `<b>` tags). The same process occurs when text is pasted into Quill.

### Next Steps ###

That's all you need to do to set up a simple Quill editor! But the power of Quill comes with its flexibility and extensibility.

Check out the [Examples](/examples/) to see all of this in action. Or start interacting with Quill in powerful new ways with its flexible [API](/docs/editor/api/).
