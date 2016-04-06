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
import Toolbar from 'quill/modules/toolbar';
import CodeHighlighter, { CodeBlock, CodeToken } from 'quill/modules/code-highlighter';

import Icons from 'quill/ui/icons';
import Picker from 'quill/ui/picker';
import ColorPicker from 'quill/ui/color-picker';
import IconPicker from 'quill/ui/icon-picker';

import BubbleTheme from 'quill/themes/bubble';
import SnowTheme from 'quill/themes/snow';


Quill.register({
  'formats/align': Align,
  'formats/direction': Direction,
  'formats/indent': Indent,

  'formats/background': Background,
  'formats/color': Color,
  'formats/font': Font,
  'formats/size': Size,

  'formats/blockquote': Blockquote,
  'formats/code-block': CodeBlock,
  'formats/header': Header,
  'formats/list': List,

  'formats/bold': Bold,
  'formats/code': InlineCode,
  'formats/italic': Italic,
  'formats/link': Link,
  'formats/script': Script,
  'formats/strike': Strike,
  'formats/underline': Underline,

  'formats/formula': Formula,
  'formats/image': Image,
  'formats/video': Video,

  'formats/code-block/token': CodeToken,
  'formats/list/item': ListItem,

  'modules/code-highlighter': CodeHighlighter,
  'modules/image-tooltip': ImageTooltip,
  'modules/link-tooltip': LinkTooltip,
  'modules/toolbar': Toolbar,

  'themes/bubble': BubbleTheme,
  'themes/snow': SnowTheme,

  'ui/icons': Icons,
  'ui/picker': Picker,
  'ui/icon-picker': IconPicker,
  'ui/color-picker': ColorPicker
});


module.exports = Quill;
