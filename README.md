WARNING
===

Please do not publicize this repository in any way. There are a few known documentation gaps and browser quirks we wish to address before publication. Thank you for your patience.


Scribe Rich Text Editor
===

Cross platform rich text editor built with coauthoring in mind. 

[![Build Status](https://secure.travis-ci.org/stypi/scribe.png?branch=master)](http://travis-ci.org/stypi/scribe)

How to Use
---

Just instantiate a new Scribe object with a css selector for the div that should become the editor.

```javascript
var editor = new Scribe('#editor');
```


Editor API
---

### Text Operations

- editor.getAt(index, length) - get length text starting from index, default to entire document
- editor.insertAt(index, text, formatting) - insert text at index
- editor.deleteAt(index, length) - delete length characters starting from index
- editor.formatAt(index, length, name, value) - apply formatting to length characters starting at index

### Delta operations

Deltas are objects used by Scribe to describe changes. See .. for more details.

See [Tandem](https://github.com/stypi/tandem) for details on deltas.

- editor.update(delta) - applies delta to editor
- editor.getContents() - returns delta that describes contents of editor
- editor.setContents(delta) - sets editor to delta, assuming delta contains only insert operations

### Events

Events names are accessible through Scribe.Editor.events

- editor.on('text-update', function(delta, source)) - source will either be 'api' or 'user'
- editor.on('selection-update', function(range)) - range is the new range of the selection


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

    `grunt test` - run tests with phantomjs
    `grunt test:karma` - allows you to visit localhost:9876/debug.html for interactive testing
    `grunt test:local` - run tests with locally installed browsers
    `grunt test:remote` - run tests on supported platforms on Sauce Labs
    `grunt test:exhaust` - run exhaustive test suite (used to create unit tests) on PhantomJS

You can use mocha's grep feature to run specific tests ex.

    grunt test:local --grep=cursor
