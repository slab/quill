---
layout: docs
title: Modules - Scribe
permalink: /docs/modules/
---

# Modules

Modules allow you to customize the functionality of Scribe to your liking. Add the features you need and exclude the ones you don't. You can also [build your own]({{ site.baseurl }}/docs/api/) modules for any particularly custom integrations or use cases. Several common modules are listed below.

Modules are meant to provide **functionality** only. See the [Configuration]({{ site.baseurl }}/docs/editor/configuration/) and [Theme]({{ site.baseurl }}/docs/themes/) guides to learn about customizing style.

To enable a module, simply add it to the editor at initialization:

{% highlight javascript %}
var editor = new Scribe('#editor', {
  modules: { toolbar: configs }
});
{% endhighlight %}

Or you can add it later:

{% highlight javascript %}
editor.addModule('multi-cursor', configs);
{% endhighlight %}

See each modules' documentation for more details about each one:

- [Toolbar]({{ site.baseurl }}/docs/modules/toolbar/)
- [Authorship]({{ site.baseurl }}/docs/modules/authorship/)
- [Multiple Cursors]({{ site.baseurl }}/docs/modules/multi-cursors/)

We are still finalizing the interfaces and writing the documententation to guide you in building your own modules. We will provide addiitonal information here when they are ready.
