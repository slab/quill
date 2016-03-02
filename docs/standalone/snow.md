---
layout: standalone
title: Snow Theme
permalink: /standalone/snow/
---
<link rel="stylesheet" href="//{{site.cdn}}/{{site.version}}/quill.snow.css">
<style>
  body {
    margin: auto;
    padding: 50px;
    width: 720px;
  }
  #editor-container {
    height: 400px;
  }
</style>
<!-- section -->
<div id="editor-container"><p><a href="google.com">Googe</a></p></div>
<script type="text/javascript" src="//{{site.cdn}}/{{site.version}}/quill.js"></script>
<script>
  var quill = new Quill('#editor-container', {
    debug: 'info',
    modules: {
      'image-tooltip': true,
      'link-tooltip': true,
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