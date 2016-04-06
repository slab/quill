import Parchment from 'parchment';
import Quill from 'quill/core/quill';

import Block, { EmbedBlock } from 'quill/blots/block';
import Break from 'quill/blots/break';
import Cursor from 'quill/blots/cursor';
import Inline from 'quill/blots/inline';
import Scroll from 'quill/blots/scroll';

import Clipboard from 'quill/modules/clipboard';
import Keyboard from 'quill/modules/keyboard';
import UndoManager from 'quill/modules/undo-manager';

Quill.register({
  'blots/block'          : Block,
  'blots/block/embed'    : EmbedBlock,
  'blots/break'          : Break,
  'blots/cursor'         : Cursor,
  'blots/embed'          : Parchment.Embed,
  'blots/inline'         : Inline,
  'blots/scroll'         : Scroll,
  'blots/text'           : Parchment.Text,

  'modules/clipboard'    : Clipboard,
  'modules/keyboard'     : Keyboard,
  'modules/undo-manager' : UndoManager
});

Parchment.register(Block, Break, Cursor, Inline, Scroll, Parchment.Text);


export default Quill;
