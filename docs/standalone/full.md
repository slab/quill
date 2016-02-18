---
layout: standalone
title: Full Example
permalink: /standalone/full/
---
<link rel="stylesheet" href="//{{site.cdn}}/{{site.version}}/quill.snow.css">
<!-- section -->
<div id="toolbar-container">
  <select class="ql-font" title="Font">
    <option selected>Sans Serif</option>
    <option value="serif">Serif</option>
    <option value="monospace">Monospace</option>
  </select>
  <select class="ql-size" title="Size">
    <option value="10px">Small</option>
    <option selected>Normal</option>
    <option value="18px">Large</option>
    <option value="32px">Huge</option>
  </select>
  <select class="ql-color" title="Text Color"></select>
  <select class="ql-background" title="Background Color"></select>
  <select class="ql-align" title="Text Alignment">
    <option selected>Left</option>
    <option value="center">Center</option>
    <option value="right">Right</option>
    <option value="justify">Justify</option>
  </select>
  <button class="ql-bold" title='Bold'>Bold</button>
  <button class="ql-italic" title='Italic'>Italic</button>
  <button class="ql-underline" title='Underline'>Under</button>
  <button class="ql-strike" title='Strikethrough'>Strike</button>
  <button class="ql-link" title='Link'>Link</button>
  <button class="ql-image" title='Image'>Image</button>
  <button class="ql-bullet" title='Bullet'>Bullet</button>
  <button class="ql-list" title='List'>List</button>
</div>
<div id="editor-container"></div>
<script type="text/javascript" src="//{{site.cdn}}/{{site.version}}/quill.js"></script>
<script>
  var quill = new Quill('#editor-container', {
    debug: 'info',
    modules: {
      toolbar: '#toolbar-container'
    },
    theme: 'snow'
  });
</script>