## Extension

### debug

Enable logging messages for given debug level.

**Methods***

- `Quill.debug(level)`

**Parameters**

| Parameter | Type       | Description
|-----------|------------|------------
| `level`   | _String_   | 'error', 'warn', 'log', or 'info'

**Examples**

```javascript
Quill.debug('info');
```


### import

Return Quill library, format, module, or theme. In general the path should map exactly to Quill source code directory structure. Unless stated otherwise, modification of returned entities may break required Quill functionality and is strongly discouraged.

**Methods***

- `Quill.import(path)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `path`    | _String_ | Import path or name

**Returns**

- Library requested or `undefined` if not found.

**Examples**

```javascript
var Parchment = Quill.import('parchment');
var Delta = Quill.import('delta');

var Link = Quill.import('formats/link');
var Toolbar = Quill.import('modules/toolbar');
// Similar to import Link from 'quill/formats/link';
```


### register

Registers a module, theme, or format(s), making them available to be added to an editor. Can later be retrieved with [`Quill.import`](/docs/api/#import). Use the path prefix of 'formats/', 'modules/', or 'themes/' for registering formats, modules or themes, respectively. Will overwrite existing definitions with the same path.

**Methods**

- `Quill.register(path, def, overwrite)`
- `Quill.register(defs, overwrite)`

**Parameters**

| Parameter   | Type       | Description
|-------------|------------|------------
| `path`      | _String_   | Path with parts made up of type and name of what to register.
| `def`       | _Function_ | What to register.
| `defs`      | _Function_ | Map of path:def keypairs for mass registration.
| `overwrite` | _Function_ | Intentionally overwriting definition (will prevent warning). Defaults to false.


**Examples**

```javascript
var Module = Quill.import('core/module');

class CustomModule extends Module {}

Quill.register('modules/custom-module', Module);
```

```javascript
Quill.register({
  'formats/custom-format': CustomFormat,
  'modules/custom-module-a': CustomModuleA,
  'modules/custom-module-b': CustomModuleB,
});
```

### addContainer

Adds a container inside the Quill container, sibling to the editor itself. By convention, Quill modules should have a class name prefixed with `ql-`.

**Methods**

- `addContainer(className, refNode)`
- `addContainer(domNode, refNode)`

**Parameters**

| Parameter   | Type          | Description
|-------------|---------------|------------
| `className` | _String_      | Class name to add to created container.
| `domNode`   | _HTMLElement_ | Container to be inserted.
| `refNode`   | _HTMLElement_ | Insert container before this reference node, if null container will be appended.

**Returns**

- *DOMElement* Container that was inserted.

**Examples**

```javascript
var container = quill.addContainer('ql-custom');
```


### getModule

Retrieves a module that has been added to the editor.

**Methods**

- `getModule(name)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `name`    | _String_ | Name of module to retrieve.

**Returns**

- *Object* Instance of the module that was added.

**Examples**

```javascript
var toolbar = quill.getModule('toolbar');
```


### disable

Shorthand for [`enable(false)`](#enable).


### enable

Set ability for user to edit, via input devices like the mouse or keyboard. Does not affect capabilities of API calls.

**Methods**

- `enable()`
- `enable(value)`

**Parameters**

| Parameter | Type      | Description
|-----------|-----------|------------
| `value`   | _Boolean_ | Whether to enable or disable user input.

**Examples**

```javascript
quill.enable();
quill.enable(false);   // Disables user input
```


### update

Synchronously check editor for user updates and fires events, if changes have occurred. Useful for collaborative use cases during conflict resolution requiring the latest up to date state.

**Methods**

- `update()`
- `update(source)`

**Parameters**

| Parameter | Type     | Description
|-----------|----------|------------
| `source`  | _String_ | [Source](/docs/api/#text-change) to be emitted. Defaults to `user`.

**Examples**

```javascript
quill.update();
```
