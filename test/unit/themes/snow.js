let icons = {
  'align-center'         : require('quill/assets/icons/align-center.svg'),
  'align-justify'        : require('quill/assets/icons/align-justify.svg'),
  'align-left'           : require('quill/assets/icons/align-left.svg'),
  'align-right'          : require('quill/assets/icons/align-right.svg'),
  'attachment'           : require('quill/assets/icons/attachment.svg'),
  'audio'                : require('quill/assets/icons/audio.svg'),
  'authorship'           : require('quill/assets/icons/authorship.svg'),
  'background'           : require('quill/assets/icons/background.svg'),
  'blockquote'           : require('quill/assets/icons/blockquote.svg'),
  'bold'                 : require('quill/assets/icons/bold.svg'),
  'clean'                : require('quill/assets/icons/clean.svg'),
  'code'                 : require('quill/assets/icons/code.svg'),
  'color'                : require('quill/assets/icons/color.svg'),
  'comment'              : require('quill/assets/icons/comment.svg'),
  'direction-left'       : require('quill/assets/icons/direction-left.svg'),
  'direction-right'      : require('quill/assets/icons/direction-right.svg'),
  'dropdown'             : require('quill/assets/icons/dropdown.svg'),
  'emoji'                : require('quill/assets/icons/emoji.svg'),
  'font'                 : require('quill/assets/icons/font.svg'),
  'formula'              : require('quill/assets/icons/formula.svg'),
  'hashtag'              : require('quill/assets/icons/hashtag.svg'),
  'header'               : require('quill/assets/icons/header.svg'),
  'header-2'             : require('quill/assets/icons/header-2.svg'),
  'image'                : require('quill/assets/icons/image.svg'),
  'indent'               : require('quill/assets/icons/indent.svg'),
  'italic'               : require('quill/assets/icons/italic.svg'),
  'link'                 : require('quill/assets/icons/link.svg'),
  'list-bullet'          : require('quill/assets/icons/list-bullet.svg'),
  'list-check'           : require('quill/assets/icons/list-check.svg'),
  'list-ordered'         : require('quill/assets/icons/list-ordered.svg'),
  'map'                  : require('quill/assets/icons/map.svg'),
  'mention'              : require('quill/assets/icons/mention.svg'),
  'outdent'              : require('quill/assets/icons/outdent.svg'),
  'redo'                 : require('quill/assets/icons/redo.svg'),
  'size-decrease'        : require('quill/assets/icons/size-decrease.svg'),
  'size-increase'        : require('quill/assets/icons/size-increase.svg'),
  'size'                 : require('quill/assets/icons/size.svg'),
  'spacing'              : require('quill/assets/icons/spacing.svg'),
  'speech'               : require('quill/assets/icons/speech.svg'),
  'strike'               : require('quill/assets/icons/strike.svg'),
  'subscript'            : require('quill/assets/icons/subscript.svg'),
  'superscript'          : require('quill/assets/icons/superscript.svg'),
  'table-border-all'     : require('quill/assets/icons/table-border-all.svg'),
  'table-border-bottom'  : require('quill/assets/icons/table-border-bottom.svg'),
  'table-border-left'    : require('quill/assets/icons/table-border-left.svg'),
  'table-border-none'    : require('quill/assets/icons/table-border-none.svg'),
  'table-border-outside' : require('quill/assets/icons/table-border-outside.svg'),
  'table-border-right'   : require('quill/assets/icons/table-border-right.svg'),
  'table-border-top'     : require('quill/assets/icons/table-border-top.svg'),
  'table-delete-cells'   : require('quill/assets/icons/table-delete-cells.svg'),
  'table-delete-columns' : require('quill/assets/icons/table-delete-columns.svg'),
  'table-delete-rows'    : require('quill/assets/icons/table-delete-rows.svg'),
  'table-insert-cells'   : require('quill/assets/icons/table-delete-cells.svg'),
  'table-insert-columns' : require('quill/assets/icons/table-insert-columns.svg'),
  'table-insert-rows'    : require('quill/assets/icons/table-insert-rows.svg'),
  'table-merge-cells'    : require('quill/assets/icons/table-merge-cells.svg'),
  'table-unmerge-cells'  : require('quill/assets/icons/table-unmerge-cells.svg'),
  'table'                : require('quill/assets/icons/table.svg'),
  'underline'            : require('quill/assets/icons/underline.svg'),
  'undo'                 : require('quill/assets/icons/undo.svg'),
  'video'                : require('quill/assets/icons/video.svg')
};


describe('Snow', function() {
  it('icons', function() {
    this.container.classList.add('ql-snow');
    this.container.classList.add('ql-toolbar');
    this.container.innerHTML = '<span class="ql-formats"></span>';
    Object.keys(icons).forEach((icon) => {
      let button = document.createElement('button');
      button.innerHTML = icons[icon];
      this.container.firstChild.appendChild(button);
    });
  });
});
