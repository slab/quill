---
layout: docs
title: Themes
permalink: /docs/themes/
stability: yellow
---

# Themes

TODO: Review

Themes allow you to easily make your Quill editor look good with minimal effort.

To use a custom theme, simply add its stylesheet in the `<head>`:

{% highlight html %}
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.snow.css" />
{% endhighlight %}

and specify its usage at initialization:

{% highlight javascript %}
var editor = new Quill('#editor', {
  theme: 'snow'
});
{% endhighlight %}

There is currently only one predefined theme `snow` for Quill.

In the future we will provide more options and even allow you to create your own. We will provide documentation and guidance here once they are finalized.
