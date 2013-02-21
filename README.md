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

Install guard and grunt

    bundle install
    npm install -g grunt
    npm install


### Building

guard will compile haml and sass on file save. grunt needs to be run manually every time coffeescript changes

    bundle exec guard
    grunt


Testing
---

To run some of the tests you will need [phantomjs](http://phantomjs.org/).

### Unit tests

Visit bin/tests/unit.html to run unit tests or run:
    
    make unit

### Code Coverage

Install [node-jscoverage](https://github.com/visionmedia/node-jscoverage) and run

    make coverage

### Fuzzer

Visit bin/tests/fuzzer.html to run the fuzzer. A seed is outputed on the console. Supply this in the fuzzer source to rerun with same seed.


Dependencies
---

tandem-core.js

underscore.js
