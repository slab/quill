---
layout: docs
title: Quickstart
permalink: /docs/quickstart/
redirect_from: /docs/
---

The best way to get started is try a simple example. Quill is initialized with a DOM element to contain the editor. The contents of that element will become the initial contents of Quill.

```html
<!-- Include stylesheet -->
<link href="https://cdn.quilljs.com/{{site.version}}/quill.snow.css" rel="stylesheet">

<!-- Create the editor container -->
<div id="editor">
  <p>Hello World!</p>
  <p>Some initial <strong>bold</strong> text</p>
  <p><br></p>
</div>

<!-- Include the Quill library -->
<script src="https://cdn.quilljs.com/{{site.version}}/quill.js"></script>

<!-- Initialize Quill editor -->
<script type="text/javascript">
  var quill = new Quill('#editor', {
    theme: 'snow'
  });
</script>
```

And that's all there is to it!


### Next Steps ###

The real magic of Quill comes in its flexibility and extensibility. You can get an idea of what's possible by playing around with all the demos throughout this site. For an indepth walkthrough, take a look at the [Customizing and Extending](/guides/customizing-and-extending/) guide.
