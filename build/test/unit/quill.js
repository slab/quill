(function() {
  describe('Quill', function() {
    beforeEach(function() {
      this.container = $('#editor-container').html('<div> <p>0123</p> <p>5678</p> </div>').get(0);
      return this.quill = new Quill(this.container.firstChild);
    });
    describe('constructor', function() {
      it('string container', function() {
        var quill;
        this.container.innerHTML = '<div id="target"></div>';
        quill = new Quill('#target');
        return expect(quill.editor.iframeContainer).toEqual(this.container.firstChild);
      });
      return it('invalid container', function() {
        return expect((function(_this) {
          return function() {
            return _this.quill = new Quill('.none');
          };
        })(this)).toThrow(new Error('Invalid Quill container'));
      });
    });
    describe('modules', function() {
      it('addContainer()', function() {
        this.quill.addContainer('test-container', true);
        return expect(this.quill.root.parentNode.querySelector('.test-container')).toEqual(this.quill.root.parentNode.firstChild);
      });
      it('addModule()', function() {
        var obj;
        obj = {
          before: function() {},
          after: function() {}
        };
        spyOn(obj, 'before');
        spyOn(obj, 'after');
        expect(this.quill.getModule('toolbar')).toBe(void 0);
        this.quill.onModuleLoad('toolbar', obj.before);
        this.quill.addModule('toolbar', {
          container: '#toolbar-container'
        });
        expect(this.quill.getModule('toolbar')).not.toBe(null);
        expect(obj.before).toHaveBeenCalled();
        this.quill.onModuleLoad('toolbar', obj.after);
        return expect(obj.after).toHaveBeenCalled();
      });
      return it('addModule() nonexistent', function() {
        return expect((function(_this) {
          return function() {
            return _this.quill.addModule('nonexistent');
          };
        })(this)).toThrow(new Error("Cannot load nonexistent module. Are you sure you included it?"));
      });
    });
    describe('manipulation', function() {
      it('deleteText()', function() {
        this.quill.deleteText(2, 3);
        return expect(this.quill.root).toEqualHTML('<p>013</p><p>5678</p>', true);
      });
      it('formatLine()', function() {
        this.quill.formatLine(4, 6, 'align', 'right');
        return expect(this.quill.root).toEqualHTML('<p style="text-align: right;">0123</p> <p style="text-align: right;">5678</p>', true);
      });
      it('formatText()', function() {
        this.quill.formatText(2, 4, 'bold', true);
        expect(this.quill.root).toEqualHTML('<p>01<b>23</b></p><p>5678</p>', true);
        this.quill.formatText(2, 4, 'bold', false);
        expect(this.quill.root).toEqualHTML('<p>0123</p><p>5678</p>', true);
        return expect(this.quill.getContents(0, 4)).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '0123'));
      });
      it('formatText() default style', function() {
        var html;
        html = this.quill.root.innerHTML;
        this.quill.formatText(2, 4, 'size', '13px');
        return expect(this.quill.root).toEqualHTML(html);
      });
      it('insertEmbed()', function() {
        this.quill.insertEmbed(2, 'image', 'http://quilljs.com/images/cloud.png');
        return expect(this.quill.root).toEqualHTML('<p>01<img src="http://quilljs.com/images/cloud.png">23</p><p>5678</p>', true);
      });
      it('insertText()', function() {
        this.quill.insertText(2, 'A');
        return expect(this.quill.root).toEqualHTML('<p>01A23</p><p>5678</p>', true);
      });
      it('setContents() with delta', function() {
        this.quill.setContents({
          startLength: 0,
          endLength: 1,
          ops: [
            {
              value: 'A',
              attributes: {
                bold: true
              }
            }
          ]
        });
        return expect(this.quill.root).toEqualHTML('<p><b>A</b></p>', true);
      });
      it('setContents() with ops', function() {
        this.quill.setContents([
          {
            value: 'A',
            attributes: {
              bold: true
            }
          }
        ]);
        return expect(this.quill.root).toEqualHTML('<p><b>A</b></p>', true);
      });
      it('setHTML()', function() {
        this.quill.setHTML('<p>A</p>');
        return expect(this.quill.root).toEqualHTML('<p>A</p>', true);
      });
      return it('updateContents()', function() {
        this.quill.updateContents(Tandem.Delta.makeInsertDelta(10, 2, 'A'));
        return expect(this.quill.root).toEqualHTML('<p>01A23</p><p>5678</p>', true);
      });
    });
    describe('retrievals', function() {
      it('getContents() all', function() {
        return expect(this.quill.getContents()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '0123\n5678\n'));
      });
      it('getContents() partial', function() {
        return expect(this.quill.getContents(2, 7)).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '23\n56'));
      });
      it('getHTML()', function() {
        return expect(this.quill.getHTML()).toEqualHTML('<p>0123</p><p>5678</p>', true);
      });
      it('getLength()', function() {
        return expect(this.quill.getLength()).toEqual(10);
      });
      return it('getText()', function() {
        return expect(this.quill.getText()).toEqual('0123\n5678\n');
      });
    });
    describe('selection', function() {
      it('get/set range', function() {
        var range;
        this.quill.setSelection(1, 2);
        range = this.quill.getSelection();
        expect(range).not.toBe(null);
        expect(range.start).toEqual(1);
        return expect(range.end).toEqual(2);
      });
      it('get/set index range', function() {
        var range;
        this.quill.setSelection(new Quill.Lib.Range(2, 3));
        range = this.quill.getSelection();
        expect(range).not.toBe(null);
        expect(range.start).toEqual(2);
        return expect(range.end).toEqual(3);
      });
      return it('get/set null', function() {
        var range;
        this.quill.setSelection(1, 2);
        expect(range).not.toBe(null);
        this.quill.setSelection(null);
        range = this.quill.getSelection();
        return expect(range).toBe(null);
      });
    });
    return describe('_buildParams()', function() {
      var tests;
      tests = {
        'index range string formats': [1, 3, 'bold', true],
        'index range object formats': [
          1, 3, {
            bold: true
          }
        ],
        'object range string formats': [new Quill.Lib.Range(1, 3), 'bold', true],
        'object range object formats': [
          new Quill.Lib.Range(1, 3), {
            bold: true
          }
        ]
      };
      _.each(tests, function(args, name) {
        return it(name, function() {
          var end, formats, source, start, _ref, _ref1;
          _ref1 = (_ref = this.quill)._buildParams.apply(_ref, args), start = _ref1[0], end = _ref1[1], formats = _ref1[2], source = _ref1[3];
          expect(start).toEqual(1);
          expect(end).toEqual(3);
          return expect(formats).toEqual({
            bold: true
          });
        });
      });
      return it('source override', function() {
        var end, formats, source, start, _ref;
        _ref = this.quill._buildParams(1, 2, {}, 'silent'), start = _ref[0], end = _ref[1], formats = _ref[2], source = _ref[3];
        return expect(source).toEqual('silent');
      });
    });
  });

}).call(this);
