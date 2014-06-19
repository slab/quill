(function() {
  describe('Tooltip', function() {
    var makeBounder;
    makeBounder = function(left, top, width, height) {
      return {
        getBoundingClientRect: function() {
          return {
            left: left,
            top: top,
            right: left + width,
            bottom: top + height,
            width: width,
            height: height
          };
        }
      };
    };
    beforeEach(function() {
      this.container = $('#editor-container').html('<div></div>').get(0);
      this.quill = new Quill(this.container.firstChild);
      return this.tooltip = this.quill.addModule('tooltip', {
        offset: 20
      });
    });
    describe('show/hide', function() {
      return it('restore range', function() {
        var range;
        this.quill.setSelection(0, 0);
        this.tooltip.show();
        this.tooltip.container.focus();
        this.tooltip.hide();
        range = this.quill.getSelection();
        expect(range.start).toEqual(0);
        return expect(range.end).toEqual(0);
      });
    });
    return describe('_position()', function() {
      beforeEach(function() {
        this.quill.root = makeBounder(50, 50, 600, 400);
        this.quill.root.ownerDocument = this.tooltip.container.ownerDocument;
        return this.tooltip.container = makeBounder(60, 60, 200, 100);
      });
      it('no reference', function() {
        var left, top, _ref;
        _ref = this.tooltip._position(), left = _ref[0], top = _ref[1];
        expect(left).toEqual(250);
        return expect(top).toEqual(200);
      });
      it('place below', function() {
        var left, reference, top, _ref;
        reference = makeBounder(100, 100, 100, 50);
        _ref = this.tooltip._position(reference), left = _ref[0], top = _ref[1];
        expect(left).toEqual(50);
        return expect(top).toEqual(170);
      });
      return it('place above', function() {
        var left, reference, top, _ref;
        reference = makeBounder(100, 500, 100, 50);
        _ref = this.tooltip._position(reference), left = _ref[0], top = _ref[1];
        expect(left).toEqual(50);
        return expect(top).toEqual(380);
      });
    });
  });

}).call(this);
