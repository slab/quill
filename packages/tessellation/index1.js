const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ['clean'], // remove formatting button
];
const quill = new Quill('#toolbar', {
  modules: {
    toolbar: {
      container: toolbarOptions,
    },
  },
  placeholder: 'Compose an epics...',
  theme: 'snow', // or 'bubble'
});

// Function to delete one grapheme (Unicode-safe) on backspace
function deleteLastGrapheme(quill) {
  // Get the current selection
  let range = quill.getSelection();
  if (!range || range.index === 0) return; // No selection or at the beginning

  // Get text before the cursor
  const deleteEndIndex = range.index;
  let textBeforeCursor = quill.getText(0, deleteEndIndex);

  // Use Intl.Segmenter to segment text into graphemes
  const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' });
  const graphemes = Array.from(segmenter.segment(textBeforeCursor), s => s.segment);

  if (graphemes.length > 0) {
    // Calculate the length of the last grapheme
    const lastGrapheme = graphemes[graphemes.length - 1];
    const graphemeLength = lastGrapheme.length;

    // Delete the last grapheme
    quill.deleteText(deleteEndIndex - graphemeLength, graphemeLength);
  }
}

// Custom binding for the Backspace key
quill.keyboard.addBinding({
  key: 8  // Backspace key code
}, function(range, context) {
  if (range && range.index > 0) {
    deleteLastGrapheme(quill); // Use custom delete function
    return false;  // Prevent Quill's default backspace handling
  }
});