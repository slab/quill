---
layout: docs
title: Configuration
permalink: /docs/configuration/
---

TODO: Review

# Configuration

Quill allows several ways to customize it to suit your needs. This section is dedicated to tweaking existing functionality. See the [Modules](/docs/modules/) section for adding new functionality and the [Themes](/docs/themes/) section for styling.


### Container

Quill requires an container where the editor will be appended. You can either pass in a CSS selector or a DOM object.

{% highlight javascript %}
var editor = new Quill('.editor');  // The first result of the selector will be used
{% endhighlight %}

{% highlight javascript %}
var container = document.getElementById('editor');
var editor = new Quill(container);
{% endhighlight %}

{% highlight javascript %}
var container = $('.editor').get(0);
var editor = new Quill(container);
{% endhighlight %}

### Options

To configure Quill, pass in an options object:

{% highlight javascript %}
var options = {
  readOnly: true,
  theme: 'snow'
};
var editor = new Quill('#editor', options);
{% endhighlight %}

The following keys are recognized:

#### modules

- Collection of modules to include and respective options. See [Modules](/docs/modules/) for more information.

#### readOnly

- Default: `false`

- Whether to instantiate the editor to read-only mode.

#### theme

- Name of theme to use. Note the theme's specific stylesheet still needs to be included manually. See [Themes](/docs/themes/) for more information.
