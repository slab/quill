// @ts-expect-error
import alignLeftIcon from '../assets/icons/align-left.svg';
// @ts-expect-error
import alignCenterIcon from '../assets/icons/align-center.svg';
// @ts-expect-error
import alignRightIcon from '../assets/icons/align-right.svg';
// @ts-expect-error
import alignJustifyIcon from '../assets/icons/align-justify.svg';
// @ts-expect-error
import backgroundIcon from '../assets/icons/background.svg';
// @ts-expect-error
import blockquoteIcon from '../assets/icons/blockquote.svg';
// @ts-expect-error
import boldIcon from '../assets/icons/bold.svg';
// @ts-expect-error
import cleanIcon from '../assets/icons/clean.svg';
// @ts-expect-error
import codeIcon from '../assets/icons/code.svg';
// @ts-expect-error
import colorIcon from '../assets/icons/color.svg';
// @ts-expect-error
import directionLeftToRightIcon from '../assets/icons/direction-ltr.svg';
// @ts-expect-error
import directionRightToLeftIcon from '../assets/icons/direction-rtl.svg';
// @ts-expect-error
import formulaIcon from '../assets/icons/formula.svg';
// @ts-expect-error
import headerIcon from '../assets/icons/header.svg';
// @ts-expect-error
import header2Icon from '../assets/icons/header-2.svg';
// @ts-expect-error
import italicIcon from '../assets/icons/italic.svg';
// @ts-expect-error
import imageIcon from '../assets/icons/image.svg';
// @ts-expect-error
import indentIcon from '../assets/icons/indent.svg';
// @ts-expect-error
import outdentIcon from '../assets/icons/outdent.svg';
// @ts-expect-error
import linkIcon from '../assets/icons/link.svg';
// @ts-expect-error
import listBulletIcon from '../assets/icons/list-bullet.svg';
// @ts-expect-error
import listCheckIcon from '../assets/icons/list-check.svg';
// @ts-expect-error
import listOrderedIcon from '../assets/icons/list-ordered.svg';
// @ts-expect-error
import subscriptIcon from '../assets/icons/subscript.svg';
// @ts-expect-error
import superscriptIcon from '../assets/icons/superscript.svg';
// @ts-expect-error
import strikeIcon from '../assets/icons/strike.svg';
// @ts-expect-error
import tableIcon from '../assets/icons/table.svg';
// @ts-expect-error
import underlineIcon from '../assets/icons/underline.svg';
// @ts-expect-error
import videoIcon from '../assets/icons/video.svg';

export default {
  align: {
    '': alignLeftIcon,
    center: alignCenterIcon,
    right: alignRightIcon,
    justify: alignJustifyIcon,
  },
  background: backgroundIcon,
  blockquote: blockquoteIcon,
  bold: boldIcon,
  clean: cleanIcon,
  code: codeIcon,
  'code-block': codeIcon,
  color: colorIcon,
  direction: {
    '': directionLeftToRightIcon,
    rtl: directionRightToLeftIcon,
  },
  formula: formulaIcon,
  header: {
    '1': headerIcon,
    '2': header2Icon,
  },
  italic: italicIcon,
  image: imageIcon,
  indent: {
    '+1': indentIcon,
    '-1': outdentIcon,
  },
  link: linkIcon,
  list: {
    bullet: listBulletIcon,
    check: listCheckIcon,
    ordered: listOrderedIcon,
  },
  script: {
    sub: subscriptIcon,
    super: superscriptIcon,
  },
  strike: strikeIcon,
  table: tableIcon,
  underline: underlineIcon,
  video: videoIcon,
};
