---
layout: docs
title: Themes
permalink: /docs/themes/
---

TODO: Review

Themes allow you to easily make your Quill editor look good with minimal effort.

To use a custom theme, simply add its stylesheet in the `<head>`:

```html
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.snow.css" />
```

and specify its usage at initialization:

```javascript
var quill = new Quill('#editor', {
  theme: 'snow'
});
```

There is currently only one predefined theme `snow` for Quill.

In the future we will provide more options and even allow you to create your own. We will provide documentation and guidance here once they are finalized.
