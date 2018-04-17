## Model

### find <span class="experimental">experimental</span> {#find-experimental}

Static method returning the Quill or [Blot](https://github.com/quilljs/parchment) instance for the given DOM node. In the latter case, passing in true for the `bubble` parameter will search up the given DOM's ancestors until it finds a corresponding [Blot](https://github.com/quilljs/parchment).

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
var linkBlot = Quill.find(linkNode);
```

### getIndex <span class="experimental">experimental</span> {#getindex-experimental}

Returns the distance between the beginning of document to the occurrence of the given [Blot](https://github.com/quilljs/parchment).

**Methods**

```javascript
getIndex(blot: Blot): Number
```

**Examples**

```javascript
let [line, offset] = quill.getLine(10);
let index = quill.getIndex(line);   // index + offset should == 10
```

### getLeaf <span class="experimental">experimental</span> {#getleaf-experimental}

Returns the leaf [Blot](https://github.com/quilljs/parchment) at the specified index within the document.

**Methods**

```javascript
getLeaf(index: Number): Blot
```

**Examples**

```javascript
quill.setText('Hello Good World!');
quill.formatText(6, 4, "bold", true);

let [leaf, offset] = quill.getLeaf(7);
// leaf should be a Text Blot with value "Good"
// offset should be 1, since the returned leaf started at index 6
```

### getLine <span class="experimental">experimental</span> {#getline-experimental}

Returns the line [Blot](https://github.com/quilljs/parchment) at the specified index within the document.

**Methods**

```javascript
getLine(index: Number): [Blot, Number]
```


**Examples**

```javascript
quill.setText('Hello\nWorld!');

let [line, offset] = quill.getLine(7);
// line should be a Block Blot representing the 2nd "World!" line
// offset should be 1, since the returned line started at index 6
```

### getLines <span class="experimental">experimental</span> {#getlines-experimental}

Returns the lines contained within the specified location.

**Methods**

```javascript
getLines(index: Number = 0, length: Number = remaining): Blot[]
getLines(range: Range): Blot[]
```

**Examples**

```javascript
quill.setText('Hello\nGood\nWorld!');
quill.formatLine(1, 1, 'list', 'bullet');

let lines = quill.getLines(2, 5);
// array with a ListItem and Block Blot,
// representing the first two lines
```
