# WARNING

Please do not publicize this repository in any way. There are a few known documentation gaps and browser quirks we wish to address before publication. Thank you for your patience.


# [Scribe Rich Text Editor](http://stypi.github.io/scribe) [![Build Status](https://secure.travis-ci.org/stypi/scribe.png?branch=master)](http://travis-ci.org/stypi/scribe) [![Dependency Status](https://gemnasium.com/stypi/scribe.png)](https://gemnasium.com/stypi/scribe)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/scribe-master.svg)](https://saucelabs.com/u/scribe)

Scribe is a modern rich text editor built for compatibility and extensibility. It was created by [Jason Chen](https://twitter.com/jhchen) and Byron Milligan and open sourced by [Salesforce.com](http://www.salesforce.com).

To get started, check out the [Scribe Github Page](http://stypi.github.io/scribe) or jump straight into the [demo](http://stypi.github.io/scribe/examples/advanced/).

## Quickstart

Instantiate a new Scribe object with a css selector for the div that should become the editor.

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

<!-- Include the Scribe library -->
<script src="http://stypi.github.io/scribe/js/scribe.js"></script>

<!-- Initialize Scribe editor -->
<script>
  var editor = new Scribe('#editor');
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
    grunt test:exhaust - run exhaustive test suite (used to create unit tests) on PhantomJS

You can use mocha's grep feature to run specific tests ex.

    grunt test:local --grep=cursor

## Community

Get help by asking questions on [Stack Overflow](http://stackoverflow.com/) (tag with scribejs). The maintainers of Scribe will actively monitor questions.

## Contributing

### Bug Reports

Search through [Github Issues](https://github.com/stypi/scribe/issues) to see if the bug has already been reported. If so, please comment with any additional information about the bug.

For new issues, create a new issue and tag with the appropriate browser tag. Include as much detail as possible such as:

- Detailed description of faulty behavior
- Affected platforms
- Steps for reproduction
- Failing test case

The more details you provide, the more likely someone will be able to find and fix the bug.

### Feature Requests

We welcome feature requests. Please make sure they are within scope of Scribe's goals and submit them in [Github Issues](https://github.com/stypi/scribe/issues) tagged with the 'feature' tag. The more complete and compelling the request, the more likely it will be implemented. Garnering community support will help as well!

### Pull Requests

1. Please check to make sure your plans fall within Scribe's scope (likely through Github Issues).
2. Fork Scribe
3. Branch off of the 'develop' branch.
4. Implement your changes.
5. Submit a Pull Request.

**Important:** By issuing a Pull Request you agree to allow the project owners to license your work under the terms of the [License](https://github.com/stypi/scribe/blob/master/LICENSE).

## License

BSD
