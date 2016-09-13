---
layout: docs
title: History Module
permalink: /docs/modules/history/
---

The History module is responsible for handling undo and redo for Quill. It can be configured with the following options:

## Configuration

#### delay

- Default: `1000`

Changes occuring within the `delay` number of milliseconds is merged into a single change.

For example, with delay set to `0`, nearly every character is recorded as one change and so undo would undo one character at a time. With delay set to `1000`, undo would undo all changes that occured within the last 1000 milliseconds.


#### maxStack

- Default: `100`

Maximum size of the history's undo/redo stack. Merged changes with the `delay` option counts as a singular change.


#### userOnly

- Default: `false`

By default all changes, whether originating from user input or programmatically through the API, are treated the same and change be undone or redone by the history module. If `userOnly` is set to `true`, only user changes will be undone or redone.


### Example

```javascript
var quill = new Quill('#editor', {
  modules: {
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true
    }
  },
  theme: 'snow'
});
```

## API

#### clear

Clears the history stack.

**Methods**

```js
clear()
```

**Examples**

```js
quill.history.clear();
```


#### undo

Undo last change.

**Methods**

```js
undo()
```

**Examples**

```js
quill.history.undo();
```


#### redo

If last change was an undo, redo this undo. Otherwise does nothing.

**Methods**

```js
redo()
```

**Examples**

```js
quill.history.redo();
```
