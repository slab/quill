---
layout: guide
title: How to Customize Quill
permalink: /guides/how-to-customize-quill/
---

Quill was designed with customization and extension in mind. This is achieved by implementing a small editor core exposed by a granular, well defined API. Modules were then built around the core, using the [same APIs](/docs/api/) you have access to. [Configurations](/docs/configuration/) were then added for the most common tasks.

In general to customize Quill, first take a look at if configurations for both Quill and individual modules. Then depending on if your desired customization has to do with the editor or the contents, you would likely modify a [module](#modules) or use [Parchment](#document-contents-and-formatting).


### Configurations

In general, Quill favors Code over Configuration&trade;. But for very common needs, especially where the equivalent code would be lengthy or complex, Quill provides [configuration](/docs/configuration/) options. This would be a good first place too look to determine if you even need to implement any custom functionality.

Two of the most powerful options is `modules` and `theme`. You can drastically change or expand what Quill can and does do by simply or removing individual [modules](/docs/modules/) or using a different [theme](/docs/themes/).


### Themes

Quill include a standard toolbar theme [Snow](/docs/themes/#snow) and a floating tooltip theme [Bubble](/docs/themes/#bubble). Since Quill is not confined within an iframe like many legacy editors, modifying visual modifications can be made with just CSS.

If you would like to drastically change UI interactions, you can omit the `theme` configuration option, which will give you an unstyled Quill editor. You do still need to include a minimal stylesheet that, for example, makes sure spaces render in all browsers and ordered lists are appropriately numbered.

```html
<link rel="stylesheet" href="https://cdn.quilljs.com/{{site.version}}/quill.core.css">
```

From there you can implement and attach your own UI elements like custom dropdowns or tooltips. Take a look at [Cloning Medium with Parchment](/guides/cloning-medium-with-parchment/) for an example of this.


### Modules

Quill is designed with a modular architecture. It is composed of a small editing core, surrounded by modules that augment its functionality. Some of this functionality is quite basic, such as the [History](/docs/modules/history/) module, which manages undo and redo. Because all modules use the same [API](/docs/api/) exposed to the developer publicly, easy interchange of even core modules is possible, when necessary.

Like Quill's core itself, many [modules](/docs/modules/) expose additional configuration options and APIs. Take a look at the module's documentation; often your desired customization is simply a configuration or API call away.

If you would like to drastically change functionality an existing module already covers, you can simply not include it&mdash;or explicitly exclude it when a theme includes it by default&mdash;and implement the functionality to your liking external to Quill, using the same [API](/docs/api/) the default module uses.

```js
var quill = new Quill('#editor', {
  modules: {
    toolbar: false    // Snow includes toolbar by default
  },
  theme: 'snow'
});
```

A few modules&mdash;[Clipboard](/docs/modules/clipboard/), [Keyboard](/docs/modules/keyboard/), and [History](/docs/modules/history/)&mdash;need to be included as core functionality depend on the APIs they implement. For example, undo and redo is basic editor functionality, yet the native browser behavior handling this is inconsistent and unpredictable. The History module bridges the gap by implementing its own undo manager and exposing `undo()` and `redo()` as APIs.

Nevertheless, staying true to Quill modular design, you can still drastically change the way undo and redo&mdash;or any other core functionality&mdash;works by implementing your own undo manager to replace the History module. As long as you implement the same API interface, Quill will happily use your replacement module. This is most easily done by inheriting from the existing module, and overwriting the methods you want to change. Take a look at the [modules](/docs/modules/) documentation for a very simple example of overwriting the core [Clipboard](/docs/modules/clipboard/) module.

Finally, you may want to add functionality not provided by existing modules. In this case, it may be convenient to organize this as a Quill module, which the [Building A Custom Module](/guides/building-a-custom-module/) guide covers. Of course, it is certainly valid to just keep this separate from Quill and just in your application code.


### Document Contents and Formatting

Quill allows modification and extension of the contents and formats that it understands through its document model [Parchment](https://github.com/quilljs/parchment/). Content and formats are represented in Parchment as either Blots or Attributors, which roughly correspond to Nodes or Attributes in the DOM.

Quill use classes, instead of inline style attributes, when possible, but both are implemented for you to pick and choose. A live example of this is implemented as a [Playground snippet](/playground/#class-vs-inline-style).

```js
var ColorClass = Quill.import('attributors/class/color');
var SizeStyle = Quill.import('attributors/style/size');
Quill.register(ColorClass, true);
Quill.register(SizeStyle, true);

// Initialize as you would normally
var quill = new Quill('#editor', {
  modules: {
    toolbar: true
  },
  theme: 'snow'
});
```

Formats represented by Blots can also be customized. Here is how you would change the DOM Node used to represent bold formatting.

```js
var Bold = Quill.import('blots/bold');
Bold.tagName = 'B';   // Quill uses <strong> by default
Quill.register(Bold, true);

// Initialize as you would normally
var quill = new Quill('#editor', {
  modules: {
    toolbar: true
  },
  theme: 'snow'
});
```

You can also extend existing formats. Here is a quick ES6 implementation of a list item that does not permit formatting its contents. Code blocks are implemented in exactly this way.

```js
var ListItem = Quill.import('blots/list/item');

class PlainListItem extends ListItem {
  formatAt(index, length, name, value) {
    if (name === 'list') {
      // Allow changing or removing list format
      super.formatAt(name, value);
    }
    // Otherwise ignore
  }
}

Quill.register(ListItem, true);

// Initialize as you would normally
var quill = new Quill('#editor', {
  modules: {
    toolbar: true
  },
  theme: 'snow'
});
```

You can view a list of Blots and Attributors available by calling `console.log(Quill.imports);`. Direct modification of this object is not supported. Use [`Quill.register`](/docs/api/#register) instead.

A complete reference on Parchment, Blots and Attributors can be found on Parchment's own [README](https://github.com/quilljs/parchment/). For an in-depth walkthrough, take a look at [Cloning Medium with Parchment](/guides/cloning-medium-with-parchment/), which starts with Quill understanding just plain text, to adding all of the formats [Medium](https://medium.com/) supports. Most of the time, you will not have to build formats from scratch since most are already implemented in Quill, but it is still useful to understanding how Quill works at this deeper level.
