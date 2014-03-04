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
</div>

<!-- Include the Scribe library -->
<script src="http://stypi.github.io/scribe/js/scribe.all.js"></script>

<!-- Initialize Scribe editor -->
<script>
  var editor = new Scribe('#editor');
  editor.addModule('toolbar', { container: '#toolbar' });
</script>
{% endhighlight %}

That's all you need to do to set up a simple Scribe editor! Take a look at the [Editor]({{ site.baseurl }}/docs/editor/) docs to see what's going on here.

# TODO: INSERT SIMPLE SCRIBE EDITOR HERE

But the power of Scribe comes with its flexibility and extensibility. Check out the rest of the documentation to learn more.
