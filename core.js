import Quill from './core/quill';
import Parchment from 'parchment';

import Block from './blots/block';
import Break from './blots/break';
import Cursor from './blots/cursor';
import Inline from './blots/inline';
import Scroll from './blots/scroll';

import Clipboard from './modules/clipboard';
import Keyboard from './modules/keyboard';
import UndoManager from './modules/undo-manager';

Quill.register(Block, Break, Cursor, Inline, Scroll, Parchment.Text);

Quill.register('clipboard', Clipboard);
Quill.register('keyboard', Keyboard);
Quill.register('undo-manager', UndoManager);


export default Quill;
