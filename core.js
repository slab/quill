import Quill from 'quill/quill';
import Parchment from 'parchment';

import Block from 'quill/blots/block';
import Break from 'quill/blots/break';
import Cursor from 'quill/blots/cursor';
import Inline from 'quill/blots/inline';
import Scroll from 'quill/blots/scroll';

import Clipboard from 'quill/modules/clipboard';
import Keyboard from 'quill/modules/keyboard';
import UndoManager from 'quill/modules/undo-manager';

Quill.register(Block, Break, Cursor, Inline, Scroll, Parchment.Text);

Quill.register('clipboard', Clipboard);
Quill.register('keyboard', Keyboard);
Quill.register('undo-manager', UndoManager);


export default Quill;
