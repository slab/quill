---
layout: docs
title: Modules - Scribe
permalink: /docs/modules/
---

# Modules

Several common extensions to Scribe are packaged as modules. Modules are meant to provide **functionality** only. See the [Configuration]({{ site.baseurl }}/docs/editor/configuration/) and [Theme]({{ site.baseurl }}/docs/themes/) documentation to learn about customizing style.

To enable a module, simply add it to the editor at initialization:

{% highlight javascript %}
var editor = new Scribe('#editor', {
  toolbar: { container: '#toolbar' }
});
{% endhighlight %}

Or you can add it later:

{% highlight javascript %}
editor.addModule('multi-cursor');
{% endhighlight %}

See each modules' documentation for more details about each one:

- [Toolbar]({{ site.baseurl }}/docs/modules/toolbar/)
- [Link Tooltip]({{ site.baseurl }}/docs/modules/link-tooltip/)
- [Authors]({{ site.baseurl }}/docs/modules/authors/)
- [Cursors]({{ site.baseurl }}/docs/modules/cursors/)

It is our intention to enable you to create your own modules. We will provide documentation and guidance here once the interface is finalized.
