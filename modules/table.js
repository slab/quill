import Quill from '../core/quill';
import Module from '../core/module';
import {
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
} from '../formats/table';

class Table extends Module {
  static register() {
    Quill.register(TableCell);
    Quill.register(TableRow);
    Quill.register(TableBody);
    Quill.register(TableContainer);
  }

  constructor(...args) {
    super(...args);
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, (mutations, context) => {
      if (context.source !== Quill.sources.USER) return;
      const tables = new Set(
        mutations
          .map(mutation => {
            if (mutation.target.tagName === 'TABLE') {
              return Quill.find(mutation.target);
            }
            return null;
          })
          .filter(blot => blot != null),
      );
      tables.forEach(table => {
        table.balanceCells();
      });
    });
  }
}

export default Table;
