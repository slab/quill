import Delta from 'rich-text/lib/delta';
import Quill from '../../../src/quill';


describe('UndoManager', function() {
  beforeEach(function() {
    this.setContainer('<div><p>The lazy fox</p></div>');
    this.quill = new Quill(this.container.firstChild, {
      modules: {
        'undo-manager': { delay: 400 }
      }
    });
    this.undoManager = this.quill.getModule('undo-manager');
    this.original = this.quill.getContents();
  });

  // tests =
  //   'insert':
  //     delta: new Delta().retain(9).insert('hairy ')
  //     index: 15
  //   'delete':
  //     delta: new Delta().retain(4).delete(5)
  //     index: 4
  //   'format':
  //     delta: new Delta().retain(4).retain(5, { bold: true })
  //     index: 9
  //   'multiple':
  //     delta: new Delta().retain(4, { bold: true }).insert('hairy').delete(4)
  //     index: 9

  // describe('_getLastChangeIndex', ->
  //   _.each(tests, (test, name) ->
  //     it(name, ->
  //       index = @undoManager._getLastChangeIndex(test.delta)
  //       expect(index).toEqual(test.index)
  //     )
  //   )
  // )

  describe('undo/redo', function() {
    // _.each(tests, (test, name) ->
    //   it(name, ->
    //     @quill.updateContents(test.delta)
    //     changed = @quill.getContents()
    //     expect(changed).not.toEqual(@original)
    //     @undoManager.undo()
    //     expect(@quill.getContents()).toEqual(@original)
    //     @undoManager.redo()
    //     expect(@quill.getContents()).toEqual(changed)
    //   )
    // )

    it('user change', function() {
      this.quill.root.firstChild.innerHTML = 'The lazy foxes';
      this.quill.update();
      let changed = this.quill.getContents();
      expect(changed).not.toEqual(this.original);
      this.undoManager.undo();
      expect(this.quill.getContents()).toEqual(this.original);
      this.undoManager.redo();
      expect(this.quill.getContents()).toEqual(changed);
    });

    it('merge changes', function() {
      expect(this.undoManager.stack.undo.length).toEqual(0);
      this.quill.updateContents(new Delta().retain(12).insert('e'));
      expect(this.undoManager.stack.undo.length).toEqual(1);
      this.quill.updateContents(new Delta().retain(13).insert('s'));
      expect(this.undoManager.stack.undo.length).toEqual(1);
      this.undoManager.undo();
      expect(this.quill.getContents()).toEqual(this.original);
      expect(this.undoManager.stack.undo.length).toEqual(0);
    });

    it('dont merge changes', function(done) {
      expect(this.undoManager.stack.undo.length).toEqual(0);
      this.quill.updateContents(new Delta().retain(12).insert('e'));
      expect(this.undoManager.stack.undo.length).toEqual(1);
      setTimeout(() => {
        this.quill.updateContents(new Delta().retain(13).insert('s'));
        expect(this.undoManager.stack.undo.length).toEqual(2);
        done();
      }, this.undoManager.options.delay * 1.25);
    });

    it('multiple undos', function(done) {
      expect(this.undoManager.stack.undo.length).toEqual(0);
      this.quill.updateContents(new Delta().retain(12).insert('e'));
      let contents = this.quill.getContents();
      setTimeout(() => {
        this.quill.updateContents(new Delta().retain(13).insert('s'));
        this.undoManager.undo();
        expect(this.quill.getContents()).toEqual(contents);
        this.undoManager.undo();
        expect(this.quill.getContents()).toEqual(this.original);
        done();
      }, this.undoManager.options.delay * 1.25);
    });

    it('transform api change', function() {
      this.undoManager.options.userOnly = true;
      this.quill.updateContents(new Delta().retain(12).insert('es'), Quill.sources.USER);
      this.quill.updateContents(new Delta().retain(4).delete(5), Quill.sources.API);
      this.quill.updateContents(new Delta().retain(9).insert('!'), Quill.sources.USER);
      expect(this.undoManager.stack.undo.length).toEqual(1);
      expect(this.quill.getContents()).toEqual(new Delta().insert('The foxes!\n'));
      this.undoManager.undo();
      expect(this.quill.getContents()).toEqual(new Delta().insert('The fox\n'));
      this.undoManager.redo();
      expect(this.quill.getContents()).toEqual(new Delta().insert('The foxes!\n'));
    });

    it('ignore remote changes', function() {
      this.undoManager.options.delay = 0;
      this.undoManager.options.userOnly = true;
      this.quill.setText('\n');
      this.quill.insertText(0, 'a', Quill.sources.USER);
      this.quill.insertText(1, 'b', Quill.sources.API);
      this.quill.insertText(2, 'c', Quill.sources.USER);
      this.quill.insertText(3, 'd', Quill.sources.API);
      this.quill.insertText(4, 'e', Quill.sources.USER);
      this.quill.insertText(5, 'f', Quill.sources.API);
      expect(this.quill.getText()).toEqual('abcdef\n');
      this.undoManager.undo();
      expect(this.quill.getText()).toEqual('abcdf\n');
      this.undoManager.undo();
      expect(this.quill.getText()).toEqual('abdf\n');
      this.undoManager.undo();
      expect(this.quill.getText()).toEqual('bdf\n');
      this.undoManager.undo();
      expect(this.quill.getText()).toEqual('bdf\n');
      this.undoManager.redo();
      expect(this.quill.getText()).toEqual('abdf\n');
      this.undoManager.redo();
      expect(this.quill.getText()).toEqual('abcdf\n');
      this.undoManager.redo();
      expect(this.quill.getText()).toEqual('abcdef\n');
      this.undoManager.redo();
      expect(this.quill.getText()).toEqual('abcdef\n');
    });
  });
});
