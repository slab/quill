---
layout: docs
title: Modules - Quill
permalink: /docs/modules/
stability: yellow
---

# Modules

Modules allow you to customize the functionality of Quill to your liking. Add the features you need and exclude the ones you don't. You can also [build your own](/docs/api/) modules for any particularly custom integrations or use cases. Several common modules are listed below.

Modules are meant to provide **functionality** only. See the [Configuration](/docs/configuration/) and [Theme](/docs/themes/) guides to learn about customizing style.

To enable a module, simply add it to the editor at initialization:

{% highlight javascript %}
var editor = new Quill('#editor', {
  modules: { toolbar: configs }
});
{% endhighlight %}

Or you can add it later:

{% highlight javascript %}
editor.addModule('multi-cursor', configs);
{% endhighlight %}

See each modules' documentation for more details about each one:

- [Toolbar](/docs/modules/toolbar/)
- [Authorship](/docs/modules/authorship/)
- [Multiple Cursors](/docs/modules/multi-cursors/)

We are still finalizing the interfaces and writing the documententation to guide you in building your own modules. We will provide addiitonal information here when they are ready.
