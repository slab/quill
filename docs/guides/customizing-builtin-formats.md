---
layout: docs
title: Customizing Built-in Formats
permalink: /guides/customizing-built-in-formats/
---

Default behavior can be changed or overriden by customizing Quill's [built-in formats](https://github.com/quilljs/quill/tree/develop/formats). All formats, built-in or custom, are implemented in [Parchment](https://github.com/quilljs/parchment/).

### Examples

#### Changing the [link sanitizer](https://github.com/quilljs/quill/blob/develop/formats/link.js)

```js
var Link = Quill.import('formats/link');
Link.sanitize = function(url) {
  // change / sanitize url
  return url;
};
```
