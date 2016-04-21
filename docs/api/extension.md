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

{% highlight javascript %}
Quill.debug('info');
{% endhighlight %}


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

{% highlight javascript %}
var Parchment = Quill.import('parchment');
var Delta = Quill.import('delta');

var Link = Quill.import('formats/link');
var Toolbar = Quill.import('modules/toolbar');
// Similar to import Link from 'quill/formats/link';
{% endhighlight %}


### register

Registers a module, theme, or format(s), making them available to be added to an editor. Can later be retrieved with [`Quill.import`](/docs/api/#import). See their respective documentation for more details on definitions. Will overwrite existing definitions for the same path.

**Methods**

- `Quill.register(path, module)`
- `Quill.register(path, theme)`
- `Quill.register(format)`
- `Quill.register(format1, format2, ...formatN)`

**Parameters**

| Parameter | Type       | Description
|-----------|------------|------------
| `name`    | _String_   | Name of theme or module to register.
| `module`  | _Function_ | Module to register.
| `theme`   | _Function_ | Theme to register.
| `format`  | _Function_ | Format to register

**Examples**

{% highlight javascript %}
var Module = Quill.import('core/module');

class CustomModule extends Module {}

Quill.register('modules/custom-module', Module);
{% endhighlight %}


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

{% highlight javascript %}
var container = editor.addContainer('ql-custom');
{% endhighlight %}


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

{% highlight javascript %}
var toolbar = editor.getModule('toolbar');
{% endhighlight %}


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

{% highlight javascript %}
editor.enable();
editor.enable(false);   // Disables user input
{% endhighlight %}


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

{% highlight javascript %}
editor.update();
{% endhighlight %}
