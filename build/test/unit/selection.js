(function() {
  describe('Selection', function() {
    beforeEach(function() {
      return this.container = $('#editor-container').get(0);
    });
    describe('helpers', function() {
      var tests;
      beforeEach(function() {
        this.container.innerHTML = '<div> <p>0123</p> <p><br></p> <p><img src="http://quilljs.com/images/cloud.png"></p> <ul> <li>One</li> <li>Two</li> </ul> <p><b><s>89</s></b><i>ab</i></p> </div>';
        this.quill = new Quill(this.container.firstChild);
        return this.selection = this.quill.editor.selection;
      });
      tests = {
        'text node': {
          "native": function() {
            return [this.quill.root.querySelector('s').firstChild, 1];
          },
          encoded: function() {
            return [this.quill.root.querySelector('s').firstChild, 1];
          },
          index: 17
        },
        'between leaves': {
          "native": function() {
            return [this.quill.root.querySelector('s').firstChild, 2];
          },
          encoded: function() {
            return [this.quill.root.querySelector('s').firstChild, 2];
          },
          index: 18
        },
        'break node': {
          "native": function() {
            return [this.quill.root.querySelector('br').parentNode, 0];
          },
          encoded: function() {
            return [this.quill.root.querySelector('br'), 0];
          },
          index: 5
        },
        'before image': {
          "native": function() {
            return [this.quill.root.querySelector('img').parentNode, 0];
          },
          encoded: function() {
            return [this.quill.root.querySelector('img'), 0];
          },
          index: 6
        },
        'after image': {
          "native": function() {
            return [this.quill.root.querySelector('img').parentNode, 1];
          },
          encoded: function() {
            return [this.quill.root.querySelector('img'), 1];
          },
          index: 7
        },
        'bullet': {
          "native": function() {
            return [this.quill.root.querySelectorAll('li')[1].firstChild, 1];
          },
          encoded: function() {
            return [this.quill.root.querySelectorAll('li')[1].firstChild, 1];
          },
          index: 13
        },
        'last node': {
          "native": function() {
            return [this.quill.root.querySelector('i').firstChild, 2];
          },
          encoded: function() {
            return [this.quill.root.querySelector('i').firstChild, 2];
          },
          index: 20
        }
      };
      describe('_decodePosition()', function() {
        return _.each(tests, function(test, name) {
          return it(name, function() {
            var expectedNode, expectedOffset, node, offset, resultNode, resultOffset, _ref, _ref1, _ref2;
            _ref = test.encoded.call(this), node = _ref[0], offset = _ref[1];
            _ref1 = this.selection._decodePosition(node, offset), resultNode = _ref1[0], resultOffset = _ref1[1];
            _ref2 = test["native"].call(this), expectedNode = _ref2[0], expectedOffset = _ref2[1];
            expect(resultNode).toEqual(expectedNode);
            return expect(resultOffset).toEqual(expectedOffset);
          });
        });
      });
      describe('_encodePosition()', function() {
        _.each(tests, function(test, name) {
          return it(name, function() {
            var expectedNode, expectedOffset, node, offset, resultNode, resultOffset, _ref, _ref1, _ref2;
            _ref = test["native"].call(this), node = _ref[0], offset = _ref[1];
            _ref1 = this.selection._encodePosition(node, offset), resultNode = _ref1[0], resultOffset = _ref1[1];
            _ref2 = test.encoded.call(this), expectedNode = _ref2[0], expectedOffset = _ref2[1];
            expect(resultNode).toEqual(expectedNode);
            return expect(resultOffset).toEqual(expectedOffset);
          });
        });
        it('empty document', function() {
          var quill, resultIndex, resultNode, _ref;
          this.container.innerHTML = '<div></div>';
          quill = new Quill(this.container.firstChild);
          quill.root.innerHTML = '';
          quill.editor.doc.rebuild();
          _ref = quill.editor.selection._encodePosition(quill.root, 0), resultNode = _ref[0], resultIndex = _ref[1];
          expect(Quill.DOM.isTextNode(resultNode)).toBe(true);
          expect(Quill.DOM.getText(resultNode)).toEqual('');
          return expect(resultIndex).toEqual(0);
        });
        return it('end of document', function() {
          var resultNode, resultOffset, _ref;
          _ref = this.selection._encodePosition(this.quill.root, 5), resultNode = _ref[0], resultOffset = _ref[1];
          expect(resultNode).toEqual(this.quill.root.querySelector('i').firstChild);
          return expect(resultOffset).toEqual(2);
        });
      });
      describe('_positionToIndex()', function() {
        _.each(tests, function(test, name) {
          return it(name, function() {
            var index, node, offset, _ref;
            _ref = test["native"].call(this), node = _ref[0], offset = _ref[1];
            index = this.selection._positionToIndex(node, offset);
            return expect(index).toEqual(test.index);
          });
        });
        return it('empty document', function() {
          var index, quill;
          this.container.innerHTML = '<div></div>';
          quill = new Quill(this.container.firstChild);
          index = quill.editor.selection._positionToIndex(quill.root, 0);
          return expect(index).toEqual(0);
        });
      });
      describe('_indexToPosition()', function() {
        _.each(tests, function(test, name) {
          return it(name, function() {
            var expectedNode, expectedOffset, node, offset, _ref, _ref1;
            _ref = this.selection._indexToPosition(test.index), node = _ref[0], offset = _ref[1];
            _ref1 = test["native"].call(this), expectedNode = _ref1[0], expectedOffset = _ref1[1];
            expect(node).toEqual(expectedNode);
            return expect(offset).toEqual(expectedOffset);
          });
        });
        it('empty document', function() {
          var node, offset, quill, _ref;
          this.container.innerHTML = '<div></div>';
          quill = new Quill(this.container.firstChild);
          quill.root.innerHTML = '';
          quill.editor.doc.rebuild();
          _ref = quill.editor.selection._indexToPosition(0), node = _ref[0], offset = _ref[1];
          expect(node).toEqual(quill.root);
          return expect(offset).toEqual(0);
        });
        return it('multiple consecutive images', function() {
          var node, offset, quill, _ref;
          this.container.innerHTML = '<div> <p><img src="http://quilljs.com/images/cloud.png"><img src="http://quilljs.com/images/cloud.png"></p> </div>';
          quill = new Quill(this.container.firstChild);
          _ref = quill.editor.selection._indexToPosition(1), node = _ref[0], offset = _ref[1];
          expect(node).toEqual(quill.root.firstChild);
          return expect(offset).toEqual(1);
        });
      });
      return describe('get/set range', function() {
        _.each(tests, function(test, name) {
          return it(name, function() {
            var range;
            this.selection.setRange(new Quill.Lib.Range(test.index, test.index));
            expect(this.selection.checkFocus()).toBe(true);
            range = this.selection.getRange();
            expect(range).not.toEqual(null);
            expect(range.start).toEqual(test.index);
            return expect(range.end).toEqual(test.index);
          });
        });
        it('entire document', function() {
          var range;
          this.selection.setRange(new Quill.Lib.Range(0, 20));
          expect(this.selection.checkFocus()).toBe(true);
          range = this.selection.getRange();
          expect(range).not.toEqual(null);
          expect(range.start).toEqual(0);
          return expect(range.end).toEqual(20);
        });
        it('null range', function() {
          var range;
          this.selection.setRange(new Quill.Lib.Range(0, 0));
          expect(this.selection.checkFocus()).toBe(true);
          this.selection.setRange(null);
          expect(this.selection.checkFocus()).toBe(false);
          range = this.selection.getRange();
          return expect(range).toBe(null);
        });
        return it('empty document', function() {
          var quill, range;
          this.container.innerHTML = '<div></div>';
          quill = new Quill(this.container.firstChild);
          quill.editor.selection.setRange(new Quill.Lib.Range(0, 0));
          expect(quill.editor.selection.checkFocus()).toBe(true);
          range = quill.editor.selection.getRange();
          expect(range).not.toEqual(null);
          expect(range.start).toEqual(0);
          return expect(range.end).toEqual(0);
        });
      });
    });
    return describe('preserve', function() {
      describe('shiftAfter()', function() {
        return it('line optimization', function() {
          var quill, range;
          this.container.innerHTML = '<div> <p><br></p> <p>1234</p> </div>';
          quill = new Quill(this.container.firstChild);
          quill.editor.selection.setRange(new Quill.Lib.Range(0, 3));
          quill.editor._insertAt(0, Quill.DOM.EMBED_TEXT, {
            image: 'http://quilljs.com/images/cloud.png'
          });
          quill.editor._formatAt(2, 4, 'bold', true);
          expect(quill.root).toEqualHTML('<p><img src="http://quilljs.com/images/cloud.png"><br></p> <p><b>1234</b></p>', true);
          range = quill.editor.selection.getRange();
          expect(range.start).toEqual(1);
          expect(range.end).toEqual(4);
          quill.editor.selection.shiftAfter(0, 0, _.bind(quill.editor.doc.optimizeLines, quill.editor.doc));
          range = quill.editor.selection.getRange();
          expect(range.start).toEqual(1);
          return expect(range.end).toEqual(4);
        });
      });
      return describe('preserve()', function() {
        beforeEach(function() {
          this.container.innerHTML = '<div></div>';
          this.quill = new Quill(this.container.firstChild);
          this.doc = this.quill.editor.doc;
          return this.selection = this.quill.editor.selection;
        });
        it('wrapInline() text', function() {
          var range, textNode;
          this.quill.root.innerHTML = 'Test';
          textNode = this.quill.root.firstChild;
          this.selection._setNativeRange(textNode, 0, textNode, 4);
          this.selection.preserve(_.bind(this.doc.rebuild, this.doc));
          range = this.selection.getRange();
          expect(range.start).toEqual(0);
          return expect(range.end).toEqual(4);
        });
        it('wrapInline() image', function() {
          var range;
          this.quill.root.innerHTML = '<img src="http://quilljs.com/images/cloud.png">';
          this.selection._setNativeRange(this.quill.root, 0, this.quill.root, 1);
          this.selection.preserve(_.bind(this.doc.rebuild, this.doc));
          range = this.selection.getRange();
          expect(range.start).toEqual(0);
          return expect(range.end).toEqual(1);
        });
        it('handleBreaks()', function() {
          var firstTextNode, lastTextNode, range;
          this.quill.root.innerHTML = '<p>01<br>34</p>';
          firstTextNode = this.quill.root.firstChild.firstChild;
          lastTextNode = this.quill.root.firstChild.lastChild;
          this.selection._setNativeRange(firstTextNode, 1, lastTextNode, 1);
          this.selection.preserve(_.bind(this.doc.rebuild, this.doc));
          range = this.selection.getRange();
          expect(range.start).toEqual(1);
          return expect(range.end).toEqual(4);
        });
        it('pullBlocks()', function() {
          var firstTextNode, lastTextNode, range;
          this.quill.root.innerHTML = '<div><div>01</div><div>34</div></div>';
          firstTextNode = this.quill.root.firstChild.firstChild.firstChild;
          lastTextNode = this.quill.root.firstChild.lastChild.firstChild;
          this.selection._setNativeRange(firstTextNode, 1, lastTextNode, 1);
          this.selection.preserve(_.bind(this.doc.rebuild, this.doc));
          range = this.selection.getRange();
          expect(range.start).toEqual(1);
          return expect(range.end).toEqual(4);
        });
        it('wrapText()', function() {
          var firstTextNode, lastTextNode, range;
          this.quill.root.innerHTML = '<p>0123</p><p>5678</p>';
          firstTextNode = this.quill.root.firstChild.firstChild;
          lastTextNode = this.quill.root.lastChild.firstChild;
          this.selection._setNativeRange(firstTextNode, 2, lastTextNode, 2);
          this.selection.preserve(_.bind(this.doc.rebuild, this.doc));
          range = this.selection.getRange();
          expect(range.start).toEqual(2);
          return expect(range.end).toEqual(7);
        });
        return it('no range', function() {
          var range, textNode;
          this.quill.root.innerHTML = '<p>Test</p>';
          textNode = this.quill.root.querySelector('p').firstChild;
          this.selection._setNativeRange(null);
          this.selection.preserve(_.bind(this.doc.rebuild, this.doc));
          range = this.selection.getRange();
          return expect(range).toBe(null);
        });
      });
    });
  });

}).call(this);
