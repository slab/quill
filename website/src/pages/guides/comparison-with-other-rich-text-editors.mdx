---
layout: docs
title: Comparison with Other Rich Text Editors
permalink: /guides/comparison-with-other-rich-text-editors/
---

## CKEditor and TinyMCE

CKEditor and TinyMCE are both very widely used, having been around for over a decade. Quill introduces several new ideas that separate it from these traditional editors:

- It treats `contenteditable` as an input, not a complete editor or API. Browsers never fully agreed on or specified the complete scope of `contenteditable`. Left to their own interpretations, each ended with different implementations that featured their own quirks and a proliferation of bugs, earning `contenteditable` deserved notoriety. It is still possible today to crash an entire browser using `contenteditable` APIs.

- It offers a substantive API on top of the DOM. Most of CKEditor and TinyMCE's APIs offer little more than syntactic sugar on top of existing DOM APIs. Quill maintains an internal document model and does not rely on the DOM as the source of truth, allowing it to offer far more powerful and relevant APIs for text editing.

- It allows customization and new additions of formats and content. Quill considers the web as a target output, not just paper. Therefore, in addition to supporting traditional formats commonly found in word processors (like bold, italics and lists), Quill allows the definition of entirely new formats and content not previously imagined. Quill's users have already added customizations to embed slide decks, interactive checklists and 3D models.

Although there are differences between them, CKEditor and TinyMCE are compared together because they differ from Quill in similar ways. Nevertheless, CKEditor or TinyMCE might be a better choice if:

- You need to support very old browsers. Quill follows the policy of many other Javascript libraries of supporting the latest two versions of each major browser.

- You need to set or edit the underlying HTML directly with arbitrary HTML. Quill does not support arbitrary modifications to its contents with `innerHTML` as it leads to surprising and buggy behavior. Instead, it provides a consistent [API](/docs/api/) for modification and the ability to define new formats and content through [Parchment](https://github.com/quilljs/parchment/).


## Draft

Draft is often compared with Quill, but Draft, by its own description, is a "Rich Text Editor Framework for React." It provides the building blocks to create an editor, but is not one ready to use by itself. It is still worthwhile to compare Quill's internals with Draft however:

- Prior to Quill 1.0, Draft allowed more customization over its content and document model, but this is no longer the case. Quill now exposes its document model, called [Parchment](https://github.com/quilljs/parchment), and allows customization to an even deeper level than Draft at this point. [Cloning Medium with Parchment](/guides/cloning-medium-with-parchment/) is a great demonstration of what is possible with Parchment.

- Draft organizes nodes into two levels: block and inline. Parchment also has a block and inline layer, but inline nodes can be nested, allowing semantic output such as `<strong><em>Stronger</em></strong>` whereas the equivalent in Draft must use just one inline format node and utilizes inline styles:

  ```html
  <span data-offset-key="1oo4h-0-0" style="font-weight: bold; font-style: italic;">
    <span data-text="true">Stronger</span>
  </span>
  ```

- Draft's API inherits primitives and ideas from React that are more appropriate for general websites. Quill's only use case is rich text content allowing for a simpler API geared specifically for that use case. API simplicity is subjective, so the best metric for you might be to think of a common task, like bolding a range of text, and try to figure out how to do it in Quill and how to do it in Draft.

- React, React DOM, and immutable.js are dependencies of Draft which add a lot of weight for users not already using React.

The main difference is still that Quill is a ready to use rich text editor, with user interactions considered and interfaces thought out and implemented. Draft provides the building blocks but you will have to implement all the pieces above the data layer yourself.


## ProseMirror

ProseMirror is relatively new but has already captured signficant attention, being built by the same author of  CodeMirror. That being said a robust comparison of the product and implementation is premature since ProseMirror is still in the development stages, as noted in their README:

> NOTE: This project is in BETA stage. It isn't thoroughly tested, and the API might still change across 0.x releases. You are welcome to use it, but don't expect it to be very stable yet.

Instead we will compare the ideas and goals:

- Both Quill and ProseMirror implement and maintain a data model to operate on with APIs, instead of allowing users to modify the DOM directly.

- Support realtime collaboration. Quill users are already doing so in production.

- Quill's architecture is more modular, allowing for easier customization of internals. Core modules that handle basic functionality like copy/paste and undo/redo can be swapped out in Quill.

- ProseMirror favors broad exposure of API methods, configurations and variables. Quill treats developers as users and designs an organized API surface, judicious in what to expose, sometimes hiding confusing methods or creating new ones that unify several internal operations.


## Trix

Trix is another newly released editor that has adopted many modern ideas in rich text editing. This includes a data model on top of the DOM and treating `contenteditable` as an input, which Quill and other modern editors also embrace. In addition, Quill offers some significant advantages over Trix:

- More [format](/docs/formats/) support. Quill supports all formats found in Trix, and also supports text color, font, background, size, superscript, subscript, underline, text alignment, text direction, syntax highlighted code, videos, and formulas, which are not supported in Trix.

- Allows customization of existing formats and content, or even adding new ones. Trix implements each format in one way, and allows no further customization.

- Modularized internals that can be configured or even swapped out. Trix is architected as a monolith.

- Trix offers one UI, that users likely will need to polish with custom CSS. Quill offers two beautiful, ready to use themes, one centering around a persistent [toolbar](/docs/themes/#snow) and one around a Medium-like [tooltip theme](/docs/themes/#bubble).
