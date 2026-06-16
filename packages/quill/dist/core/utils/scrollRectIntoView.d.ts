export type Rect = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export interface ScrollRectIntoViewOptions {
    smooth?: boolean;
}
declare const scrollRectIntoView: (root: HTMLElement, targetRect: Rect, options?: ScrollRectIntoViewOptions) => void;
export default scrollRectIntoView;
