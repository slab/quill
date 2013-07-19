Scribe Rich Text Editor
===

Cross platform rich text editor built with coauthoring in mind.


How to Use
---

```javascript
var editor = new Scribe.Editor('editor')      // 'editor' is id of dom container
```


Editor API
---

### Modifying Text

- editor.insertAt(index, text) - insert text (unformatted) at index
- editor.deleteAt(index, length) - delete length characters starting from index
- editor.formatAt(index, length, name, value) - apply formatting to length characters starting at index

### Delta operations

See [Tandem](https://github.com/stypi/tandem) for details on deltas.

- editor.applyDelta(delta) - applies delta to editor
- editor.getDelta() - returns delta that describes contents of editor
- editor.setDelta(delta) - sets editor to delta, assuming delta contains only insert operations

### Events

Events names are accessible through Scribe.Editor.events

- editor.on('text-change', function(delta))
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

    npm install -g grunt-cli phantomjs mocha-phantomjs
    npm install
    bundle install

### Building

We use grunt to compile coffeescript, sass, and haml

    grunt

### Version numbers

Until we write a script, version numbers will have to be updated in the following files:

- lib/scribe-rails/version.rb
- Gruntfile.coffee
- package.json


Testing
---

To run some of the tests you will need [phantomjs](http://phantomjs.org/).

### Unit tests

Visit build/tests/unit.html to run unit tests or run:
    
    make unit
    
For webdriver unit tests, run:
    
    make webdriver-unit-chrome
    make webdriver-unit-firefox
    

### Browser Testing

You can run the unit tests on all browsers on your machine by running:

    make testem

You can also test on different operating systems or browsers not installed on your computer. To set this up run:

    ./node_modules/.bin/browserstack setup
    Username: StypiAPIUser
    Password: tandemtype
    Tunnel private key:
    Tunnel API key: m2LGGyTRgKd453bAQhcb

To be clear the tunnel private key should be left blank. Then to run on the remote browsers run:

    make testem-remote

### Code Coverage

Install [node-jscoverage](https://github.com/visionmedia/node-jscoverage) and run

    make coverage

### Fuzzer

    make webdriver-fuzzer-[browser]
    make webdriver-fuzzer-[browser]-replay _replay_file_

Possible values for ```_browser_``` are ```chrome```, ```internet_explorer```, or ```firefox```.
```_replay_file_``` must be the absolute path to the file the fuzzer creates after a failed run.
This file contains the final edit that caused the fuzzer to fail, so that you can replay the edit until you fix the bug.

In order to run the fuzzer against Chrome or IE, you'll need to download 
[ChromeDriver](https://code.google.com/p/chromedriver/downloads/list) or
[InternetExplorerDriver](https://code.google.com/p/selenium/downloads/list) and add it to your system's path.
For Chrome, be sure to download ChromeDriver, not ChromeDriver2, which is still experimental. 
Support for Firefox is built in and requires no special downloads.

The fuzzer currently works against IE 9 & 10, Firefox 19 - 21, and Chrome 26.



Dependencies
---

tandem-core.js

underscore.js
