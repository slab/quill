---
layout: docs
title: Themes
permalink: /docs/themes/
---
<!-- head -->
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.2.0/styles/monokai-sublime.min.css">
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.snow.css">
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.bubble.css">
<!-- head -->

Themes allow you to easily make your editor look good with minimal effort. Quill features two offically supported themes: [Snow](#snow) and [Bubble](#bubble).

Themes primarily control the visual look of Quill through a CSS stylesheet, and slight tweaks can easily be made by overriding these rules.


### Usage

```html
<!-- Add the theme's stylesheet -->
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.bubble.css">

<script type="text/javascript" src="{{site.cdn}}{{site.version}}/quill.js"></script>
<script type="text/javascript">
var quill = new Quill('#editor', {
  theme: 'bubble'   // Specify theme in configuration
});
</script>
```


## Snow

Snow is a clean, flat toolbar theme.

<div class="standalone-container">
  <div id="snow-container"></div>
</div>
<a class="standalone-link" href="/standalone/snow/">Standalone</a>


## Bubble

Bubble is a simple tooltip based theme.

<div class="standalone-container">
  <div id="bubble-container"></div>
</div>
<a class="standalone-link" href="/standalone/bubble/">Standalone</a>


<!-- script -->
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.2.0/highlight.min.js"></script>
<script type="text/javascript" src="{{site.cdn}}{{site.version}}/quill.js"></script>
<script>
  var snowQuill = new Quill('#snow-container', {
    placeholder: 'Compose an epic...',
    modules: {
      toolbar: [
        [{ header: [] }],
        ['bold', 'italic', 'underline', 'link'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean']
      ]
    },
    theme: 'snow'
  });
  var bubbleQuill = new Quill('#bubble-container', {
    placeholder: 'Compose an epic...',
    theme: 'bubble'
  });
</script>
<!-- script -->
