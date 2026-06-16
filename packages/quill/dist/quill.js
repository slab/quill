import Quill from './core.js';
import { AlignClass, AlignStyle } from './formats/align.js';
import { DirectionAttribute, DirectionClass, DirectionStyle } from './formats/direction.js';
import Indent from './formats/indent.js';
import Blockquote from './formats/blockquote.js';
import Header from './formats/header.js';
import List from './formats/list.js';
import { BackgroundClass, BackgroundStyle } from './formats/background.js';
import { ColorClass, ColorStyle } from './formats/color.js';
import { FontClass, FontStyle } from './formats/font.js';
import { SizeClass, SizeStyle } from './formats/size.js';
import Bold from './formats/bold.js';
import Italic from './formats/italic.js';
import Link from './formats/link.js';
import Script from './formats/script.js';
import Strike from './formats/strike.js';
import Underline from './formats/underline.js';
import Formula from './formats/formula.js';
import Image from './formats/image.js';
import Video from './formats/video.js';
import CodeBlock, { Code as InlineCode } from './formats/code.js';
import Syntax from './modules/syntax.js';
import Table from './modules/table.js';
import Toolbar from './modules/toolbar.js';
import Icons from './ui/icons.js';
import Picker from './ui/picker.js';
import ColorPicker from './ui/color-picker.js';
import IconPicker from './ui/icon-picker.js';
import Tooltip from './ui/tooltip.js';
import BubbleTheme from './themes/bubble.js';
import SnowTheme from './themes/snow.js';
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
  'ui/tooltip': Tooltip
}, true);
export { AttributeMap, Delta, Module, Op, OpIterator, Parchment, Range } from './core.js';
export default Quill;
//# sourceMappingURL=quill.js.map