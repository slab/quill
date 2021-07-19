---
layout: standalone
title: Snow Theme
permalink: /1.0/standalone/snow/
---

<!-- head -->
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css">
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css">
<link rel="stylesheet" href="//cdn.quilljs.com/1.3.6/quill.snow.css">
<style>
  .standalone-container {
    margin: 50px auto;
    max-width: 720px;
  }
  #snow-container {
    height: 350px;
  }
</style>
<!-- head -->
<div class="standalone-container">
  <div id="snow-container"></div>
</div>
<!-- script -->
<script src="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
<script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>
<script>
  var quill = new Quill('#snow-container', {
    placeholder: 'Compose an epic...',
    theme: 'snow'
  });
</script>
<!-- script -->
