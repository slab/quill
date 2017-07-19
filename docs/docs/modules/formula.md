---
layout: docs
title: Formula Module
permalink: /docs/modules/formula/
---

The Formula Module adds beautifully rendered formulas into Quill documents, powered by [KaTeX](https://khan.github.io/KaTeX/).


### Example

```html
<!-- Include KaTeX stylesheet -->
<link href="katex.css" rel="stylesheet">

<!-- Include KaTeX library -->
<script src="katex.js"></script>

<script>
var quill = new Quill('#editor', {
  modules: {
    formula: true,          // Include formula module
    toolbar: [['formula']]  // Include button in toolbar
  },
  theme: 'snow'
});
</script>
```
