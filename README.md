WARNING
===

Please do not publicize this repository in any way. There are a few known documentation gaps and browser quirks we wish to address before publication. Thank you for your patience.


Scribe Rich Text Editor
===

Cross platform rich text editor built with coauthoring in mind. 

[![Build Status](https://secure.travis-ci.org/stypi/scribe.png?branch=master)](http://travis-ci.org/stypi/scribe)
[![Dependency Status](https://david-dm.org/stypi/scribe.png?theme=shields.io)](https://david-dm.org/stypi/scribe)


How to Use
---

Just instantiate a Scribe.Editor with a css selector for the div that should become the editor.


```javascript
var editor = new Scribe.Editor('#editor');
```


Editor API
---

### Text Operations

- editor.getAt(index, length) - get length text starting from index, default to entire document
- editor.insertAt(index, text, formatting) - insert text at index
- editor.deleteAt(index, length) - delete length characters starting from index
- editor.formatAt(index, length, name, value) - apply formatting to length characters starting at index

### Delta operations

See [Tandem](https://github.com/stypi/tandem) for details on deltas.

- editor.applyDelta(delta) - applies delta to editor
- editor.getContents() - returns delta that describes contents of editor
- editor.setContents(delta) - sets editor to delta, assuming delta contains only insert operations

### Events

Events names are accessible through Scribe.Editor.events

- editor.on('api-text-change', function(delta))
- editor.on('user-text-change', function(delta))
- editor.on('selection-change', function(range)) - range is the new range of the selection


Toolbar API
---

You can create a toolbar to assist in formatting the editor. Just set the container a css selector for where the toolbar is.

```javascript
editor.addModule('toolbar', { container: '#toolbar' });   // #toolbar is css selector
```

Any DOM node with the following classes that is clicked will trigger the corresponding format change:

- bold
- italic
- strike
- underline
- link

Toolbar will listen to selection changes and will add/remove the 'active' class to the corresponding DOM node.

Any DOM node with the following classes that is changed ("change" DOM event, ex. <select>) will trigger the corresponding format change:

- background - background color
- color - text color
- family - font family
- size - font size

Toolbar will listen to selection changes and will set the corresponding DOM node value to the selected text value.


Local Development
---

### Installation

Install dependencies

    npm install -g grunt-cli
    npm install
    bundle install

### Building

We use grunt to compile coffeescript, stylus, and jade

    grunt


Testing
---

### Javascript Testing

    `make test` - run all tests with phantomjs
    `make test-karma` - allows you to visit localhost:9876/debug.html for interactive testing
    `make test-all` - run all unit tests with all locally installed browsers
    `make test-remote` - run all tests on different platforms on Browserstack

To run tests on Browserstack you will need to set your credentials:

    export BROWSER_STACK_USERNAME=yourusername
    export BROWSER_STACK_ACCESS_KEY=yourapikey

### Webdriver Testing

For webdriver unit tests, run:
    
    make webdriver-unit-chrome
    make webdriver-unit-firefox
    
For the fuzzer, run:

    make webdriver-fuzzer-[browser]
    make webdriver-fuzzer-[browser]-replay _replay_file_

Possible values for ```_browser_``` are ```chrome```, ```internet_explorer```, or ```firefox```.
```_replay_file_``` must be the absolute path to the file the fuzzer creates after a failed run.
This file contains the final edit that caused the fuzzer to fail, so that you can replay the edit until you fix the bug.

In order to run any Webdriver tests against Chrome or IE, you'll need to download 
[ChromeDriver](https://code.google.com/p/chromedriver/downloads/list) or
[InternetExplorerDriver](https://code.google.com/p/selenium/downloads/list) and add it to your system's path. 
Support for Firefox is built in and requires no special downloads.

The fuzzer currently works against IE 9 & 10, Firefox 19 - 21, and Chrome 26.

