(function() {
  describe('UndoManager', function() {
    var tests;
    beforeEach(function() {
      this.container = $('#editor-container').get(0);
      this.container.innerHTML = '<div> <p>The lazy fox</p> </div>';
      this.quill = new Quill(this.container.firstChild, {
        modules: {
          'undo-manager': {
            delay: 100
          }
        }
      });
      this.undoManager = this.quill.getModule('undo-manager');
      return this.original = this.quill.getContents();
    });
    tests = {
      'insert': {
        delta: Tandem.Delta.makeInsertDelta(13, 9, 'hairy '),
        index: 15
      },
      'delete': {
        delta: Tandem.Delta.makeDeleteDelta(13, 4, 5),
        index: 4
      },
      'format': {
        delta: Tandem.Delta.makeRetainDelta(13, 4, 5, {
          bold: true
        }),
        index: 9
      },
      'multiple': {
        delta: Tandem.Delta.makeDelta({
          startLength: 13,
          endLength: 14,
          ops: [
            {
              start: 0,
              end: 4,
              attributes: {
                bold: true
              }
            }, {
              value: 'hairy'
            }, {
              start: 8,
              end: 13
            }
          ]
        }),
        index: 9
      }
    };
    describe('_getLastChangeIndex', function() {
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var index;
          index = this.undoManager._getLastChangeIndex(test.delta);
          return expect(index).toEqual(test.index);
        });
      });
    });
    return describe('undo/redo', function() {
      _.each(tests, function(test, name) {
        return it(name, function() {
          var changed;
          this.quill.updateContents(test.delta);
          changed = this.quill.getContents();
          expect(changed).not.toEqualDelta(this.original);
          this.undoManager.undo();
          expect(this.quill.getContents()).toEqualDelta(this.original);
          this.undoManager.redo();
          return expect(this.quill.getContents()).toEqualDelta(changed);
        });
      });
      it('user change', function() {
        var changed;
        this.quill.root.firstChild.innerHTML = 'The lazy foxes';
        this.quill.editor.checkUpdate();
        changed = this.quill.getContents();
        expect(changed).not.toEqualDelta(this.original);
        this.undoManager.undo();
        expect(this.quill.getContents()).toEqualDelta(this.original);
        this.undoManager.redo();
        return expect(this.quill.getContents()).toEqualDelta(changed);
      });
      it('merge changes', function() {
        expect(this.undoManager.stack.undo.length).toEqual(0);
        this.quill.updateContents(Tandem.Delta.makeInsertDelta(13, 12, 'e'));
        expect(this.undoManager.stack.undo.length).toEqual(1);
        this.quill.updateContents(Tandem.Delta.makeInsertDelta(14, 13, 's'));
        expect(this.undoManager.stack.undo.length).toEqual(1);
        this.undoManager.undo();
        expect(this.quill.getContents()).toEqual(this.original);
        return expect(this.undoManager.stack.undo.length).toEqual(0);
      });
      it('dont merge changes', function(done) {
        expect(this.undoManager.stack.undo.length).toEqual(0);
        this.quill.updateContents(Tandem.Delta.makeInsertDelta(13, 12, 'e'));
        expect(this.undoManager.stack.undo.length).toEqual(1);
        return setTimeout((function(_this) {
          return function() {
            _this.quill.updateContents(Tandem.Delta.makeInsertDelta(14, 13, 's'));
            expect(_this.undoManager.stack.undo.length).toEqual(2);
            return done();
          };
        })(this), this.undoManager.options.delay * 1.25);
      });
      it('multiple undos', function(done) {
        var contents;
        expect(this.undoManager.stack.undo.length).toEqual(0);
        this.quill.updateContents(Tandem.Delta.makeInsertDelta(13, 12, 'e'));
        contents = this.quill.getContents();
        return setTimeout((function(_this) {
          return function() {
            _this.quill.updateContents(Tandem.Delta.makeInsertDelta(14, 13, 's'));
            _this.undoManager.undo();
            expect(_this.quill.getContents()).toEqual(contents);
            _this.undoManager.undo();
            expect(_this.quill.getContents()).toEqual(_this.original);
            return done();
          };
        })(this), this.undoManager.options.delay * 1.25);
      });
      return it('hotkeys', function() {
        var changed;
        this.quill.updateContents(Tandem.Delta.makeInsertDelta(13, 0, 'A '));
        changed = this.quill.getContents();
        expect(changed).not.toEqualDelta(this.original);
        Quill.DOM.triggerEvent(this.quill.root, 'keydown', Quill.Module.UndoManager.hotkeys.UNDO);
        expect(this.quill.getContents()).toEqualDelta(this.original);
        Quill.DOM.triggerEvent(this.quill.root, 'keydown', Quill.Module.UndoManager.hotkeys.REDO);
        return expect(this.quill.getContents()).toEqualDelta(changed);
      });
    });
  });

}).call(this);
