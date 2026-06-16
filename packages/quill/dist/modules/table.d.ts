import Module from '../core/module.js';
import { TableCell, TableRow } from '../formats/table.js';
declare class Table extends Module {
    static register(): void;
    constructor(...args: ConstructorParameters<typeof Module>);
    balanceTables(): void;
    deleteColumn(): void;
    deleteRow(): void;
    deleteTable(): void;
    getTable(range?: import("../core/selection.js").Range | null): [null, null, null, -1] | [Table, TableRow, TableCell, number];
    insertColumn(offset: number): void;
    insertColumnLeft(): void;
    insertColumnRight(): void;
    insertRow(offset: number): void;
    insertRowAbove(): void;
    insertRowBelow(): void;
    insertTable(rows: number, columns: number): void;
    listenBalanceCells(): void;
}
export default Table;
