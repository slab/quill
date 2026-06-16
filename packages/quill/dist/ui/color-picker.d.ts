import Picker from './picker.js';
declare class ColorPicker extends Picker {
    constructor(select: HTMLSelectElement, label: string);
    buildItem(option: HTMLOptionElement): HTMLSpanElement;
    selectItem(item: HTMLElement | null, trigger?: boolean): void;
}
export default ColorPicker;
