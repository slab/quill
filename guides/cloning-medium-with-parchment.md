---
layout: guide
title: Cloning Medium with Parchment
permalink: /guides/cloning-medium-with-parchment/
---

To provide a consistent editing experience, you need consistent data and predictable behaviors. The DOM is unfortunately lacking on both of these to be a high quality data store. The solution for modern editors is to maintain its own document model to represent its contents. [Parchment](https://github.com/quilljs/quill) is that solution for Quill. It is organized in its own codebase with its own API layer. Through Parchment, you can customize the content and formats Quill recognizes, or add entirely new ones.

In this guide, we will use the building blocks provided by Parchment and Quill to replicate the editor on Medium. We will to start with the bare bones of Quill, without any themes, extraneous modules, or formats. At this basic level, Quill only understand plain text. But by the end of this guide, links, videos, and even Tweets will be understood.


### Groundwork

Let's start without even using Quill, with just a textarea and button, hooked up to a dummy event listener. We'll use jQuery for convenience throughout this guide, but neither Quill nor Parchment depends on this. We'll also add some basic styling, with the help of [Google Fonts](https://fonts.google.com/) and [Font Awesome](http://fontawesome.io/). None of this has anything to do with Quill or Parchment, so we'll move through quickly.

<div data-height="400" data-theme-id="23269" data-slug-hash="oLVAKZ" data-default-tab="result" data-embed-version="2" class="codepen"></div>


### Adding Quill Core

Next, we'll replace the textarea with Quill core, absent of themes, formats and extraneous modules. Open up your developer console to inspect the demo while you type into the editor. You can see the basic building blocks of a Parchment document at work.

<div data-height="400" data-theme-id="23269" data-slug-hash="QEoZQb" data-default-tab="result" data-embed-version="2" class="codepen"></div>

Like the DOM, a Parchment document is a tree. Its nodes, called Blots, are an abstraction over DOM Nodes. A few blots are already defined for us: Block, Inline, Text and Break. As you type, a Text blots is synchronized with the corresponding DOM Text node. Enters are handled by creating a new Block blot and filling it with a Break blot, if no text is present. In Parchment, Blots that can have children must, so empty lines are filled with a Break blot. This makes handling leaves simple and predictable.

You cannot observe an Inline blot by just typing at this point since it does not contribute meaningful structure or formatting to the document. A valid Quill document must be canonical and compact. There is only one valid DOM tree that can represent a given document, and that DOM tree contains the minimal number of nodes.

Since `<p><span>Text</span></p>` and `<p>Text</p>` represent the same content, the former is invalid and it is part of Quill's optimization process to unwrap the `<span>`. Similarly, once we add formatting, `<p><em>Te</em><em>st</em></p>` and `<p><em><em>Test</em></em></p>` are also invalid.

Because of these contraints, Quill cannot support arbitrary DOM trees and HTML changes. But as we will see, the rigor this structure provides enables us to build rich editing experiences on top of consistent and predictable behaviors.


### Basic Formatting

We mentioned earlier that an Inline does not contribute formatting. This is the exception, rather than the rule, made for the base Inline class. The base Block blot works the same way for block level elements.

To implement bold and italic, we only need to inherit from Inline, and set the `blotName` and `tagName`, and register it with Quill.

```js
let Inline = Quill.import('blots/inline');

class BoldBlot extends Inline { }
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'strong';

class ItalicBlot extends Inline { }
ItalicBlot.blotName = 'italic';
ItalicBlot.tagName = 'em';

Quill.register(BoldBlot);
Quill.register(ItalicBlot);
```

Let's get rid of our dummy button handler and hook up the bold and italic buttons to Quill's `format()`. We will hardcode `true` to always add formatting for simplicity. In your application, you will can use `getFormat()` to get the current formatting over a arbitrary range to decide whether to add or remove a format. The [Toolbar](/docs/modules/toolbar/) module implements this for Quill, and we will not reimplement it here.

<div data-height="400" data-theme-id="23269" data-slug-hash="VjRovy" data-default-tab="result" data-embed-version="2" class="codepen"></div>

Note that if you apply both bold and italic to some text, regardless of what order you do so, Quill wraps the `<strong>` tag outside of the `<em>` tag, in a consistent order.


### Links

Links are slightly more complicated, since we need to store not only that some text is linked, we need to store the url to where. This affects our Link blot in two ways: creation and format retrieval. We will represent the url as a string value, but we could easily do so in other ways, such as an object with a url key, allowing for other key/value pairs to be set and define a link.

```js
class LinkBlot extends Inline {
  static create(value) {
    let node = super.create();
    // Sanitize url if desired
    node.setAttribute('href', value);
    // Okay to set other non-format related attributes
    node.setAttribute('target', '_blank');
    return node;
  }

  static formats(node) {
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    return node.getAttribute('href');
  }
}
LinkBlot.blotName = 'link';
LinkBlot.tagName = 'a';

Quill.register(LinkBlot);
```

Now we can hook our link button up to a fancy `prompt`, again to keep things simple, before passing to Quill's `format()`.

<div data-height="400" data-theme-id="23269" data-slug-hash="oLVKRa" data-default-tab="result" data-embed-version="2" class="codepen"></div>


### Blockquote and Headers

Blockquotes are implemented the same way as Bold blots, except we will inherit from Block, the base block level Blot.

```js
let Block = Quill.import('blots/block');

class BlockquoteBlot extends Block { }
BlockquoteBlot.blotName = 'blockquote';
BlockquoteBlot.tagName = 'blockquote';
```

Headers are implemented exactly like blockquotes, with only one difference: it can be represented by more than one DOM element. The value of the format by default becomes the tagName, instead of just `true`. We can customize this similar to how we did so for Links.

```js
class HeaderBlot extends Block {
  static formats(node) {
    return HeaderBlot.tagName.indexOf(node.tagName) + 1;
  }
}
HeaderBlot.blotName = 'header';
HeaderBlot.tagName = ['H1', 'H2'];
// Medium only supports two header sizes, so we will only demonstrate two,
// but we could easily just add more tags into this array
HeaderBlot.tagName = ['H1', 'H2'];
```

Let's hook these new blots up to their respective buttons and add some CSS. Unlike Inline blots which wrap, Block blots are exclusive over a range.

<div data-height="400" data-theme-id="23269" data-slug-hash="NAmKAR" data-default-tab="result" data-embed-version="2" class="codepen"></div>

Try setting some text to H1, and in your console, run `quill.getContents()`. You will see our custom static `formats()` function at work. Make sure to set the context to the correct CodePen iframe to be able to access the `quill` variable in the demo.


### Images and Dividers

Now let's implement our first leaf Blot. Parchment leaves are either Text or Embeds, so our section divider will be an embed. The methodology is the same as before, except we inherit from an EmbedBlock. Embed also exists, but is an inline class, so we want the block level implementation instead.

```js
let BlockEmbed = Quill.import('blots/block/embed');

class DividerBlot extends BlockEmbed { }
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';
```

Images can be added with what we learned building Link and Divider blots. We will use an object for the value to show how this is supported.

```js
class ImageBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute('alt', value.alt);
    node.setAttribute('src', value.url);
    return node;
  }

  static value(node) {
    return {
      alt: node.getAttribute('alt'),
      url: node.getAttribute('src')
    };
  }
}
ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';
```

We add some CSS styling for our new Divider blot and attach the appropriate button. The click handler calls `insertEmbed()` instead of `format()`, which does not as convienently determine, save and restore the user selection for us like `format()` does, so we have to do a little more work.

<div data-height="400" data-theme-id="23269" data-slug-hash="QEPLrv" data-default-tab="result" data-embed-version="2" class="codepen"></div>


### Videos

We will implement videos the same way as we did images, but additionally it will also understand widths and heights, as a format.

```js
class VideoBlot extends BlockEmbed {
  static create(url) {
    let node = super.create();
    node.setAttribute('src', url);
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', true);
    return node;
  }

  static value(node) {
    return node.getAttribute('src');
  }

  format(name, value) {
    if (name === 'height' || name === 'width') {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name, value);
      }
    } else {
      super.format(name, value);
    }
  }
}
VideoBlot.blotName = 'video';
VideoBlot.tagName = 'iframe';
```

<div data-height="400" data-theme-id="23269" data-slug-hash="qNwWzW" data-default-tab="result" data-embed-version="2" class="codepen"></div>


### Tweets

Medium supports many embed types, but we will just focus on Tweets for this guide. It is exactly the same as Images except it illustrates that Embeds do not have to correspond to a DOM void node. It can be any arbitrary node and Quill will treat it like a void node and not traverse its children or descendants. This allows the Twitter plugin to do what it pleases within the container we specify. We also add a `className` so Tweet blots do not match on all `<div>` nodes. We use the Tweet id as our value.

```js
class TweetBlot extends BlockEmbed {
  static create(id) {
    let node = super.create();
    node.dataset.id = id;
    twttr.widgets.createTweet(id, node);
    return node;
  }

  static value(domNode) {
    return domNode.dataset.id;
  }
}
TweetBlot.blotName = 'tweet';
TweetBlot.tagName = 'div';
TweetBlot.className = 'tweet';
```

<div data-height="400" data-theme-id="23269" data-slug-hash="vKrBjE" data-default-tab="result" data-embed-version="2" class="codepen"></div>


### Final Polish

Let's add some final polish to our demo. It won't compare to Medium's UI, but we'll try to get close enough for a demo.

<div data-height="400" data-theme-id="23269" data-slug-hash="qNJrYB" data-default-tab="result" data-embed-version="2" class="codepen"></div>


<!-- script -->
<script src="//codepen.io/assets/embed/ei.js" type="text/javascript"></script>
<!-- script -->
