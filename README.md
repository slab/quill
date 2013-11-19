WARNING
===

Please do not publicize this repository in any way. There are a few known documentation gaps and browser quirks we wish to address before publication. Thank you for your patience.


Scribe Rich Text Editor
===

Cross platform rich text editor built with coauthoring in mind. 

[![Build Status](https://secure.travis-ci.org/stypi/scribe.png?branch=master)](http://travis-ci.org/stypi/scribe)


How to Use
---

```javascript
var editor = new Scribe.Editor('editor')      // 'editor' is id of dom container
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
- editor.getDelta() - returns delta that describes contents of editor
- editor.setDelta(delta) - sets editor to delta, assuming delta contains only insert operations

### Events

Events names are accessible through Scribe.Editor.events

- editor.on('api-text-change', function(delta))
- editor.on('user-text-change', function(delta))
- editor.on('selection-change', function(range)) - range is the new range of the selection


Toolbar API
---

You can create a toolbar to assist in formatting the editor.

```javascript
var toolbar = new Scribe.Toolbar('toolbar', editor)   // 'toolbar' is the id of dom container
```

Any DOM node with the following classes that is clicked will trigger the corresponding format change:

- bold
- italic
- strike
- underline
- link

Toolbar will listen to selection changes and will add/remove the 'active' class to the corresponding DOM node.

Any DOM node with the following classes that is changed (change DOM event, ex. <select>) will trigger the corresponding format change:

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

### Version numbers

Until we write a script, version numbers will have to be updated in the following files:

- Gruntfile.coffee
- index.coffee
- package.json


Testing
---

### Unit tests

Visit build/tests/unit.html to run unit tests or run:
    
    make test
    
### Browser Testing

You can run the unit tests on all browsers on your machine by running:

    make test-all

You can also test on different operating systems or browsers on Browserstack:

    export BROWSER_STACK_USERNAME=yourusername
    export BROWSER_STACK_ACCESS_KEY=yourapikey
    make test-remote

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

