---
layout: docs
title: Themes - Scribe
permalink: /docs/themes/
stability: yellow
---

# Themes

Themes allow you to easily make your Scribe editor look good with minimal effort.

To use a custom theme, simply add its stylesheet in the `<head>`:

{% highlight html %}
<link rel="stylesheet" href="http://stypi.github.io/scribe/css/scribe.snow.css" />
{% endhighlight %}

and specify its usage at initialization:

{% highlight javascript %}
var editor = new Scribe('#editor', {
  theme: 'snow'
});
{% endhighlight %}

There is currently only one predefined theme `snow` for Scribe.

In the future we will provide more options and even allow you to create your own. We will provide documentation and guidance here once they are finalized.
