(function() {
  describe('Toolbar', function() {
    beforeEach(function() {
      this.editorContainer = $('#editor-container').html('<div> <p> <b>01</b>23<i>45</i><span style="font-size: 18px;">67</span><span style="font-size: 32px;">89</span> </p> </div>').get(0);
      this.toolbarContainer = $('#toolbar-container').get(0);
      this.toolbarContainer.innerHTML = this.toolbarContainer.innerHTML;
      this.quill = new Quill(this.editorContainer.firstChild);
      this.toolbar = this.quill.addModule('toolbar', {
        container: this.toolbarContainer
      });
      this.button = this.toolbarContainer.querySelector('.ql-bold');
      return this.select = this.toolbarContainer.querySelector('.ql-size');
    });
    describe('format', function() {
      it('button add', function() {
        var range;
        range = new Quill.Lib.Range(2, 4);
        this.quill.setSelection(range);
        Quill.DOM.triggerEvent(this.button, 'click');
        return expect(this.quill.getContents(range)).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '23', {
          bold: true
        }));
      });
      it('button remove', function() {
        var range;
        range = new Quill.Lib.Range(0, 2);
        this.quill.setSelection(range);
        Quill.DOM.triggerEvent(this.button, 'click');
        return expect(this.quill.getContents(range)).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '01'));
      });
      it('dropdown add', function() {
        var range;
        range = new Quill.Lib.Range(2, 4);
        this.quill.setSelection(range);
        Quill.DOM.selectOption(this.select, '18px');
        return expect(this.quill.getContents(range)).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '23', {
          size: '18px'
        }));
      });
      return it('dropdown remove', function() {
        var range;
        range = new Quill.Lib.Range(6, 8);
        this.quill.setSelection(range);
        Quill.DOM.resetSelect(this.select);
        return expect(this.quill.getContents(range)).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '67'));
      });
    });
    describe('updateActive()', function() {
      it('button', function() {
        this.quill.setSelection(1, 1);
        return expect(Quill.DOM.hasClass(this.button, 'ql-active')).toBe(true);
      });
      it('dropdown', function() {
        this.quill.setSelection(7, 7);
        return expect(Quill.DOM.getSelectValue(this.select)).toEqual('18px');
      });
      it('dropdown change', function() {
        this.quill.setSelection(7, 7);
        this.quill.setSelection(9, 9);
        return expect(Quill.DOM.getSelectValue(this.select)).toEqual('32px');
      });
      it('dropdown reset', function() {
        this.quill.setSelection(7, 7);
        this.quill.setSelection(3, 3);
        return expect(Quill.DOM.getSelectValue(this.select)).toEqual('13px');
      });
      return it('dropdown blank', function() {
        this.quill.setSelection(5, 7);
        return expect(Quill.DOM.getSelectValue(this.select)).toEqual('');
      });
    });
    describe('_getActive()', function() {
      var tests;
      tests = {
        'cursor in middle of format': {
          range: [1, 1],
          expected: {
            bold: true
          }
        },
        'cursor at beginning of format': {
          range: [4, 4],
          expected: {}
        },
        'cursor at end of format': {
          range: [2, 2],
          expected: {
            bold: true
          }
        },
        'neighboring formats': {
          range: [2, 4],
          expected: {}
        },
        'overlapping formats': {
          range: [1, 3],
          expected: {}
        },
        'select format': {
          range: [7, 7],
          expected: {
            size: '18px'
          }
        },
        'overlapping select formats': {
          range: [5, 7],
          expected: {
            size: ['18px']
          }
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var formats;
          formats = this.toolbar._getActive(new Quill.Lib.Range(test.range[0], test.range[1]));
          return expect(formats).toEqual(test.expected);
        });
      });
    });
    return describe('_interesctFormats()', function() {
      var tests;
      tests = {
        'preserve common format': {
          initial: [
            {
              bold: true
            }, {
              bold: true
            }
          ],
          expected: {
            bold: true
          }
        },
        'remove uncommon format': {
          initial: [
            {
              bold: true
            }, {
              italic: true
            }
          ],
          expected: {}
        },
        'common select format': {
          initial: [
            {
              size: '18px'
            }, {
              size: '18px'
            }
          ],
          expected: {
            size: '18px'
          }
        },
        'combine select format': {
          initial: [
            {
              size: '18px'
            }, {
              size: '10px'
            }, {
              size: '32px'
            }
          ],
          expected: {
            size: ['18px', '10px', '32px']
          }
        },
        'preserve select format': {
          initial: [
            {
              bold: true
            }, {
              size: '18px'
            }, {
              italic: true
            }
          ],
          expected: {
            size: ['18px']
          }
        },
        'combination of all cases': {
          initial: [
            {
              bold: true,
              size: '10px'
            }, {
              bold: true,
              italic: true
            }, {
              bold: true,
              size: '18px'
            }
          ],
          expected: {
            bold: true,
            size: ['10px', '18px']
          }
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var formats;
          formats = this.toolbar._intersectFormats(test.initial);
          return expect(formats).toEqual(test.expected);
        });
      });
    });
  });

}).call(this);
