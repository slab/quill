import Delta from 'rich-text/lib/delta';
import Quill from 'quill/core';


describe('UndoManager', function() {
  beforeEach(function() {
    this.initialize(HTMLElement, '<div><p>The lazy fox</p></div>');
    this.quill = new Quill(this.container.firstChild, {
      modules: {
        'undo-manager': { delay: 400 }
      }
    });
    this.original = this.quill.getContents();
  });

  it('user change', function() {
    this.quill.root.firstChild.innerHTML = 'The lazy foxes';
    this.quill.update();
    let changed = this.quill.getContents();
    expect(changed).not.toEqual(this.original);
    this.quill.undoManager.undo();
    expect(this.quill.getContents()).toEqual(this.original);
    this.quill.undoManager.redo();
    expect(this.quill.getContents()).toEqual(changed);
  });

  it('merge changes', function() {
    expect(this.quill.undoManager.stack.undo.length).toEqual(0);
    this.quill.updateContents(new Delta().retain(12).insert('e'));
    expect(this.quill.undoManager.stack.undo.length).toEqual(1);
    this.quill.updateContents(new Delta().retain(13).insert('s'));
    expect(this.quill.undoManager.stack.undo.length).toEqual(1);
    this.quill.undoManager.undo();
    expect(this.quill.getContents()).toEqual(this.original);
    expect(this.quill.undoManager.stack.undo.length).toEqual(0);
  });

  it('dont merge changes', function(done) {
    expect(this.quill.undoManager.stack.undo.length).toEqual(0);
    this.quill.updateContents(new Delta().retain(12).insert('e'));
    expect(this.quill.undoManager.stack.undo.length).toEqual(1);
    setTimeout(() => {
      this.quill.updateContents(new Delta().retain(13).insert('s'));
      expect(this.quill.undoManager.stack.undo.length).toEqual(2);
      done();
    }, this.quill.undoManager.options.delay * 1.25);
  });

  it('multiple undos', function(done) {
    expect(this.quill.undoManager.stack.undo.length).toEqual(0);
    this.quill.updateContents(new Delta().retain(12).insert('e'));
    let contents = this.quill.getContents();
    setTimeout(() => {
      this.quill.updateContents(new Delta().retain(13).insert('s'));
      this.quill.undoManager.undo();
      expect(this.quill.getContents()).toEqual(contents);
      this.quill.undoManager.undo();
      expect(this.quill.getContents()).toEqual(this.original);
      done();
    }, this.quill.undoManager.options.delay * 1.25);
  });

  it('transform api change', function() {
    this.quill.undoManager.options.userOnly = true;
    this.quill.updateContents(new Delta().retain(12).insert('es'), Quill.sources.USER);
    this.quill.undoManager.lastRecorded = 0;
    this.quill.updateContents(new Delta().retain(14).insert('!'), Quill.sources.USER);
    this.quill.undoManager.undo();
    this.quill.updateContents(new Delta().retain(4).delete(5), Quill.sources.API);
    expect(this.quill.getContents()).toEqual(new Delta().insert('The foxes\n'));
    this.quill.undoManager.undo();
    expect(this.quill.getContents()).toEqual(new Delta().insert('The fox\n'));
    this.quill.undoManager.redo();
    expect(this.quill.getContents()).toEqual(new Delta().insert('The foxes\n'));
    this.quill.undoManager.redo();
    expect(this.quill.getContents()).toEqual(new Delta().insert('The foxes!\n'));
  });

  it('ignore remote changes', function() {
    this.quill.undoManager.options.delay = 0;
    this.quill.undoManager.options.userOnly = true;
    this.quill.setText('\n');
    this.quill.insertText(0, 'a', Quill.sources.USER);
    this.quill.insertText(1, 'b', Quill.sources.API);
    this.quill.insertText(2, 'c', Quill.sources.USER);
    this.quill.insertText(3, 'd', Quill.sources.API);
    expect(this.quill.getText()).toEqual('abcd\n');
    this.quill.undoManager.undo();
    expect(this.quill.getText()).toEqual('abd\n');
    this.quill.undoManager.undo();
    expect(this.quill.getText()).toEqual('bd\n');
    this.quill.undoManager.redo();
    expect(this.quill.getText()).toEqual('abd\n');
    this.quill.undoManager.redo();
    expect(this.quill.getText()).toEqual('abcd\n');
  });
});
