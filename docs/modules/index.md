---
layout: docs
title: Modules
permalink: /docs/modules/
stability: yellow
---

# Modules

Modules allow Quill's behavior and functionality to customized. To enable a module, simply add it to the editor at initialization:

{% highlight javascript %}
var editor = new Quill('#editor', {
  modules: { toolbar: options }
});
{% endhighlight %}

Or you can add it later:

{% highlight javascript %}
editor.addModule('toolbar', options);
{% endhighlight %}

A few common and officially supported modules are listed here:

- [Toolbar](/docs/modules/toolbar/)
- [Authorship](/docs/modules/authorship/)
- [Multiple Cursors](/docs/modules/multi-cursors/)


## Custom Modules

You can also build your own module. Simply register it with [Quill.registerModule](/docs/api/) and the module will be passed the corresponding Quill editor and options. Check out the [Building a Custom Module](/blog/building-a-custom-module/) guide for a walkthrough.

{% highlight javascript %}

Quill.registerModule('armorer', function(quill, options) {
  switch(options.hero) {
    case 'aragorn':
      console.log('anduril');
      break;
    case 'bilbo':
    case 'frodo':
      console.log('sting');
      break;
    case 'eomer':
      console.log('guthwine');
      break;
    case 'gandalf':
      console.log('glamdring');
      break;
    default:
      console.log('stick');
  }
});

var quill = new Quill('#editor');
quill.addModule('armorer', {
  hero: 'sam'
});

{% endhighlight %}
