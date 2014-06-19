(function() {
  describe('Leaf', function() {
    beforeEach(function() {
      return this.container = $('#editor-container').html('').get(0);
    });
    describe('constructor', function() {
      var tests;
      tests = {
        'image': {
          html: '<img src="http://quilljs.com/images/cloud.png">',
          text: Quill.DOM.EMBED_TEXT
        },
        'break': {
          html: '<br>',
          text: ''
        },
        'empty element': {
          html: '<b></b>',
          text: ''
        },
        'text': {
          html: 'Text',
          text: 'Text'
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var leaf;
          this.container.innerHTML = test.html;
          leaf = new Quill.Leaf(this.container.firstChild, {});
          return expect(leaf.text).toEqual(test.text);
        });
      });
    });
    describe('isLeafNode()', function() {
      var tests;
      tests = {
        'text node': {
          html: 'Test',
          expected: true
        },
        'empty element': {
          html: '<b></b>',
          expected: true
        },
        'break': {
          html: '<br>',
          expected: true
        },
        'image': {
          html: '<img src="http://quilljs.com/images/cloud.png">',
          expected: true
        },
        'element with element child': {
          html: '<b><i></i></b>',
          expected: false
        },
        'element with text child': {
          html: '<b>Test</b>',
          expected: false
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          this.container.innerHTML = test.html;
          return expect(Quill.Leaf.isLeafNode(this.container.firstChild)).toBe(test.expected);
        });
      });
    });
    describe('deleteText()', function() {
      var tests;
      beforeEach(function() {
        this.container.innerHTML = 'Test';
        return this.leaf = new Quill.Leaf(this.container.firstChild, {});
      });
      tests = {
        'remove middle': {
          expected: 'Tt',
          offset: 1,
          length: 2
        },
        'remove till end': {
          expected: 'Te',
          offset: 2,
          length: 2
        },
        'remove all': {
          expected: '',
          offset: 0,
          length: 4
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          this.leaf.deleteText(test.offset, test.length);
          expect(this.leaf.text).toEqualHTML(test.expected);
          return expect(Quill.DOM.getText(this.leaf.node)).toEqualHTML(test.expected);
        });
      });
    });
    return describe('insertText()', function() {
      var tests;
      tests = {
        'element with text node': {
          initial: 'Test',
          expected: 'Te|st',
          text: 'Test'
        },
        'element without text node': {
          initial: '<b></b>',
          expected: '<b>|</b>'
        },
        'break': {
          initial: '<br>',
          expected: '|'
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var leaf, length, text;
          this.container.innerHTML = test.initial;
          leaf = new Quill.Leaf(this.container.firstChild, {});
          text = test.text || '';
          length = text.length;
          expect(leaf.text).toEqual(text);
          expect(leaf.length).toEqual(length);
          leaf.insertText(length / 2, '|');
          expect(this.container).toEqualHTML(test.expected);
          expect(leaf.text).toEqual(Quill.DOM.getText(leaf.node));
          return expect(leaf.length).toEqual(length + 1);
        });
      });
    });
  });

}).call(this);
