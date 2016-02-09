import Quill from './core/quill';

import AlignFormat from './formats/align';
import BackgroundFormat from './formats/background';
import BoldFormat from './formats/bold';
import CodeFormat from './formats/code';
import ColorFormat from './formats/color';
import DirectionFormat from './formats/direction';
import FontFormat from './formats/font';
import HeaderFormat from './formats/header';
import IndentFormat from './formats/indent';
import ItalicFormat from './formats/italic';
import ListFormat from './formats/list';
import ScriptFormat from './formats/script';
import SizeFormat from './formats/size';
import StrikeFormat from './formats/strike';
import UnderlineFormat from './formats/underline';

import BlockBlot from './blots/block';
import BreakBlot from './blots/break';
import CursorBlot from './blots/cursor';
import EmbedBlot from './blots/embed';
import InlineBlot from './blots/inline';
import ScrollBlot from './blots/scroll';

import ImageModule, { ImageBlot } from './modules/image';
import LinkModule, { LinkBlot } from './modules/link';
import ToolbarModule from './modules/toolbar';

import SnowTheme from './themes/snow';


Quill.register(AlignFormat);
Quill.register(BackgroundFormat);
Quill.register(BoldFormat);
Quill.register(CodeFormat);
Quill.register(ColorFormat);
Quill.register(DirectionFormat);
Quill.register(FontFormat);
Quill.register(HeaderFormat);
Quill.register(IndentFormat);
Quill.register(ItalicFormat);
Quill.register(ListFormat);
Quill.register(ScriptFormat);
Quill.register(SizeFormat);
Quill.register(StrikeFormat);
Quill.register(UnderlineFormat);

Quill.register(Block);
Quill.register(Break);
Quill.register(Cursor);
Quill.register(Embed);
Quill.register(Inline);
Quill.register(Scroll);

Quill.register(ImageModule);
Quill.register(LinkModule);
Quill.register(ToolbarModule);

Quill.register(SnowTheme);

module.export = Quill;
