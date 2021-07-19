---
layout: v1.0-docs
title: Themes
permalink: /1.0/docs/themes/
---
<!-- head -->
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css">
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css">
<link rel="stylesheet" href="//cdn.quilljs.com/1.3.6/quill.snow.css">
<link rel="stylesheet" href="//cdn.quilljs.com/1.3.6/quill.bubble.css">
<style>
  #bubble-container .ql-editor {
    border: 1px solid #ccc;
  }
  .standalone-container .ql-editor {
    height: 350px;
  }
</style>
<!-- head -->

Themes allow you to easily make your editor look good with minimal effort. Quill features two offically supported themes: [Snow](#snow) and [Bubble](#bubble).

### Usage

```html
<!-- Add the theme's stylesheet -->
<link rel="stylesheet" href="//cdn.quilljs.com/1.3.6/quill.bubble.css">

<script src="//cdn.quilljs.com/1.3.6/quill.js"></script>
<script>
var quill = new Quill('#editor', {
  theme: 'bubble'   // Specify theme in configuration
});
</script>
```

## Bubble

Bubble is a simple tooltip based theme.

<div class="standalone-container">
  <div id="bubble-container"></div>
</div>
<a class="standalone-link" href="/standalone/bubble/">Standalone</a>

## Snow

Snow is a clean, flat toolbar theme.

<div class="standalone-container">
  <div id="snow-container"></div>
</div>
<a class="standalone-link" href="/standalone/snow/">Standalone</a>


### Customization

Themes primarily control the visual look of Quill through its CSS stylesheet, and many changes can easily be made by overriding these rules. This is easiest to do, as with any other web application, by simply using your browser developer console to inspect the elements to view the rules affecting them.

Many other customizations can be done through the respective modules. For example, the toolbar is perhaps the most visible user interface, but much of the customization is done through the [Toolbar module](/1.0/docs/modules/toolbar/).


<!-- script -->
<script src="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
<script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>
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
