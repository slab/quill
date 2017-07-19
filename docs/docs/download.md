---
layout: docs
title: Download
permalink: /docs/download/
---

Quill comes ready to use in several convenient forms.


### CDN

A globally distributed and available CDN is provided, backed by [Amazon Cloudfront](https://aws.amazon.com/cloudfront/).

```html
<!-- Main Quill library -->
<script src="//cdn.quilljs.com/{{site.version}}/quill.js"></script>
<script src="//cdn.quilljs.com/{{site.version}}/quill.min.js"></script>

<!-- Theme included stylesheets -->
<link href="//cdn.quilljs.com/{{site.version}}/quill.snow.css" rel="stylesheet">
<link href="//cdn.quilljs.com/{{site.version}}/quill.bubble.css" rel="stylesheet">

<!-- Core build with no theme, formatting, non-essential modules -->
<link href="//cdn.quilljs.com/{{site.version}}/quill.core.css" rel="stylesheet">
<script src="//cdn.quilljs.com/{{site.version}}/quill.core.js"></script>
```


### NPM

Add Quill as an [NPM](//www.npmjs.org/) dependency and add it your own build workflow, or use the included built options. Compiled stylesheets are also included in `dist/` folder.

```bash
npm install quill@{{site.version}}
```


### Direct Download

Quill builds are also available for direct download on every [release](https://github.com/quilljs/quill/releases/tag/v{{site.version}}).


### Source

And of course the complete source code is always available on [Github](https://github.com/quilljs/quill).

```bash
git clone git@github.com:quilljs/quill.git
```
