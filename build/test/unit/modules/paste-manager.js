(function() {
  describe('PasteManager', function() {
    return it('_paste()', function(done) {
      var container, pasteManager, quill;
      container = $('#editor-container').get(0);
      container.innerHTML = '<div> <p>0123</p> </div>';
      quill = new Quill(container.firstChild);
      pasteManager = quill.getModule('paste-manager');
      quill.setSelection(2, 2);
      pasteManager._paste();
      pasteManager.container.innerHTML = '<b>Pasted</b> <p style="text-align: right;">Text</p>';
      return quill.on(Quill.events.TEXT_CHANGE, function(delta) {
        expect(delta).toEqualDelta(Tandem.Delta.makeDelta({
          startLength: 5,
          endLength: 16,
          ops: [
            {
              start: 0,
              end: 2
            }, {
              value: 'Pasted',
              attributes: {
                bold: true
              }
            }, {
              value: '\nText'
            }, {
              start: 2,
              end: 5
            }
          ]
        }));
        return _.defer(function() {
          var range;
          range = quill.getSelection();
          expect(range.start).toEqual(13);
          expect(range.end).toEqual(13);
          return done();
        });
      });
    });
  });

}).call(this);
