declare class Picker {
    select: HTMLSelectElement;
    container: HTMLElement;
    label: HTMLElement;
    constructor(select: HTMLSelectElement);
    togglePicker(): void;
    buildItem(option: HTMLOptionElement): HTMLSpanElement;
    buildLabel(): HTMLSpanElement;
    buildOptions(): void;
    buildPicker(): void;
    escape(): void;
    close(): void;
    selectItem(item: HTMLElement | null, trigger?: boolean): void;
    update(): void;
}
export default Picker;
