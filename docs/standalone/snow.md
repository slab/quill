---
layout: standalone
title: Snow Theme
permalink: /standalone/snow/
---
<link rel="stylesheet" href="//{{site.cdn}}/{{site.version}}/quill.snow.css">
<style>
  body {
    padding: 25px;
  }
  #editor-container {
    height: 250px;
  }
</style>
<!-- section -->
<div id="editor-container"><p>Test</p></div>
<script type="text/javascript" src="//{{site.cdn}}/{{site.version}}/quill.js"></script>
<script>
  var quill = new Quill('#editor-container', {
    debug: 'info',
    modules: {
      toolbar: [
        [{ font: [false, 'serif', 'monospace'] }, { size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }, { align: [false, 'center', 'right', 'justify'] }],
        ['link', 'image']
      ]
    },
    theme: 'snow'
  });
</script>