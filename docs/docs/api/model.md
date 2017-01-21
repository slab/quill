## Blots

### find <span class="experimental">experimental</span>

Static method returning the Quill or Blot instance for the given DOM node. In the latter case, passing in true for the `bubble` parameter will search up the given DOM's ancestors until it finds a corresponding Blot.

**Methods**

```javascript
Quill.find(domNode: Node, bubble: boolean = false): Blot | Quill
```

**Examples**

```javascript
var container = document.querySelector("#container");
var quill = new Quill(container);
console.log(Quill.find(container) === quill);   // Should be true

quill.insertText(0, 'Hello', 'link', 'https://world.com');
var linkNode = document.querySelector('#container a');
var linkBlot = Quill.find(link);
```

### getIndex <span class="experimental">experimental</span>


### getLeaf <span class="experimental">experimental</span>


### getLine <span class="experimental">experimental</span>


### getLines <span class="experimental">experimental</span>
