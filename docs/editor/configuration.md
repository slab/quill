---
layout: docs
title: Editor Configuration - Scribe
permalink: /docs/editor/configuration/
---

# Configuration

Scribe allows several ways to customize it to suit your needs. This section is dedicated to tweaking existing functionality. See the [Modules]({{ site.baseurl }}/docs/modules/) section for adding new functionality and the [Themes]({{ site.baseurl }}/docs/themes/) section for styling.

To configure Scribe, pass in an object with the following recognized keys:

{% highlight javascript %}
var configs = {
  logLevel: 'warn',
  readonly: true
};
var editor = new Scribe('#editor', configs);
{% endhighlight %}


#### formats

- Formats recognized by the editor. See [Formats]({{ site.baseurl }}/docs/editor/formats/) for more information.

#### logLevel

- Default: `false`

- The amount of detail Scribe should log. Acceptable values are:

- `"debug"`
- `"info"`
- `"warn"`
- `"error"`
- `false`

#### pollInterval

- Default: `100`

- Number of milliseconds between checking for local changes in the editor. Note that certain actions or API calls may prompt immediate checking.

#### readonly

- Default: `false`

- Whether to instantiate the editor to readonly mode.

#### styles

- Default: `null`

- Object containing CSS rules to add to Scribe editor.

- **Example**

{% highlight javascript %}
var editor = new Scribe('#editor', {
  styles: {
    '.editor-container': {
      'font-family': "'Arial', san-serif"
    },
    '.editor a': {
      'text-decoration': 'none'
    }
  }
});
{% endhighlight %}

#### theme

- See [Themes]({{ site.baseurl }}/docs/themes/) for more information.

#### undoDelay

- Default: `1000`

- Minimum number of milliseconds between changes in the undo stack. Changes occurring within this threshold are combined in the undo stack.

#### undoMaxStack

- Defaults: `100`

- Maximum number of changes the keep in the undo stack.
