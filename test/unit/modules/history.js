import Delta from 'quill-delta';
import Quill from '../../../core';
import { getLastChangeIndex } from '../../../modules/history';


describe('History', function() {
  describe('getLastChangeIndex', function() {
    it('delete', function() {
      let delta = new Delta().retain(4).delete(2);
      expect(getLastChangeIndex(delta)).toEqual(4);
    });

    it('delete with inserts', function() {
      let delta = new Delta().retain(4).insert('test').delete(2);
      expect(getLastChangeIndex(delta)).toEqual(8);
    });

    it('insert text', function() {
      let delta = new Delta().retain(4).insert('testing');
      expect(getLastChangeIndex(delta)).toEqual(11);
    });

    it('insert embed', function() {
      let delta = new Delta().retain(4).insert({ image: true });
      expect(getLastChangeIndex(delta)).toEqual(5);
    });

    it('insert with deletes', function() {
      let delta = new Delta().retain(4).delete(3).insert('!');
      expect(getLastChangeIndex(delta)).toEqual(5);
    });

    it('format', function() {
      let delta = new Delta().retain(4).retain(3, { bold: true });
      expect(getLastChangeIndex(delta)).toEqual(7);
    });

    it('format newline', function() {
      let delta = new Delta().retain(4).retain(1, { align: 'left' });
      expect(getLastChangeIndex(delta)).toEqual(4);
    });

    it('format mixed', function() {
      let delta = new Delta().retain(4).retain(1, { align: 'left', bold: true });
      expect(getLastChangeIndex(delta)).toEqual(4);
    });

    it('insert newline', function() {
      let delta = new Delta().retain(4).insert('a\n');
      expect(getLastChangeIndex(delta)).toEqual(5);
    });

    it('mutliple newline inserts', function() {
      let delta = new Delta().retain(4).insert('ab\n\n');
      expect(getLastChangeIndex(delta)).toEqual(7);
    });
  });

  describe('undo/redo', function() {
    beforeEach(function() {
      this.initialize(HTMLElement, '<div><p>The lazy fox</p></div>');
      this.quill = new Quill(this.container.firstChild, {
        modules: {
          'history': { delay: 400 }
        }
      });
      this.original = this.quill.getContents();
    });

    it('limits undo stack size', function () {
      let quill = new Quill(this.container.firstChild, {
        modules: {
          history: { delay: 0, maxStack: 2 }
        }
      });
      ['A', 'B', 'C'].forEach(function(text) {
        quill.insertText(0, text)
      });
      expect(quill.history.stack.undo.length).toEqual(2);
    });

    it('user change', function() {
      this.quill.root.firstChild.innerHTML = 'The lazy foxes';
      this.quill.update();
      let changed = this.quill.getContents();
      expect(changed).not.toEqual(this.original);
      this.quill.history.undo();
      expect(this.quill.getContents()).toEqual(this.original);
      this.quill.history.redo();
      expect(this.quill.getContents()).toEqual(changed);
    });

    it('merge changes', function() {
      expect(this.quill.history.stack.undo.length).toEqual(0);
      this.quill.updateContents(new Delta().retain(12).insert('e'));
      expect(this.quill.history.stack.undo.length).toEqual(1);
      this.quill.updateContents(new Delta().retain(13).insert('s'));
      expect(this.quill.history.stack.undo.length).toEqual(1);
      this.quill.history.undo();
      expect(this.quill.getContents()).toEqual(this.original);
      expect(this.quill.history.stack.undo.length).toEqual(0);
    });

    it('dont merge changes', function(done) {
      expect(this.quill.history.stack.undo.length).toEqual(0);
      this.quill.updateContents(new Delta().retain(12).insert('e'));
      expect(this.quill.history.stack.undo.length).toEqual(1);
      setTimeout(() => {
        this.quill.updateContents(new Delta().retain(13).insert('s'));
        expect(this.quill.history.stack.undo.length).toEqual(2);
        done();
      }, this.quill.history.options.delay * 1.25);
    });

    it('multiple undos', function(done) {
      expect(this.quill.history.stack.undo.length).toEqual(0);
      this.quill.updateContents(new Delta().retain(12).insert('e'));
      let contents = this.quill.getContents();
      setTimeout(() => {
        this.quill.updateContents(new Delta().retain(13).insert('s'));
        this.quill.history.undo();
        expect(this.quill.getContents()).toEqual(contents);
        this.quill.history.undo();
        expect(this.quill.getContents()).toEqual(this.original);
        done();
      }, this.quill.history.options.delay * 1.25);
    });

    it('transform api change', function() {
      this.quill.history.options.userOnly = true;
      this.quill.updateContents(new Delta().retain(12).insert('es'), Quill.sources.USER);
      this.quill.history.lastRecorded = 0;
      this.quill.updateContents(new Delta().retain(14).insert('!'), Quill.sources.USER);
      this.quill.history.undo();
      this.quill.updateContents(new Delta().retain(4).delete(5), Quill.sources.API);
      expect(this.quill.getContents()).toEqual(new Delta().insert('The foxes\n'));
      this.quill.history.undo();
      expect(this.quill.getContents()).toEqual(new Delta().insert('The fox\n'));
      this.quill.history.redo();
      expect(this.quill.getContents()).toEqual(new Delta().insert('The foxes\n'));
      this.quill.history.redo();
      expect(this.quill.getContents()).toEqual(new Delta().insert('The foxes!\n'));
    });

    it('transform preserve intention', function() {
      let url = 'https://www.google.com/';
      this.quill.history.options.userOnly = true;
      this.quill.updateContents(new Delta().insert(url, { link: url }), Quill.sources.USER);
      this.quill.history.lastRecorded = 0;
      this.quill.updateContents(new Delta().delete(url.length).insert('Google', { link: url }), Quill.sources.API);
      this.quill.history.lastRecorded = 0;
      this.quill.updateContents(new Delta().retain(this.quill.getLength()-1).insert('!'), Quill.sources.USER);
      this.quill.history.lastRecorded = 0;
      expect(this.quill.getContents()).toEqual(new Delta().insert('Google', { link: url }).insert('The lazy fox!\n'));
      this.quill.history.undo();
      expect(this.quill.getContents()).toEqual(new Delta().insert('Google', { link: url }).insert('The lazy fox\n'));
      this.quill.history.undo();
      expect(this.quill.getContents()).toEqual(new Delta().insert('Google', { link: url }).insert('The lazy fox\n'));
    });

    it('ignore remote changes', function() {
      this.quill.history.options.delay = 0;
      this.quill.history.options.userOnly = true;
      this.quill.setText('\n');
      this.quill.insertText(0, 'a', Quill.sources.USER);
      this.quill.insertText(1, 'b', Quill.sources.API);
      this.quill.insertText(2, 'c', Quill.sources.USER);
      this.quill.insertText(3, 'd', Quill.sources.API);
      expect(this.quill.getText()).toEqual('abcd\n');
      this.quill.history.undo();
      expect(this.quill.getText()).toEqual('abd\n');
      this.quill.history.undo();
      expect(this.quill.getText()).toEqual('bd\n');
      this.quill.history.redo();
      expect(this.quill.getText()).toEqual('abd\n');
      this.quill.history.redo();
      expect(this.quill.getText()).toEqual('abcd\n');
    });
  });
});
