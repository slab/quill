---
layout: post
permalink: /blog/quill-1-0-release-candidate-released/
title: Quill 1.0 Release Candidate... Released!
---

Today Quill enters its highly anticipated 1.0 release candidacy. Through the 11 beta releases, over 300 reported bugs were fixed, and almost 1000 commits were made. **Thank you to all contributors who pitched in, in ways small and large, isolated and numerous, either reporting issues, committing code, or otherwise helping out the community!**

The [API](/docs/api/) should now be considered stable, with only backwards compatible bug fixes to look forward to. No additional new features are planned until after the official 1.0 release.

<!-- more -->

You can now access the release candidate from npm:

```bash
npm install quill@1.0.0-rc.0
```

As always our CDN is also available:

```html
<link href="//cdn.quilljs.com/1.0.0-rc.0/quill.snow.css" rel="stylesheet">
<link href="//cdn.quilljs.com/1.0.0-rc.0/quill.bubble.css" rel="stylesheet">

<script src="//cdn.quilljs.com/1.0.0-rc.0/quill.js"></script>
<script src="//cdn.quilljs.com/1.0.0-rc.0/quill.min.js"></script>
```

If you are just joining from the 0.20.1 or older, take a look at the updated [Upgrading to 1.0 Guide](/guides/upgrading-to-1-0/). If you prefer to stay with 0.20, the [documentation](/0.20/) will remain available.


### Many New Formats

Quill 1.0 adds several new formats and improves on existing ones. Superscript, subscript, inline code and blocks, headers, blockquotes, text direction, and video support have all been added. List can also now be nested and formats previously implemented with just inline styles can now use classes [instead](/playground/#class-vs-inline-style).

Syntax highlighted [code](/docs/modules/syntax/) and LaTeX [formulas](/docs/modules/formula/) can also be added with an optional module.


### Brand New Theme

An entirely new theme [Bubble](/docs/themes/#bubble) has also been added, based on a floating toolbar.

![Color Icon](/assets/images/blog/bubble.png)

Both Snow and Bubble now also use SVG icons to sharply scale to whatever size your application demands. The icons are implemented to be added to the DOM directly so you can customize the active color and enable less obvious UI enhancements.

![Color Icon](/assets/images/blog/color.png)


### More Configurable Modules

Existing modules have much more customization capabilities in 1.0, with new configurations and APIs. Most notably:

- [Clipboard](/docs/modules/clipboard/) introduces the ability to customize interpretation of pasted content before it reaches the editor.
- [Keyboard](/docs/modules/keyboard/) adds a context option to give much more granular control over when bindings are triggered.
- [Toolbar](/docs/modules/toolbar/) can be much more easily configured with just an array, and now exposes options to overwrite its handler.


### Parchment

[Parchment](https://github.com/quilljs/parchment/) also enters its 1.0 release candidacy today. For Quill, not only did Parchment enable the addition the numerous formats, it enables a path to the new generation of content creation. Text today is written to be rendered on the web, offering a much richer canvas than a printed piece of paper. Content can now be live, interactive, or even collaborative.

Users have already been using Quill in beta to successfully support these editing experiences. This is possible in part due to the [API](/docs/api/) Quill was designed with at inception, but now Parchment takes that further by providing a powerful abstraction layer over the DOM. This enables the addition of new content and formats that cannot exist on paper or even anticipated by Quill's developers.

Of course, Quill still ships with ready to go defaults, so you can integrate and use it with just a few lines of code&mdash;you never have to do more if your product needs never demands it.

Jump to the [demo](/) to see Quill's new features or try out some code in the [Interactive Playground](/playground/)!
