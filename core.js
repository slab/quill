import Parchment from 'parchment';
import Quill from './core/quill';

import Block, { BlockEmbed } from './blots/block';
import Break from './blots/break';
import Container from './blots/container';
import Cursor from './blots/cursor';
import Embed from './blots/embed';
import Inline from './blots/inline';
import Scroll from './blots/scroll';
import TextBlot from './blots/text';

import Table from './blots/table';
import TableRow from './blots/table_row';
import TableCell from './blots/table_cell';
import ContainBlot from './blots/contain';

import Clipboard from './modules/clipboard';
import History from './modules/history';
import Keyboard from './modules/keyboard';

Quill.register({
  'blots/block'        : Block,
  'blots/block/embed'  : BlockEmbed,
  'blots/break'        : Break,
  'blots/container'    : Container,
  'blots/cursor'       : Cursor,
  'blots/embed'        : Embed,
  'blots/inline'       : Inline,
  'blots/scroll'       : Scroll,
  'blots/text'         : TextBlot,

  'blots/table'        : Table,
  'blots/table_row'    : TableRow,
  'blots/table_cell'   : TableCell,
  'blots/contain'      : ContainBlot,

  'modules/clipboard'  : Clipboard,
  'modules/history'    : History,
  'modules/keyboard'   : Keyboard
});

Parchment.register(Block, Break, Cursor, Inline, Scroll, TextBlot);


module.exports = Quill;
