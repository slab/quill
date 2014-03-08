---
layout: docs
title: Toolbar Module - Scribe
permalink: /docs/modules/toolbar/
---

# Toolbar

Toolbars allow users to easily format Scribe's contents. Simply create a container and the module to the Scribe editor.

{% highlight html %}
<!-- Create toolbar container -->
<div id="toolbar">
  <!-- Add a bold button -->
  <button class="sc-bold"></button>
  <!-- Add font size dropdown -->
  <select class="sc-font-size">
    <option value="small">Small</option>
    <option value="normal" selected>Normal</option>
    <option value="large">Large</option>
    <option value="huge">Huge</option>
  </select>
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

Any DOM node with the following classes that is clicked will trigger the corresponding format change:

- `sc-bold`
- `sc-italic`
- `sc-strike`
- `sc-underline`
- `sc-link`

Any DOM node with the following classes that is changed (DOM "change" event) will trigger the corresponding format change:

- `sc-back-color`
- `sc-fore-color`
- `sc-font-size`
- `sc-font-family`

The toolbar will also listen to cursor changes and will add an `sc-active` class to elements in the toolbar that corresponds to the format of the text the cursor is on.
