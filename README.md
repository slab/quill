**Note: This branch and README is intended for the upcoming 1.0 release which has made many changes to the development toolchain. Some instructions here may be out of date or become out of date as development on 1.0 progresses.**

# [Quill Rich Text Editor](http://quilljs.com/) [![Build Status](https://travis-ci.org/quilljs/quill.svg?branch=master)](http://travis-ci.org/quilljs/quill)

[![Test Status](https://saucelabs.com/browser-matrix/quill-master.svg)](https://saucelabs.com/u/quill)

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
<script src="http://cdn.quilljs.com/latest/quill.js"></script>

<!-- Initialize Quill editor -->
<script>
  var editor = new Quill('#editor');
  editor.addModule('toolbar', { container: '#toolbar' });
</script>
```


## Downloading Quill

There are a number of ways to download the latest or versioned copy of Quill.

- npm: `npm install quill`
- bower: `bower install quill`
- tar: https://github.com/quilljs/quill/releases

### CDN

```html
<link rel="stylesheet" href="//cdn.quilljs.com/0.19.10/quill.snow.css" />
<script src="//cdn.quilljs.com/0.19.10/quill.min.js"></script>
```


## Local Development

Quill's source is in [ES6](http://www.ecma-international.org/ecma-262/6.0/index.html) and utilizes [Webpack](https://webpack.github.io/) to organize its files.

### Installation

    npm install -g gulp
    npm install

### Building

    gulp build - compiles quill and examples into .build/
    gulp server - starts a local server that will build and serve assets on the fly
    gulp dev - same as `gulp server` and also starts the test server proxied through /karma

### Examples

With the local server (`gulp server`) running you can try out some minimal examples on:

- [localhost:9000/examples/index.html](http://localhost:9000/examples/index.html)
- [localhost:9000/examples/advanced.html](http://localhost:9000/examples/advanced.html)

Quill [releases](https://github.com/quilljs/quill/releases) also contain these examples as built static files you can try without needing to run the local development server.

With the dev server (`gulp dev`) you can also run the unit tests with your browser:

- [localhost:9000/karma/debug.html](localhost:9000/karma/debug.html)

### Testing

    gulp test:unit - runs javascript test suite with Chrome
    gulp test:e2e - runs end to end tests with Webdriver + Chrome
    gulp test:coverage - run tests measuring coverage with Chrome

Tests are run by [Karma](http://karma-runner.github.io/) and [Protractor](https://github.com/angular/protractor) using [Jasmine](http://jasmine.github.io/). Check out `gulpfile.js` and `config/test.js` for more testing options.


## Contributing

### Community

Get help or stay up to date.

- Follow [@quilljs](https://twitter.com/quilljs) on Twitter
- Ask questions on [Stack Overflow](http://stackoverflow.com/questions/tagged/quill) (tag with quill)
- If a private channel is required, you may also email support@quilljs.com

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

1. Conform to existing [coding styles](docs/style-guide.md).
2. New functionality are accompanied by tests.
3. Serve a single atomic purpose (add one feature or fix one bug)
4. Introduce only changes that further the PR's singular purpose (ex. do not tweak an unrelated config along with adding your feature).

**Important:** By issuing a Pull Request you agree to allow the project owners to license your work under the terms of the [License](https://github.com/quilljs/quill/blob/master/LICENSE).

## License

BSD 3-clause
