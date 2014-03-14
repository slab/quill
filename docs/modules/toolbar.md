---
layout: docs
title: Toolbar Module - Scribe
permalink: /docs/modules/toolbar/
stylesheet: 'css/scribe.snow.css'
---

# Toolbar

The Toolbar module allow users to easily format Scribe's contents.

<div class="scribe-wrapper">
  <div id="toolbar-toolbar" class="toolbar">
  {% include full-toolbar.html %}
  </div>
  <div id="toolbar-editor" class="editor"></div>
</div>
<script src="/js/scribe.js"></script>
<script>
  var editor = new Scribe('#toolbar-editor', {
    modules: {
      toolbar: { container: '#toolbar-toolbar' }
    },
    theme: 'snow'
  });
</script>

Simply create a container and the module to the Scribe editor.

{% highlight html %}
<!-- Create toolbar container -->
<div id="toolbar">
  <!-- Add font size dropdown -->
  <select class="sc-font-size">
    <option value="small">Small</option>
    <option value="normal" selected>Normal</option>
    <option value="large">Large</option>
    <option value="huge">Huge</option>
  </select>
  <!-- Add a bold button -->
  <button class="sc-bold"></button>
</div>
<div id="editor"></div>

<!-- Initialize editor and toolbar -->
<script>
  var editor = new Scribe('#editor');
  editor.addModule('toolbar', {
    container: '#toolbar'     // Selector for toolbar container
  });
</script>
{% endhighlight %}

The `sc-toolbar-container` class will be added to the toolbar container.

A click handler will be added to any DOM element with the following classes:

- `sc-bold`
- `sc-italic`
- `sc-strike`
- `sc-underline`
- `sc-link`

A change (DOM `change` event) handler will be added to any DOM element with the following classes:

- `sc-back-color`
- `sc-fore-color`
- `sc-font-size`
- `sc-font-family`

The toolbar will also listen to cursor movements and will add an `sc-active` class to elements in the toolbar that corresponds to the format of the text the cursor is on.

The following classes are also recognized by the toolbar but largely used by [Themes](/docs/themes/) for styling:

- `sc-format-button`
- `sc-format-group`
- `sc-format-separator`
