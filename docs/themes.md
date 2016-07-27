---
layout: docs
title: Themes
permalink: /docs/themes/
---

Themes allow you to easily make your editor look good with minimal effort. Quill features two offically supported themes: [Snow](/docs/themes/snow/) and [Bubble](/docs/themes/bubble/).

```html
<!-- Add the theme's stylesheet -->
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.snow.css">

<script type="text/javascript">
var quill = new Quill('#editor', {
  theme: 'snow'   // Specify theme in configuration
});
</script>
```

### Customization

Themes primarily control the visual look of Quill through a CSS stylesheet, and slight tweaks can easily be made by overriding these rules.

You can almost build an entirely new theme with just your own custom CSS stylesheet. However, since some UI elements like `<select>` cannot be customized very much, and others like tooltips are missing entirely, you might want to add your own utilize some Javascript to achieve a complete user experience.
