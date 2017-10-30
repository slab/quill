import Quill from './core';

import { AlignClass, AlignStyle } from './formats/align';
import { DirectionAttribute, DirectionClass, DirectionStyle } from './formats/direction';
import { IndentClass as Indent } from './formats/indent';

import Blockquote from './formats/blockquote';
import Header from './formats/header';
import List, { ListItem } from './formats/list';

import { BackgroundClass, BackgroundStyle } from './formats/background';
import { ColorClass, ColorStyle } from './formats/color';
import { FontClass, FontStyle } from './formats/font';
import { SizeClass, SizeStyle } from './formats/size';

import Bold from './formats/bold';
import Italic from './formats/italic';
import Link from './formats/link';
import Script from './formats/script';
import Strike from './formats/strike';
import Underline from './formats/underline';

import Image from './formats/image';
import Video from './formats/video';

import CodeBlock, { Code as InlineCode } from './formats/code';

import Formula from './modules/formula';
import Syntax from './modules/syntax';
import Toolbar from './modules/toolbar';

import Icons from './ui/icons';
import Picker from './ui/picker';
import ColorPicker from './ui/color-picker';
import IconPicker from './ui/icon-picker';
import Tooltip from './ui/tooltip';

import BubbleTheme from './themes/bubble';
import SnowTheme from './themes/snow';


Quill.register({
  'attributors/attribute/direction': DirectionAttribute,

  'attributors/class/align': AlignClass,
  'attributors/class/background': BackgroundClass,
  'attributors/class/color': ColorClass,
  'attributors/class/direction': DirectionClass,
  'attributors/class/font': FontClass,
  'attributors/class/size': SizeClass,

  'attributors/style/align': AlignStyle,
  'attributors/style/background': BackgroundStyle,
  'attributors/style/color': ColorStyle,
  'attributors/style/direction': DirectionStyle,
  'attributors/style/font': FontStyle,
  'attributors/style/size': SizeStyle
}, true);


Quill.register({
  'formats/align': AlignClass,
  'formats/direction': DirectionClass,
  'formats/indent': Indent,

  'formats/background': BackgroundStyle,
  'formats/color': ColorStyle,
  'formats/font': FontClass,
  'formats/size': SizeClass,

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

  'formats/image': Image,
  'formats/video': Video,

  'formats/list/item': ListItem,

  'modules/formula': Formula,
  'modules/syntax': Syntax,
  'modules/toolbar': Toolbar,

  'themes/bubble': BubbleTheme,
  'themes/snow': SnowTheme,

  'ui/icons': Icons,
  'ui/picker': Picker,
  'ui/icon-picker': IconPicker,
  'ui/color-picker': ColorPicker,
  'ui/tooltip': Tooltip
}, true);


export default Quill;
