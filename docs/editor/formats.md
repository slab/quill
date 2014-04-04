---
layout: docs
title: Editor Formats - Quill
permalink: /docs/editor/formats/
---

# Formats

Quill currently supports a number of formats. Enabling a format:

- \- Allows the Quill Editor to recognize the format
- \- Quill API calls using the format
- \- Registers associated hotkeys

Note that enabling a format is distinct from adding a control in the [toolbar](/docs/modules/toolbar/). By default all supported formats are enabled.

  - Bold - `bold`
  - Italic - `italic`
  - Strikethrough - `strike`
  - Underline - `underline`
  - Link - `link`
  - Font - `font-name`
  - Size - `font-size`
  - Color - `fore-color`
  - Background Color - `back-color`

### Configuring

To customize the supported formats, pass in a whitelist array of formats you wish to support.

{% highlight javascript %}
var editor = new Quill('#editor', {
  formats: ['bold', 'italic', 'fore-color']
});
{% endhighlight %}
