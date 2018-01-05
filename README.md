<h1 align="center">
  <a href="https://quilljs.com/" title="Quill">Quill Rich Text Editor</a>
</h1>
<p align="center">
  <a href="https://quilljs.com/" title="Quill"><img alt="Quill Logo" src="https://quilljs.com/assets/images/logo.svg" width="180"></a>
</p>
<p align="center">
  <a title="Quickstart" href="#quickstart"><strong>Quickstart</strong></a>
  &#x2022;
  <a title="Documentation" href="https://quilljs.com/docs/"><strong>Documentation</strong></a>
  &#x2022;
  <a title="Development" href="https://github.com/quilljs/quill/blob/master/.github/DEVELOPMENT.md"><strong>Development</strong></a>
  &#x2022;
  <a title="Contributing" href="https://github.com/quilljs/quill/blob/master/.github/CONTRIBUTING.md"><strong>Contributing</strong></a>
  &#x2022;
  <a title="Interactive Playground" href="https://quilljs.com/playground/"><strong>Interactive Playground</strong></a>
</p>
<p align="center">
  <a href="https://travis-ci.org/quilljs/quill" title="Build Status">
    <img src="https://travis-ci.org/quilljs/quill.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://npmjs.com/package/quill" title="Version">
    <img src="https://img.shields.io/npm/v/quill.svg" alt="Version">
  </a>
  <a href="https://npmjs.com/package/quill" title="Downloads">
    <img src="https://img.shields.io/npm/dm/quill.svg" alt="Downloads">
  </a>
</p>
<p align="center">
  <a href="https://saucelabs.com/u/quill" title="Test Status">
    <img src="https://cdn.quilljs.com/badge.svg?v=2" alt="Test Status">
  </a>
</p>

[QuillJS](https://quilljs.com/) is a modern rich text editor built for compatibility and extensibility. It was created by [Jason Chen](https://twitter.com/jhchen) and [Byron Milligan](https://twitter.com/byronmilligan) and open sourced by Salesforce.

To get started, check out the [Quill](https://quilljs.com/) website for documentation, guides, and live demos!


## Quickstart

Instantiate a new Quill object with a css selector for the div that should become the editor.

```html
<!-- Include Quill stylesheet -->
<link href="https://cdn.quilljs.com/1.0.0/quill.snow.css" rel="stylesheet">

<!-- Create the toolbar container -->
<div id="toolbar">
  <button class="ql-bold">Bold</button>
  <button class="ql-italic">Italic</button>
</div>

<!-- Create the editor container -->
<div id="editor">
  <p>Hello World!</p>
</div>

<!-- Include the Quill library -->
<script src="https://cdn.quilljs.com/1.0.0/quill.js"></script>

<!-- Initialize Quill editor -->
<script>
  var editor = new Quill('#editor', {
    modules: { toolbar: '#toolbar' },
    theme: 'snow'
  });
</script>
```

Take a look at the [Quill](https://quilljs.com/) website for more documentation, guides and [live playground](https://quilljs.com/playground/)!


## Download

- [npm](https://www.npmjs.com/package/quill) - `npm install quill`
- tar - https://github.com/quilljs/quill/releases


### CDN

```html
<!-- Main Quill library -->
<script src="//cdn.quilljs.com/1.0.0/quill.js"></script>
<script src="//cdn.quilljs.com/1.0.0/quill.min.js"></script>

<!-- Theme included stylesheets -->
<link href="//cdn.quilljs.com/1.0.0/quill.snow.css" rel="stylesheet">
<link href="//cdn.quilljs.com/1.0.0/quill.bubble.css" rel="stylesheet">

<!-- Core build with no theme, formatting, non-essential modules -->
<link href="//cdn.quilljs.com/1.0.0/quill.core.css" rel="stylesheet">
<script src="//cdn.quilljs.com/1.0.0/quill.core.js"></script>
  ```


## Community

Get help or stay up to date.

- [Contribute](https://github.com/quilljs/quill/blob/develop/.github/CONTRIBUTING.md) on [Issues](https://github.com/quilljs/quill/issues)
- Follow [@jhchen](https://twitter.com/jhchen) and [@quilljs](https://twitter.com/quilljs) on Twitter
- Ask questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/quill)
- If privacy is required, email support@quilljs.com


## License

BSD 3-clause
