(function() {
  describe('Document', function() {
    beforeEach(function() {
      return this.container = $('#editor-container').html('').get(0);
    });
    describe('constructor', function() {
      var tests;
      tests = {
        'blank': {
          initial: '',
          expected: ''
        },
        'no change': {
          initial: '<p><b>Test</b></p>',
          expected: '<p><b>Test</b></p>'
        },
        'text': {
          initial: 'Test',
          expected: '<p>Test</p>'
        },
        'inline': {
          initial: '<b>Test</b>',
          expected: '<p><b>Test</b></p>'
        },
        'block pulling': {
          initial: '<div><div><div><div><b>Test</b><div>Test</div></div></div></div></div>',
          expected: '<p><b>Test</b></p><p>Test</p>'
        },
        'with breaks': {
          initial: '<p>A<br>B<br>C</p>',
          expected: '<p>A<br></p><p>B<br></p><p>C</p>'
        },
        'pull and break': {
          initial: '<div><div><div>A</div>B<br>C</div></div>',
          expected: '<p>A</p><p>B<br></p><p>C</p>'
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var doc;
          this.container.innerHTML = "<div>" + test.initial + "</div>";
          doc = new Quill.Document(this.container.firstChild, {
            formats: Quill.DEFAULTS.formats
          });
          return expect(this.container.firstChild).toEqualHTML(test.expected, true);
        });
      });
    });
    describe('search', function() {
      beforeEach(function() {
        this.container.innerHTML = '<div> <p>0123</p> <p><br></p> <p><b>6789</b></p> </div>';
        return this.doc = new Quill.Document(this.container.firstChild, {
          formats: Quill.DEFAULTS.formats
        });
      });
      it('findLine() lineNode', function() {
        var line;
        line = this.doc.findLine(this.doc.root.firstChild);
        return expect(line).toEqual(this.doc.lines.first);
      });
      it('findLine() not a line', function() {
        var line, node;
        node = this.doc.root.ownerDocument.createElement('i');
        node.innerHTML = 'Test';
        this.doc.root.appendChild(node);
        line = this.doc.findLine(node);
        return expect(line).toBe(null);
      });
      it('findLine() not in doc', function() {
        var line;
        line = this.doc.findLine($('#toolbar-container').get(0));
        return expect(line).toBe(null);
      });
      it('findLine() id false positive', function() {
        var clone, line;
        clone = this.doc.root.firstChild.cloneNode(true);
        this.doc.root.appendChild(clone);
        line = this.doc.findLine(clone);
        return expect(line).toBe(null);
      });
      it('findLine() leaf node', function() {
        var line;
        line = this.doc.findLine(this.doc.root.querySelector('b'));
        return expect(line).toEqual(this.doc.lines.last);
      });
      it('findLineAt() middle of line', function() {
        var line, offset, _ref;
        _ref = this.doc.findLineAt(2), line = _ref[0], offset = _ref[1];
        expect(line).toEqual(this.doc.lines.first);
        return expect(offset).toEqual(2);
      });
      it('findLineAt() last line', function() {
        var line, offset, _ref;
        _ref = this.doc.findLineAt(8), line = _ref[0], offset = _ref[1];
        expect(line).toEqual(this.doc.lines.last);
        return expect(offset).toEqual(2);
      });
      it('findLineAt() end of line', function() {
        var line, offset, _ref;
        _ref = this.doc.findLineAt(4), line = _ref[0], offset = _ref[1];
        expect(line).toEqual(this.doc.lines.first);
        return expect(offset).toEqual(4);
      });
      it('findLineAt() newline', function() {
        var line, offset, _ref;
        _ref = this.doc.findLineAt(5), line = _ref[0], offset = _ref[1];
        expect(line).toEqual(this.doc.lines.first.next);
        return expect(offset).toEqual(0);
      });
      it('findLineAt() end of document', function() {
        var line, offset, _ref;
        _ref = this.doc.findLineAt(11), line = _ref[0], offset = _ref[1];
        expect(line).toBe(this.doc.lines.last);
        return expect(offset).toEqual(5);
      });
      return it('findLineAt() beyond document', function() {
        var line, offset, _ref;
        _ref = this.doc.findLineAt(12), line = _ref[0], offset = _ref[1];
        expect(line).toBe(null);
        return expect(offset).toEqual(1);
      });
    });
    describe('manipulation', function() {
      beforeEach(function() {
        this.container.innerHTML = Quill.Normalizer.stripWhitespace('<div> <p>Test</p> <p><i>Test</i></p> <p><br></p> <p><br></p> <p><b>Test</b></p> </div>');
        this.doc = new Quill.Document(this.container.firstChild, {
          formats: Quill.DEFAULTS.formats
        });
        return this.lines = this.doc.lines.toArray();
      });
      it('mergeLines() normal', function() {
        this.doc.mergeLines(this.lines[0], this.lines[1]);
        expect(this.doc.root).toEqualHTML('<p>Test<i>Test</i></p> <p><br></p> <p><br></p> <p><b>Test</b></p>', true);
        return expect(this.doc.lines.length).toEqual(this.lines.length - 1);
      });
      it('mergeLines() with newline', function() {
        this.doc.mergeLines(this.lines[1], this.lines[2]);
        expect(this.doc.root).toEqualHTML('<p>Test</p> <p><i>Test</i></p> <p><br></p> <p><b>Test</b></p>', true);
        return expect(this.doc.lines.length).toEqual(this.lines.length - 1);
      });
      it('mergeLines() from newline', function() {
        this.doc.mergeLines(this.lines[3], this.lines[4]);
        expect(this.doc.root).toEqualHTML('<p>Test</p> <p><i>Test</i></p> <p><br></p> <p><b>Test</b></p>', true);
        return expect(this.doc.lines.length).toEqual(this.lines.length - 1);
      });
      it('mergeLines() two newlines', function() {
        this.doc.mergeLines(this.lines[2], this.lines[3]);
        expect(this.doc.root).toEqualHTML('<p>Test</p> <p><i>Test</i></p> <p><br></p> <p><b>Test</b></p>', true);
        return expect(this.doc.lines.length).toEqual(this.lines.length - 1);
      });
      it('removeLine() existing', function() {
        this.doc.removeLine(this.lines[1]);
        expect(this.doc.root).toEqualHTML('<p>Test</p> <p><br></p> <p><br></p> <p><b>Test</b></p>', true);
        return expect(this.doc.lines.length).toEqual(this.lines.length - 1);
      });
      it('removeLine() lineNode missing', function() {
        Quill.DOM.removeNode(this.lines[1].node);
        this.doc.removeLine(this.lines[1]);
        expect(this.doc.root).toEqualHTML('<p>Test</p> <p><br></p> <p><br></p> <p><b>Test</b></p>', true);
        return expect(this.doc.lines.length).toEqual(this.lines.length - 1);
      });
      it('splitLine() middle', function() {
        this.doc.splitLine(this.lines[1], 2);
        expect(this.doc.root).toEqualHTML('<p>Test</p> <p><i>Te</i></p> <p><i>st</i></p> <p><br></p> <p><br></p> <p><b>Test</b></p>', true);
        return expect(this.doc.lines.length).toEqual(this.lines.length + 1);
      });
      it('splitLine() beginning', function() {
        this.doc.splitLine(this.lines[1], 0);
        expect(this.doc.root).toEqualHTML('<p>Test</p> <p><br></p> <p><i>Test</i></p> <p><br></p> <p><br></p> <p><b>Test</b></p>', true);
        return expect(this.doc.lines.length).toEqual(this.lines.length + 1);
      });
      it('splitLine() end', function() {
        this.doc.splitLine(this.lines[1], 4);
        expect(this.doc.root).toEqualHTML('<p>Test</p> <p><i>Test</i></p> <p><br></p> <p><br></p> <p><br></p> <p><b>Test</b></p>', true);
        return expect(this.doc.lines.length).toEqual(this.lines.length + 1);
      });
      it('splitLine() beyond end', function() {
        this.doc.splitLine(this.lines[1], 5);
        expect(this.doc.root).toEqualHTML('<p>Test</p> <p><i>Test</i></p> <p><br></p> <p><br></p> <p><br></p> <p><b>Test</b></p>', true);
        return expect(this.doc.lines.length).toEqual(this.lines.length + 1);
      });
      it('splitLine() split break', function() {
        this.doc.splitLine(this.lines[2], 0);
        expect(this.doc.root).toEqualHTML('<p>Test</p> <p><i>Test</i></p> <p><br></p> <p><br></p> <p><br></p> <p><b>Test</b></p>', true);
        return expect(this.doc.lines.length).toEqual(this.lines.length + 1);
      });
      it('setHTML() valid', function() {
        var html;
        html = '<p>Test</p>';
        this.doc.setHTML(html);
        return expect(this.doc.root).toEqualHTML(html, true);
      });
      it('setHTML() invalid', function() {
        this.doc.setHTML('<div> <div> <div>A</div>B<br>C</div> </div> </div> <div> <b></b> </div>');
        return expect(this.doc.root).toEqualHTML('<p>A</p> <p>B<br></p> <p>C</p> <p><b></b><br></p>', true);
      });
      return it('setHTML() with comment', function() {
        return this.doc.setHTML('<!-- HTML Comment --> <p>Test</p>');
      });
    });
    describe('toDelta()', function() {
      var tests;
      tests = {
        'blank': {
          initial: [''],
          expected: Tandem.Delta.getInitial('')
        },
        'single line': {
          initial: ['<p>0123</p>'],
          expected: Tandem.Delta.getInitial('0123\n')
        },
        'single newline': {
          initial: ['<p><br></p>'],
          expected: Tandem.Delta.getInitial('\n')
        },
        'preceding newline': {
          initial: ['<p><br></p>', '<p>0</p>'],
          expected: Tandem.Delta.getInitial('\n0\n')
        },
        'explicit trailing newline': {
          initial: ['<p>0</p>', '<p><br></p>'],
          expected: Tandem.Delta.getInitial('0\n\n')
        },
        'multiple lines': {
          initial: ['<p>0</p>', '<p>1</p>'],
          expected: Tandem.Delta.getInitial('0\n1\n')
        },
        'multiple newlines': {
          initial: ['<p><br></p>', '<p><br></p>'],
          expected: Tandem.Delta.getInitial('\n\n')
        },
        'multiple preceding newlines': {
          initial: ['<p><br></p>', '<p><br></p>', '<p>0</p>'],
          expected: Tandem.Delta.getInitial('\n\n0\n')
        },
        'multiple explicit trailing newlines': {
          initial: ['<p>0</p>', '<p><br></p>', '<p><br></p>'],
          expected: Tandem.Delta.getInitial('0\n\n\n')
        },
        'lines separated by multiple newlines': {
          initial: ['<p>0</p>', '<p><br></p>', '<p>1</p>'],
          expected: Tandem.Delta.getInitial('0\n\n1\n')
        },
        'tag format': {
          initial: ['<p><b>0123</b></p>'],
          expected: Tandem.Delta.makeDelta({
            startLength: 0,
            ops: [
              {
                value: '0123',
                attributes: {
                  bold: true
                }
              }, {
                value: '\n'
              }
            ]
          })
        },
        'style format': {
          initial: ['<p><span style="color: teal;">0123</span></p>'],
          expected: Tandem.Delta.makeDelta({
            startLength: 0,
            ops: [
              {
                value: '0123',
                attributes: {
                  color: 'teal'
                }
              }, {
                value: '\n'
              }
            ]
          })
        },
        'bullets': {
          initial: ['<ul><li>One</li><li>Two</li></ul>'],
          expected: Tandem.Delta.makeDelta({
            startLength: 0,
            ops: [
              {
                value: 'One'
              }, {
                value: '\n',
                attributes: {
                  bullet: true
                }
              }, {
                value: 'Two'
              }, {
                value: '\n',
                attributes: {
                  bullet: true
                }
              }
            ]
          })
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var doc;
          this.container.innerHTML = test.initial.join('');
          doc = new Quill.Document(this.container, {
            formats: Quill.DEFAULTS.formats
          });
          return expect(doc.toDelta()).toEqualDelta(test.expected);
        });
      });
    });
    return describe('rebuild()', function() {
      beforeEach(function() {
        this.container.innerHTML = '<div> <p>0123</p> <p>5678</p> </div>';
        return this.doc = new Quill.Document(this.container);
      });
      it('new line inserted', function() {
        var lineNode;
        lineNode = this.doc.root.ownerDocument.createElement(Quill.DOM.DEFAULT_BLOCK_TAG);
        lineNode.innerHTML = 'A';
        this.doc.root.insertBefore(lineNode, this.doc.root.lastChild);
        this.doc.rebuild();
        return expect(this.doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '0123\nA\n5678\n'));
      });
      it('existing line changed', function() {
        this.doc.root.firstChild.innerHTML = '01A23';
        this.doc.rebuild();
        return expect(this.doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '01A23\n5678\n'));
      });
      it('existing line removed', function() {
        this.doc.root.removeChild(this.doc.root.firstChild);
        this.doc.rebuild();
        return expect(this.doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '5678\n'));
      });
      it('existing line split', function() {
        Quill.Utils.splitNode(this.doc.root.firstChild, 2);
        this.doc.rebuild();
        return expect(this.doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '01\n23\n5678\n'));
      });
      it('existing lines merged', function() {
        Quill.DOM.moveChildren(this.doc.root.firstChild, this.doc.root.lastChild);
        this.doc.root.removeChild(this.doc.root.lastChild);
        this.doc.rebuild();
        return expect(this.doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '01235678\n'));
      });
      return it('new lines appended', function() {
        var lineNode;
        lineNode = this.doc.root.ownerDocument.createElement(Quill.DOM.DEFAULT_BLOCK_TAG);
        lineNode.innerHTML = 'A';
        this.doc.root.appendChild(lineNode);
        this.doc.rebuild();
        return expect(this.doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '0123\n5678\nA\n'));
      });
    });
  });

}).call(this);
