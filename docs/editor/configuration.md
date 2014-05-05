---
layout: docs
title: Editor Configuration - Quill
permalink: /docs/editor/configuration/
---

# Configuration

Quill allows several ways to customize it to suit your needs. This section is dedicated to tweaking existing functionality. See the [Modules](/docs/modules/) section for adding new functionality and the [Themes](/docs/themes/) section for styling.

To configure Quill, pass in an object with the following recognized keys:

{% highlight javascript %}
var configs = {
  logLevel: 'warn',
  readOnly: true
};
var editor = new Quill('#editor', configs);
{% endhighlight %}


#### formats

- Formats recognized by the editor. See [Formats](/docs/editor/formats/) for more information.

#### logLevel

- Default: `false`

- The amount of detail Quill should log. Acceptable values are:

- `"debug"`
- `"info"`
- `"warn"`
- `"error"`
- `false`

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

- Object containing CSS rules to add to Quill editor.

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
