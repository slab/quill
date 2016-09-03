---
layout: docs
title: API
permalink: /docs/api/
---

<h4>Content</h4>

- [deleteText](#deletetext)
- [disable](#disable)
- [enable](#enable)
- [getContents](#getcontents)
- [getLength](#getlength)
- [getText](#gettext)
- [insertEmbed](#insertembed)
- [insertText](#inserttext)
- [pasteHTML](#pastehtml)
- [setContents](#setcontents)
- [setText](#settext)
- [updateContents](#updatecontents)


<h4>Formatting</h4>

- [format](#format)
- [formatLine](#formatline)
- [formatText](#formattext)
- [getFormat](#getformat)
- [removeFormat](#removeFormat)


<h4>Selection</h4>

- [blur](#blur)
- [focus](#focus)
- [getBounds](#getbounds)
- [getSelection](#getselection)
- [hasFocus](#hasfocus)
- [setSelection](#setselection)


<h4>Events</h4>

- [off](#off)
- [on](#on)
- [once](#once)
- [selection-change](#selectionchange)
- [text-change](#textchange)
- [editor-change](#editorchange)


<h4>Extension</h4>

- [debug](#debug)
- [import](#import)
- [register](#register)
- [addContainer](#addcontainer)
- [getModule](#getmodule)
- [update](#update)

{% include_relative api/contents.md %}
{% include_relative api/formatting.md %}
{% include_relative api/selection.md %}
{% include_relative api/events.md %}
{% include_relative api/extension.md %}
