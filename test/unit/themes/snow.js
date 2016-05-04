import Quill from '../../../core/quill';
import SnowTheme from '../../../themes/snow';


describe('Snow', function() {
  describe('options', function() {
    beforeEach(function() {
      this.container.innerHTML = '<div id="toolbar"></div><div id="editor"></div>';
      this.quill = this.initialize(Quill, '', this.container.lastChild);
    });

    it('default', function() {
      let theme = new SnowTheme(this.quill, {
        modules: {
          toolbar: true
        }
      });
      let toolbar = theme.addModule('toolbar');
      expect(toolbar.container.querySelector('.ql-bold')).toBeTruthy();
      expect(toolbar.container.querySelector('.ql-italic')).toBeTruthy();
    });

    it('selector', function() {
      let theme = new SnowTheme(this.quill, {
        modules: {
          toolbar: '#toolbar'
        }
      });
      let toolbar = theme.addModule('toolbar');
      expect(toolbar.container).toEqual(this.container.firstChild);
    });

    it('dom node', function() {
      let theme = new SnowTheme(this.quill, {
        modules: {
          toolbar: document.querySelector('#toolbar')
        }
      });
      let toolbar = theme.addModule('toolbar');
      expect(toolbar.container).toEqual(this.container.firstChild);
    });

    it('array', function() {
      let theme = new SnowTheme(this.quill, {
        modules: {
          toolbar: ['bold']
        }
      });
      let toolbar = theme.addModule('toolbar');
      expect(toolbar.container.querySelector('.ql-bold')).toBeTruthy();
      expect(toolbar.container.querySelector('.ql-italic')).toBeFalsy();
    });

    it('custom handler, default container', function() {
      let theme = new SnowTheme(this.quill, {
        modules: {
          toolbar: {
            handlers: {
              bold: function(value) {}
            }
          }
        }
      });
      let toolbar = theme.addModule('toolbar');
      expect(toolbar.container.querySelector('.ql-bold')).toBeTruthy();
      expect(toolbar.container.querySelector('.ql-italic')).toBeTruthy();
    });
  });
});
