# WARNING

Please do not publicize this repository in any way. There are a few known documentation gaps and browser quirks we wish to address before publication. Thank you for your patience.


# [Quill Rich Text Editor](http://quilljs.com/) [![Build Status](https://travis-ci.org/quilljs/quill.svg?branch=master)](http://travis-ci.org/quilljs/quill) [![Dependency Status](https://gemnasium.com/quilljs/quill.png)](https://gemnasium.com/quilljs/quill)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/quill-master.svg)](https://saucelabs.com/u/quill)

Quill is a modern rich text editor built for compatibility and extensibility. It was created by [Jason Chen](https://twitter.com/jhchen) and [Byron Milligan](https://twitter.com/byronmilligan) and open sourced by [Salesforce.com](http://www.salesforce.com).

To get started, check out the [Quill Github Page](http://quilljs.com/) or jump straight into the [demo](http://quilljs.com/examples/).

## Quickstart

Instantiate a new Quill object with a css selector for the div that should become the editor.

```html
<!-- Create the toolbar container -->
<div id="toolbar">
  <button class="sc-bold">Bold</button>
  <button class="sc-italic">Italic</button>
</div>

<!-- Create the editor container -->
<div id="editor">
  <div>Hello World!</div>
</div>

<!-- Include the Quill library -->
<script src="http://quilljs.com/js/quill.js"></script>

<!-- Initialize Quill editor -->
<script>
  var editor = new Quill('#editor');
  editor.addModule('toolbar', { container: '#toolbar' });
</script>
```

## Local Development

### Installation

    npm install -g grunt-cli
    npm install
    bundle install

### Building

    grunt

### Testing

    grunt test - run tests with phantomjs
    grunt test:karma - allows you to visit localhost:9876/debug.html for interactive testing
    grunt test:local - run tests with locally installed browsers
    grunt test:remote - run tests on supported platforms on Sauce Labs

## Community

Get help or stay up to date.

- Follow [@quilljs](https://twitter.com/quilljs) on Twitter
- Ask questions on [Stack Overflow](http://stackoverflow.com/) (tag with quill)
- Visit the [discussion group](http://discuss.quilljs.com)

## Contributing

### Bug Reports

Search through [Github Issues](https://github.com/quilljs/quill/issues) to see if the bug has already been reported. If so, please comment with any additional information about the bug.

For new issues, create a new issue and tag with the appropriate browser tag. Include as much detail as possible such as:

- Detailed description of faulty behavior
- Affected platforms
- Steps for reproduction
- Failing test case

The more details you provide, the more likely we or someone else will be able to find and fix the bug.

### Feature Requests

We welcome feature requests. Please make sure they are within scope of Quill's goals and submit them in [Github Issues](https://github.com/quilljs/quill/issues) tagged with the 'feature' tag. The more complete and compelling the request, the more likely it will be implemented. Garnering community support will help as well!

### Pull Requests

1. Please check to make sure your plans fall within Quill's scope (likely through Github Issues).
2. Fork Quill
3. Branch off of the 'develop' branch.
4. Implement your changes.
5. Submit a Pull Request.

**Important:** By issuing a Pull Request you agree to allow the project owners to license your work under the terms of the [License](https://github.com/quilljs/quill/blob/master/LICENSE).

## License

BSD 3-clause
