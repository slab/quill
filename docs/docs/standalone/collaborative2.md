---
layout: standalone
title: Collaborative Example
permalink: /standalone/collaborative/
---

<!-- head -->

<link rel="stylesheet" href="{{site.highlightjs}}/styles/monokai-sublime.min.css">
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.bubble.css">
<link rel="stylesheet" href="{{site.cdn}}{{site.version}}/quill.snow.css">
<style>
  body {
    padding: 25px;
  }
  #bubble-container, #snow-container {
    margin-bottom: 25px;
    height: 200px;
  }
</style>
<!-- head -->
<div>
  <button id="insert-table">Insert Table</button>
  <button id="insert-row-above">Insert Row Above</button>
  <button id="insert-row-below">Insert Row Below</button>
  <button id="insert-column-left">Insert Column Left</button>
  <button id="insert-column-right">Insert Column Right</button>
  <button id="delete-row">Delete Row</button>
  <button id="delete-column">Delete Column</button>
  <button id="delete-table">Delete Table</button>
</div>
<div id="snow-container"></div>
<div id="bubble-container"></div>
<!-- script -->
<script src="{{site.highlightjs}}/highlight.min.js"></script>
<script src="{{site.cdn}}{{site.version}}/{{site.quill}}"></script>
<script>
  var Delta = Quill.import('delta');
  var bubble = new Quill('#bubble-container', {
    theme: 'bubble',
    modules: {
      syntax: true,
      table: true,
      keyboard: {
        bindings: {
          'markdown-code-block': {
            key: 13,
            prefix: /^```$/,
            collapsed: true,
            format: { 'code-block': false },
            handler(range) {
              this.quill.history.cutoff();
              const delta = new Delta().retain(range.index - 3)
                .delete(3)
                .retain(1, { 'code-block': true });
              this.quill.updateContents(delta, Quill.sources.USER);
              this.quill.history.cutoff();
            },
          },
        }
      }
    }
  });
  var snow = new Quill('#snow-container', {
    theme: 'snow',
    modules: {
      syntax: true,
      table: true,
      toolbar: [['code-block', 'clean']]
    }
  });
  bubble.on('text-change', function(delta, old, source) {
    if (source === 'user') {
      snow.updateContents(delta, 'api');
    }
  });
  const table = snow.getModule('table');
  snow.on('text-change', function(delta, old, source) {
    if (source === 'user') {
      bubble.updateContents(delta, 'api');
    }
  });
  document.querySelector('#insert-table').addEventListener('click', function() {
    table.insertTable(2, 2);
  });
  document.querySelector('#insert-row-above').addEventListener('click', function() {
    table.insertRowAbove();
  });
  document.querySelector('#insert-row-below').addEventListener('click', function() {
    table.insertRowBelow();
  });
  document.querySelector('#insert-column-left').addEventListener('click', function() {
    table.insertColumnLeft();
  });
  document.querySelector('#insert-column-right').addEventListener('click', function() {
    table.insertColumnRight();
  });
  document.querySelector('#delete-row').addEventListener('click', function() {
    table.deleteRow();
  });
  document.querySelector('#delete-column').addEventListener('click', function() {
    table.deleteColumn();
  });
  document.querySelector('#delete-table').addEventListener('click', function() {
    table.deleteTable();
  });
</script>
<!-- script -->
