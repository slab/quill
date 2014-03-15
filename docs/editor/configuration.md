---
layout: docs
title: Editor Configuration - Scribe
permalink: /docs/editor/configuration/
---

# Configuration

Scribe allows several ways to customize it to suit your needs. This section is dedicated to tweaking existing functionality. See the [Modules](/docs/modules/) section for adding new functionality and the [Themes](/docs/themes/) section for styling.

To configure Scribe, pass in an object with the following recognized keys:

{% highlight javascript %}
var configs = {
  logLevel: 'warn',
  readOnly: true
};
var editor = new Scribe('#editor', configs);
{% endhighlight %}


#### formats

- Formats recognized by the editor. See [Formats](/docs/editor/formats/) for more information.

#### logLevel

- Default: `false`

- The amount of detail Scribe should log. Acceptable values are:

- `"debug"`
- `"info"`
- `"warn"`
- `"error"`
- `false`

#### modules

- See [Modules](/docs/modules/) for more information.

#### pollInterval

- Default: `100`

- Number of milliseconds between checking for local changes in the editor. Note that certain actions or API calls may prompt immediate checking.

#### readOnly

- Default: `false`

- Whether to instantiate the editor to read-only mode.

#### styles

- Default: `null`

- Object containing CSS rules to add to Scribe editor.

- **Example**

{% highlight javascript %}
var editor = new Scribe('#editor', {
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

- See [Themes](/docs/themes/) for more information.
