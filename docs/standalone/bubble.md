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
<!-- section -->
<div id="editor-container"><p>Test</p></div>
<script type="text/javascript" src="{{site.cdn}}{{site.version}}/quill.js"></script>
<script>
  var quill = new Quill('#editor-container', {
    debug: 'info',
    theme: 'bubble'
  });
</script>