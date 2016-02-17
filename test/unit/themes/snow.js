let icons = {
  'align-center'         : require('../../../assets/icons/align-center.svg'),
  'align-justify'        : require('../../../assets/icons/align-justify.svg'),
  'align-left'           : require('../../../assets/icons/align-left.svg'),
  'align-right'          : require('../../../assets/icons/align-right.svg'),
  'attachment'           : require('../../../assets/icons/attachment.svg'),
  'audio'                : require('../../../assets/icons/audio.svg'),
  'authorship'           : require('../../../assets/icons/authorship.svg'),
  'background'           : require('../../../assets/icons/background.svg'),
  'bold'                 : require('../../../assets/icons/bold.svg'),
  'clean'                : require('../../../assets/icons/clean.svg'),
  'code'                 : require('../../../assets/icons/code.svg'),
  'color'                : require('../../../assets/icons/color.svg'),
  'comment'              : require('../../../assets/icons/comment.svg'),
  'direction-left'       : require('../../../assets/icons/direction-left.svg'),
  'direction-right'      : require('../../../assets/icons/direction-right.svg'),
  'dropdown'             : require('../../../assets/icons/dropdown.svg'),
  'emoji'                : require('../../../assets/icons/emoji.svg'),
  'font'                 : require('../../../assets/icons/font.svg'),
  'formula'              : require('../../../assets/icons/formula.svg'),
  'hashtag'              : require('../../../assets/icons/hashtag.svg'),
  'header'               : require('../../../assets/icons/header.svg'),
  'header-2'             : require('../../../assets/icons/header-2.svg'),
  'image'                : require('../../../assets/icons/image.svg'),
  'indent'               : require('../../../assets/icons/indent.svg'),
  'italic'               : require('../../../assets/icons/italic.svg'),
  'link'                 : require('../../../assets/icons/link.svg'),
  'list-bullet'          : require('../../../assets/icons/list-bullet.svg'),
  'list-check'           : require('../../../assets/icons/list-check.svg'),
  'list-ordered'         : require('../../../assets/icons/list-ordered.svg'),
  'map'                  : require('../../../assets/icons/map.svg'),
  'mention'              : require('../../../assets/icons/mention.svg'),
  'outdent'              : require('../../../assets/icons/outdent.svg'),
  'quote'                : require('../../../assets/icons/quote.svg'),
  'redo'                 : require('../../../assets/icons/redo.svg'),
  'size-decrease'        : require('../../../assets/icons/size-decrease.svg'),
  'size-increase'        : require('../../../assets/icons/size-increase.svg'),
  'size'                 : require('../../../assets/icons/size.svg'),
  'spacing'              : require('../../../assets/icons/spacing.svg'),
  'speech'               : require('../../../assets/icons/speech.svg'),
  'strike'               : require('../../../assets/icons/strike.svg'),
  'subscript'            : require('../../../assets/icons/subscript.svg'),
  'superscript'          : require('../../../assets/icons/superscript.svg'),
  'table-border-all'     : require('../../../assets/icons/table-border-all.svg'),
  'table-border-bottom'  : require('../../../assets/icons/table-border-bottom.svg'),
  'table-border-left'    : require('../../../assets/icons/table-border-left.svg'),
  'table-border-none'    : require('../../../assets/icons/table-border-none.svg'),
  'table-border-outside' : require('../../../assets/icons/table-border-outside.svg'),
  'table-border-right'   : require('../../../assets/icons/table-border-right.svg'),
  'table-border-top'     : require('../../../assets/icons/table-border-top.svg'),
  'table-delete-cells'   : require('../../../assets/icons/table-delete-cells.svg'),
  'table-delete-columns' : require('../../../assets/icons/table-delete-columns.svg'),
  'table-delete-rows'    : require('../../../assets/icons/table-delete-rows.svg'),
  'table-insert-cells'   : require('../../../assets/icons/table-delete-cells.svg'),
  'table-insert-columns' : require('../../../assets/icons/table-insert-columns.svg'),
  'table-insert-rows'    : require('../../../assets/icons/table-insert-rows.svg'),
  'table-merge-cells'    : require('../../../assets/icons/table-merge-cells.svg'),
  'table-unmerge-cells'  : require('../../../assets/icons/table-unmerge-cells.svg'),
  'table'                : require('../../../assets/icons/table.svg'),
  'underline'            : require('../../../assets/icons/underline.svg'),
  'undo'                 : require('../../../assets/icons/undo.svg'),
  'video'                : require('../../../assets/icons/video.svg')
};


describe('Themes', function() {
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
});
