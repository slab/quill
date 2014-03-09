---
layout: docs
title: Editor - Scribe
permalink: /docs/editor/
---

# Editor

Add some overview...

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

Check out the [Examples]({{ site.baseurl }}/examples/) to see all of this in action. Or start interacting with Scribe in powerful new ways with its flexible [API]({{ site.baseurl }}/docs/api/).
