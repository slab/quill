---
layout: docs
title: API
permalink: /docs/api/
---

# API

#### Content
- [deleteText](#deletetext)
- [getContents](#getcontents)
- [getLength](#getlength)
- [getText](#gettext)
- [insertEmbed](#insertembed)
- [insertText](#inserttext)
- [setContents](#setcontents)
- [setText](#settext)
- [updateContents](#updatecontents)

#### Formatting
- [format](#format)
- [formatLine](#formatline)
- [formatText](#formattext)
- [getFormat](#getformat)
- [removeFormat](#removeFormat)

#### Selection
- [focus](#focus)
- [getBounds](#getbounds)
- [getSelection](#getselection)
- [hasFocus](#hasfocus)
- [setSelection](#setselection)

#### Events
- [off](#off)
- [on](#on)
- [once](#once)
- [selection-change](#selectionchange)
- [text-change](#textchange)

#### Extension
- [debug](#debug)
- [import](#import)
- [register](#register)
- [disable](#disable)
- [enable](#enable)
- [addContainer](#addcontainer)
- [getModule](#getmodule)
- [update](#update)

{% include_relative api/contents.md %}
{% include_relative api/formatting.md %}
{% include_relative api/selection.md %}
{% include_relative api/events.md %}
{% include_relative api/extension.md %}
