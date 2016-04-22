---
layout: standalone
title: Bubble Theme
permalink: /standalone/bubble/
---
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.bubble.css">
<style>
  body {
    margin: auto;
    padding: 50px;
    width: 720px;
  }
  #editor-container {
    height: 350px;
  }
</style>
<!-- head -->
<div id="editor-container"></div>
<script type="text/javascript" src="{{site.cdn}}{{site.version}}/quill.js"></script>
<script>
  var quill = new Quill('#editor-container', {
    placeholder: 'Compose an epic...',
    theme: 'bubble'
  });
</script>