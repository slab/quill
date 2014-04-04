---
layout: docs
title: API - Quill
permalink: /docs/api/
---

# API

Quill allows you to extend its already rich functionality with a powerful set of APIs. They allow granular access to the editor contents, and notifications when they change. Check out the following pages to learn more:

Several common extensions have already been built and packaged as [modules](/docs/modules/). They're great examples of Quill's API in action.

#### [Manipulation](/docs/api/manipulation/)
  - [Quill.prototype.getText](/docs/api/manipulation/#quillprototypegettext)
  - [Quill.prototype.insertText](/docs/api/manipulation/#quillprototypeinserttext)
  - [Quill.prototype.deleteText](/docs/api/manipulation/#quillprototypedeletetext)
  - [Quill.prototype.formatText](/docs/api/manipulation/#quillprototypeformattext)
  - [Quill.prototype.getContents](/docs/api/manipulation/#quillprototypegetcontents)
  - [Quill.prototype.setContents](/docs/api/manipulation/#quillprototypesetcontents)
  - [Quill.prototype.updateContents](/docs/api/manipulation/#quillprototypeupdatecontents)

#### [Events](/docs/api/events/)
  - [text-change](/docs/api/events/#text-change)
  - [selection-change](/docs/api/events/#selection-change)
  - [focus-change](/docs/api/events/#focus-change)

#### [Deltas](/docs/api/deltas/)
  - [Operations](/docs/api/deltas/#operations)
  - [Delta.prototype.constructor](/docs/api/deltas/#deltaprototypeconstructor)
  - [Delta.prototype.apply](/docs/api/deltas/#deltaprototypeapply)
  - [Delta.prototype.compose](/docs/api/deltas/#deltaprototypecompose)
  - [Delta.prototype.decompose](/docs/api/deltas/#deltaprototypedecompose)
