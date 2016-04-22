---
layout: standalone
title: Snow Theme
permalink: /standalone/snow/
---
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.2.0/styles/monokai-sublime.min.css">
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.snow.css">
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
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.2.0/highlight.min.js"></script>
<script type="text/javascript" src="{{site.cdn}}{{site.version}}/quill.js"></script>
<script>
  var quill = new Quill('#editor-container', {
    debug: 'info',
    modules: {
      'code-highlighter': true
    },
    theme: 'snow'
  });
</script>