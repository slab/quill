---
layout: docs
title: Upgrading to 2.0
permalink: /guides/upgrading-to-2-0/
---

In progress

## Quill

- `strict` *removed* - Previously some changes that were small in practice (renames) but would warrant a semver major bump would be hidden under this configuration. This ended up being more confusing than helpful as we will no longer make use of this.
- `registry` - added to allow multiple editors with different formats to coexist on the same page.
- `formats` *removed* - `registry` is now strictly more powerful and safer.

## Clipboard

- `convert` - API changed to include both HTML and text and previous functionality is broken into multiple method calls (`convert`, `onCapturePaste`) to allow more surface to hook into.
- `onCapturePaste` - Added

### Configuration

- `matchVisual` *removed* - Previously there was a choice between using visual or semantic interpretation of pasted whitespace; now just the semantic interpretation is used. Visual matching was expensive, requiring the DOM renderer which is no longer available in the new clipboard rewrite.
- `pasteHTML` *removed* - Deprecated alias to `dangerouslyPasteHTML`.

## Keyboard

- Binding `key` is no longer case insensitive. To support bindings like `key: '@'`, modifiers are taken into account so the shift modifier will affect case sensitivity.
- Binding `key` now supports an array of keys to easily bind to multiple shortcuts.
- Native keyboard event object is now also passed into handlers.

## Parchment

- All lists use `<ol>` instead of both `<ul>` and `<ol>` allowing better nesting between the two. Copied content will generate the correct semantic markup for paste into other applications.
- Code block markup now uses `<div>` to better support syntax highlighting.
- Static `register` method added to allow dependent chains of registration.
- Static `formats` method now passes in `scroll`.
- Blot constructor now requires `scroll` to be passed in.

## Delta

- Support for the deprecated delta format, where embeds had integer values and list attributes had different keys, is now removed

## Browser

- Quill builds now use `babel-env` to determine the right level of transpiling and polyfilling.
- IE11 support is dropped build size reduced ~25% as a result.
