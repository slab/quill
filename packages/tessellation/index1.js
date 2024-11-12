import Quill from '../quill/dist';  // Import Quill
import '../quill/dist/dist/quill.snow.css';  // Optional: Import the default Quill theme CSS
// const toolbarOptions = [
//   ['bold', 'italic', 'underline', 'strike'], // toggled buttons
//   ['blockquote', 'code-block'],
//   ['link', 'image', 'video', 'formula'],

//   [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
//   [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
//   [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
//   [{ direction: 'rtl' }], // text direction

//   [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

//   [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//   [{ font: [] }],
//   [{ align: [] }],
//   ['clean'], // remove formatting button
// ];
var  placeHolderLanguage = 'Enter note content here';
var  keyboardHeight = 0;
var isTabToEdit = null;
var isPlanNote = false;
var belowContentHeight = 0;
// Add fonts to whitelist
let Font = Quill.import('formats/font');
// We do not add Sans Serif since it is the default
Font.whitelist = ['Times-New-Roman','Helvetica', 'Apple-Chancery','Papyrus','Rockwell','Optima', 'Georgia'];
Quill.register(Font, true);

var Size = Quill.import("attributors/style/size");
Size.whitelist = ['10px','11px', '12px', '14px', '16px', '18px', '20px', '24px','28px','36px'];
Quill.register(Size, true);
const quill = new Quill('#editor', {
  modules: {
                   table: true,
               tableUI: true,
      toolbar:'#toolbar'
  },
  placeholder: 'Compose an epic...',
  theme: 'snow', // or 'bubble'
});


const table = quill.getModule('table');

document.querySelector('#insert-table').addEventListener('click', function () {
    table.insertTable(3, 3);
});

// Called each time when text changes in the editor
const toolbar = document.getElementById("toolbar");
const toolbarWrapper = document.getElementById("toolbarWrapper");

quill.on('text-change', function (delta, source) {
    sendContentToNativeApp()
})

// Called when user begin editing
let editorHeight = document.getElementById('editor').offsetHeight;
const selection =() => {
    if (window.getSelection)
     return window.getSelection();
}
quill.on('selection-change', function (range) {
    if (range) {
        if (range.start == range.end) {
            window.webkit.messageHandlers.callbackHandler.postMessage(`Toolbar_Visible`);
            
            if(isTabToEdit) {
                document.getElementById('toolbar').style.display = 'block';
            }
           
           //document.getElementById('editor').style.height = '36%';
            toolbar.scrollIntoView();
            setTimeout(() => {
                if(document.getElementById('toolbar').style.display != 'none') {
                    document.getElementById('editor').style.height = `${editorHeight + Number(belowContentHeight) - Number(keyboardHeight)}px`;
                }
                quill.focus();
                toolbar.scrollIntoView();
            }, 100)
            
           // if(Boolean(selection().toString())) {
           //     setTimeout(() => {
           //         toolbar.scrollIntoView();
           //         snow.focus();
                    //snow.setSelection(range.index, range.length);
           //     }, 0)
           // } else {
           //     setTimeout(() => {
           //         toolbar.scrollIntoView();
           //         snow.focus();
                    //snow.setSelection(range.index, range.length);
           //     }, 150)
           // }
            
        }
    } else {
        document.getElementById('editor').style='';
        toolbar.scrollIntoView();
    }
})

// Return the HTML content of the editor
function getQuillHtml() { return quill.root.innerHTML; }

// Send editor text to native app
function sendContentToNativeApp() {
    try {
        let html = getQuillHtml();
        window.webkit.messageHandlers.callbackHandler.postMessage(html);
    } catch (err) {
        console.log('The native context does not exist yet');
    }
}

function cakllkeyboardOpen() {
    window.scrollBy({
        top: -1
    });
}

function isToolbarFullyVisible() {
    var $toolbar = $('#toolbar');
    var toolbarTop = $toolbar.offset().top;
    var toolbarBottom = toolbarTop + $toolbar.outerHeight();
    var windowHeight = $(window).height();

    return toolbarTop >= 0 && toolbarBottom <= windowHeight;
}

$(window).on('resize', function () {
    if (isToolbarFullyVisible) {
        //window.webkit.messageHandlers.callbackHandler.postMessage('Toolbar_Visible');
    } else {
        //window.webkit.messageHandlers.callbackHandler.postMessage('Toolbar_Not_Visible');
    }
});

$("#btnscrollToBottom").click(function () {
    const $editable = $('.ql-editor');
    const height = $editable[0].scrollHeight;

    console.log('scroll height: ', height);

    $editable.animate({
        scrollTop: height
    }, 500);
});

$("#MakeUIWorkForEdit").click(function () {
    quill.root.scrollTop = 0;
});

function scrollToCursor() {
    var range = quill.getSelection();
    if (range) {
        var bounds = quill.getBounds(range.index, range.length);
        quill.root.scrollTop = bounds.top;
    }
}

$("#ScrollToCursorPosition").click(function () {
    scrollToCursor();
});

function getTextOfRichTextEditorSave() {
    quill.root.blur();
    quill.enable(false);
    return quill.root.innerHTML;
}

function disabledRichTextContainer() {
    quill.enable(false);
    isTabToEdit = false;

    document.getElementById('toolbar').style.display = 'none';
    document.querySelector('#editor-container .ql-container.ql-snow').style.height = '100%';

}


function enabledRichTextContainer() {
    isPlanNote = false;
    quill.enable(true);
    document.getElementById('toolbar').style.display = 'none';
    isTabToEdit = true;
    document.querySelector('#editor-container .ql-container.ql-snow').style.height = '95%';
}

function getTextOfRichTextEditorEdit() {
    //window.webkit.messageHandlers.callbackHandler.postMessage('Start edit');
    quill.enable(true);
    const root = quill.root;
    const selectionPosition = Math.round(root.scrollTop / (root.scrollHeight - root.clientHeight) * quill.getLength());
    quill.setSelection(selectionPosition || 0);
    document.getElementById('toolbar').style.display = 'block';

    
    setTimeout(() => {
        if(document.getElementById('toolbar').style.display != 'none') {
            document.getElementById('editor').style.height = `${editorHeight + Number(belowContentHeight) - Number(keyboardHeight)}px`;
        }
        quill.focus();
        toolbar.scrollIntoView();
    }, 100)
}
       
 async function setkeyboardScroll() {
     const range = quill.getSelection();
     await quill.blur();
     await quill.setSelection(range.index, range.length);
     await toolbar.scrollIntoView();
 }

// START: set default font size
 function onSelectDefaultFontSize(size) {
     //document.getElementById("sizeSelect").value = size;
     //snow.format("size", size);
     //const option = document.querySelector("#sizeSelect .ql-picker-label");
     //option.setAttribute("data-value", size);
     //option.setAttribute("data-label", size);
     //document.getElementById("firstElement")?.setAttribute('style',`font-size:${size}`);
 }
 // END: set default font size
       
 // START: set default font family
 function onSelectDefaultFontFamily(font) {
    // document.getElementById("fontSelect").value = font.replaceAll(" ","-");
    // snow.format("font", font.replaceAll(" ","-"));
     //const option = document.querySelector("#fontSelect .ql-picker-label");
     //option.setAttribute("data-value", font.replaceAll(" ","-"));
    // option.setAttribute("data-label", font);
    // document.getElementById("firstElement")?.classList?.add(`ql-font-${font.replaceAll(" ","-")}`);
 }
// END: set default font family

function changeThePlaceHolder(newPlaceholder) {
    quill.root.setAttribute('data-placeholder', `${newPlaceholder}`);
}
