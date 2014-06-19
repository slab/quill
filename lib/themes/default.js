var DefaultTheme;

DefaultTheme = (function() {
  DefaultTheme.OPTIONS = {};

  function DefaultTheme(quill) {
    this.quill = quill;
    this.editor = this.quill.editor;
    this.editorContainer = this.editor.root;
  }

  return DefaultTheme;

})();

module.exports = DefaultTheme;
