import Delta from 'quill-delta';
import type { Op } from 'quill-delta';
import Module from '../core/module.js';
export type CellData = {
    content?: Delta['ops'];
    attributes?: Record<string, unknown>;
};
export type TableRowColumnOp = Omit<Op, 'insert'> & {
    insert?: {
        id: string;
    };
};
export interface TableData {
    rows?: Delta['ops'];
    columns?: Delta['ops'];
    cells?: Record<string, CellData>;
}
export declare const composePosition: (delta: Delta, index: number) => number | null;
export declare const tableHandler: {
    compose(a: TableData, b: TableData, keepNull?: boolean): TableData;
    transform(a: TableData, b: TableData, priority: boolean): TableData;
    invert(change: TableData, base: TableData): TableData;
};
declare class TableEmbed extends Module {
    static register(): void;
}
export default TableEmbed;
