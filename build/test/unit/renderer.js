(function() {
  describe('Renderer', function() {
    beforeEach(function() {
      return this.container = $('#editor-container').html('').get(0);
    });
    it('objToCss()', function() {
      var css;
      css = Quill.Renderer.objToCss({
        '.editor-container a': {
          'font-style': 'italic',
          'text-decoration': 'underline'
        },
        '.editor-container b': {
          'font-weight': 'bold'
        }
      });
      return expect(css).toEqual(['.editor-container a { font-style: italic; text-decoration: underline; }', '.editor-container b { font-weight: bold; }'].join('\n'));
    });
    it('buildFrame()', function() {
      var iframe, root, _ref;
      _ref = Quill.Renderer.buildFrame(this.container), root = _ref[0], iframe = _ref[1];
      expect(this.container.querySelectorAll('iframe').length).toEqual(1);
      expect(root.ownerDocument.body.firstChild).toEqual(root);
      return expect(root.innerHTML).toEqual('');
    });
    it('constructor', function() {
      var renderer;
      renderer = new Quill.Renderer(this.container);
      expect(this.container.querySelectorAll('iframe').length).toEqual(1);
      return expect(renderer.root.id).not.toBe(null);
    });
    it('constructor with styles', function(done) {
      var renderer;
      renderer = new Quill.Renderer(this.container, {
        styles: {
          '.editor-container > p': {
            'line-height': '25px'
          }
        }
      });
      renderer.root.innerHTML = '<p>Test</p>';
      return _.defer((function(_this) {
        return function() {
          expect(renderer.root.firstChild.offsetHeight).toEqual(25);
          return done();
        };
      })(this));
    });
    return it('addStyles()', function() {
      var renderer;
      renderer = new Quill.Renderer(this.container);
      renderer.root.innerHTML = '<p>Test</p>';
      renderer.addStyles({
        '.editor-container > p': {
          'line-height': '25px'
        }
      });
      return expect(renderer.root.firstChild.offsetHeight).toEqual(25);
    });
  });

}).call(this);
