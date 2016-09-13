---
layout: post
permalink: /blog/a-new-delta/
title: A New Delta
---

Part of providing a complete API in Quill is providing events for when and what changes occur in the editor. Those changes are currently represented by a [Delta](/guides/working-with-deltas/) object, which aims to be intuitive, human-readable, and expressive for any change or document that might need to represented. Over the past few weeks I’ve been working on a new format that better fulfills those goals and addresses the challenges in the current format.

Documentation for the new Delta format can be found in its own [Github repository](https://github.com/ottypes/rich-text) but I will go over some of the rationale behind some of the changes in this post.

<!-- more -->

### Reduced Complexity

When the Delta format was originally designed, it had ambitious goals of being general purpose and being able to represent any kind of document. The new format reduces the scope to just rich text documents, allowing for a much tighter implementation[^1].

Quill is not specifically built to be a collaborative editor but the ability to be used as one is a good benchmark of the API. The new Delta format maintains this capability and fulfills the specifications of an [ottype](https://github.com/ottypes/docs), making it compatible with [ShareJS](https://github.com/share/ShareJS).


### Explicit Deletes

In the current Delta format, a delete operation is implied by a lack of a retain operation. Basically everything is deleted unless you say it should be kept. This has some nice properties from an implementation perspective[^2] but was probably the largest source of confusion for users trying to work with Deltas and challenged the human-readability goal. It is very difficult to keep track of indexes to figure out what was not accounted for, to figure out what should be deleted.

The new format has an explicit delete operation and by default everything is kept. Here’s a comparison of the two formats both representing removing the ‘b’ in ‘abc’.

```javascript
var oldFormat = {
  startLength: 3,
  endLength: 2,
  ops: [
    { start: 0, end: 1 },
    { start: 2, end: 3 }
  ]
};

var newFormat = {
  ops: [
    { retain: 1 },
    { delete: 1 }
  ]
};
```

A side effect of having explicit deletes and defaulting to keeping text is that in practice the representation for new Deltas will usually be smaller.

### Embed Support

The new Delta format provides native support for embeds, which can be used to represent images, video, etc. There is no support for this in the current format and implementation is hackily achieved by representing an ‘!’ with a image key in the attributes (which will break when video support is added).

```javascript
var oldFormat = {
  startLength: 0,
  endLength: 1,
  ops: [{
    text: '!',
    attributes: { image: 'https://octodex.github.com/images/labtocat.png' }
  }]
};

var newFormat = {
  ops: [{
    insert: 1, attributes: { image: 'https://octodex.github.com/images/labtocat.png' }
  }]
};
```

### Going Forward

This new format will be the finalized representation for changes and state in Quill going forward and is one of the major steps toward a 1.0 release (a topic for another post).


[^1]: Currently 28658 vs 9507 lines of code (though in practice is less relevant due to minification and gzip).
[^2]: Minimizes number of operations to support, and easy to calculate the length of text of the resulting document which is useful for sanity checks.
