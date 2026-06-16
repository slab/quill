import Delta, { OpIterator } from 'quill-delta';
import Module from '../core/module.js';
const parseCellIdentity = identity => {
  const parts = identity.split(':');
  return [Number(parts[0]) - 1, Number(parts[1]) - 1];
};
const stringifyCellIdentity = (row, column) => `${row + 1}:${column + 1}`;
export const composePosition = (delta, index) => {
  let newIndex = index;
  const thisIter = new OpIterator(delta.ops);
  let offset = 0;
  while (thisIter.hasNext() && offset <= newIndex) {
    const length = thisIter.peekLength();
    const nextType = thisIter.peekType();
    thisIter.next();
    switch (nextType) {
      case 'delete':
        if (length > newIndex - offset) {
          return null;
        }
        newIndex -= length;
        break;
      case 'insert':
        newIndex += length;
        offset += length;
        break;
      default:
        offset += length;
        break;
    }
  }
  return newIndex;
};
const compactCellData = _ref => {
  let {
    content,
    attributes
  } = _ref;
  const data = {};
  if (content.length() > 0) {
    data.content = content.ops;
  }
  if (attributes && Object.keys(attributes).length > 0) {
    data.attributes = attributes;
  }
  return Object.keys(data).length > 0 ? data : null;
};
const compactTableData = _ref2 => {
  let {
    rows,
    columns,
    cells
  } = _ref2;
  const data = {};
  if (rows.length() > 0) {
    data.rows = rows.ops;
  }
  if (columns.length() > 0) {
    data.columns = columns.ops;
  }
  if (Object.keys(cells).length) {
    data.cells = cells;
  }
  return data;
};
const reindexCellIdentities = (cells, _ref3) => {
  let {
    rows,
    columns
  } = _ref3;
  const reindexedCells = {};
  Object.keys(cells).forEach(identity => {
    let [row, column] = parseCellIdentity(identity);

    // @ts-expect-error Fix me later
    row = composePosition(rows, row);
    // @ts-expect-error Fix me later
    column = composePosition(columns, column);
    if (row !== null && column !== null) {
      const newPosition = stringifyCellIdentity(row, column);
      reindexedCells[newPosition] = cells[identity];
    }
  }, false);
  return reindexedCells;
};
export const tableHandler = {
  compose(a, b, keepNull) {
    const rows = new Delta(a.rows || []).compose(new Delta(b.rows || []));
    const columns = new Delta(a.columns || []).compose(new Delta(b.columns || []));
    const cells = reindexCellIdentities(a.cells || {}, {
      rows: new Delta(b.rows || []),
      columns: new Delta(b.columns || [])
    });
    Object.keys(b.cells || {}).forEach(identity => {
      const aCell = cells[identity] || {};
      // @ts-expect-error Fix me later
      const bCell = b.cells[identity];
      const content = new Delta(aCell.content || []).compose(new Delta(bCell.content || []));
      const attributes = Delta.AttributeMap.compose(aCell.attributes, bCell.attributes, keepNull);
      const cell = compactCellData({
        content,
        attributes
      });
      if (cell) {
        cells[identity] = cell;
      } else {
        delete cells[identity];
      }
    });
    return compactTableData({
      rows,
      columns,
      cells
    });
  },
  transform(a, b, priority) {
    const aDeltas = {
      rows: new Delta(a.rows || []),
      columns: new Delta(a.columns || [])
    };
    const bDeltas = {
      rows: new Delta(b.rows || []),
      columns: new Delta(b.columns || [])
    };
    const rows = aDeltas.rows.transform(bDeltas.rows, priority);
    const columns = aDeltas.columns.transform(bDeltas.columns, priority);
    const cells = reindexCellIdentities(b.cells || {}, {
      rows: bDeltas.rows.transform(aDeltas.rows, !priority),
      columns: bDeltas.columns.transform(aDeltas.columns, !priority)
    });
    Object.keys(a.cells || {}).forEach(identity => {
      let [row, column] = parseCellIdentity(identity);
      // @ts-expect-error Fix me later
      row = composePosition(rows, row);
      // @ts-expect-error Fix me later
      column = composePosition(columns, column);
      if (row !== null && column !== null) {
        const newIdentity = stringifyCellIdentity(row, column);

        // @ts-expect-error Fix me later
        const aCell = a.cells[identity];
        const bCell = cells[newIdentity];
        if (bCell) {
          const content = new Delta(aCell.content || []).transform(new Delta(bCell.content || []), priority);
          const attributes = Delta.AttributeMap.transform(aCell.attributes, bCell.attributes, priority);
          const cell = compactCellData({
            content,
            attributes
          });
          if (cell) {
            cells[newIdentity] = cell;
          } else {
            delete cells[newIdentity];
          }
        }
      }
    });
    return compactTableData({
      rows,
      columns,
      cells
    });
  },
  invert(change, base) {
    const rows = new Delta(change.rows || []).invert(new Delta(base.rows || []));
    const columns = new Delta(change.columns || []).invert(new Delta(base.columns || []));
    const cells = reindexCellIdentities(change.cells || {}, {
      rows,
      columns
    });
    Object.keys(cells).forEach(identity => {
      const changeCell = cells[identity] || {};
      const baseCell = (base.cells || {})[identity] || {};
      const content = new Delta(changeCell.content || []).invert(new Delta(baseCell.content || []));
      const attributes = Delta.AttributeMap.invert(changeCell.attributes, baseCell.attributes);
      const cell = compactCellData({
        content,
        attributes
      });
      if (cell) {
        cells[identity] = cell;
      } else {
        delete cells[identity];
      }
    });

    // Cells may be removed when their row or column is removed
    // by row/column deltas. We should add them back.
    Object.keys(base.cells || {}).forEach(identity => {
      const [row, column] = parseCellIdentity(identity);
      if (composePosition(new Delta(change.rows || []), row) === null || composePosition(new Delta(change.columns || []), column) === null) {
        // @ts-expect-error Fix me later
        cells[identity] = base.cells[identity];
      }
    });
    return compactTableData({
      rows,
      columns,
      cells
    });
  }
};
class TableEmbed extends Module {
  static register() {
    Delta.registerEmbed('table-embed', tableHandler);
  }
}
export default TableEmbed;
//# sourceMappingURL=tableEmbed.js.map