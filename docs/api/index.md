---
layout: docs
title: API - Scribe
permalink: /docs/api/
---

# API

Scribe allows you to extend its already rich functionality with a powerful set of APIs. They allow granular access to the editor contents, and notifications when they change. Check out the following pages to learn more:

Several common extensions have already been built and packaged as [modules](/docs/modules/). They're great examples of Scribe's API in action.

#### [Manipulation](/docs/api/manipulation/)
  - [Scribe.prototype.getText](/docs/api/manipulation/#scribeprototypegettext)
  - [Scribe.prototype.insertText](/docs/api/manipulation/#scribeprototypeinserttext)
  - [Scribe.prototype.deleteText](/docs/api/manipulation/#scribeprototypedeletetext)
  - [Scribe.prototype.formatText](/docs/api/manipulation/#scribeprototypeformattext)
  - [Scribe.prototype.getContents](/docs/api/manipulation/#scribeprototypegetcontents)
  - [Scribe.prototype.setContents](/docs/api/manipulation/#scribeprototypesetcontents)
  - [Scribe.prototype.updateContents](/docs/api/manipulation/#scribeprototypeupdatecontents)

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
