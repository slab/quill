// Add fonts to whitelist
const Font = Quill.import('formats/font');
// We do not add Aref Ruqaa since it is the default
Font.whitelist = ['mirza', 'roboto'];
Quill.register(Font, true);

const quill = new Quill('#editor', {
  modules: {
    toolbar: '#toolbar',
  },
  theme: 'snow',
});
