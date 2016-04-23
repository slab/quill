---
layout: docs
title: Configuration
permalink: /docs/configuration/
---

Quill allows several ways to customize it to suit your needs. This section is dedicated to tweaking existing functionality. See the [Modules](/docs/modules/) section for adding new functionality and the [Themes](/docs/themes/) section for styling.


### Container

Quill requires an container where the editor will be appended. You can either pass in a CSS selector or a DOM object.

```javascript
var editor = new Quill('.editor');  // The first result of the selector will be used
```

```javascript
var container = document.getElementById('editor');
var editor = new Quill(container);
```

```javascript
var container = $('.editor').get(0);
var editor = new Quill(container);
```

### Options

To configure Quill, pass in an options object:

```javascript
var options = {
  debug: 'info',
  modules: {
    toolbar: '#toolbar'
  },
  placeholder: 'Compose an epic...',
  readOnly: true,
  theme: 'snow'
};
var editor = new Quill('#editor', options);
```

The following keys are recognized:

#### debug

- Default: `false`

- Shortcut for [debug](/docs/api/#debug). Note `debug` is a static method and will affect other instances of Quill editors on the page. Debugging messages are disabled by default.

#### formats

- Default: All formats

- Whitelist of formats to allow in the editor. See [formats](/docs/formats/) for a complete list.

#### modules

- Collection of modules to include and respective options. See [Modules](/docs/modules/) for more information.

#### placeholder

- Default: ''

- Placeholder text to show when editor is empty.

#### readOnly

- Default: `false`

- Whether to instantiate the editor to read-only mode.

#### theme

- Name of theme to use. Note the theme's specific stylesheet still needs to be included manually. See [Themes](/docs/themes/) for more information.
