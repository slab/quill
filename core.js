import Parchment from 'parchment';
import Quill from './core/quill';

import Block, { EmbedBlock } from './blots/block';
import Break from './blots/break';
import Cursor from './blots/cursor';
import Inline from './blots/inline';
import Scroll from './blots/scroll';

import Clipboard from './modules/clipboard';
import History from './modules/history';
import Keyboard from './modules/keyboard';

Quill.register({
  'blots/block'        : Block,
  'blots/block/embed'  : EmbedBlock,
  'blots/break'        : Break,
  'blots/cursor'       : Cursor,
  'blots/embed'        : Parchment.Embed,
  'blots/inline'       : Inline,
  'blots/scroll'       : Scroll,
  'blots/text'         : Parchment.Text,

  'modules/clipboard'  : Clipboard,
  'modules/history'    : History,
  'modules/keyboard'   : Keyboard
});

Parchment.register(Block, Break, Cursor, Inline, Scroll, Parchment.Text);


export default Quill;
