---
layout: v1.0-docs
title: Clipboard Module
permalink: /1.0/docs/modules/clipboard/
---

The Clipboard handles copy, cut and paste between Quill and external applications. A set of defaults exist to provide sane interpretation of pasted content, with the ability for further customization through matchers.

The Clipboard interprets pasted HTML by traversing the corresponding DOM tree in [post-order](https://en.wikipedia.org/wiki/Tree_traversal#Post-order), building up a [Delta](/1.0/docs/delta/) representation of all subtrees. At each descendant node, matcher functions are called with the DOM Node and Delta interpretation so far, allowing the matcher to return a modified Delta interpretation.

Familiarity and comfort with [Deltas](/1.0/docs/delta/) is necessary in order to effectively use matchers.


## API

#### addMatcher

Adds a custom matcher to the Clipboard. Matchers using `nodeType` are called first, in the order they were added, followed by matchers using a CSS `selector`, also in the order they were added. [`nodeType`](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType) may be `Node.ELEMENT_NODE` or `Node.TEXT_NODE`.

**Methods**

```javascript
addMatcher(selector: String, (node: Node, delta: Delta) => Delta)
addMatcher(nodeType: Number, (node: Node, delta: Delta) => Delta)
```

**Examples**

```javascript
quill.clipboard.addMatcher(Node.TEXT_NODE, function(node, delta) {
  return new Delta().insert(node.data);
});

// Interpret a <b> tag as bold
quill.clipboard.addMatcher('B', function(node, delta) {
  return delta.compose(new Delta().retain(delta.length(), { bold: true }));
});
```

### dangerouslyPasteHTML

Inserts content represented by HTML snippet into editor at a given index. The snippet is interpreted by Clipboard [matchers](#addMatcher), which may not produce the exactly input HTML. If no insertion index is provided, the entire editor contents will be overwritten. The [source](/1.0/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`.

Improper handling of HTML can lead to [cross site scripting (XSS)](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)) and failure to sanitize properly is both notoriously error-prone and a leading cause of web vulnerabilities. This method follows React's example and is aptly named to ensure the developer has taken the necessary precautions.

**Methods**

```javascript
dangerouslyPasteHTML(html: String, source: String = 'api')
dangerouslyPasteHTML(index: Number, html: String, source: String = 'api')
```

**Examples**

```javascript
quill.setText('Hello!');

quill.clipboard.dangerouslyPasteHTML(5, '&nbsp;<b>World</b>');
// Editor is now '<p>Hello&nbsp;<strong>World</strong>!</p>';
```


## Configuration

### matchers

An array of matchers can be passed into Clipboard's configuration options. These will be appended after Quill's own default matchers.

```javascript
var quill = new Quill('#editor', {
  modules: {
    clipboard: {
      matchers: [
        ['B', customMatcherA],
        [Node.TEXT_NODE, customMatcherB]
      ]
    }
  }
});
```
