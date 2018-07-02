---
layout: v1.0-docs
title: Formats
permalink: /1.0/docs/formats/
---

Quill supports a number of formats, both in UI controls and API calls.

By default all formats are enabled and allowed to exist within a Quill editor and can be configured with the [formats](/1.0/docs/configuration/#formats) option. This is separate from adding a control in the [Toolbar](/1.0/docs/modules/toolbar/). For example, you can configure Quill to allow bolded content to be pasted into an editor that has no bold button in the toolbar.

<!-- head -->
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css">
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css">
<link rel="stylesheet" href="//cdn.quilljs.com/1.3.6/quill.snow.css">
<style>
  body > #standalone-container {
    margin: 50px auto;
    max-width: 720px;
  }
  #editor-container {
    height: 350px;
  }
</style>
<!-- head -->
<div id="standalone-container">
  <div id="toolbar-container">
    <span class="ql-formats">
      <select class="ql-font"></select>
      <select class="ql-size"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-color"></select>
      <select class="ql-background"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-header" value="1"></button>
      <button class="ql-header" value="2"></button>
      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-direction" value="rtl"></button>
      <select class="ql-align"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <button class="ql-video"></button>
      <button class="ql-formula"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-clean"></button>
    </span>
  </div>
  <div id="editor-container"></div>
</div>
<!-- script -->
<script src="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
<script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>
<script>
  var quill = new Quill('#editor-container', {
    modules: {
      syntax: true,
      toolbar: '#toolbar-container'
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  });
</script>
<!-- script -->

<a class="standalone-link" href="/standalone/full/">Standalone</a>

#### Inline

  - Background Color - `background`
  - Bold - `bold`
  - Color - `color`
  - Font - `font`
  - Inline Code - `code`
  - Italic - `italic`
  - Link - `link`
  - Size - `size`
  - Strikethrough - `strike`
  - Superscript/Subscript - `script`
  - Underline - `underline`

#### Block

  - Blockquote - `blockquote`
  - Header - `header`
  - Indent - `indent`
  - List - `list`
  - Text Alignment - `align`
  - Text Direction - `direction`
  - Code Block - `code-block`

#### Embeds

  - Formula - `formula` (requires [KaTex]((https://khan.github.io/KaTeX/)))
  - Image - `image`
  - Video - `video`
