import Delta from 'quill-delta';
import TableEmbed from '../modules/tableEmbed';

// Random testing in order to find unknown issues.

const random = choices => {
  if (typeof choices === 'number') {
    return Math.floor(Math.random() * choices);
  }
  return choices[random(choices.length)];
};

const getRandomRowColumnId = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return new Array(8)
    .fill(0)
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('');
};

const attachAttributes = obj => {
  const getRandomAttributes = () => {
    const attributeCount = random([1, 4, 8]);
    const allowedAttributes = ['align', 'background', 'color', 'font'];
    const allowedValues = ['center', 'red', 'left', 'uppercase'];
    const attributes = {};
    new Array(attributeCount).fill(0).forEach(() => {
      attributes[random(allowedAttributes)] = random(allowedValues);
    });
    return attributes;
  };
  if (random([true, false])) {
    obj.attributes = getRandomAttributes();
  }
  return obj;
};

const getRandomCellContent = () => {
  const opCount = random([1, 2, 3]);
  const delta = new Delta();
  new Array(opCount).fill(0).forEach(() => {
    delta.push(
      attachAttributes({
        insert: new Array(random(10) + 1)
          .fill(0)
          .map(() => random(['a', 'b', 'c', 'c', 'e', 'f', 'g']))
          .join(''),
      }),
    );
  });
  return delta.ops;
};

const getRandomChange = base => {
  const table = {};
  const dimension = {
    rows: new Delta(base.ops[0].insert['table-embed'].rows || []).length(),
    columns: new Delta(
      base.ops[0].insert['table-embed'].columns || [],
    ).length(),
  };
  ['rows', 'columns'].forEach(field => {
    const baseLength = dimension[field];
    const action = random(['insert', 'delete', 'retain']);
    const delta = new Delta();
    switch (action) {
      case 'insert':
        delta.retain(random(baseLength + 1));
        delta.push(
          attachAttributes({ insert: { id: getRandomRowColumnId() } }),
        );
        break;
      case 'delete':
        if (baseLength >= 1) {
          delta.retain(random(baseLength));
          delta.delete(1);
        }
        break;
      case 'retain':
        if (baseLength >= 1) {
          delta.retain(random(baseLength));
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

  const updateCellCount = random([0, 1, 2, 3]);
  new Array(updateCellCount).fill(0).forEach(() => {
    const row = random(dimension.rows);
    const column = random(dimension.columns);
    const cellIdentityToModify = `${row + 1}:${column + 1}`;
    table.cells = {
      [cellIdentityToModify]: attachAttributes({
        content: getRandomCellContent(),
      }),
    };
  });
  return new Delta([attachAttributes({ retain: { 'table-embed': table } })]);
};

const getRandomRowColumnInsert = count => {
  return new Delta(
    new Array(count)
      .fill(0)
      .map(() => attachAttributes({ insert: { id: getRandomRowColumnId() } })),
  ).ops;
};

const getRandomBase = () => {
  const rowCount = random([0, 1, 2, 3]);
  const columnCount = random([0, 1, 2]);
  const cellCount = random([0, 1, 2, 3, 4, 5]);

  const table = {};
  if (rowCount) table.rows = getRandomRowColumnInsert(rowCount);
  if (columnCount) table.columns = getRandomRowColumnInsert(columnCount);
  if (cellCount) {
    const cells = {};
    new Array(cellCount).fill(0).forEach(() => {
      const row = random(rowCount);
      const column = random(columnCount);
      const identity = `${row + 1}:${column + 1}`;
      const cell = attachAttributes({});
      if (random([true, false])) {
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

describe('random tests', () => {
  beforeAll(() => {
    TableEmbed.register();
  });

  it('delta', () => {
    for (let i = 0; i < 20; i += 1) {
      for (let j = 0; j < 1000; j += 1) {
        runTestCase();
      }
    }
  });
});
