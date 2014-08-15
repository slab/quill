# [Quill Rich Text Editor](http://quilljs.com/) [![Build Status](https://travis-ci.org/quilljs/quill.svg?branch=master)](http://travis-ci.org/quilljs/quill) [![Dependency Status](https://gemnasium.com/quilljs/quill.png)](https://gemnasium.com/quilljs/quill)

[![Webdriver Test Status](https://saucelabs.com/browser-matrix/quill-master.svg)](https://saucelabs.com/u/quill)

Quill is a modern rich text editor built for compatibility and extensibility. It was created by [Jason Chen](https://twitter.com/jhchen) and [Byron Milligan](https://twitter.com/byronmilligan) and open sourced by [Salesforce.com](http://www.salesforce.com).

To get started, check out the [Quill Github Page](http://quilljs.com/) or jump straight into the [demo](http://quilljs.com/examples/).

## Quickstart

Instantiate a new Quill object with a css selector for the div that should become the editor.

```html
<!-- Create the toolbar container -->
<div id="toolbar">
  <button class="ql-bold">Bold</button>
  <button class="ql-italic">Italic</button>
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

Quill's source is in [Coffeescript](http://coffeescript.org/) and utilizes [Browserify](http://browserify.org/) to organize its files.

### Installation

    npm install -g grunt-cli
    npm install

### Building

    grunt dist - compile and browserify
    grunt server - starts a local server that will build and serve assets on the fly

### Testing

All tests assume the local server is running.

    grunt test - run tests with phantomjs
    grunt test:unit - runs javascript test suite with phantomjs
    grunt test:e2e - runs end to end tests with Webdriver + Chrome
    grunt test:coverage - run coverage tests using phantomjs
    grunt test:karma - runs karma on port 9876

Check out Gruntfile.coffee and config/grunt for more testing options.

## Community

Get help or stay up to date.

- Follow [@quilljs](https://twitter.com/quilljs) on Twitter
- Ask questions on [Stack Overflow](http://stackoverflow.com/) (tag with quill)
- Visit the [discussion group](http://discuss.quilljs.com)
- If a private channel is required, you may also email support@quilljs.com

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

Pull requests will not be accepted without adhering to the following:

1. Conform to existing coding styles.
2. New functionality are accompanied by tests.
3. Serve a single atomic purpose (add one feature or fix one bug)
4. Introduce only changes that further the PR's singular purpose (ex. do not tweak an unrelated config along with adding your feature).

**Important:** By issuing a Pull Request you agree to allow the project owners to license your work under the terms of the [License](https://github.com/quilljs/quill/blob/master/LICENSE).

## License

BSD 3-clause
