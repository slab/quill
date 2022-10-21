---
layout: standalone
title: Basic Example
permalink: /standalone/basic/
---
<!-- head -->
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.core.css">
<style>
  body {
    padding: 25px;
  }
  #toolbar-container {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 10px;
  }
  #editor-container {
    border: 1px solid #ccc;
    height: 250px;
  }
</style>
<!-- head -->
<div id="toolbar-container">
  <select class="ql-font" title="Font">
    <option selected>Sans Serif</option>
    <option value="serif">Serif</option>
    <option value="monospace">Monospace</option>
  </select>
  <select class="ql-size" title="Size">
    <option value="small">Small</option>
    <option selected>Normal</option>
    <option value="large">Large</option>
    <option value="huge">Huge</option>
  </select>
  <select class="ql-color" title="Text Color">
    <option value="white">White</option>
    <option selected>Black</option>
    <option value="red">Red</option>
    <option value="orange">Orange</option>
    <option value="yellow">Yellow</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
    <option value="purple">Purple</option>
  </select>
  <select class="ql-background" title="Background Color">
    <option selected>White</option>
    <option value="black">Black</option>
    <option value="red">Red</option>
    <option value="orange">Orange</option>
    <option value="yellow">Yellow</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
    <option value="purple">Purple</option>
  </select>
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
  <button class="ql-list" title='Bullet' value="bullet">Bullet</button>
  <button class="ql-list" title='List' value="ordered">List</button>
</div>
<div id="editor-container"></div>
<!-- script -->
<script src="{{site.cdn}}{{site.version}}/{{site.quill}}"></script>
<script>
  var quill = new Quill('#editor-container', {
    debug: 'info',
    modules: {
      toolbar: '#toolbar-container'
    }
  });
</script>
<!-- script -->
