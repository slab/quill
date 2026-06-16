import { ClassAttributor } from 'parchment';
declare class IndentAttributor extends ClassAttributor {
    add(node: HTMLElement, value: string | number): boolean;
    canAdd(node: HTMLElement, value: string): boolean;
    value(node: HTMLElement): number | undefined;
}
declare const IndentClass: IndentAttributor;
export default IndentClass;
