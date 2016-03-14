import Quill from './core';

import { AlignClass as Align } from './formats/align';
import { BackgroundStyle as Background } from './formats/background';
import Blockquote from './formats/blockquote';
import Bold from './formats/bold';
import CodeBlock, { CodeInline } from './formats/code';
import { ColorStyle as Color } from './formats/color';
import { DirectionClass as Direction } from './formats/direction';
import { FontClass as Font } from './formats/font';
import Header from './formats/header';
import { IndentClass as Indent } from './formats/indent';
import Image from './formats/image';
import Italic from './formats/italic';
import Link from './formats/link';
import List, { ListItem } from './formats/list';
import Script from './formats/script';
import { SizeClass as Size } from './formats/size';
import Strike from './formats/strike';
import Underline from './formats/underline';
import Video from './formats/video';

import ImageTooltip from './modules/image-tooltip';
import LinkTooltip from './modules/link-tooltip';
import ToolbarModule from './modules/toolbar';

import BubbleTheme from './themes/bubble';
import SnowTheme from './themes/snow';


Quill.register(Align, Blockquote, CodeBlock, Direction, Header, Indent, List, ListItem);
Quill.register(Background, Bold, CodeInline, Color, Font, Italic, Link, Script, Size, Strike, Underline);
Quill.register(Image, Video);

Quill.register('image-tooltip', ImageTooltip);
Quill.register('link-tooltip', LinkTooltip);
Quill.register('toolbar', ToolbarModule);

Quill.register('bubble', BubbleTheme);
Quill.register('snow', SnowTheme);


module.exports = Quill;
