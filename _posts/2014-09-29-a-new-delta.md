---
layout: post
permalink: /blog/a-new-delta/
title: A New Delta
---

Part of providing a complete API in Quill is providing events for when and what changes occur in the editor. Those changes are currently represented by a [Delta](/docs/deltas/) object, which aims to be intuitive, human-readable, and expressive for any change or document that might need to represented. Over the past few weeks I’ve been working on a new format that better fulfills those goals and addresses the challenges in the current format.

Documentation for the new Delta format can be found in its own [Github repository](https://github.com/ottypes/rich-text) but I will go over some of the rationale behind some of the changes in this post.

<!-- more -->

### Reduced Complexity

Much of the design for the new Delta format is inspired by collaborative systems, which also deal with state and changes and how to represent the two. In fact the old Delta format and implementation was originally intended for an Operational Transform engine. Quill is not specifically built to be a collaborative editor[^1] and only deals with rich text, so the old Delta format added a lot of unnecessary functionality and complexity. The reduced scope of the new Delta format allows for a much tighter implementation[^2].

### Explicit Deletes

In the current Delta format, a delete operation is implied by a lack of a retain operation. Basically everything is deleted unless you say it should be kept. This has some nice properties from an implementation perspective[^3] but was probably the largest source of confusion for users trying to work with Deltas and challenged the human-readability goal. It is very difficult to keep track of indexes to figure out what was not accounted for, to figure out what should be deleted.

The new format has an explicit delete operation and by default everything is kept. Here’s a comparison of the two formats both representing removing the ‘b’ in ‘abc’.

{% highlight javascript %}
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
{% endhighlight %}

A side effect of having explicit deletes and defaulting to keeping text is that in practice the representation for new Deltas will usually be smaller.

### Embed Support

The new Delta format provides native support for embeds, which can be used to represent images, video, etc [2]. There is no support for this in the current format and implementation is hackily achieved by representing an ‘!’ with a src key in the attributes (which will break when video support is added).

{% highlight javascript %}
var oldFormat = {
  startLength: 0,
  endLength: 1,
  ops: [{
    text: “!”,
    attributes: { src: ‘https://octodex.github.com/images/labtocat.png’ }
  }]
};

var newFormat = {
  ops: [{
    insert: 1, attributes: { src: ‘https://octodex.github.com/images/labtocat.png’ }
  }]
};
{% endhighlight %}

### Forward

This new format will be the finalized representation for changes and state in Quill going forward and is one of the major steps toward a 1.0 release (a topic for another post).

[^1]: The ability be used in a collaborative system remains a good benchmark of the capabilities of an editor’s API.
[^2]: Currently 28658 vs 9507 lines of code (though in practice is less relevant due to minification and gzip).
[^3]: Minimizes number of operations to support, and easy to calculate the length of text of the resulting document which is useful for sanity checks.
