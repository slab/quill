## Editor

### blur

Removes focus from the editor.

**Methods**

```javascript
blur()
```

**Examples**

```javascript
quill.blur();
```

### disable

Shorthand for [`enable(false)`](#enable).

### enable

Set ability for user to edit, via input devices like the mouse or keyboard. Does not affect capabilities of API calls, when the `source` is `"api"` or `"silent".

**Methods**

```javascript
enable(enabled: boolean = true)
```

**Examples**

```javascript
quill.enable();
quill.enable(false);   // Disables user input
```

### focus

Focuses the editor and restores its last range.

**Methods**

```javascript
focus()
```

**Examples**

```javascript
quill.focus();
```

### hasFocus

Checks if editor has focus. Note focus on toolbar, tooltips, does not count as the editor.

**Methods**

```javascript
hasFocus(): Boolean
```

**Examples**

```javascript
quill.hasFocus();
```

### update

Synchronously check editor for user updates and fires events, if changes have occurred. Useful for collaborative use cases during conflict resolution requiring the latest up to date state. [Source](/docs/api/#events) may be `"user"`, `"api"`, or `"silent"`.

**Methods**

```javascript
update(source: String = 'user')
```

**Examples**

```javascript
quill.update();
```
