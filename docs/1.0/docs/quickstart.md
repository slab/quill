---
layout: v1.0-docs
title: Quickstart
permalink: /1.0/docs/quickstart/
redirect_from:
  - /1.0/docs/
---

The best way to get started is try a simple example. Quill is initialized with a DOM element to contain the editor. The contents of that element will become the initial contents of Quill.

```html
<!-- Include stylesheet -->
<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">

<!-- Create the editor container -->
<div id="editor">
  <p>Hello World!</p>
  <p>Some initial <strong>bold</strong> text</p>
  <p><br></p>
</div>

<!-- Include the Quill library -->
<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>

<!-- Initialize Quill editor -->
<script>
  var quill = new Quill('#editor', {
    theme: 'snow'
  });
</script>
```

And that's all there is to it!


### Next Steps ###

The real magic of Quill comes in its flexibility and extensibility. You can get an idea of what is possible by playing around with the demos throughout this site or head straight to the [Interactive Playground](/playground/). For an in-depth walkthrough, take a look at [How to Customize Quill](/guides/how-to-customize-quill/).
