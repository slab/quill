---
layout: docs
title: Building a Custom Module
permalink: /guides/building-a-custom-module/
---

Quill's core strength as an editor is its rich API and powerful customization capabilities. As you implement functionality on top of Quill's API, it may be convenient to organize this as a module. For the purpose of this guide, we will walk through one way to build a word counter module, a commonly found feature in many word processors.

*Note: Internally modules are how much of Quill's functionality is organized. You can overwrite these default [modules](/docs/modules/) by implementing your own and registering it with the same name.*

### Counting Words

At its core a word counter simply counts the number of words in the editor and displays this value in some UI. Thus we need to:

1. Listen for text changes in Quill.
1. Count the number of words.
1. Display this value.

Let's jump straight in with a complete example!

<!-- more -->
<div data-height="379" data-theme-id="23269" data-slug-hash="bZkWKA" data-default-tab="js" data-embed-version="2" class="codepen"><pre><code>
// Implement and register module
Quill.register('modules/counter', function(quill, options) {
  var container = document.querySelector('#counter');
  quill.on('text-change', function() {
    var text = quill.getText();
    // There are a couple issues with counting words
    // this way but we'll fix these later
    container.innerText = text.split(/\s+/).length;
  });
});

// We can now initialize Quill with something like this:
var quill = new Quill('#editor', {
  modules: {
    counter: true
  }
});
</code></pre></div>

That's all it takes to add a custom module to Quill! A function can be [registered](/docs/api/#quillregistermodule/) as a module and it will be passed the corresponding Quill editor object along with any options.

### Using Options

Modules are passed an options object that can be used to fine tune the desired behavior. We can use this to accept a selector for the counter container instead of a hard-coded string. Let's also customize the counter to either count words or characters:

<div data-height="430" data-theme-id="23269" data-slug-hash="OXqmEp" data-default-tab="js" data-embed-version="2" class="codepen"><pre><code>
Quill.register('modules/counter', function(quill, options) {
  var container = document.querySelector(options.container);
  quill.on('text-change', function() {
    var text = quill.getText();
    if (options.unit === 'word') {
      container.innerText = text.split(/\s+/).length + ' words';
    } else {
      container.innerText = text.length + ' characters';
    }
  });
});

var quill = new Quill('#editor', {
  modules: {
    counter: {
      container: '#counter',
      unit: 'word'
    }
  }
});
</code></pre></div>

### Constructors

Since any function can be registered as a Quill module, we could have implemented our counter as an ES5 constructor or ES6 class. This allows us to access and utilize the module directly.

<div data-height="688" data-theme-id="23269" data-slug-hash="BzbRVR" data-default-tab="js" data-embed-version="2" class="codepen"><pre><code>
var Counter = function(quill, options) {
  this.quill = quill;
  this.options = options;
  var container = document.querySelector(options.container);
  var _this = this;
  quill.on('text-change', function() {
    var length = _this.calculate();
    container.innerText = length + ' ' + options.unit + 's';
  });
};

Counter.prototype.calculate = function() {
  var text = this.quill.getText();
  if (this.options.unit === 'word') {
    return text.split(/\s+/).length;
  } else {
    return text.length;
  }
};

Quill.register('modules/counter', Counter);

var quill = new Quill('#editor', {
  modules: {
    counter: {
      container: '#counter',
      unit: 'word'
    }
  }
});

var counter = quill.getModule('counter');

// We can now access calculate() directly
console.log(counter.calculate(), 'words');
</code></pre></div>

### Wrapping It All Up

Now let's polish off the module in ES6 and fix a few pesky bugs. That's all there is to it!

<div data-height="772" data-theme-id="23269" data-slug-hash="wWOdXZ" data-default-tab="js" data-embed-version="2" class="codepen"><pre><code>
class Counter {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.container = document.querySelector(options.container);
    quill.on('text-change', this.update.bind(this));
    this.update();  // Account for initial contents
  }

  calculate() {
    let text = this.quill.getText();
    if (this.options.unit === 'word') {
      text = text.trim();
      // Splitting empty text returns a non-empty array
      return text.length > 0 ? text.split(/\s+/).length : 0;
    } else {
      return text.length;
    }
  }

  update() {
    var length = this.calculate();
    var label = this.options.unit;
    if (length !== 1) {
      label += 's';
    }
    this.container.innerText = length + ' ' + label;
  }
}

Quill.register('modules/counter', Counter);

var quill = new Quill('#editor', {
  modules: {
    counter: {
      container: '#counter',
      unit: 'word'
    }
  }
});
</code></pre></div>

<!-- script -->
<script src="//codepen.io/assets/embed/ei.js"></script>
<!-- script -->
