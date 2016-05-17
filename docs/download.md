---
layout: docs
title: Download
permalink: /docs/download/
---

Quill comes ready to use in several convenient forms.


### CDN

A globally distributed and available CDN is provided, backed by [Amazon Cloudfront](https://aws.amazon.com/cloudfront/).

```html
<!-- Main library -->
<script src="https://cdn.quilljs.com/{{site.version}}/quill.js"></script>
<script src="https://cdn.quilljs.com/{{site.version}}/quill.min.js"></script>

<!-- Themes -->
<link href="https://cdn.quilljs.com/{{site.version}}/quill.snow.css">
<link href="https://cdn.quilljs.com/{{site.version}}/quill.bubble.css">

<!-- Minimal styles -->
<link href="https://cdn.quilljs.com/{{site.version}}/quill.css">
```


### NPM

Add Quill as an [NPM](//www.npmjs.org/) dependency and add it your own build workflow, or use the included built options. Compile stylesheets are also included in `dist/` folder.

```bash
npm install quill
```


### Direct Download

Quill builds are also available for direct download on every [release](https://github.com/quilljs/quill/releases/tag/v{{site.version}}).


### Source

And of course the complete source code is always available on [Github](https://github.com/quilljs/quill).

```bash
git clone git@github.com:quilljs/quill.git
```
