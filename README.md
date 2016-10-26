# [Quill Rich Text Editor](http://quilljs.com/) [![Build Status](https://travis-ci.org/quilljs/quill.svg?branch=master)](http://travis-ci.org/quilljs/quill)

[![Test Status](https://cdn.quilljs.com/badge.svg?v=2)](https://saucelabs.com/u/quill)

Quill is a modern rich text editor built for compatibility and extensibility. It was created by [Jason Chen](https://twitter.com/jhchen) and [Byron Milligan](https://twitter.com/byronmilligan) and open sourced by [Salesforce.com](http://www.salesforce.com).

To get started, check out the [Quill website](http://quilljs.com/) for documentation, guides, and live demos!


## Useful Links

- [Demo](https://quilljs.com/)
- [Documentation](https://quilljs.com/docs/)
- [How-to Guides](https://quilljs.com/guides/)
- [Interactive Playground](https://quilljs.com/playground/)
- [Contributing](https://github.com/quilljs/quill/blob/master/.github/CONTRIBUTING.md)
- [Local Development](https://github.com/quilljs/quill/blob/master/.github/DEVELOPMENT.md)


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

Take a look at the [Quill website](https://quilljs.com/) for more documentation, guides and [live playground](https://quilljs.com/playground/)!


## Download

- [npm](https://www.npmjs.com/package/quill) - `npm install quill`
- tar - https://github.com/quilljs/quill/releases


### CDN

```html
<!-- Main Quill library -->
<script src="//cdn.quilljs.com/1.0.0/quill.js" type="text/javascript"></script>
<script src="//cdn.quilljs.com/1.0.0/quill.min.js" type="text/javascript"></script>

<!-- Theme included stylesheets -->
<link href="//cdn.quilljs.com/1.0.0/quill.snow.css" rel="stylesheet">
<link href="//cdn.quilljs.com/1.0.0/quill.bubble.css" rel="stylesheet">

<!-- Core build with no theme, formatting, non-essential modules -->
<link href="//cdn.quilljs.com/1.0.0/quill.core.css" rel="stylesheet">
<script src="//cdn.quilljs.com/1.0.0/quill.core.js" type="text/javascript"></script>
  ```


## Community

Get help or stay up to date.

- [Contribute](https://github.com/quilljs/quill/blob/develop/.github/CONTRIBUTING.md) on [Issues](https://github.com/quilljs/quill/issues)
- Follow [@jhchen](https://twitter.com/jhchen) and [@quilljs](https://twitter.com/quilljs) on Twitter
- Ask questions on [Stack Overflow](http://stackoverflow.com/questions/tagged/quill)
- If privacy is required, email support@quilljs.com


## License

BSD 3-clause
