---
layout: docs
title: Designing the Delta Format
permalink: /guides/designing-the-delta-format/
redirect_from:
  - /docs/api/deltas/
  - /guides/working-with-deltas/
---

Rich text editors lack a specification to express its own contents. Until recently, most rich text editors did not even know what was in their own edit areas. These editors just pass the user HTML, along with the burden of parsing and interpretting this. At any given time, this interpretation will differ from those of major browser vendors, leading to different editing experiences for users.

Quill is the first rich text editor to actually understand its own contents. Key to this is Deltas, the specification describing rich text. Deltas are designed to be easy to understand and use. We will walk through some of the thinking behind Deltas, to shed light on *why* things are the way they are.

If you are looking for a reference on *what* Deltas are, the [Delta documentation](/docs/delta/) is a more concise resource.


## Plain Text

Let's start at the basics with just plain text. There already is a ubiquitous format to store plain text: the string. Now if we want to build upon this and describe formatted text, such as when a range is bold, we need to add additional information.

Arrays are the only other ordered data type available, so we use an array of objects. This also allows us to leverage JSON for compatibility with a breadth of tools.

```javascript
var content = [
  { text: 'Hello' },
  { text: 'World', bold: true }
];
```

We can add italics, underline, and other formats to the main object if we want to; but it is cleaner to separate `text` from all of this so we organize formatting under one field, which we will name `attributes`.

```javascript
var content = [
  { text: 'Hello' },
  { text: 'World', attributes: { bold: true } }
];
```


### Compact

Even with our simple Delta format so far, it is unpredictable since the above "Hello World" example can be represented differently, so we cannot predict which will be generated:

```javascript
var content = [
  { text: 'Hel' },
  { text: 'lo' },
  { text: 'World', attributes: { bold: true } }
];
```

To solve this, we add the constraint that Deltas must be compact. With this constraint, the above representation is not a valid Delta, since it can be represented more compactly by the previous example, where "Hel" and "lo" were not separate. Similarly we cannot have `{ bold: false, italic: true, underline: null }`, because `{ italic: true }` is more compact.


### Canonical

We have not assigned any meaning to `bold`, just that it describes some formatting for text. We could very well have used different names, such as `weighted` or `strong`, or used a different range of possible values, such as a numerical or descriptive range of weights. An example can be found in CSS, where most of these ambiguities are at play. If we saw bolded text on a page, we cannot predict if its rule set is `font-weight: bold` or `font-weight: 700`. This makes the task of parsing CSS to discern its meaning, much more complex.

We do not define the set of possible attributes, nor their meanings, but we do add an additional constraint that Deltas must be canonical. If two Deltas are equal, the content they represent must be equal, and there cannot be two unequal Deltas that represent the same content. Programmatically, this allows you to simply deep compare two Deltas to determine if the content they represent is equal.

So if we had the following, the only conclusion we can draw is `a` is different from `b`, but not what `a` or `b` means.

```javascript
var content = [{
  text: "Mystery",
  attributes: {
    a: true,
    b: true
  }
];
```

It is up to the implementer to pick appropriate names:

```javascript
var content = [{
  text: "Mystery",
  attributes: {
    italic: true,
    bold: true
  }
];
```

This canonicalization applies to both keys and values, `text` and `attributes`. For example, Quill by default:

- Uses six character hex values to represent colors and not RGB
- There is only one way to represent a newline which is with `\n`, not `\r` or `\r\n`
- <code>text: "Hello&nbsp;&nbsp;World"</code> unambiguously means there are precisely two spaces between "Hello" and "World"

Some of these choices may be customized by the user, but the canonical constraint in Deltas dictate that the choice must be unique.

This unambiguous predictability makes Deltas easier to work with, both because you have fewer cases to handle and because there are no surprises in what a corresponding Delta will look like. Long term, this makes applications using Deltas easier to understand and maintain.


## Line Formatting

Line formats affect the contents of an entire line, so they present an interesting challenge for our compact and canonical constraints. A seemingly reasonable way to represent centered text would be the following:

```javascript
var content = [
  { text: "Hello", attributes: { align: "center" } },
  { text: "\nWorld" }
];
```

But what if the user deletes the newline character? If we just naively get rid of the newline character, the Delta would now look like this:

```javascript
var content = [
  { text: "Hello", attributes: { align: "center" } },
  { text: "World" }
];
```

Is this line still centered? If the answer is no, then our representation is not compact, since we do not need the attribute object and can combine the two strings:

```javascript
var content = [
  { text: "HelloWorld" }
];
```

But if the answer is yes, then we violate the canonical constraint since any permutation of characters having an align attribute would represent the same content.

So we cannot just naively get rid of the newline character. We also have to either get rid of line attributes, or expand them to fill all characters on the line.

What if we removed the newline from the following?

```javascript
var content = [
  { text: "Hello", attributes: { align: "center" } },
  { text: "\n" },
  { text: "World", attributes: { align: "right" } }
];
```

It is not clear if our resulting line is aligned center or right. We could delete both or have some ordering rule to favor one over the other, but our Delta is becoming more complex and harder to work with on this path.

This problem begs for atomicity, and we find this in the *newline* character itself. But we have an off by one problem in that if we have *n* lines, we only have *n-1* newline characters.

To solve this, Quill "adds" a newline to all documents and always ends Deltas with "\n".

```javascript
// Hello World on two lines
var content = [
  { text: "Hello" },
  { text: "\n", attributes: { align: "center" } },
  { text: "World" },
  { text: "\n", attributes: { align: "right" } }   // Deltas must end with newline
];
```


## Embedded Content

We want to add embedded content like images or video. Strings were natural to use for text but we have a lot more options for embeds. Since there are different types of embeds, our choice just needs to include this type information, and then the actual content. There are many reasonable options here but we will use an object whose only key is the embed type and the value is the content representation, which may have any type or value.

```javascript
var img = {
  image: {
    url: 'https://quilljs.com/logo.png'
  }
};

var f = {
  formula: 'e=mc^2'
};
```

Similar to text, images might have some defining characteristics, and some transient ones. We used `attributes` for text content and can use the same `attributes` field for images. But because of this, we can keep the general structure we have been using, but should rename our `text` key into something more general. For reasons we will explore later, we will choose the name `insert`. Putting this all together we have:

```javascript
var content = [{
  insert: 'Hello'
}, {
  insert: 'World',
  attributes: { bold: true }
}, {
  insert: {
    image: 'https://exclamation.com/mark.png'
  },
  attributes: { width: '100' }
}];
```


## Describing Changes

As the name Delta implies, our format can describe changes to documents, as well as documents themselves. In fact we can think of documents as the changes we would make to the empty document, to get to the one we are describing. As you might have already guessed, using Deltas to also describe changes is why we renamed `text` to `insert` earlier. We call each element in our Delta array an Operation.

#### Delete

To describe deleting text, we need to know where and how many characters to delete. To delete embeds, there needs not be any special treatment, other than to understand the length of an embed. If it is anything other than one, we would then need to specify what happens when only part of an embed is deleted. There is currently no such specification, so regardless of how many pixels make up an image, how many minutes long a video is, or how many slides are in a deck; embeds are all of length **one**.

One reasonable way to describe a deletion is to explicitly store its index and length.

```javascript
var delta = [{
  delete: {
    index: 4,
    length: 1
  }
}, {
  delete: {
    index: 12,
    length: 3
  }
}];
```

We would have to order the deletions based on indexes, and ensure no ranges overlap, otherwise our canonical constraint would be violated. There are a couple other shortcomings to this index and length approach, but they are easier to appreciate after describing format changes.

#### Insert

Now that Deltas may be describing changes to a non-empty document, `{ insert: "Hello" }` is insufficient, because we do not know where "Hello" should be inserted. We can solve this by also adding an index, similar to `delete`.

#### Format

Similar to deletes, we need to specify the range of text to format, along with the format change itself. Formatting exists in the `attributes` object, so a simple solution is to provide an additional `attributes` object to merge with the existing one. This merge is shallow to keep things simple. We have not found a use case that is compelling enough to require a deep merge and warrants the added complexity.

```javascript
var delta = [{
  format: {
    index: 4,
    length: 1
  },
  attributes: {
    bold: true
  }
}];
```

The special case is when we want to remove formatting. We will use `null` for this purpose, so `{ bold: null }` would mean remove the bold format. We could have specified any falsy value, but there may be legitimate use cases for an attribute value to be `0` or the empty string.

**Note:** We now have to be careful with indexes at the application layer. As mentioned earlier, Deltas do not ascribe any inherent meaning to any the `attributes`' key-value pairs, nor any embed types or values. Deltas do not know an image does not have duration, text does not have alternative texts, and videos cannot be bolded. The following is a *legal* Delta that might have been the result of applying other *legal* Deltas, by an application not being careful of format ranges.

```javascript
var delta = [{
  insert: {
    image: "https://imgur.com/"
  },
  attributes: {
    duration: 600
  }
}, {
  insert: "Hello",
  attributes: {
    alt: "Funny cat photo"
  }
}, {
  insert: {
    video: "https://youtube.com/"
  },
  attributes: {
    bold: true
  }
}];
```

#### Pitfalls

First, we should be clear that an index must refer to its position in the document **before** any Operations are applied. Otherwise, a later Operation may delete a previous insert, unformat a previous format, etc., which would violate compactness.

Operations must also be strictly ordered to satisfy our canonical constraint. Ordering by index, then length, and then type is one valid way this can be accomplished.

As stated earlier, delete ranges cannot overlap. The case against overlapping format ranges is less brief, but it turns out we do not want overlapping formats either.

The number of reasons a Delta might be invalid is piling up. A better format would simply not allow such cases to be expressed at all.

#### Retain

If we step back from our compactness formalities for a moment, we can describe a much simpler format to express inserting, deleting, and formatting:

- A Delta would have Operations that are at least as long as the document being modified.
- Each Operation would describe what happens to the character at that index.
- Optional insert Operations may make the Delta longer than the document it describes.

This necessitates the creation of a new Operation, that will simply mean "keep this character as is". We call this a `retain`.

```javascript
// Starting with "HelloWorld",
// bold "Hello", and insert a space right after it
var change = [
  { format: true, attributes: { bold: true } },  // H
  { format: true, attributes: { bold: true } },  // e
  { format: true, attributes: { bold: true } },  // l
  { format: true, attributes: { bold: true } },  // l
  { format: true, attributes: { bold: true } },  // o
  { insert: ' ' },
  { retain: true },  // W
  { retain: true },  // o
  { retain: true },  // r
  { retain: true },  // l
  { retain: true }   // d
]
```

Since every character is described, explicit indexes and lengths are no longer necessary. This makes overlapping ranges and out-of-order indexes impossible to express.

Therefore, we can make the easy optimization to merge adjacent equal Operations, re-introducing *length*. If the last Operation is a `retain` we can simply drop it, for it simply instructs to "do nothing to the rest of the document".

```javascript
var change = [
  { format: 5, attributes: { bold: true } }
  { insert: ' ' }
]
```

Furthermore, you might notice that a `retain` is in some ways just a special case of `format`. For instance, there is no practical difference between `{ format: 1, attributes: {} }` and `{ retain: 1 }`. Compacting would drop the empty `attributes` object leaving us with just `{ format: 1 }`, creating a canonicalization conflict. Thus, in our example we will simply combine `format` and `retain`, and keep the name `retain`.

```javascript
var change = [
  { retain: 5, attributes: { bold: true } },
  { insert: ' ' }
]
```

We now have a Delta that is very close to the current standard format.

#### Ops

Right now we have an easy to use JSON Array that describes rich text. This is great at the storage and transport layers, but applications could benefit from more functionality. We can add this by implementing Deltas as a class, that can be easily initialized from or exported to JSON, and then providing it with relevant methods.

At the time of Delta's inception, it was not possible to sub-class an Array. For this reason Deltas are expressed as Objects, with a single property `ops` that stores an array of Operations like the ones we have been discussing.

```javascript
var delta = {
  ops: [{
    insert: 'Hello'
  }, {
    insert: 'World',
    attributes: { bold: true }
  }, {
    insert: {
    image: 'https://exclamation.com/mark.png'
    },
    attributes: { width: '100' }
  }]
};
```

Finally, we arrive at the [Delta format](/docs/delta/), as it exists today.
