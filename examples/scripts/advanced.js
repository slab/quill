var quillBasic = new Quill('.basic-wrapper .editor-container', {
  modules: {
    // authorship: { authorId: 'basic' },
    toolbar: { container: '.basic-wrapper .toolbar-container' }
  },
  theme: false
});

var quillAdvanced = new Quill('.advanced-wrapper .editor-container', {
  modules: {
    // 'authorship': { authorId: 'advanced', enabled: true },
    'toolbar': { container: '.advanced-wrapper .toolbar-container' },
    // 'link-tooltip': true,
    // 'image-tooltip': true,
    // 'multi-cursor': true
  },
  styles: false,
  theme: 'snow'
});

// var authorship = quillAdvanced.getModule('authorship');
// authorship.addAuthor('basic', 'rgba(255,153,51,0.4)');

// var cursorManager = quillAdvanced.getModule('multi-cursor');
// cursorManager.setCursor('basic', 0, 'basic', 'rgba(255,153,51,0.9)');

quillBasic.on('selection-change', function(range) {
  console.info('basic', 'selection', range);
  // if (range != null) {
  //   cursorManager.moveCursor('basic', range.end);
  // }
});

quillBasic.on('text-change', function(delta, source) {
  if (source === 'api') return;
  console.info('basic', 'text', delta, source);
  quillAdvanced.updateContents(delta);
  var sourceDelta = quillBasic.getContents();
  var targetDelta = quillAdvanced.getContents();
  console.assert(_.isEqual(sourceDelta, targetDelta), "Editor diversion!", sourceDelta.ops, targetDelta.ops);
});

quillAdvanced.on('selection-change', function(range) {
  console.info('advanced', 'selection', range);
});

quillAdvanced.on('text-change', function(delta, source) {
  if (source === 'api') return;
  console.info('advanced', 'text', delta, source);
  quillBasic.updateContents(delta);
  var sourceDelta = quillAdvanced.getContents();
  var targetDelta = quillBasic.getContents();
  console.assert(_.isEqual(sourceDelta, targetDelta), "Editor diversion!", sourceDelta.ops, targetDelta.ops);
});
