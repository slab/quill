---
layout: standalone
title: Collaborative Example
permalink: /standalone/collaborative/
---
<!-- head -->
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
<div id="bubble-container"></div>
<div id="snow-container"></div>
<!-- script -->
<script src="{{site.cdn}}{{site.version}}/{{site.quill}}"></script>
<script>
  var Delta = Quill.import('delta');
  var bubble = new Quill('#bubble-container', {
    theme: 'bubble',
    modules: {
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
    theme: 'snow'
  });
  bubble.on('text-change', function(delta, old, source) {
    if (source === 'user') {
      snow.updateContents(delta, 'api');
    }
  });
  snow.on('text-change', function(delta, old, source) {
    if (source === 'user') {
      bubble.updateContents(delta, 'api');
    }
  });
</script>
<!-- script -->
