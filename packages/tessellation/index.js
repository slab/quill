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
      placeholder: 'Compose an epics...',
      theme: 'snow', // or 'bubble'
});


// Function to delete one grapheme safely (without manual cursor manipulation)
function handleBackspaceWithIntlSegmenter(quill) {
  // Get the current selection range
  let range = quill.getSelection();
  if (!range || range.index === 0) return; // No selection or at the beginning

  // Calculate the position for deletion
  const deleteEndIndex = range.index;

  // Get text before the cursor
  let textBeforeCursor = quill.getText(0, deleteEndIndex);

  // Use Intl.Segmenter to handle complex character segmentation
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

// Custom backspace binding that minimally intervenes
quill.keyboard.addBinding({
  key: 8 // Backspace key code
}, function(range, context) {
  // Only apply the custom backspace logic if the character is complex
  if (range && range.index > 0) {
    let textBeforeCursor = quill.getText(range.index - 1, 1);
    if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(textBeforeCursor)) {
      // Custom deletion for complex characters (Japanese kanji, kana, etc.)
      handleBackspaceWithIntlSegmenter(quill);
      return false; // Prevent Quill's default handling
    }
  }
  // For non-complex characters, allow Quill's default backspace behavior
  return true;
});