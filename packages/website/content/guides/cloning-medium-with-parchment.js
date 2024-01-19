export const externalResources = [
  'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css',
  'https://fonts.googleapis.com/css?family=Open+Sans%3A300,400,600,700',
  'https://platform.twitter.com/widgets.js',
];

export const basicHTML = `
<link href="/styles.css" rel="stylesheet">

<div id="tooltip-controls">
  <button id="bold-button"><i class="fa fa-bold"></i></button>
  <button id="italic-button"><i class="fa fa-italic"></i></button>
  <button id="link-button"><i class="fa fa-link"></i></button>
  <button id="blockquote-button"><i class="fa fa-quote-right"></i></button>
  <button id="header-1-button"><i class="fa fa-header"><sub>1</sub></i></button>
  <button id="header-2-button"><i class="fa fa-header"><sub>2</sub></i></button>
</div>
<div id="sidebar-controls">
  <button id="image-button"><i class="fa fa-camera"></i></button>
  <button id="video-button"><i class="fa fa-play"></i></button>
  <button id="tweet-button"><i class="fa fa-twitter"></i></button>
  <button id="divider-button"><i class="fa fa-minus"></i></button>
</div>
`;

export const html = `
<link href="{{site.cdn}}/quill.core.css" rel="stylesheet" />
<script src="{{site.cdn}}/quill.core.js"></script>
${basicHTML}
<div id="editor">Tell your story...</div>

<script type="module" src="/index.js"></script>
`;

export const basicCSS = `
#editor {
  border: 1px solid #ccc;
  font-family: 'Open Sans', Helvetica, sans-serif;
  font-size: 1.2em;
  height: 180px;
  margin: 0 auto;
  width: 450px;
}

#tooltip-controls, #sidebar-controls {
  text-align: center;
}

button {
  background: transparent;
  border: none;
  cursor: pointer;
  display: inline-block;
  font-size: 18px;
  padding: 0;
  height: 32px;
  width: 32px;
  text-align: center;
}
button:active, button:focus {
  outline: none;
}
`;

export const boldBlot = `
const Inline = Quill.import('blots/inline');

class BoldBlot extends Inline {
  static blotName = 'bold';
  static tagName = 'strong';
}

Quill.register(BoldBlot);
`;

export const italicBlot = `
const Inline = Quill.import('blots/inline');

class ItalicBlot extends Inline {
  static blotName = 'italic';
  static tagName = 'em';
}

Quill.register(ItalicBlot);
`;

export const linkBlot = `
const Inline = Quill.import('blots/inline');

class LinkBlot extends Inline {
  static blotName = 'link';
  static tagName = 'a';

  static create(url) {
    let node = super.create();
    // Sanitize url if desired
    node.setAttribute('href', url);
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

Quill.register(LinkBlot);
`;

export const blockquoteBlot = `
const Block = Quill.import('blots/block');

class BlockquoteBlot extends Block {
  static blotName = 'blockquote';
  static tagName = 'blockquote';
}

Quill.register(BlockquoteBlot);
`;

export const headerBlot = `
const Block = Quill.import('blots/block');

class HeaderBlot extends Block {
  static blotName = 'header';
  static tagName = ['h1', 'h2'];
}

Quill.register(HeaderBlot);
`;

export const cssWithBlockquoteAndHeader = `
${basicCSS}

#editor h1 + p,
#editor h2 + p {
  margin-top: 0.5em; 
}
#editor blockquote {
  border-left: 4px solid #111;
  padding-left: 1em;
}
`;

export const dividerBlot = `
const BlockEmbed = Quill.import('blots/block/embed');

class DividerBlot extends BlockEmbed {
  static blotName = 'divider';
  static tagName = 'hr';
}

Quill.register(DividerBlot);
`;

export const imageBlot = `
const BlockEmbed = Quill.import('blots/block/embed');

class ImageBlot extends BlockEmbed {
  static blotName = 'image';
  static tagName = 'img';

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

Quill.register(ImageBlot);
`;

export const videoBlot = `
const BlockEmbed = Quill.import('blots/block/embed');

class VideoBlot extends BlockEmbed {
  static blotName = 'video';
  static tagName = 'iframe';

  static create(url) {
    let node = super.create();
    node.setAttribute('src', url);
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', true);
    return node;
  }
  
  static formats(node) {
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

Quill.register(VideoBlot);
`;

export const tweetBlot = `
const BlockEmbed = Quill.import('blots/block/embed');

class TweetBlot extends BlockEmbed {
  static blotName = 'tweet';
  static tagName = 'div';
  static className = 'tweet';

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

Quill.register(TweetBlot);
`;
