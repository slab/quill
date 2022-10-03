---
layout: docs
title: Toolbar Module
permalink: /docs/modules/toolbar/
---
<!-- head -->
<link href="{{ site.cdn }}{{ site.version }}/quill.snow.css" rel="stylesheet">
<!-- head -->

The Toolbar module allow users to easily format Quill's contents.

<div class="quill-wrapper">
  <div id="toolbar-toolbar" class="toolbar">
  {% include full-toolbar.html %}
  </div>
  <div id="toolbar-editor" class="editor"></div>
</div>

It can be configured with a custom container and handlers.

```javascript
var quill = new Quill('#editor', {
  modules: {
    toolbar: {
      container: '#toolbar',  // Selector for toolbar container
      handlers: {
        'bold': customBoldHandler
      }
    }
  }
});
```

Because the `container` option is so common, a top level shorthand is also allowed.

```javascript
var quill = new Quill('#editor', {
  modules: {
    // Equivalent to { toolbar: { container: '#toolbar' }}
    toolbar: '#toolbar'
  }
});
```


## Container

Toolbar controls can either be specified by a simple array of format names or a custom HTML container.

To begin with the simpler array option:

```javascript
var toolbarOptions = ['bold', 'italic', 'underline', 'strike'];

var quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  }
});
```

Controls can also be grouped by one level of nesting an array. This will wrap controls in a `<span>` with class name `ql-formats`, providing structure for themes to utilize. For example [Snow](/docs/themes/#snow/) adds extra spacing between control groups.

```javascript
var toolbarOptions = [['bold', 'italic'], ['link', 'image']];
```

Buttons with custom values can be specified with an Object with the name of the format as its only key.

```javascript
var toolbarOptions = [{ 'header': '3' }];
```

Dropdowns are similarly specified by an Object, but with an array of possible values. CSS is used to control the visual labels for dropdown options.

```javascript
// Note false, not 'normal', is the correct value
// quill.format('size', false) removes the format,
// allowing default styling to work
var toolbarOptions = [
  { size: [ 'small', false, 'large', 'huge' ]}
];
```

Note [Themes](/docs/themes/) may also specify default values for dropdowns. For example, [Snow](/docs/themes/#snow/) provides a default list of 35 colors for the `color` and `background` formats, if set to an empty array.

```javascript
var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

var quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
});
```

For even more customization you can create the toolbar with HTML using a mix of controls controlled and styled by Quill, along side completely custom elements. To add a Quill controlled button/dropdown, add an input element with the matching class name for the desired control and Quill will automatically attach the appropriate handlers and add the relevant icon. For example a Bold button is created with `<button class="ql-bold"></button>`. Some controls will take a `value` attribute as well to adjust the behaviour of the control.

So that Quill knows where to look you'll need to specify the location of the toolbar element by DOM element or element selector in the Quill initialization options. Quill will also add a `ql-toolbar` class to the toolbar container.

For example a simple toolbar can be specified using html like so:

```html
<!-- Create toolbar container -->
<div id="toolbar">
  <!-- Add font size dropdown -->
  <select class="ql-size">
    <option value="small"></option>
    <!-- Note a missing, thus falsy value, is used to reset to default -->
    <option selected></option>
    <option value="large"></option>
    <option value="huge"></option>
  </select>
  <!-- Add a bold button -->
  <button class="ql-bold"></button>
  <!-- Add subscript and superscript buttons -->
  <button class="ql-script" value="sub"></button>
  <button class="ql-script" value="super"></button>
</div>
<div id="editor"></div>

<!-- Initialize editor with toolbar -->
<script>
  var quill = new Quill('#editor', {
    modules: {
      toolbar: '#toolbar'
    }
  });
</script>
```

Note by supplying your own HTML element, Quill searches for particular input elements, but your own inputs that have nothing to do with Quill can still be added and styled and coexist.

```html
<div id="toolbar">
  <!-- Add buttons as you would before -->
  <button class="ql-bold"></button>
  <button class="ql-italic"></button>

  <!-- But you can also add your own -->
  <button id="custom-button"></button>
</div>
<div id="editor"></div>

<script>
var quill = new Quill('#editor', {
  modules: {
    toolbar: '#toolbar'
  }
});

var customButton = document.querySelector('#custom-button');
customButton.addEventListener('click', function() {
  console.log('Clicked!');
});
</script>
```

<details>
  <summary>Complete list of Quill-controlled HTML toolbar controls</summary>
  <div id="toolbar-controls-editor" class="editor"></div>
  <table id="toolbar-controls-toolbar">
    <tr>
      <th>Toolbar Item</th>
      <th>Example</th>
      <th>HTML</th>
    </tr>
    <tr>
      <td>Bold</td>
      <td><button class="ql-bold"></button></td>
      <td>
        {% highlight html %}<button class="ql-bold"></button>{% endhighlight %}                              
      </td>
    </tr>
    <tr>
      <td>Italic</td>
      <td><button class="ql-italic"></button></td>
      <td>
        {% highlight html %}<button class="ql-italic"></button>{% endhighlight %}                              
      </td>
    </tr>
    <tr>
      <td>Underline</td>
      <td><button class="ql-underline"></button></td>
      <td>
        {% highlight html %}<button class="ql-underline"></button>{% endhighlight %}                              
      </td>
    </tr>
    <tr>
      <td>Strike</td>
      <td><button class="ql-strike"></button></td>
      <td>
        {% highlight html %}<button class="ql-strike"></button>{% endhighlight %}                              
      </td>
    </tr>
    <tr>
      <td>Blockquote</td>
      <td><button class="ql-blockquote"></button></td>
      <td>
        {% highlight html %}<button class="ql-blockquote"></button>{% endhighlight %}                              
      </td>
    </tr>
    <tr>
      <td>Code Block</td>
      <td><button class="ql-code-block"></button></td>
      <td>
        {% highlight html %}<button class="ql-code-block"></button>{% endhighlight %}                              
      </td>
    </tr>
    <tr>
      <td>Header Button</td>
      <td><button class="ql-header" value="1"></button><button class="ql-header" value="6"></button></td>
      <td>
        {% highlight html %}<button class="ql-header" value="1"></button>{% endhighlight %}
        <p>
          The <code>value</code> attribute specifies which size header the button should format the text as. It can be any integer number between (and including) 1 to 6.
        </p>
      </td>
    </tr>
    <tr>
      <td>List</td>
      <td>
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
      </td>
      <td>
        {% highlight html %}<button class="ql-list" value="ordered"></button>{% endhighlight %}
        <p>
          The <code>value</code> attribute specifies which what type of list. It can be <code>ordered</code> or <code>bullet</code>.
        </p>
      </td>
    </tr>
    <tr>
      <td>Sub/Super Script</td>
      <td>
        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>
      </td>
      <td>
        {% highlight html %}<button class="ql-script" value="sub"></button>{% endhighlight %}  
        <p>
          The <code>value</code> attribute specifies if the text should be <code>sub</code> or <code>super</code> script.
        </p>                                        
      </td>
    </tr>
    <tr>
      <td>Indent</td>
      <td>
        <button class="ql-indent" value="+1"></button>
        <button class="ql-indent" value="-1"></button>
      </td>
      <td>
        {% highlight html %}<button class="ql-indent" value="+1"></button>{% endhighlight %}   
        <p>
          The <code>value</code> attribute specifies what direction the text should be indented and can be <code>+1</code> or <code>-1</code>.
        </p>                                
      </td>
    </tr>
    <tr>
      <td>Text Direction</td>
      <td>
        <button class="ql-direction" value="rtl"></button>
        <button class="ql-direction" value="ltr"></button>
      </td>
      <td>
        {% highlight html %}<button class="ql-direction" value="rtl"></button>{% endhighlight %}
        <p>
          The <code>value</code> attribute specifies what direction the text be read <code>rtl</code> or <code>ltr</code>.
        </p>         
      </td>
    </tr>
    <tr>
      <td>Size Dropdown</td>
      <td>
        <select class="ql-size"></select>
      </td>
      <td>
        <div>
          With default options:
          {% highlight html %}<select class="ql-font"></size>{% endhighlight %}
        </div>
        <div>
          With all the options manually specified (so you can remove some if you wish):
          {% highlight html %}<select class="ql-size">
  <option value="small"></option>
  <!-- Note a missing, thus falsy value, is used to reset to default -->
  <option selected></option>
  <option value="large"></option>
  <option value="huge"></option>
</select>{% endhighlight %}   
        </div>       
      </td>
    </tr>
    <tr>
      <td>Header Dropdown</td>
      <td>
        <p>
          With default options:
          <span class="ql-formats">
            <select class="ql-header"></select>
          </span>
        </p>
        <p>
          With customised options:
          <span class="ql-formats">
            <select class="ql-header">
              <option value="1"></option>
              <option value="2"></option>
              <option value="3"></option>
              <option value="4"></option>
              <option value="5"></option>
              <option value="6"></option>
              <option selected></option>
            </select>
          </span>
        </p>
      </td>
      <td>
        <div>
          To use default options:
          {% highlight html %}<select class="ql-header"></select>{% endhighlight %}
        </div>
        <div>
          Or to specify your own:
          {% highlight html %}<select class="ql-header">
  <option value="1"></option>
  <option value="2"></option>
  <option value="6"></option>
  <!-- Note a missing, thus falsy value, is used to reset to default -->
  <option selected></option>
</select>{% endhighlight %} 
        </div>                             
      </td>
    </tr>
    <tr>
      <td>Text Color</td>
      <td>
        <p>
          With default options:
          <span class="ql-formats">
            <select class="ql-color"></select>
          </span>
        </p>
        <p>
          With customised options:
          <span class="ql-formats">
            <select class="ql-color">
              <option selected></option>
              <option value="#e60000"></option>
              <option value="#ff9900"></option>
              <option value="#ffff00"></option>
            </select>
          </span>
        </p>
      </td>
      <td>
        <div>
          To use default options:
          {% highlight html %}<select class="ql-color"></select>{% endhighlight %}
        </div>
        <div>
          Or to specify your own:
          {% highlight html %}<select class="ql-color">
  <!-- Note a missing, thus falsy value, is used to reset to default -->
  <option selected></option>
  <option value="#e60000"></option>
  <option value="#ff9900"></option>
  <option value="#ffff00"></option>
</select>{% endhighlight %} 
        </div>
      </td>
    </tr>
    <tr>
      <td>Text Background Color</td>
      <td>
        <p>
          With default options:
          <span class="ql-formats">
            <select class="ql-background"></select>
          </span>
        </p>
        <p>
          With customised options:
          <span class="ql-formats">
            <select class="ql-background">
              <option selected></option>
              <option value="#e60000"></option>
              <option value="#ff9900"></option>
              <option value="#ffff00"></option>
            </select>
          </span>
        </p>
      </td>
      <td>
        <div>
          To use default options:
          {% highlight html %}<select class="ql-background"></select>{% endhighlight %}
        </div>
        <div>
          Or to specify your own:
          {% highlight html %}<select class="ql-background">
  <!-- Note a missing, thus falsy value, is used to reset to default -->
  <option selected></option>
  <option value="#e60000"></option>
  <option value="#ff9900"></option>
  <option value="#ffff00"></option>
</select>{% endhighlight %} 
        </div>
      </td>
    </tr>
    <tr>
      <td>Font Dropdown</td>
      <td>
        <select class="ql-font"></select>
      </td>
      <td>
        <div>
          With default options:
          {% highlight html %}<select class="ql-font"></select>{% endhighlight %}
        </div>
        <div>
          With all the options manually specified (so you can remove some if you wish):
          {% highlight html %}<select class="ql-font">
  <option selected></option>
  <option value="serif"></option>
  <option value="monospace"></option>
</select>{% endhighlight %}
        </div>
      </td>
    </tr>
    <tr>
      <td>Alignment Dropdown</td>
      <td><select class="ql-align"></select></td>
      <td>
        <div>
          With default options:
          {% highlight html %}<select class="ql-align"></select>{% endhighlight %}
        </div>
        <div>
          With all the options manually specified (so you can remove some if you wish):
          {% highlight html %}<select class="ql-align">
  <option selected></option>
  <option value="center"></option>
  <option value="right"></option>
  <option value="justify"></option>
</select>{% endhighlight %}
        </div>
      </td>
    </tr>
    <tr>
      <td>Link</td>
      <td><button class="ql-link"></button></td>
      <td>
        {% highlight html %}<button class="ql-link"></button>{% endhighlight %}
      </td>
    </tr>
    <tr>
      <td>Video</td>
      <td><button class="ql-video"></button></td>
      <td>
        {% highlight html %}<button class="ql-video"></button>{% endhighlight %}
      </td>
    </tr>
    <tr>
      <td>Image</td>
      <td><button class="ql-image"></button></td>
      <td>
        {% highlight html %}<button class="ql-image"></button>{% endhighlight %}
      </td>
    </tr>
    <tr>
      <td>Clear Formatting</td>
      <td><button class="ql-clean"></button></td>
      <td>
        {% highlight html %}<button class="ql-clean"></button>{% endhighlight %}
      </td>
    </tr>
    <tr>
      <td>Controls Group</td>
      <td>
        <span class="ql-formats">
          <button class="ql-bold"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
        </span>
      </td>
      <td>
        {% highlight html %}<span class="ql-formats">
  <!-- Controls to include in the group go here -->
</span>{% endhighlight %}
      </td>
    </tr>
  </table>
</details>


## Handlers

The toolbar controls by default applies and removes formatting, but you can also overwrite this with custom handlers, for example in order to show external UI.

Handler functions will be bound to the toolbar (so using `this` will refer to the toolbar instance) and passed the `value` attribute of the input if the corresponding format is inactive, and `false` otherwise. Adding a custom handler will overwrite the default toolbar and theme behavior.

```javascript
var toolbarOptions = {
  handlers: {
    // handlers object will be merged with default handlers object
    'link': function(value) {
      if (value) {
        var href = prompt('Enter the URL');
        this.quill.format('link', href);
      } else {
        this.quill.format('link', false);
      }
    }
  }
}

var quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  }
});

// Handlers can also be added post initialization
var toolbar = quill.getModule('toolbar');
toolbar.addHandler('image', showImageUI);
```

<!-- script -->
<script src="{{site.cdn}}{{site.version}}/{{site.quill}}"></script>
<script>
  const quillToolbarExample = new Quill('#toolbar-editor', {
    modules: {
      toolbar: { container: '#toolbar-toolbar' }
    },
    theme: 'snow'
  });
  const quillToolbarControlsExample = new Quill('#toolbar-controls-editor', {
    modules: {
      toolbar: { container: '#toolbar-controls-toolbar' }
    },
    theme: 'snow'
  });
</script>
<!-- script -->
