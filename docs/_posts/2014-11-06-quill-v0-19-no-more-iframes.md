---
layout: post
permalink: /blog/quill-v0-19-no-more-iframes/
title: Quill v0.19 - No More Iframes
---

Customizability is core to Quill's ethos and the new [v0.19 release](https://github.com/quilljs/quill/releases/tag/v0.19.0) is a big step towards fulfilling that mission. In previous versions Quill utilized an iframe to contain the editor. This unfortunately prevented expected browser behaviors and made it difficult for developers to access and extend Quill[^1]. Its removal is the biggest change in v0.19 and some rippling effects are expected. They, and other changes for v0.19, are summarized here.


### Styles

With iframes gone it is now much easier to customize the styling of the Quill editor and unecessary for Quill to do so on your behalf in most cases. This leads to a few changes:

You can now pass `false` into the [style config](/docs/configuration/#styles) to prevent Quill from injecting any `<style>` tags. No change is necessary if the default behavior is preferred, but this added option makes it easier and more efficient for those that prefer to completely control styling with stylesheets. For this latter route, `quill.base.css` is now included in releases and the CDN.

<!-- more -->

Since adding and customizing styles is no longer inaccessible, the `addStyles` helper is no longer particularly useful and has been removed.

All Quill containers' class names have changed to be prefixed with `ql-`. If your application was using these names in any way they will need to be updated.

Quill is also no longer "protected" from external styles so it should be treated with the same caution as any other front end library. In particular, avoiding overly general css rules will help ensure a peaceful coexistence.


### Scripts

It was always possible to access and manipulate Quill's editor, but without an iframe the task is now easy. While this greatly simplifies custom enhancements it also makes it easier to inadvertently interfere with Quill's necessary operations. But with modern developer tools and practices, the risks can be mitigated and ultimately the benefits of customization is worthwhile.

This is a good time to reiterate good bug reporting practices, not just for Quill but for all open source projects. Reducing bugs into the simplest case and providing repeatable reproduction instructions will help isolate the source of issues.


### Default Theme

The default theme in Quill has been renamed from `default` to `base`. No change should be necessary unless the `default` theme was explicitly being included in the [theme config](/docs/configuration/#theme) in which case it should be changed to `base`.


### NPM

Quill is now listed in npm as `quill` instead of `quilljs`. Quill was already listed as `quill` on bower so its name will now be consistent across package managers.


### Contributing

Finally, community contribution and involvement has been tremendous and both the project and everyone using it reaps the benefits. A big thanks for all the contributions so far and keep them coming!


[^1]: See [Editors and Iframes](https://www.jasonchen.me/editors-and-iframes/) for full details.
