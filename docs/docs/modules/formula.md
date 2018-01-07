---
layout: docs
title: Formula Module
permalink: /docs/modules/formula/
redirect_from:
  - /docs/modules/formulas/
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
