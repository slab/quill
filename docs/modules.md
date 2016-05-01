---
layout: docs
title: Modules
permalink: /docs/modules/
stability: review
---

Modules allow Quill's behavior and functionality to customized. To enable a module, simply add it to the editor at initialization:

```javascript
var editor = new Quill('#editor', {
  modules: { toolbar: options }
});
```

A few common and officially supported modules are listed here:

- [Toolbar](/docs/modules/toolbar/)
