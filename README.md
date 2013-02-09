Scribe Rich Text Editor
===

Cross platform rich text editor built with coauthoring in mind.


Local Development
---

### Installation

Install guard and grunt

    bundle install
    npm install -g grunt
    npm install


### Building

guard will compile haml and sass on file save. grunt needs to be run manually every time coffeescript changes

    bundle exec guard -G guardfile
    grunt


Testing
---

### Unit tests

Visit bin/tests/unit.html to run unit tests

### Fuzzer

Visit bin/tests/fuzzer.html to run the fuzzer. A seed is outputed on the console. Supply this in the fuzzer source to rerun with same seed.


Dependencies
---

tandem-core.js

underscore.js
