---
layout: docs
title: Editor - Scribe
permalink: /docs/editor/
---

# Editor

Welcome to Scribe!

Scribe was built to address the problem that existing WYSIWYG editors are themselves WYSIWYG. If the editor was not exactly the way you want it, it was difficult or impossible to customize it to fit your needs.

Scribe aims to solve this by organizing itself into [modules](/docs/modules/) and offering a powerful [API](/docs/api/) to build additional modules. It also imposes no styles (though reasonable defaults are available) to allow you to skin the editor however you wish.

Scribe also provides all of what you've come to expect from a rich text editor, including a lightweight package, numerous [formatting](/editor/formats/) options, and wide [cross platform](https://saucelabs.com/u/scribe) support.

### Quickstart

The best way to get started is a simple example:

{% highlight html %}
<!-- Create the toolbar container -->
<div id="toolbar">
  <button class="sc-bold">Bold</button>
  <button class="sc-italic">Italic</button>
</div>

<!-- Create the editor container -->
<div id="editor">
  <div>Hello World!</div>
  <div>
    <span>Some initial </span><b>bold</b></span> text</span>
  </div>
  <div><br /></div>
</div>

<!-- Include the Scribe library -->
<script src="http://stypi.github.io/scribe/js/scribe.js"></script>

<!-- Initialize Scribe editor -->
<script>
  var editor = new Scribe('#editor');
  editor.addModule('toolbar', { container: '#toolbar' });
</script>

{% endhighlight %}

Scribe is initialized with a DOM element to contain the editor. The contents of that element will become the initial contents of Scribe.

Only a subset of HTML is recognized for security (`<script>` tags are stripped) and consistency (`<strong>` tags are converted to `<b>` tags). The same process occurs when text is pasted into Scribe.

### Next Steps ###

That's all you need to do to set up a simple Scribe editor! But the power of Scribe comes with its flexibility and extensibility.

Check out the [Examples](/examples/) to see all of this in action. Or start interacting with Scribe in powerful new ways with its flexible [API](/docs/api/).
