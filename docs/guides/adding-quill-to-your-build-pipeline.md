---
layout: docs
title: Adding Quill to Your Build Pipeline
permalink: /guides/adding-quill-to-your-build-pipeline/
---

Each version of Quill is built and ready to use from a variety of sources, including [NPM](https://www.npmjs.com/package/quill) or its [CDN](/docs/download/). However there may be use cases where you would like to build Quill from source, as part of your application's build pipeline. If this desire has not occurred to you, don't sweat it! Using pre-built versions is the easiest way to use Quill.

Quill is built using [Webpack](https://webpack.js.org/concepts/) and this guide is mostly targeted towards Webpack users. However some principles may translate to other build environments.

A minimal working example of everything covered in this guide can be found at [quill-webpack-example](https://github.com/quilljs/webpack-example/).


### Webpack

You will need to add Webpack and appropriate loaders as development dependencies to your app. The Typescript compiler is necessary if you want to build Parchment from source as well.

- Quill source code - [`babel-core`](https://www.npmjs.com/package/babel-core), [`babel-loader`](https://www.npmjs.com/package/babel-loader), [`babel-preset-es2015`](https://www.npmjs.com/package/babel-preset-es2015)
- Parchment source code - [`ts-loader`](https://www.npmjs.com/package/ts-loader), [`typescript`](https://www.npmjs.com/package/typescript)
- SVG icons - [`html-loader`](https://www.npmjs.com/package/html-loader)

You Webpack configuration file will also need to alias Quill and Parchment to point to their respective entry source files. Without this, Webpack will use the pre-built files included in NPM, instead of building from source.


### Entry

Quill is distributed with builds `quill.js` and `quill.core.js`. The purpose of the entry files for both builds, [quill.js](https://github.com/quilljs/quill/blob/master/quill.js) and [core.js](https://github.com/quilljs/quill/blob/master/core.js), is to import and register necessary dependencies. You will likely want a similar entry point in your application that includes only the formats, modules, or themes that you use.

```js
import Quill from 'quill/core';

import Toolbar from 'quill/modules/toolbar';
import Snow from 'quill/themes/snow';

import Bold from 'quill/formats/bold';
import Italic from 'quill/formats/italic';
import Header from 'quill/formats/header';


Quill.register({
  'modules/toolbar': Toolbar,
  'themes/snow': Snow,
  'formats/bold': Bold,
  'formats/italic': Italic,
  'formats/header': Header
});


export default Quill;
```


### Stylesheets

There is not as much to benefit from building from source in the realm of stylesheets, since rules can be so easily overwritten. However, [`css-loader`](https://www.npmjs.com/package/css-loader)'s tilde prefix may be useful to include Quill styles in a your application css file.

```css
@import "~quill/dist/quill.core.css"

// Rest of your application CSS
```


### Example

Take a look at [quill-webpack-example](https://github.com/quilljs/webpack-example/) for a minimal working example.
