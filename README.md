> [!NOTE]
> This branch and README covers the upcoming 2.0 release. View [1.x docs here](https://github.com/quilljs/quill/tree/1.3.6).

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
  <a href="https://github.com/quilljs/quill/actions" title="Build Status">
    <img src="https://github.com/quilljs/quill/actions/workflows/main.yml/badge.svg" alt="Build Status">
  </a>
  <a href="https://npmjs.com/package/quill" title="Version">
    <img src="https://img.shields.io/npm/v/quill.svg" alt="Version">
  </a>
  <a href="https://npmjs.com/package/quill" title="Downloads">
    <img src="https://img.shields.io/npm/dm/quill.svg" alt="Downloads">
  </a>
</p>

<hr/>

[Quill](https://quilljs.com/) is a modern rich text editor built for compatibility and extensibility. It was created by [Jason Chen](https://twitter.com/jhchen) and [Byron Milligan](https://twitter.com/byronmilligan) and actively maintained by [Slab](https://slab.com).

To get started, check out [https://quilljs.com/](https://quilljs.com/) for documentation, guides, and live demos!

## Quickstart

Instantiate a new Quill object with a css selector for the div that should become the editor.

```html
<!-- Include Quill stylesheet -->
<link
  href="https://cdn.jsdelivr.net/npm/quill@2.0.0-beta.0/dist/quill.snow.css"
  rel="stylesheet"
/>

<!-- Create the toolbar container -->
<div id="toolbar">
  <button class="ql-bold">Bold</button>
  <button class="ql-italic">Italic</button>
</div>

<!-- Create the editor container -->
<div id="editor">
  <p>Hello World!</p>
  <p>Some initial <strong>bold</strong> text</p>
  <p><br /></p>
</div>

<!-- Include the Quill library -->
<script src="https://cdn.jsdelivr.net/npm/quill@2.0.0-beta.0/dist/quill.js"></script>

<!-- Initialize Quill editor -->
<script>
  const quill = new Quill("#editor", {
    theme: "snow",
  });
</script>
```

Take a look at the [Quill](https://quilljs.com/) website for more documentation, guides and [live playground](https://quilljs.com/playground/)!

## Download

- [npm](https://www.npmjs.com/package/quill) - `npm install quill@beta`
- tar - https://github.com/quilljs/quill/releases

### CDN

```html
<!-- Main Quill library -->
<script src="https://cdn.jsdelivr.net/npm/quill@2.0.0-beta.0/dist/quill.js"></script>

<!-- Theme included stylesheets -->
<link
  href="https://cdn.jsdelivr.net/npm/quill@2.0.0-beta.0/dist/quill.snow.css"
  rel="stylesheet"
/>
<link
  href="https://cdn.jsdelivr.net/npm/quill@2.0.0-beta.0/dist/quill.bubble.css"
  rel="stylesheet"
/>

<!-- Core build with no theme, formatting, non-essential modules -->
<link
  href="https://cdn.jsdelivr.net/npm/quill@2.0.0-beta.0/dist/quill.core.css"
  rel="stylesheet"
/>
<script src="https://cdn.jsdelivr.net/npm/quill@2.0.0-beta.0/dist/quill.core.js"></script>
```

## Community

Get help or stay up to date.

- [Contribute](https://github.com/quilljs/quill/blob/develop/.github/CONTRIBUTING.md) on [Issues](https://github.com/quilljs/quill/issues)
- Ask questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/quill)

## License

BSD 3-clause
