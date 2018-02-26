---
layout: docs
title: Cloning Medium with Parchment
permalink: /guides/cloning-medium-with-parchment/
redirect_from:
  - /docs/parchment/
  - /guides/building-on-parchment/
---
<!-- head -->
<style>
.codepen {
  height: 408px;
}
</style>
<!-- head -->

To provide a consistent editing experience, you need both consistent data and predictable behaviors. The DOM unfortunately lacks both of these. The solution for modern editors is to maintain their own document model to represent their contents. [Parchment](https://github.com/quilljs/parchment/) is that solution for Quill. It is organized in its own codebase with its own API layer. Through Parchment you can customize the content and formats Quill recognizes, or add entirely new ones.

In this guide, we will use the building blocks provided by Parchment and Quill to replicate the editor on Medium. We will start with the bare bones of Quill, without any themes, extraneous modules, or formats. At this basic level, Quill only understands plain text. But by the end of this guide, links, videos, and even tweets will be understood.


### Groundwork

Let's start without even using Quill, with just a textarea and button, hooked up to a dummy event listener. We'll use jQuery for convenience throughout this guide, but neither Quill nor Parchment depends on this. We'll also add some basic styling, with the help of [Google Fonts](https://fonts.google.com/) and [Font Awesome](https://fontawesome.io/). None of this has anything to do with Quill or Parchment, so we'll move through quickly.

<div data-height="400" data-theme-id="23269" data-slug-hash="oLVAKZ" data-default-tab="result" data-embed-version="2" class="codepen"></div>


### Adding Quill Core

Next, we'll replace the textarea with Quill core, absent of themes, formats and extraneous modules. Open up your developer console to inspect the demo while you type into the editor. You can see the basic building blocks of a Parchment document at work.

<div data-height="400" data-theme-id="23269" data-slug-hash="QEoZQb" data-default-tab="result" data-embed-version="2" class="codepen"></div>

Like the DOM, a Parchment document is a tree. Its nodes, called Blots, are an abstraction over DOM Nodes. A few blots are already defined for us: Scroll, Block, Inline, Text and Break. As you type, a Text blot is synchronized with the corresponding DOM Text node; enters are handled by creating a new Block blot. In Parchment, Blots that can have children must have at least one child, so empty Blocks are filled with a Break blot. This makes handling leaves simple and predictable. All this is organized under a root Scroll blot.

You cannot observe an Inline blot by just typing at this point since it does not contribute meaningful structure or formatting to the document. A valid Quill document must be canonical and compact. There is only one valid DOM tree that can represent a given document, and that DOM tree contains the minimal number of nodes.

Since `<p><span>Text</span></p>` and `<p>Text</p>` represent the same content, the former is invalid and it is part of Quill's optimization process to unwrap the `<span>`. Similarly, once we add formatting, `<p><em>Te</em><em>st</em></p>` and `<p><em><em>Test</em></em></p>` are also invalid, as they are not the most compact representation.

Because of these contraints, **Quill cannot support arbitrary DOM trees and HTML changes**. But as we will see, the consistency and predicability this structure provides enables us to easily build rich editing experiences.


### Basic Formatting

We mentioned earlier that an Inline does not contribute formatting. This is the exception, rather than the rule, made for the base Inline class. The base Block blot works the same way for block level elements.

To implement bold and italics, we need only to inherit from Inline, set the `blotName` and `tagName`, and register it with Quill. For a compelete reference of the signatures of inherited and static methods and variables, take a look at [Parchment](https://github.com/quilljs/parchment/).

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

We follow Medium's example here in using `strong` and `em` tags but you could just as well use `b` and `i` tags. The name of the blot will be used as the name of the format by Quill. By registering our blots, we can now use Quill's full API on our new formats:

```js
Quill.register(BoldBlot);
Quill.register(ItalicBlot);

var quill = new Quill('#editor');

quill.insertText(0, 'Test', { bold: true });
quill.formatText(0, 4, 'italic', true);
// If we named our italic blot "myitalic", we would call
// quill.formatText(0, 4, 'myitalic', true);
```

Let's get rid of our dummy button handler and hook up the bold and italic buttons to Quill's [`format()`](/docs/api/#format). We will hardcode `true` to always add formatting for simplicity. In your application, you can use [`getFormat()`](/docs/api/#getformat) to retrieve the current formatting over a arbitrary range to decide whether to add or remove a format. The [Toolbar](/docs/modules/toolbar/) module implements this for Quill, and we will not reimplement it here.

Open your developer console and try out Quill's [APIs](/docs/api/) on your new bold and italic formats! Make sure to set the context to the correct CodePen iframe to be able to access the `quill` variable in the demo.

<div data-height="400" data-theme-id="23269" data-slug-hash="VjRovy" data-default-tab="result" data-embed-version="2" class="codepen"></div>

Note that if you apply both bold and italic to some text, regardless of what order you do so, Quill wraps the `<strong>` tag outside of the `<em>` tag, in a consistent order.


### Links

Links are slightly more complicated, since we need more than a boolean to store the link url. This affects our Link blot in two ways: creation and format retrieval. We will represent the url as a string value, but we could easily do so in other ways, such as an object with a url key, allowing for other key/value pairs to be set and define a link. We will demonstrate this later with [images](#images).

```js
class LinkBlot extends Inline {
  static create(value) {
    let node = super.create();
    // Sanitize url value if desired
    node.setAttribute('href', value);
    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
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

Blockquotes are implemented the same way as Bold blots, except we will inherit from Block, the base block level Blot. While Inline blots can be nested, Block blots cannot. Instead of wrapping, Block blots replace one another when applied to the same text range.

```js
let Block = Quill.import('blots/block');

class BlockquoteBlot extends Block { }
BlockquoteBlot.blotName = 'blockquote';
BlockquoteBlot.tagName = 'blockquote';
```

Headers are implemented exactly the same way, with only one difference: it can be represented by more than one DOM element. The value of the format by default becomes the tagName, instead of just `true`. We can customize this by extending `formats()`, similar to how we did so for [links](#links).

```js
class HeaderBlot extends Block {
  static formats(node) {
    return HeaderBlot.tagName.indexOf(node.tagName) + 1;
  }
}
HeaderBlot.blotName = 'header';
// Medium only supports two header sizes, so we will only demonstrate two,
// but we could easily just add more tags into this array
HeaderBlot.tagName = ['H1', 'H2'];
```

Let's hook these new blots up to their respective buttons and add some CSS for the `<blockquote>` tag.

<div data-height="400" data-theme-id="23269" data-slug-hash="NAmKAR" data-default-tab="result" data-embed-version="2" class="codepen"></div>

Try setting some text to H1, and in your console, run `quill.getContents()`. You will see our custom static `formats()` function at work. Make sure to set the context to the correct CodePen iframe to be able to access the `quill` variable in the demo.


### Dividers

Now let's implement our first leaf Blot. While our previous Blot examples contribute formatting and implement `format()`, leaf Blots contribute content and implement `value()`. Leaf Blots can either be Text or Embed Blots, so our section divider will be an Embed. Once created, Embed Blots' value is immutable, requiring deletion and reinsertion to change the content at that location.

Our methodology is similar to before, except we inherit from a BlockEmbed. Embed also exists under `blots/embed`, but is meant for inline level blots. We want the block level implementation instead for dividers.

```js
let BlockEmbed = Quill.import('blots/block/embed');

class DividerBlot extends BlockEmbed { }
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';
```

Our click handler calls [`insertEmbed()`](/docs/api/#insertembed), which does not as convienently determine, save, and restore the user selection for us like [`format()`](/docs/api/#format) does, so we have to do a little more work to preserve selection ourselves. In addition, when we try to insert a BlockEmbed in the middle of the Block, Quill splits the Block for us. To make this behavior more clear, we will explicitly split the block oursevles by inserting a newline before inserting the divider. Take a look at the Babel tab in the CodePen for specifics.

<div data-height="400" data-theme-id="23269" data-slug-hash="QEPLrv" data-default-tab="result" data-embed-version="2" class="codepen"></div>


### Images

Images can be added with what we learned building the [Link](#links) and [Divider](#divider) blots. We will use an object for the value to show how this is supported. Our button handler to insert images will use a static value, so we are not distracted by tooltip UI code irrelevant to [Parchment](https://github.com/quilljs/parchment/), the focus of this guide.

```js
let BlockEmbed = Quill.import('blots/block/embed');

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

<div data-height="400" data-theme-id="23269" data-slug-hash="Pzggmy" data-default-tab="result" data-embed-version="2" class="codepen"></div>


### Videos

We will implement videos in a similar way as we did [images](#images). We could use the HTML5 `<video>` tag but we cannot play YouTube videos this way, and since this is likely the more common and relevant use case, we will use an `<iframe>` to support this. We do not have to here, but if you want multiple Blots to use the same tag, you can use `className` in addition to `tagName`, demonstrated in the next [Tweet](#tweet) example.

Additionally we will add support for widths and heights, as unregistered formats. Formats specific to Embeds do not have to be registered separately, as long as there is no namespace collision with registered formats. This works since Blots just pass unknown formats to its children, eventually reaching the leaves. This also allows different Embeds to handle unregistered formats differently. For example, our [image](#images) embed from earlier could have recognized and handled the `width` format differently than our video does here.

```js
class VideoBlot extends BlockEmbed {
  static create(url) {
    let node = super.create();

    // Set non-format related attributes with static values
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', true);

    return node;
  }

  static formats(node) {
    // We still need to report unregistered embed formats
    let format = {};
    if (node.hasAttribute('height')) {
      format.height = node.getAttribute('height');
    }
    if (node.hasAttribute('width')) {
      format.width = node.getAttribute('width');
    }
    return format;
  }

  static value(node) {
    return node.getAttribute('src');
  }

  format(name, value) {
    // Handle unregistered embed formats
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

Note if you open your console and call [`getContents`](/docs/api/#getcontents), Quill will report the video as:

```js
{
  ops: [{
    insert: {
      video: {
        src: 'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0'
      }
    },
    attributes: {
      height: '170',
      width: '400'
    }
  }]
}
```

<div data-height="400" data-theme-id="23269" data-slug-hash="qNwWzW" data-default-tab="result" data-embed-version="2" class="codepen"></div>


### Tweets

Medium supports many embed types, but we will just focus on Tweets for this guide. The Tweet blot is implemented almost exactly the same as [images](#images). We take advantage of the fact that Embed blots do not have to correspond to a void node. It can be any arbitrary node and Quill will treat it like a void node and not traverse its children or descendants. This allows us to use a `<div>` and the native Twitter Javascript library to do what it pleases within the `<div>` container we specify.

Since our root Scroll Blot also uses a `<div>`, we also specify a `className` to disambiguate. Note Inline blots use `<span>` and Block Blots use `<p>` by default, so if you would like to use these tags for your custom Blots, you will have to specify a `className` in addition to a `tagName`.

We use the Tweet id as the value defining our Blot. Again our click handler uses a static value to avoid distraction from irrelevant UI code.

```js
class TweetBlot extends BlockEmbed {
  static create(id) {
    let node = super.create();
    node.dataset.id = id;
    // Allow twitter library to modify our contents
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

We began with just a bunch of buttons and a Quill core that just understands plaintext. With Parchment, we are able to add bold, italic, links, blockquotes, headers, section dividers, images, videos, and even Tweets. All of this comes while maintaining a predictable and consistent document, allowing us to use Quill's powerful [APIs](/docs/api/) with these new formats and content.

Let's add some final polish to finish off our demo. It won't compare to Medium's UI, but we'll try to get close.

<div data-height="400" data-theme-id="23269" data-slug-hash="qNJrYB" data-default-tab="result" data-embed-version="2" class="codepen"></div>


<!-- script -->
<script src="//codepen.io/assets/embed/ei.js"></script>
<!-- script -->
