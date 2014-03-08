---
layout: docs
title: Get Started - Scribe
permalink: /docs/quickstart/
---

# Quickstart

The best way to get started is a simple demo:

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

That's all you need to do to set up a simple Scribe editor! But the power of Scribe comes with its flexibility and extensibility. Check out the rest of the documentation to learn more.
