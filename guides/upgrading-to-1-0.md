---
layout: guide
title: Upgrading to 1.0
permalink: /guides/upgrading-to-1-0/
---

Quill 1.0 introduces major changes aimed at greater ability to customize Quill. Interfaces stayed the same where possible and this guide helps bridge the gap otherwise.

To realize the full benefits of 1.0, it is encouraged to take a fresh view of Quill 1.0 and revisit even basic topics on this documentation site.

**Note: While Quill is in its beta and release candidate stages, this guide will be updated as needed.**


### API

- `getHTML` *removed* - Previous versions of Quill required the usage of class names to identify lines `ql-line` and an `id` attribute to identify particular lines. This is no longer a requirement and a custom API call no longer adds any value on top of the DOM's existing innerHTML.

- `setHTML` *removed* - Quill, like many editors with a data layer on top of the DOM, does not allow arbitrary changes to the underlying HTML. Previously Quill would detect an illegal state and correct it, but this makes the naming setHTML disingenuous and the reasoning behind the correction is unintuitive. Most use cases of `setHTML` can be suitably met or improved (since cursor preservation is much better) with the new [`pasteHTML`](/docs/api/#pastehtml).

- `addModule` *removed* - Modules are now initialized based off of the initial Quill [configuration](/docs/configuration/), instead of having a separate function.

- `onModuleLoad` *removed* - Module loading is handled by Themes and similar behavior should be achieved by extending the theme.

- `prepareFormat` *renamed* - A new API [`format`](/docs/api/#format) now provides formatting functionality for all selection states, including those previously covered by `prepareFormat`.

- For consistency, all positions are now index and length based versus the start and end representation sometimes used by [`deleteText`](/docs/api/#deletetext), [`formatText`](/docs/api/#formattext), [`formatLine`](/docs/api/#formatline), and the Range object used by selection APIs such as on [`getSelection`](/docs/api/#getselection), [`setSelection`](/docs/api/#setselection), and the [`selection-change`](/docs/api/#selection-change) event.

- `registerModule` *renamed* - A new API [`register`](/docs/api/#register) is now used to registers all modules, themes and formats.

- `require` *renamed* - Renamed to `import` for consistency with ES6.

- `addContainer` *modified* - The [second parameter](/docs/api/#addcontainer) is changed to allow insertion before any container, not just the editor. Thus instead of an optional boolean, it now an optional HTMLElement.


### Modules

- Toolbars, when initialized with a custom HTML element, requires buttons to be actual HTMLButtonElements. Previously it allowed any element with an appropriate class name.

- The [Snow](/docs/themes/snow/) toolbar no longer adds or uses `ql-format-separator` and renamed `ql-format-group` to `ql-formats`.

- The authorship and multi-cursor modules have been temporarily removed. Similar functionality will be re-added at a later time, either separately or in a bundled collaboration module.

- UndoManager has been renamed to [History](/docs/modules/history/).

- PasteManager has been renamed to [Clipboard](/docs/modules/clipboard/), and will provide custom copy and cut, as well paste, behavior.


### Browsers

- Quill now follows other major open source libraries in supporting the last two versions of major browser releases. Support for IE9 and IE10 have been dropped, and MS Edge has been added.

- Android browser support now applies to Chrome on Android, instead of the stock Android Browser, which Google has phased out support for.


### Improvements

- Ability to add new formats and content, or modify existing ones with [Parchment](/guides/building-on-parchment/).

- Improved ability to customize interpretation of pastes in Clipboard.

- Improved ability to customize keyboard handlers.

- A simple tooltip based theme called [Bubble](/docs/themes/bubble/) has been added.

- Toolbar icons now use SVGs instead of inline PNGs allowing freedom to resize icons while retaining clarity. CSS can now also be used to easily change the active state color instead of the default #06c blue.

- A placeholder configuration option.

- Nested list, superscript, subscript, inline code, code block, header, blockquote, text direction, video and forumla support.

- Ability to format with classes instead of inline styles.

- Editable [syntax highlighted code](/docs/modules/code-highlighter/) block.

- Several new [APIs](/docs/api/).

- Many, many bug fixes.

