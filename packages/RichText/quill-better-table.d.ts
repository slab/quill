declare module 'quill-better-table' {
    import Quill from 'quill';
  
    class QuillBetterTable {
      static keyboardBindings: any;
      constructor(quill: Quill, options: any);
      insertTable(rows: number, columns: number): void;
    }
  
    export default QuillBetterTable;
  }
  