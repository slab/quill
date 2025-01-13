import { EmbedBlot } from "parchment";

export const SOFT_BREAK_CHARACTER = "\u2028";

export default class SoftBreak extends EmbedBlot {
  static tagName = "BR";
  static blotName: string = 'soft-break';
  static className: string = 'soft-break';
  
  length(): number {
    return 1
  }

  value(): string {
    return SOFT_BREAK_CHARACTER
  }

  optimize(): void {
    return
  }
}