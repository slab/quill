---
layout: post
permalink: /blog/announcing-quill-1-0/
title: Announcing Quill 1.0
---


Quill 1.0 has arrived. It was just two years ago that Quill made its public debut as an open source project. Today, it can be found in applications and products of all sizes, ranging from personal projects and promising startups, to established public companies.

**Quill is designed as an easy to use editor, to support content creation across the web.** It is built on top of consistent and predictable constructs, exposed through a powerful [API](/docs/api/). With coverage across both ends of the complexity spectrum, Quill aims to be the defacto rich text editor for the web.

In the 111 releases, Quill has iterated relentlessly towards this goal. It has stabilized its API, moved essential internal implementations into customizable modules, and exposed its document model for users to define and add entirely new formats and content.

1. [New Features](/blog/announcing-quill-1-0/#new-features)
2. [Parchment](/blog/announcing-quill-1-0/#parchment)
3. [Website](/blog/announcing-quill-1-0/#website)
4. [What's Next](/blog/announcing-quill-1-0/#whats-next)
5. [Getting Started](/blog/announcing-quill-1-0/#getting-started)
6. [Credits](/blog/announcing-quill-1-0/#credits)

<!-- more -->


### New Features

Editable [Syntax Highlighted Code](/docs/modules/syntax/) blocks can now seamlessly exist inline with the rest of your text.

![Syntax Highlighted Code](/assets/images/blog/syntax.png)

Beautifully rendered [LaTeX formulas](/docs/modules/formula/) can be inserted to your contents.

![Formula](/assets/images/blog/formula.png)

**Many, many new formats** have been added, including superscript, subscript, inline code, code blocks, headers, blockquotes, text direction, videos, and nested lists. Inline styles can now also use classes [instead](/playground/#class-vs-inline-style).

An entirely new theme [Bubble](/docs/themes/#bubble) has also been added, based on a floating toolbar.

![Bubble Theme](/assets/images/blog/bubble.png)

Take a look at the [Changelog](https://github.com/quilljs/quill/blob/develop/CHANGELOG.md) to see an exhaustive list.


### Parchment

As the biggest feature in Quill 1.0, [Parchment](https://github.com/quilljs/parchment/) deserves its own mention. It offers a powerful abstraction over the DOM to enable custom formats and content in Quill. It is responsible for the numerous new formats added in Quill 1.0, including videos, syntax highlighted code, and formulas.

With Parchment, you can now enhance or customize existing Quill formats or add entirely new ones in your own application. Take a look at [Cloning Medium with Parchment](/guides/cloning-medium-with-parchment/) for a detailed guide.


### Website

In addition to the fancy new features, Quill's documentation site has also been given an upgrade. The [referential](/docs/) portions have all been filled out, with no more incomplete or unstable pages. A new [Guides](/guides/) section has been added to cover some of the common how-tos and whys behind design decisions.

There is now also an [Interactive Playground](/playground/), for tinkerers and immediate gratification. You can use it try out Quill's features and experiment with its API, without any setup or installation.


### What's Next

Quill will continue to refine itself in being the easiest editor to use, while allowing for the most sophisticated customizations. With a stable and solid foundation on 1.0, some areas of focus will include:

- Iterating on modules and themes, making them easier to create, customize and share
- Add remaining common formats, such as tables
- Better internationalization support


### Getting Started

If you are just joining us today, the example editors on the [homepage](/) are an excellent demonstration of the gorgeous editing experiences you can add to your application. Make sure to open up your developer console to play around with the API.

Head to the [Interactive Playground](/playground/) if you want to tinker some more or to the [Quickstart](/docs/quickstart/) docs if you are ready to add Quill, with just a few lines of code.


### Credits

Last, but not least, **a special thank you goes out to Quill's community.** Whether you contributed code for the codebase, help for other community members, reports or context for bugs, ideas for new features or improve existing ones, feedback on use cases, or evangelism for the project, Quill would not be nearly as successful without your collective efforts. Thank you for your contribution!
