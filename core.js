import Quill from './core/quill';
import Parchment from 'parchment';

import BlockBlot from './blots/block';
import BreakBlot from './blots/break';
import CursorBlot from './blots/cursor';
import InlineBlot from './blots/inline';
import ScrollBlot from './blots/scroll';

import ClipboardModule from './modules/clipboard';
import KeyboardModule from './modules/keyboard';
import UndoManagerModule from './modules/undo-manager';

Quill.register(BlockBlot);
Quill.register(BreakBlot);
Quill.register(CursorBlot);
Quill.register(InlineBlot);
Quill.register(ScrollBlot);
Quill.register(Parchment.Text);

Quill.register('clipboard', ClipboardModule);
Quill.register('keyboard', KeyboardModule);
Quill.register('undo-manager', UndoManagerModule);


export default Quill;
