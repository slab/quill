import type { AttributeMap } from 'quill-delta';
import Delta from 'quill-delta';
import TableEmbed from '../../src/modules/tableEmbed';
import type {
  CellData,
  TableData,
  TableRowColumnOp,
} from '../../src/modules/tableEmbed';
import { choose, randomInt } from './__helpers__/utils';
import { beforeAll, describe, expect, test } from 'vitest';

const getRandomRowColumnId = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return new Array(8)
    .fill(0)
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('');
};

const attachAttributes = <T extends object>(
  obj: T,
): T & { attributes: Record<string, unknown> } => {
  const getRandomAttributes = () => {
    const attributeCount = choose([1, 4, 8]);
    const allowedAttributes = ['align', 'background', 'color', 'font'];
    const allowedValues = ['center', 'red', 'left', 'uppercase'];
    const attributes: AttributeMap = {};
    new Array(attributeCount).fill(0).forEach(() => {
      attributes[choose(allowedAttributes)] = choose(allowedValues);
    });
    return attributes;
  };
  if (choose([true, false])) {
    // @ts-expect-error
    obj.attributes = getRandomAttributes();
  }
  // @ts-expect-error
  return obj;
};

const getRandomCellContent = () => {
  const opCount = choose([1, 2, 3]);
  const delta = new Delta();
  new Array(opCount).fill(0).forEach(() => {
    delta.push(
      attachAttributes({
        insert: new Array(randomInt(10) + 1)
          .fill(0)
          .map(() => choose(['a', 'b', 'c', 'c', 'e', 'f', 'g']))
          .join(''),
      }),
    );
  });
  return delta.ops;
};

const getRandomChange = (base: Delta) => {
  const table: TableData = {};
  const dimension = {
    rows: new Delta(
      (base.ops[0].insert as any)['table-embed'].rows || [],
    ).length(),
    columns: new Delta(
      (base.ops[0].insert as any)['table-embed'].columns || [],
    ).length(),
  };
  (['rows', 'columns'] as const).forEach((field) => {
    const baseLength = dimension[field];
    const action = choose(['insert', 'delete', 'retain']);
    const delta = new Delta();
    switch (action) {
      case 'insert':
        delta.retain(randomInt(baseLength + 1));
        delta.push(
          attachAttributes({ insert: { id: getRandomRowColumnId() } }),
        );
        break;
      case 'delete':
        if (baseLength >= 1) {
          delta.retain(randomInt(baseLength));
          delta.delete(1);
        }
        break;
      case 'retain':
        if (baseLength >= 1) {
          delta.retain(randomInt(baseLength));
          delta.push(attachAttributes({ retain: 1 }));
        }
        break;
      default:
        break;
    }
    if (delta.length() > 0) {
      table[field] = delta.ops;
    }
  });

  const updateCellCount = choose([0, 1, 2, 3]);
  new Array(updateCellCount).fill(0).forEach(() => {
    const row = randomInt(dimension.rows);
    const column = randomInt(dimension.columns);
    const cellIdentityToModify = `${row + 1}:${column + 1}`;
    table.cells = {
      [cellIdentityToModify]: attachAttributes({
        content: getRandomCellContent(),
      }),
    };
  });
  return new Delta([attachAttributes({ retain: { 'table-embed': table } })]);
};

const getRandomRowColumnInsert = (count: number): TableRowColumnOp[] => {
  return new Array(count)
    .fill(0)
    .map<TableRowColumnOp>(() =>
      attachAttributes({ insert: { id: getRandomRowColumnId() } }),
    );
};

const getRandomBase = () => {
  const rowCount = choose([0, 1, 2, 3]);
  const columnCount = choose([0, 1, 2]);
  const cellCount = choose([0, 1, 2, 3, 4, 5]);

  const table: TableData = {};
  if (rowCount) table.rows = getRandomRowColumnInsert(rowCount);
  if (columnCount) table.columns = getRandomRowColumnInsert(columnCount);
  if (cellCount) {
    const cells: Record<string, CellData> = {};
    new Array(cellCount).fill(0).forEach(() => {
      const row = randomInt(rowCount);
      const column = randomInt(columnCount);
      const identity = `${row + 1}:${column + 1}`;
      const cell: CellData = attachAttributes({});
      if (choose([true, false])) {
        cell.content = getRandomCellContent();
      }
      if (Object.keys(cell).length) {
        cells[identity] = cell;
      }
    });
    if (Object.keys(cells).length) table.cells = cells;
  }
  return new Delta([{ insert: { 'table-embed': table } }]);
};

const runTestCase = () => {
  const base = getRandomBase();
  const change = getRandomChange(base);
  expect(base).toEqual(base.compose(change).compose(change.invert(base)));

  const anotherChange = getRandomChange(base);
  expect(change.compose(change.transform(anotherChange, true))).toEqual(
    anotherChange.compose(anotherChange.transform(change)),
  );
};

describe('tableEmbed', () => {
  beforeAll(() => {
    TableEmbed.register();
  });

  test('delta', () => {
    for (let i = 0; i < 20; i += 1) {
      for (let j = 0; j < 1000; j += 1) {
        runTestCase();
      }
    }
  });
});
