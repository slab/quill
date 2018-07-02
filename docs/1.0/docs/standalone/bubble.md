---
layout: standalone
title: Bubble Theme
permalink: /1.0/standalone/bubble/
---

<!-- head -->
<link rel="stylesheet" href="//cdn.quilljs.com/1.3.6/quill.bubble.css">
<style>
  .standalone-container {
    margin: 50px auto;
    max-width: 720px;
  }
  #bubble-container {
    height: 350px;
  }
</style>
<!-- head -->
<div class="standalone-container">
  <div id="bubble-container"></div>
</div>
<!-- script -->
<script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>
<script>
  var quill = new Quill('#bubble-container', {
    placeholder: 'Compose an epic...',
    theme: 'bubble'
  });
</script>
<!-- script -->
