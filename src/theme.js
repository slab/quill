class Theme {
  constructor(quill) {
    this.quill = quill;
    this.quill.container.classList.add('ql-container');
  }
}
Theme.OPTIONS = {};


export default Theme;
