import Quill from 'quill/core';

import { AlignClass as Align } from 'quill/formats/align';
import { DirectionClass as Direction } from 'quill/formats/direction';
import { IndentClass as Indent } from 'quill/formats/indent';

import Blockquote from 'quill/formats/blockquote';
import Header from 'quill/formats/header';
import List, { ListItem } from 'quill/formats/list';

import { BackgroundStyle as Background } from 'quill/formats/background';
import { ColorStyle as Color } from 'quill/formats/color';
import { FontClass as Font } from 'quill/formats/font';
import { SizeClass as Size } from 'quill/formats/size';

import Bold from 'quill/formats/bold';
import Italic from 'quill/formats/italic';
import Link from 'quill/formats/link';
import Script from 'quill/formats/script';
import Strike from 'quill/formats/strike';
import Underline from 'quill/formats/underline';

import Formula from 'quill/formats/formula';
import Image from 'quill/formats/image';
import Video from 'quill/formats/video';

import { Code as InlineCode } from 'quill/formats/code';

import ImageTooltip from 'quill/modules/image-tooltip';
import LinkTooltip from 'quill/modules/link-tooltip';
import ToolbarModule from 'quill/modules/toolbar';
import CodeHighlighter, { CodeBlock, CodeToken } from 'quill/modules/code-highlighter';

import BubbleTheme from 'quill/themes/bubble';
import SnowTheme from 'quill/themes/snow';


Quill.register(Align, Blockquote, Direction, Header, Indent, List, ListItem);
Quill.register(Background, Bold, Color, Font, Italic, InlineCode, Link, Script, Size, Strike, Underline);
Quill.register(Formula, Image, Video);

Quill.register('image-tooltip', ImageTooltip);
Quill.register('link-tooltip', LinkTooltip);
Quill.register('toolbar', ToolbarModule);

Quill.register(CodeToken, CodeBlock)
Quill.register('code-highlighter', CodeHighlighter);

Quill.register('bubble', BubbleTheme);
Quill.register('snow', SnowTheme);


module.exports = Quill;
