---
layout: docs
title: Editor Configuration - Quill
permalink: /docs/editor/configuration/
---

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
var configs = {
  readOnly: true,
  theme: 'snow'
};
var editor = new Quill('#editor', configs);
{% endhighlight %}

The following keys are recognized:

#### formats

- Formats recognized by the editor. See [Formats](/docs/editor/formats/) for more information.

#### modules

- Collection of modules to include. See [Modules](/docs/modules/) for more information.

#### pollInterval

- Default: `100`

- Number of milliseconds between checking for local changes in the editor. Note that certain actions or API calls may prompt immediate checking.

#### readOnly

- Default: `false`

- Whether to instantiate the editor to read-only mode.

#### styles

- Default: `null`

- Object containing CSS rules to add to the Quill editor.

- **Example**

{% highlight javascript %}
var editor = new Quill('#editor', {
  styles: {
    'body': {
      'font-family': "'Arial', san-serif"
    },
    'a': {
      'text-decoration': 'none'
    }
  }
});
{% endhighlight %}

#### theme

- Name of theme to use. See [Themes](/docs/themes/) for more information.
