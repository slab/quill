(function() {
  describe('Editor', function() {
    beforeEach(function() {
      var emitter;
      this.container = $('#editor-container').html('<div></div>').get(0);
      Quill.Lib.EventEmitter2.events = Quill.events;
      emitter = new Quill.Lib.EventEmitter2;
      return this.editor = new Quill.Editor(this.container.firstChild, emitter, {
        formats: Quill.DEFAULTS.formats
      });
    });
    describe('_deleteAt()', function() {
      var tests;
      tests = {
        'part of line': {
          initial: ['<p>0123</p>'],
          expected: ['<p>03</p>'],
          index: 1,
          length: 2
        },
        'part of multiple lines': {
          initial: ['<p>0123</p>', '<p><b>5678</b></p>'],
          expected: ['<p>01<b>78</b></p>'],
          index: 2,
          length: 5
        },
        'entire line keeping trailing newline': {
          initial: ['<p>0123</p>', '<p><b>5678</b></p>'],
          expected: ['<p><br></p>', '<p><b>5678</b></p>'],
          index: 0,
          length: 4
        },
        'trailing newline': {
          initial: ['<p>0123</p>', '<p><b>5678</b></p>'],
          expected: ['<p>0123<b>5678</b></p>'],
          index: 4,
          length: 1
        },
        'entire line and parts of neighbors': {
          initial: ['<p>0123</p>', '<p><b>5678</b></p>', '<p>abcd</p>'],
          expected: ['<p>01cd</p>'],
          index: 2,
          length: 10
        },
        'entire doc': {
          initial: ['<p>0123</p>', '<p><b>5678</b></p>'],
          expected: [''],
          index: 0,
          length: 10
        },
        'entire doc except trailing newline': {
          initial: ['<p>0123</p>', '<p><b>5678</b></p>'],
          expected: ['<p><br></p>'],
          index: 0,
          length: 9
        },
        'last trailing newline': {
          initial: ['<p>0123</p>'],
          expected: ['<p>0123</p>'],
          index: 4,
          length: 1
        },
        'bulleted line': {
          initial: ['<p>0</p><ul><li><br></li>'],
          expected: ['<p>0</p>'],
          index: 2,
          length: 1
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          this.editor.doc.setHTML(test.initial.join(''));
          this.editor._deleteAt(test.index, test.length);
          this.editor.doc.optimizeLines();
          return expect(this.editor.root).toEqualHTML(test.expected.join(''), true);
        });
      });
    });
    describe('_formatAt()', function() {
      var tests;
      tests = {
        'part of line': {
          initial: ['<p>0123</p>'],
          expected: Tandem.Delta.makeDelta({
            startLength: 0,
            ops: [
              {
                value: '0'
              }, {
                value: '12',
                attributes: {
                  bold: true
                }
              }, {
                value: '3\n'
              }
            ]
          }),
          index: 1,
          length: 2,
          name: 'bold',
          value: true
        },
        'trailing newline with normal format': {
          initial: ['<p>0123</p>'],
          expected: Tandem.Delta.makeDelta({
            startLength: 0,
            ops: [
              {
                value: '0123'
              }, {
                value: '\n',
                attributes: {
                  bold: true
                }
              }
            ]
          }),
          index: 4,
          length: 1,
          name: 'bold',
          value: true
        },
        'trailing newline with line format': {
          initial: ['<p>0123</p>'],
          expected: Tandem.Delta.makeDelta({
            startLength: 0,
            ops: [
              {
                value: '0123'
              }, {
                value: '\n',
                attributes: {
                  align: 'right'
                }
              }
            ]
          }),
          index: 4,
          length: 1,
          name: 'align',
          value: 'right'
        },
        'part of multiple lines': {
          initial: ['<p>0123</p>', '<p><b>5678</b></p>'],
          expected: Tandem.Delta.makeDelta({
            startLength: 0,
            ops: [
              {
                value: '01'
              }, {
                value: '23\n',
                attributes: {
                  strike: true
                }
              }, {
                value: '56',
                attributes: {
                  bold: true,
                  strike: true
                }
              }, {
                value: '78',
                attributes: {
                  bold: true
                }
              }, {
                value: '\n'
              }
            ]
          }),
          index: 2,
          length: 5,
          name: 'strike',
          value: true
        },
        'line contents with line level format': {
          initial: ['<p>0123</p>'],
          expected: Tandem.Delta.makeDelta({
            startLength: 0,
            ops: [
              {
                value: '0123\n'
              }
            ]
          }),
          index: 1,
          length: 2,
          name: 'align',
          value: 'right'
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          this.editor.doc.setHTML(test.initial.join(''));
          this.editor._formatAt(test.index, test.length, test.name, test.value);
          this.editor.doc.optimizeLines();
          return expect(this.editor.doc.toDelta()).toEqualDelta(test.expected);
        });
      });
    });
    describe('_insertAt()', function() {
      describe('empty', function() {
        var tests;
        tests = {
          'text': {
            expected: '<p>Test</p>',
            text: 'Test'
          },
          'formatted text': {
            expected: '<p><i><b>Test</b></i></p>',
            text: 'Test',
            formats: {
              bold: true,
              italic: true
            }
          },
          'newline': {
            expected: '<p><br></p>',
            text: '\n'
          },
          'multiple newlines': {
            expected: '<p><br></p><p><br></p>',
            text: '\n\n'
          },
          'multiline insert': {
            expected: '<p>A</p><p>B</p>',
            text: 'A\nB\n'
          }
        };
        _.each(tests, function(test, name) {
          return it(name, function() {
            this.editor._insertAt(0, test.text, test.formats);
            this.editor.doc.optimizeLines();
            return expect(this.editor.root).toEqualHTML(test.expected, true);
          });
        });
        it('formatted newline', function() {
          this.editor._insertAt(0, 'A\n', {
            bold: true
          });
          this.editor.doc.optimizeLines();
          expect(this.editor.root).toEqualHTML('<p><b>A</b></p>', true);
          return expect(this.editor.doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, 'A\n', {
            bold: true
          }));
        });
        return it('multiple formatted newlines', function() {
          this.editor._insertAt(0, 'A\nB\n', {
            bold: true
          });
          this.editor.doc.optimizeLines();
          expect(this.editor.root).toEqualHTML('<p><b>A</b></p><p><b>B</b></p>', true);
          return expect(this.editor.doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, 'A\nB\n', {
            bold: true
          }));
        });
      });
      return describe('nonempty', function() {
        var tests;
        tests = {
          'insert in middle of text': {
            expected: ['<p>01A23<b><i>4567</i></b></p>'],
            index: 2,
            text: 'A'
          },
          'insert in middle of formatted text': {
            expected: ['<p>0123<b><i>45</i></b>A<b><i>67</i></b></p>'],
            index: 6,
            text: 'A'
          },
          'insert formatted text with match': {
            expected: ['<p>0123<b><i>45A67</i></b></p>'],
            index: 6,
            text: 'A',
            formats: {
              bold: true,
              italic: true
            }
          },
          'prepend newline': {
            expected: ['<p><br></p>', '<p>0123<b><i>4567</i></b></p>'],
            index: 0,
            text: '\n'
          },
          'append newline': {
            expected: ['<p>0123<b><i>4567</i></b></p>', '<p><br></p>'],
            index: 8,
            text: '\n'
          },
          'insert newline in middle': {
            expected: ['<p>0123<b><i>45</i></b></p>', '<p><b><i>67</i></b></p>'],
            index: 6,
            text: '\n'
          },
          'insert two newlines in middle': {
            expected: ['<p>0123<b><i>45</i></b></p>', '<p><br></p>', '<p><b><i>67</i></b></p>'],
            index: 6,
            text: '\n\n'
          },
          'insert text with newline': {
            expected: ['<p>0123<b><i>45</i></b>A</p>', '<p>B<b><i>67</i></b></p>'],
            index: 6,
            text: 'A\nB'
          },
          'multiline insert with preceding newline': {
            expected: ['<p>0123<b><i>45</i></b></p>', '<p>A</p>', '<p>B<b><i>67</i></b></p>'],
            index: 6,
            text: '\nA\nB'
          },
          'multiline insert with newline after': {
            expected: ['<p>0123<b><i>45</i></b>A</p>', '<p>B</p>', '<p><b><i>67</i></b></p>'],
            index: 6,
            text: 'A\nB\n'
          },
          'multiline insert with newline surrounding': {
            expected: ['<p>0123<b><i>45</i></b></p>', '<p>A</p>', '<p>B</p>', '<p><b><i>67</i></b></p>'],
            index: 6,
            text: '\nA\nB\n'
          }
        };
        _.each(tests, function(test, name) {
          return it(name, function() {
            this.editor.doc.setHTML('<p>0123<b><i>4567</i></b></p>');
            this.editor._insertAt(test.index, test.text, test.formats);
            this.editor.doc.optimizeLines();
            return expect(this.editor.root).toEqualHTML(test.expected.join(''), true);
          });
        });
        it('append formatted newline', function() {
          this.editor.doc.setHTML('<p>A</p>');
          this.editor._insertAt(2, '\n', {
            bold: true
          });
          this.editor.doc.optimizeLines();
          expect(this.editor.root).toEqualHTML('<p>A</p><p><br></p>', true);
          return expect(this.editor.doc.toDelta()).toEqualDelta(Tandem.Delta.makeDelta({
            startLength: 0,
            endLength: 3,
            ops: [
              {
                value: 'A\n'
              }, {
                value: '\n',
                attributes: {
                  bold: true
                }
              }
            ]
          }));
        });
        it('insert after image', function() {
          this.editor.doc.setHTML('<p><img src="http://quilljs.com/images/cloud.png"></p>');
          this.editor._insertAt(1, 'A', {
            bold: true
          });
          this.editor.doc.optimizeLines();
          return expect(this.editor.root).toEqualHTML('<p><img src="http://quilljs.com/images/cloud.png"><b>A</b></p>', true);
        });
        return it('insert newline after bullet', function() {
          this.editor.doc.setHTML('<ul><li>One</li></ul>');
          this.editor._insertAt(1, '\n');
          this.editor.doc.optimizeLines();
          return expect(this.editor.root).toEqualHTML('<p>O</p><ul><li>ne</li></ul>', true);
        });
      });
    });
    return describe('applyDelta()', function() {
      var tests;
      tests = {
        'insert formatted': {
          initial: '<p>0123</p>',
          delta: Tandem.Delta.makeInsertDelta(5, 2, '|', {
            bold: true
          }),
          expected: '<p>01<b>|</b>23</p>'
        },
        'multiple formats': {
          initial: '<p>0123</p>',
          delta: Tandem.Delta.makeRetainDelta(5, 1, 2, {
            bold: true,
            italic: true
          }),
          expected: '<p>0<b><i>12</i></b>3</p>'
        },
        'multiple instructions': {
          initial: '<p>0123</p> <p>5678</p> <p>abcd</p>',
          delta: Tandem.Delta.makeDelta({
            startLength: 15,
            endLength: 17,
            ops: [
              {
                start: 0,
                end: 4
              }, {
                start: 5,
                end: 7
              }, {
                value: '|\n|'
              }, {
                start: 7,
                end: 14
              }, {
                start: 14,
                end: 15,
                attributes: {
                  align: 'right'
                }
              }
            ]
          }),
          expected: '<p>012356|</p> <p>|78</p> <p style="text-align: right;">abcd</p>'
        }
      };
      _.each(tests, function(test, name) {
        return it(name, function() {
          this.editor.doc.setHTML(test.initial);
          this.editor.checkUpdate();
          this.editor.applyDelta(test.delta);
          return expect(this.editor.root).toEqualHTML(test.expected, true);
        });
      });
      return it('local change', function() {
        var delta, expected;
        this.editor.doc.setHTML('<p>0123</p>');
        this.editor.checkUpdate();
        delta = Tandem.Delta.makeInsertDelta(5, 4, '|');
        this.editor.root.querySelector('p').innerHTML = '01a23';
        this.editor.applyDelta(delta);
        expected = '<p>01a23|</p>';
        return expect(this.editor.root).toEqualHTML(expected, true);
      });
    });
  });

}).call(this);
