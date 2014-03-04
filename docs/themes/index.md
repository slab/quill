---
layout: docs
title: Themes - Scribe
permalink: /docs/themes/
---

# Themes

Themes allow you to easily make your Scribe editor look good with minimal effort. 

To use a custom theme, simply add its stylesheet in the `<head>`:

```html
<link rel="stylesheet" href="http://stypi.github.io/scribe/css/scribe.snow.css" />
```

and specify its usage at initialization:

```javascript
var editor = new Scribe('#editor', {
  theme: 'snow'
});
```

There is currently only one predefined theme `snow` for Scribe.

In the future we will provide more options and even allow you to create your own. We will provide documentation and guidance here once they are finalized.
