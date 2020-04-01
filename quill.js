import Quill from './core';
import AlertClass from './formats/alert';
import { AlignClass, AlignStyle } from './formats/align';
import { BackgroundClass, BackgroundStyle } from './formats/background';
import Blockquote from './formats/blockquote';
import Bold from './formats/bold';
import CodeBlock, { Code as InlineCode } from './formats/code';
import { ColorClass, ColorStyle } from './formats/color';
import {
  DirectionAttribute,
  DirectionClass,
  DirectionStyle,
} from './formats/direction';
import { FontClass, FontStyle } from './formats/font';
import Formula from './formats/formula';
import Header from './formats/header';
import Image from './formats/image';
import Indent from './formats/indent';
import Italic from './formats/italic';
import Link from './formats/link';
import List from './formats/list';
import Script from './formats/script';
import { SizeClass, SizeStyle } from './formats/size';
import Strike from './formats/strike';
import Underline from './formats/underline';
import Video from './formats/video';
import Syntax from './modules/syntax';
import Table from './modules/table';
import Toolbar from './modules/toolbar';
import BubbleTheme from './themes/bubble';
import SnowTheme from './themes/snow';
import ColorPicker from './ui/color-picker';
import IconPicker from './ui/icon-picker';
import Icons from './ui/icons';
import Picker from './ui/picker';
import Tooltip from './ui/tooltip';

Quill.register(
  {
    'attributors/attribute/direction': DirectionAttribute,

    'attributors/class/align': AlignClass,
    'attributors/class/alert': AlertClass,
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
    'attributors/style/size': SizeStyle,
  },
  true,
);

Quill.register(
  {
    'formats/align': AlignClass,
    'formats/alert': AlertClass,
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

    'formats/formula': Formula,
    'formats/image': Image,
    'formats/video': Video,

    'modules/syntax': Syntax,
    'modules/table': Table,
    'modules/toolbar': Toolbar,

    'themes/bubble': BubbleTheme,
    'themes/snow': SnowTheme,

    'ui/icons': Icons,
    'ui/picker': Picker,
    'ui/icon-picker': IconPicker,
    'ui/color-picker': ColorPicker,
    'ui/tooltip': Tooltip,
  },
  true,
);

export default Quill;
