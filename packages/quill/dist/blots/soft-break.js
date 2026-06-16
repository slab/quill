import { EmbedBlot } from 'parchment';
export const SOFT_BREAK_CHARACTER = '\u2028';
export default class SoftBreak extends EmbedBlot {
  static tagName = 'BR';
  static blotName = 'soft-break';
  static className = 'soft-break';
  length() {
    return 1;
  }
  value() {
    return SOFT_BREAK_CHARACTER;
  }
  optimize() {
    return;
  }
}
//# sourceMappingURL=soft-break.js.map