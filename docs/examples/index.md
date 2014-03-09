---
layout: examples
title: Examples - Scribe
permalink: /examples/
---

# Examples

The two examples below are synchronized. Check out how they interact with each other!

## Basic Example

A basic editor with just a few formats to get started.

<div class="scribe-wrapper">
  <div id="basic-toolbar">

  </div>
  <div id="basic-editor">
  {% include lotr.html %}
  </div>
</div>

<a class="accordian-toggle" data-toggle="collapse" href="#basic-collapse">Show/Hide Code</a>

<div id="basic-collapse" class="accordian-body collapse">
{% highlight javascript %}
{% include basic-editor.html %}
{% endhighlight %}
</div>

## Full Example

Uses all the features of Scribe, including [Modules]({{ site.baseurl }}/docs/modules/) and [Themes]({{ site.baseurl }}/docs/themes/).

<div class="scribe-wrapper">
  <div id="full-toolbar">

  </div>
  <div id="full-editor">
  {% include lotr.html %}
  </div>
</div>

<a class="accordian-toggle" data-toggle="collapse" href="#full-collapse">Show/Hide Code</a>

<div id="full-collapse" class="accordian-body collapse">
{% highlight javascript %}
{% include full-editor.html %}
{% endhighlight %}
</div>


<script src="{{ site.baseurl }}/js/scribe.js"></script>
<script>
{% include basic-editor.html %}
{% include full-editor.html %}
</script>