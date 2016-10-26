---
layout: docs
title: Upgrading to 1.0
permalink: /guides/upgrading-to-1-0/
---

Quill 1.0 introduces major changes aimed at greater ability to customize Quill. Interfaces stayed the same where possible and this guide helps bridge the gap otherwise.

To realize the full benefits of 1.0, it is encouraged to take a fresh view of Quill 1.0 and revisit even basic topics on this documentation site. Often, you will find that even though you could do things the old way, there is a better new way.

### Configuration

- `styles` *removed* - Previous versions of Quill allowed custom CSS to be injected through `<style>` additions. This option has been removed due to [Content Security Policy](https://developers.google.com/web/fundamentals/security/csp/). Instead you should use external CSS directly.

### API

- `getHTML` *removed* - Previous versions of Quill required the usage of class names to identify lines `ql-line` and an `id` attribute to identify particular lines. This is no longer a requirement and a custom API call no longer adds any value on top of the DOM's existing innerHTML.

- `setHTML` *removed* - Quill, like many editors with a data layer on top of the DOM, does not allow arbitrary changes to the underlying HTML. Previously Quill would detect an illegal state and correct it, but this makes the naming setHTML disingenuous and the reasoning behind the correction is unintuitive. Most use cases of `setHTML` can be suitably met or improved (since cursor preservation is much better) with the new [`pasteHTML`](/docs/api/#pastehtml).

- `addModule` *removed* - Modules are now initialized based off of the initial Quill [configuration](/docs/configuration/), instead of having a separate function.

- `onModuleLoad` *removed* - Module loading is handled by Themes and similar behavior should be achieved by extending the theme.

- `destroy` *removed* - No longer necessary as Quill no longer keeps references to editor instances, allowing Javascript garbage collectors to work as expected.

- `prepareFormat` *renamed* - A new API [`format`](/docs/api/#format) now provides formatting functionality for all selection states, including those previously covered by `prepareFormat`.

- For consistency, all positions are now index and length based versus the start and end representation sometimes used by [`deleteText`](/docs/api/#deletetext), [`formatText`](/docs/api/#formattext), [`formatLine`](/docs/api/#formatline), and the Range object used by selection APIs such as on [`getSelection`](/docs/api/#getselection), [`setSelection`](/docs/api/#setselection), and the [`selection-change`](/docs/api/#selection-change) event.

- `registerModule` *renamed* - A new API [`register`](/docs/api/#register) is now used to registers all modules, themes and formats.

- `require` *renamed* - Renamed to `import` for consistency with ES6.

- `addContainer` *modified* - The [second parameter](/docs/api/#addcontainer) is changed to allow insertion before any container, not just the editor. Thus instead of an optional boolean, it now an optional HTMLElement.


### Modules

- Toolbars, when initialized with a custom HTML element, requires buttons to be actual HTMLButtonElements. Previously it allowed any element with an appropriate class name.

- The [Snow](/docs/themes/#snow/) toolbar no longer adds or uses `ql-format-separator` and renamed `ql-format-group` to `ql-formats`.

- The authorship and multi-cursor modules have been temporarily removed. Similar functionality will be re-added at a later time, either separately or in a bundled collaboration module.

- UndoManager has been renamed to [History](/docs/modules/history/).

- PasteManager has been renamed to [Clipboard](/docs/modules/clipboard/), and will provide custom copy and paste behavior.

- LinkTooltip has been moved to be theme specific. With the addition of [Bubble](/docs/themes/#bubble) and videos and [formulas](/docs/modules/formula/), it no longer made sense to open a separate tooltip for links as its own general UI element. The old tooltip behavior is still present in Snow, but is now specific to that theme.

- ImageTooltip has been removed in favor of a simpler and more native flow. The image button now opens the OS file picker and the selected image file is inserted into the editor as a base64 image.


### Deltas

The default [Delta](/guides/working-with-deltas/) representation of some content has changed. In all cases the old format is still supported in methods using Deltas as in input, such as `setContents` and `updateContents`. But outputted Deltas, such as the ones reported by `text-change` and `getContents` will be in the new form. Since [Parchment](https://github.com/quilljs/parchment) now allows custom content and formats, it is possible to customize these Delta representations entirely.

```javascript
var newImage = {
  insert: { image: 'url' }
};
var oldImage = {
  insert: 1,
  attributes: {
    image: 'url'
  }
};

var newOrderedList = {
  insert: '\n',
  attributes: {
    list: 'ordered'
  }
};
var oldOrderedList = {
  insert: '\n',
  attributes: {
    list: true
  }
};

var newBullettedList = {
  insert: '\n',
  attributes: {
    list: 'bullet'
  }
};
var oldBullettedList = {
  insert: '\n',
  attributes: {
    bullet: true
  }
};

```

### Defaults

- Quill previously used inline styles to implement font family and size. A class implementation is now default. To revert this, see [Content and Formatting](/guides/how-to-customize-quill/#content-and-formatting).

### Browsers

- Quill now follows other major open source libraries in supporting the last two versions of major browser releases. Support for IE9 and IE10 have been dropped, and MS Edge has been added.

- Android browser support now applies to Chrome on Android, instead of the stock Android Browser, which Google has phased out support for.


### Improvements

- Ability to add new formats and content, or modify existing ones with [Parchment](https://github.com/quilljs/parchment/).

- Added support for nested list, superscript, subscript, inline code, code block, header, blockquote, text direction, video and forumla support.

- Ability to format with classes instead of inline styles.

- New tooltip based theme called [Bubble](/docs/themes/#bubble/).

- Improved [Toolbar](/docs/modules/toolbar/) initialization with format arrays and customization with custom values.

- Toolbar icons now use SVGs instead of inline PNGs allowing freedom to resize icons while retaining clarity. CSS can now also be used to easily change the active state color instead of the default #06c blue.

- Improved ability to customize interpretation of pastes in [Clipboard](/docs/modules/clipboard/).

- Improved ability to customize [keyboard handlers](/docs/modules/keyboard/).

- A placeholder configuration option.

- Editable [syntax highlighted code](/docs/modules/syntax/) block.

- Several new [APIs](/docs/api/).

- Many, many bug fixes.

