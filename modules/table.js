import Parchment from 'parchment';
import Block from '../blots/block';
import Container from '../blots/container';
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
}

export default Table;
