---
layout: docs
title: Deltas
permalink: /docs/deltas/
redirect_from: /docs/editor/deltas/
---

# Deltas

Quill uses the [rich text](https://github.com/ottypes/rich-text) format to represent the editor's contents, as well as changes to those contents. In most cases directly dealing with Deltas can be avoided. But it is available to provide a powerful interface to Quill.

A Delta representing the editor's contents looks something like this:

{% highlight javascript %}
{
  ops:[
    { insert: 'Gandalf', attributes: { bold: true } },
    { insert: ' the ' },
    { insert: 'Grey', attributes: { color: '#ccc' } }
  ]
)
{% endhighlight %}

A change looks something like this:

{% highlight javascript %}
{
  ops: [
    { retain: 12 },
    { delete: '4 ' },
    { insert: 'White', attributes: { color: '#fff' } }
  ]
}
{% endhighlight %}

Note there's really no difference between the two; the contents representation is simply the change from an empty document.


## Operations

Operations describe a singular change. They can be an [insert](#insert), [delete](#delete) or [retain](#retain). Note operations do not take an index. They always describe the change at the current index. Use retains to "keep" or "skip" certain parts of the document.

### Insert

Insert operations have an `insert` key defined. A String value represents inserting text. A Number value represents inserting an embed, with the value corresponding to an embed type (such as an image or video).

Quill recognizes the following embed types:

{% highlight javascript %}
{
  image: 1
}
{% endhighlight %}

In both cases of text and embeds, an optional `attributes` key can be defined with an Object to describe additonal formatting information. A format on the newline character describes the format for the line. Formats can be changed by the [retain](#retain) operation.

{% highlight javascript %}
// Insert a bolded "Text"
{ insert: "Text", attributes: { bold: true } }

// Insert a link
{ insert: "Google", attributes: { link: 'https://www.google.com' } }

// Insert an image
{
  insert: 1,
  attributes: {
    image: 'https://octodex.github.com/images/labtocat.png'
  }
}

// Aligned text example
{
  ops:[
    { insert: 'Right align' },
    { insert: '\n', attributes: { align: 'right' } },
    { insert: 'Center align' },
    { insert: '\n', attributes: { align: 'center' } }
  ]
)
{% endhighlight %}

### Delete

Delete operations have a Number `delete` key defined representing the number of characters to delete. All embeds have a length of 1.

{% highlight javascript %}
// Delete the next 10 characters
{ delete: 10 }
{% endhighlight %}

### Retain

Retain operations have a Number `retain` key defined representing the number of characters to keep (other libraries might use the name keep or skip). An optional `attributes` key can be defined with an Object to describe formatting changes to the character range. A value of null in the `attributes` Object represents removal of that key.

*Note: It is not necessary to retain the last characters of a document as this is implied.*

{% highlight javascript %}
// Keep the next 5 characters
{ retain: 5 }

// Keep and bold the next 5 characters
{ retain: 5, attributes: { bold: true } }

// Keep and unbold the next 5 characters
// More specifically, remove the bold key in the attributes Object
// in the next 5 characters
{ retain: 5, attributes: { bold: null } }
{% endhighlight %}
