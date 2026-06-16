import type { LinkedList } from 'parchment';
import Block from '../blots/block.js';
import Container from '../blots/container.js';
declare class TableCell extends Block {
    static blotName: string;
    static tagName: string;
    static create(value: string): HTMLElement;
    static formats(domNode: HTMLElement): string | null | undefined;
    next: this | null;
    cellOffset(): number;
    format(name: string, value: string): void;
    row(): TableRow;
    rowOffset(): number;
    table(): import("parchment").Parent;
}
declare class TableRow extends Container {
    static blotName: string;
    static tagName: string;
    children: LinkedList<TableCell>;
    next: this | null;
    checkMerge(): boolean;
    optimize(context: {
        [key: string]: any;
    }): void;
    rowOffset(): number;
    table(): import("parchment").Parent;
}
declare class TableBody extends Container {
    static blotName: string;
    static tagName: string;
    children: LinkedList<TableRow>;
}
declare class TableContainer extends Container {
    static blotName: string;
    static tagName: string;
    children: LinkedList<TableBody>;
    balanceCells(): void;
    cells(column: number): any[];
    deleteColumn(index: number): void;
    insertColumn(index: number): void;
    insertRow(index: number): void;
    rows(): any[];
}
declare function tableId(): string;
export { TableCell, TableRow, TableBody, TableContainer, tableId };
