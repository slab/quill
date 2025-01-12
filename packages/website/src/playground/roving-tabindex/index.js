const quill = new Quill('#editor', {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: [1, 2, false] }],
      ['image', 'code-block'],
    ],
  },
  placeholder: 'Compose an epic...',
  theme: 'snow', // or 'bubble'
});
