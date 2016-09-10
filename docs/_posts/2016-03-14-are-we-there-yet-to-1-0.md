---
layout: post
permalink: /blog/are-we-there-yet-to-1-0/
title: Are We There Yet (to 1.0)?
---

When Quill laid out its [1.0 roadmap](/blog/the-road-to-1-0/), core to its journey was the development of a new document model called Parchment. Today a beta release of Parchment is being made available on [Github](https://github.com/quilljs/parchment) and [NPM](https://www.npmjs.com/package/parchment).

What this means is its design and API is reasonably stable and the adventurous can now take an early look. The latest Quill source is already using Parchment to implement its formatting and content capabilities, and its [integration](https://github.com/quilljs/quill/tree/develop/formats) would be a helpful example of Parchment in action. Of course, this is in addition to Parchment’s own [documentation](https://github.com/quilljs/parchment/blob/master/README.md).

<!-- more -->


### New Formats

Parchment enables Quill to scalably support many formats and many are being added in 1.0. The list includes headers, blockquotes, code, superscript, subscript, text direction, nested lists, and video embeds. Syntax highlighted code and formulas will also be available through externally supported modules. In addition, formats that previously relied on style attributes are reimplemented to optionally use classes instead. By default, fonts, sizes, and text alignment will use classes, while foreground and background colors will still use style attributes, since there are so many possible color values.


### Quill 1.0 Beta

With Parchment out of the way, Quill is nearing its own 1.0 release. This will also be prefaced with a beta period, optimistically planned for early April. You can also set up the [local development](https://github.com/quilljs/quill/blob/develop/.github/CONTRIBUTING.md#local-development) environment to follow along with the latest changes and progress.

If you are currently using Quill at your company or project, we'd love to hear about your use case [hello@quilljs.com](mailto:hello@quilljs.com)!
