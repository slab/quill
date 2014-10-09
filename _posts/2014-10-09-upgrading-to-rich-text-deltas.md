---
layout: post
permalink: /blog/upgrading-to-rich-text-deltas/
title: Upgrading to Rich Text Deltas
---

The new rich text type is now being used in Quill and will be the way documents and changes are represented going forward. If you happened to be using and storing the old format (despite the warning on the Delta page), here's a short guide on how to upgrade.

The main relevant differences are:

1. Explicit deletes - Thus we need to go through the old Delta, find the implied deletes and insert explicit delete operations into the new Delta
2. Support for embeds - If we see the hacky representation of embeds, and use the new Delta's representation

<!-- more -->

{% highlight javascript %}
var richText = require('rich-text');

var newDelta = new richText.Delta();
var index = 0;
var changeLength = 0;
oldDelta.ops.forEach(function (op) {
  if (_.isString(op.value)) {
    // Insert operation
    if (op.value === '!' && op.attributes && _.isString(op.attributes.src)) {
      // Found the old hacky representation for an embed
      // Quill only supports images so far so we can be confident this is an image
      newDelta.insert(1, op.attributes);
    } else {
      newDelta.insert(op.value, op.attributes);
    }
    changeLength += op.value.length;
  } else if (_.isNumber(op.start) && _.isNumber(op.end)) {
    // Retain operation
    if (op.start > index) {
      // Delete operation was implied by the current retain operation
      var length = op.start - index;
      newDelta.delete(length);
      changeLength -= length;
    }
    // Now handle or retain operation
    newDelta.retain(op.end - op.start, op.attributes);
    index = op.end;
  } else {
    throw new Error('You have a misformed delta');
  }
});

// Handle implied deletes at the end of the document
if (oldDelta.endLength < oldDelta.startLength + changeLength) {
  var length = oldDelta.startLength + changeLength - oldDelta.endLength;
  newDelta.delete(length);
}
{% endhighlight %}

If you cannot use the rich-text module or if you are using this as a general guide for another language, the following might be helpful in crafting insert, delete and retain operations.

{% highlight javascript %}

var nweDelta = { ops: [] };
oldDelta.ops.forEach(function () {
  // Following a similar logic to the earlier snippet
  // except replacing .insert(), .retain(), .delete() with:
  // insertOp(newDelta.ops, value, formats)
  // retainOp(newDelta.ops, length, formats)
  // deleteOp(newDelta.ops, length)
});

function insertOp(opsArr, text, formats) {
  var op = { insert: text };
  if (formats && Object.keys(formats).length > 0) {
    op.attributes = formats;
  }
  opsArr.push(op);
};

function deleteOp(opsArr, length) {
  opsArr.push({ delete: length });
}

function retainOp(opsArr, length, formats) {
  var op = { retain: length };
  if (formats && Object.keys(formats).length > 0) {
    op.attributes = formats;
  }
  opsArr.push(op);
}
{% endhighlight %}

There are some optimizations performed by rich-text such as excluding no-ops (delete 0 characters) and merging two adjacent operations of the same type (insert 'A' followed by insert 'B' is merged to be a single insert 'AB' operation). But you should not have to worry about these cases since the old Delta format had similar optimizations.
