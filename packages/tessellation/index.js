import Quill from '../quill/dist';  // Import Quill
import '../quill/dist/dist/quill.snow.css';  // Optional: Import the default Quill theme CSS


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
// Your Quill initialization code
const quill = new Quill('#toolbar', {
    modules: {
        toolbar: {
          container: toolbarOptions,
        },
      },
      placeholder: 'Compose an epic...',
      theme: 'snow', // or 'bubble'
});


// Unicode-safe delete function for complex scripts
function deleteLastGrapheme(quill) {
  // Get the current selection
  let range = quill.getSelection();
  if (!range || range.index === 0) return; // No selection or at the start

  // Calculate the index for safe deletion
  const deleteEndIndex = range.index;
  const deleteStartIndex = deleteEndIndex - 1;

  // Get text up to the cursor position
  let textBeforeCursor = quill.getText(0, deleteEndIndex);

  // Use Intl.Segmenter to segment text before cursor position into graphemes
  const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' });
  const graphemes = Array.from(segmenter.segment(textBeforeCursor), s => s.segment);

  // If we have graphemes to delete
  if (graphemes.length > 0) {
    // Calculate the length of the last grapheme (important for complex characters)
    const lastGrapheme = graphemes[graphemes.length - 1];
    const graphemeLength = lastGrapheme.length;

    // Delete the last grapheme based on its length
    quill.deleteText(deleteEndIndex - graphemeLength, graphemeLength);

    // Move the cursor back by the grapheme length
    quill.setSelection(deleteEndIndex - graphemeLength);
  }
}

// Custom key binding for Backspace
quill.keyboard.addBinding({
  key: 8  // Backspace key (ASCII code for backspace)
}, function(range, context) {
  if (range && range.index > 0) {
    // Prevent default backspace behavior
    deleteLastGrapheme(quill);
    return false;  // Prevent Quill’s default handling
  }
});