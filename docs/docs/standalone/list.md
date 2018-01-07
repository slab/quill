---
layout: standalone
title: List Example
permalink: /standalone/list/
---
<!-- head -->
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.snow.css">
<style>
  body {
    padding: 25px;
  }
  #editor-container {
    border: 1px solid #ccc;
    height: 250px;
  }
</style>
<!-- head -->
<div id="editor-container"></div>
<!-- script -->
<script src="{{site.katex}}/katex.min.js"></script>
<script src="{{site.cdn}}{{site.version}}/{{site.quill}}"></script>
<script>
  var quill = new Quill('#editor-container', {
    debug: 'info',
    modules: {
      toolbar: [{'list': 'check'}, 'bold'],
    },
    theme: 'snow'
  });
</script>
<!-- script -->
