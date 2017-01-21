---
layout: standalone
title: Collaborative Example
permalink: /standalone/collaborative/
---
<!-- head -->
<link rel="stylesheet" href="{{site.katex}}/katex.min.css">
<link rel="stylesheet" href="{{site.highlightjs}}/styles/monokai-sublime.min.css">
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.bubble.css">
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.snow.css">
<style>
  * {
    box-sizing: border-box;
  }
  .standalone-container {
    float: left;
    padding: 25px;
    width: 50%;
  }
  #bubble-container {
    border: 1px solid #ccc;
    height: 392px;
  }
  #snow-container {
    height: 350px;
  }
</style>
<!-- head -->

<div class="standalone-container">
  <div id="bubble-container"></div>
</div>
<div class="standalone-container">
  <div id="snow-container"></div>
</div>

<!-- script -->
<script type="text/javascript" src="{{site.katex}}/katex.min.js"></script>
<script type="text/javascript" src="{{site.highlightjs}}/highlight.min.js"></script>
<script type="text/javascript" src="{{site.cdn}}{{site.version}}/{{site.quill}}"></script>
<script type="text/javascript">
  var bubbleQuill = new Quill('#bubble-container', {
    placeholder: 'Compose an epic...',
    theme: 'bubble'
  });
  var snowQuill = new Quill('#snow-container', {
    placeholder: 'Compose an epic...',
    theme: 'snow'
  });

  bubbleQuill.on(Quill.events.TEXT_CHANGE, function(delta, old, source) {
    if (source === Quill.sources.USER) {
      snowQuill.updateContents(delta);
    }
  });
  snowQuill.on(Quill.events.TEXT_CHANGE, function(delta, old, source) {
    if (source === Quill.sources.USER) {
      bubbleQuill.updateContents(delta);
    }
  });
</script>
<!-- script -->