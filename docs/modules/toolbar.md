---
layout: docs
title: Toolbar Module
permalink: /docs/modules/toolbar/
---

<link href="{{ site.cdn }}{{ site.version }}/quill.snow.css" rel="stylesheet">
<!-- head -->

TODO: Review

The Toolbar module allow users to easily format Quill's contents.

<div class="quill-wrapper">
  <div id="toolbar-toolbar" class="toolbar">
  {% include full-toolbar.html %}
  </div>
  <div id="toolbar-editor" class="editor"></div>
</div>

Simply create a container and the module to the Quill editor.

```html
<!-- Create toolbar container -->
<div id="toolbar">
  <!-- Add font size dropdown -->
  <select class="ql-size">
    <option value="10px">Small</option>
    <option value="13px" selected>Normal</option>
    <option value="18px">Large</option>
    <option value="32px">Huge</option>
  </select>
  <!-- Add a bold button -->
  <button class="ql-bold"></button>
</div>
<div id="editor"></div>

<!-- Initialize editor and toolbar -->
<script>
  var quill = new Quill('#editor');
  quill.addModule('toolbar', {
    container: '#toolbar'     // Selector for toolbar container
  });
</script>
```

The `ql-toolbar` class will be added to the toolbar container.

A click handler will be added to any DOM element with the following classes:

- `ql-bold`
- `ql-italic`
- `ql-strike`
- `ql-underline`
- `ql-link`

A change (DOM `change` event) handler will be added to any DOM element with the following classes:

- `ql-background`
- `ql-color`
- `ql-font`
- `ql-size`

The toolbar will also listen to cursor movements and will add an `ql-active` class to elements in the toolbar that corresponds to the format of the text the cursor is on.

The following classes are also recognized by the toolbar but largely used by [Themes](/docs/themes/) for styling:

- `ql-format-button`
- `ql-format-group`
- `ql-format-separator`

<!-- script -->
<script src="{{site.cdn}}{{site.version}}/quill.js"></script>
<script>
  var quill = new Quill('#toolbar-editor', {
    modules: {
      toolbar: { container: '#toolbar-toolbar' }
    },
    theme: 'snow'
  });
</script>
