import Delta from 'quill-delta';
import Quill, { expandConfig, overload } from '../../../core/quill';
import Theme from '../../../core/theme';
import Emitter from '../../../core/emitter';
import Toolbar from '../../../modules/toolbar';
import Snow from '../../../themes/snow';
import { Range } from '../../../core/selection';


describe('Quill', function() {
  it('imports', function() {
    Object.keys(Quill.imports).forEach(function(path) {
      expect(Quill.import(path)).toBeTruthy();
    });
  });

  describe('construction', function() {
    it('empty', function() {
      let quill = this.initialize(Quill, '');
      expect(quill.getContents()).toEqual(new Delta().insert('\n'));
      expect(quill.root).toEqualHTML('<p><br></p>');
    });

    it('text', function() {
      let quill = this.initialize(Quill, '0123');
      expect(quill.getContents()).toEqual(new Delta().insert('0123\n'));
      expect(quill.root).toEqualHTML('<p>0123</p>');
    });

    it('newlines', function() {
      let quill = this.initialize(Quill, '<p><br></p><p><br></p><p><br></p>');
      expect(quill.getContents()).toEqual(new Delta().insert('\n\n\n'));
      expect(quill.root).toEqualHTML('<p><br></p><p><br></p><p><br></p>');
    });

    it('formatted ending', function() {
      let quill = this.initialize(Quill, '<p class="ql-align-center">Test</p>');
      expect(quill.getContents()).toEqual(
        new Delta().insert('Test').insert('\n', { align: 'center' })
      );
      expect(quill.root).toEqualHTML('<p class="ql-align-center">Test</p>');
    });
  });

  describe('api', function() {
    beforeEach(function() {
      this.quill = this.initialize(Quill, '<p>0123<em>45</em>67</p>');
      this.oldDelta = this.quill.getContents();
      spyOn(this.quill.emitter, 'emit').and.callThrough();
    });

    it('deleteText()', function() {
      this.quill.deleteText(3, 2);
      let change = new Delta().retain(3).delete(2);
      expect(this.quill.root).toEqualHTML('<p>012<em>5</em>67</p>');
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, change, this.oldDelta, Emitter.sources.API);
    });

    it('format()', function() {
      this.quill.setSelection(3, 2);
      this.quill.format('bold', true);
      let change = new Delta().retain(3).retain(2, { bold: true });
      expect(this.quill.root).toEqualHTML('<p>012<strong>3<em>4</em></strong><em>5</em>67</p>');
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, change, this.oldDelta, Emitter.sources.API);
      expect(this.quill.getSelection()).toEqual(new Range(3, 2));
    });

    it('formatLine()', function() {
      this.quill.formatLine(1, 1, 'header', 2);
      let change = new Delta().retain(8).retain(1, { header: 2});
      expect(this.quill.root).toEqualHTML('<h2>0123<em>45</em>67</h2>');
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, change, this.oldDelta, Emitter.sources.API);
    });

    it('formatText()', function() {
      this.quill.formatText(3, 2, 'bold', true);
      let change = new Delta().retain(3).retain(2, { bold: true });
      expect(this.quill.root).toEqualHTML('<p>012<strong>3<em>4</em></strong><em>5</em>67</p>');
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, change, this.oldDelta, Emitter.sources.API);
    });

    it('insertEmbed()', function() {
      this.quill.insertEmbed(5, 'image', '/assets/favicon.png');
      let change = new Delta().retain(5).insert({ image: '/assets/favicon.png'}, { italic: true });
      expect(this.quill.root).toEqualHTML('<p>0123<em>4<img src="/assets/favicon.png">5</em>67</p>');
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, change, this.oldDelta, Emitter.sources.API);
    });

    it('insertText()', function() {
      this.quill.insertText(5, '|', 'bold', true);
      let change = new Delta().retain(5).insert('|', { bold: true, italic: true });
      expect(this.quill.root).toEqualHTML('<p>0123<em>4</em><strong><em>|</em></strong><em>5</em>67</p>');
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, change, this.oldDelta, Emitter.sources.API);
    });

    it('enable/disable', function() {
      this.quill.disable();
      expect(this.quill.root.getAttribute('contenteditable')).toEqual('false');
      this.quill.enable();
      expect(this.quill.root.getAttribute('contenteditable')).toBeTruthy();
    });

    it('getBounds() index', function() {
      expect(this.quill.getBounds(1)).toBeTruthy();
    });

    it('getBounds() range', function() {
      expect(this.quill.getBounds(new Range(3, 4))).toBeTruthy();
    });

    it('getFormat()', function() {
      let formats = this.quill.getFormat(5);
      expect(formats).toEqual({ italic: true });
    });

    it('getSelection()', function() {
      expect(this.quill.getSelection()).toEqual(null);
      let range = new Range(1, 2);
      this.quill.setSelection(range);
      expect(this.quill.getSelection()).toEqual(range);
    });

    it('pasteHTML(html)', function() {
      this.quill.pasteHTML('<i>ab</i><b>cd</b>');
      expect(this.quill.root).toEqualHTML('<p><em>ab</em><strong>cd</strong></p>');
    });

    it('pasteHTML(index, html)', function() {
      this.quill.pasteHTML(2, '<b>ab</b>');
      expect(this.quill.root).toEqualHTML('<p>01<strong>ab</strong>23<em>45</em>67</p>');
    });

    it('removeFormat()', function() {
      this.quill.removeFormat(5, 1);
      let change = new Delta().retain(5).retain(1, { italic: null });
      expect(this.quill.root).toEqualHTML('<p>0123<em>4</em>567</p>');
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, change, this.oldDelta, Emitter.sources.API);
    });

    it('updateContents() delta', function() {
      let delta = new Delta().retain(5).insert('|');
      this.quill.updateContents(delta);
      expect(this.quill.root).toEqualHTML('<p>0123<em>4</em>|<em>5</em>67</p>');
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, delta, this.oldDelta, Emitter.sources.API);
    });

    it('updateContents() ops array', function() {
      let delta = new Delta().retain(5).insert('|');
      this.quill.updateContents(delta.ops);
      expect(this.quill.root).toEqualHTML('<p>0123<em>4</em>|<em>5</em>67</p>');
      expect(this.quill.emitter.emit).toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, delta, this.oldDelta, Emitter.sources.API);
    });
  });

  describe('events', function() {
    beforeEach(function() {
      this.quill = this.initialize(Quill, '<p>0123</p>');
      this.quill.update();
      spyOn(this.quill.emitter, 'emit').and.callThrough();
      this.oldDelta = this.quill.getContents();
    });

    it('api text insert', function() {
      this.quill.insertText(2, '!');
      let delta = new Delta().retain(2).insert('!');
      expect(this.quill.emitter.emit)
        .toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, delta, this.oldDelta, Emitter.sources.API);
    });

    it('user text insert', function(done) {
      this.container.firstChild.firstChild.firstChild.data = '01!23';
      let delta = new Delta().retain(2).insert('!');
      setTimeout(() => {
        expect(this.quill.emitter.emit)
          .toHaveBeenCalledWith(Emitter.events.TEXT_CHANGE, delta, this.oldDelta, Emitter.sources.USER);
        done();
      }, 1);
    });

    it('insert same character', function(done) {
      this.quill.setText('aaaa\n');
      this.quill.setSelection(2);
      this.quill.update();
      let old = this.quill.getContents();
      let textNode = this.container.firstChild.firstChild.firstChild;
      textNode.data = 'aaaaa';
      this.quill.selection.setNativeRange(textNode.data, 3);
      // this.quill.selection.update(Emitter.sources.SILENT);
      let delta = new Delta().retain(2).insert('a');
      setTimeout(() => {
        let args = this.quill.emitter.emit.calls.mostRecent().args;
        expect(args).toEqual([Emitter.events.TEXT_CHANGE, delta, old, Emitter.sources.USER]);
        done();
      }, 1);
    });
  });

  describe('setContents()', function() {
    it('empty', function() {
      let quill = this.initialize(Quill, '');
      let delta = new Delta().insert('\n');
      quill.setContents(delta);
      expect(quill.getContents()).toEqual(delta);
      expect(quill.root).toEqualHTML('<p><br></p>');
    });

    it('single line', function() {
      let quill = this.initialize(Quill, '');
      let delta = new Delta().insert('Hello World!\n');
      quill.setContents(delta);
      expect(quill.getContents()).toEqual(delta);
      expect(quill.root).toEqualHTML('<p>Hello World!</p>');
    });

    it('multiple lines', function() {
      let quill = this.initialize(Quill, '');
      let delta = new Delta().insert('Hello\n\nWorld!\n');
      quill.setContents(delta);
      expect(quill.getContents()).toEqual(delta);
      expect(quill.root).toEqualHTML('<p>Hello</p><p><br></p><p>World!</p>');
    });

    it('basic formats', function() {
      let quill = this.initialize(Quill, '');
      let delta = new Delta().insert('Welcome').insert('\n', { header: 1 })
                             .insert('Hello\n')
                             .insert('World')
                             .insert('!', { bold: true })
                             .insert('\n');
      quill.setContents(delta);
      expect(quill.getContents()).toEqual(delta);
      expect(quill.root).toEqualHTML(`
        <h1>Welcome</h1>
        <p>Hello</p>
        <p>World<strong>!</strong></p>
      `);
    });

    it('array of operations', function() {
      let quill = this.initialize(Quill, '');
      let delta = new Delta().insert('test').insert('123', { bold: true }).insert('\n');
      quill.setContents(delta.ops);
      expect(quill.getContents()).toEqual(delta);
    });

    it('json', function() {
      let quill = this.initialize(Quill, '');
      let delta = { ops: [{ insert: 'test\n'}] };
      quill.setContents(delta);
      expect(quill.getContents()).toEqual(new Delta(delta));
    });

    it('no trailing newline', function() {
      let quill = this.initialize(Quill, '<h1>Welcome</h1>');
      quill.setContents(new Delta().insert('0123'));
      expect(quill.getContents()).toEqual(new Delta().insert('0123\n'));
    });

    it('inline formatting', function() {
      let quill = this.initialize(Quill, '<p><strong>Bold</strong></p><p>Not bold</p>');
      let contents = quill.getContents();
      let delta = quill.setContents(contents);
      expect(quill.getContents()).toEqual(contents);
      expect(delta).toEqual(contents.delete(contents.length()));
    });
  });

  describe('setText()', function() {
    it('overwrite', function() {
      let quill = this.initialize(Quill, '<h1>Welcome</h1>');
      quill.setText('abc');
      expect(quill.root).toEqualHTML('<p>abc</p>');
    });

    it('set to newline', function() {
      let quill = this.initialize(Quill, '<h1>Welcome</h1>');
      quill.setText('\n');
      expect(quill.root).toEqualHTML('<p><br></p>');
    });

    it('multiple newlines', function() {
      let quill = this.initialize(Quill, '<h1>Welcome</h1>');
      quill.setText('\n\n');
      expect(quill.root).toEqualHTML('<p><br></p><p><br></p>');
    });

    it('content with trailing newline', function() {
      let quill = this.initialize(Quill, '<h1>Welcome</h1>');
      quill.setText('abc\n');
      expect(quill.root).toEqualHTML('<p>abc</p>');
    });

    it('return carriage', function() {
      let quill = this.initialize(Quill, '<p>Test</p>');
      quill.setText('\r');
      expect(quill.root).toEqualHTML('<p><br></p>');
    });

    it('return carriage newline', function() {
      let quill = this.initialize(Quill, '<p>Test</p>');
      quill.setText('\r\n');
      expect(quill.root).toEqualHTML('<p><br></p>');
    });
  });

  describe('expandConfig', function() {
    it('user overwrite quill', function() {
      let config = expandConfig('#test-container', {
        placeholder: 'Test',
        readOnly: true
      });
      expect(config.placeholder).toEqual('Test')
      expect(config.readOnly).toEqual(true);
    });

    it('convert css selectors', function() {
      let config = expandConfig('#test-container', {
        bounds: '#test-container'
      });
      expect(config.bounds).toEqual(document.querySelector('#test-container'));
      expect(config.container).toEqual(document.querySelector('#test-container'));
    });

    it('convert module true to {}', function() {
      let oldModules = Theme.DEFAULTS.modules;
      Theme.DEFAULTS.modules = {
        formula: true
      };
      let config = expandConfig('#test-container', {
        modules: {
          syntax: true
        }
      });
      expect(config.modules.formula).toEqual({});
      expect(config.modules.syntax).toEqual({ highlight: null, interval: 1000 });
      Theme.DEFAULTS.modules = oldModules;
    });

    describe('theme defaults', function() {
        it('for Snow', function() {
            let config = expandConfig('#test-container', {
                modules: {
                    toolbar: true,
                },
                theme: 'snow'
            });
            expect(config.theme).toEqual(Snow);
            expect(config.modules.toolbar.handlers.image).toEqual(Snow.DEFAULTS.modules.toolbar.handlers.image);
        });

        it('for false', function() {
            let config = expandConfig('#test-container', {
                theme: false
            });
            expect(config.theme).toEqual(Theme);
        });

        it('for undefined', function() {
            let config = expandConfig('#test-container', {
                theme: undefined
            });
            expect(config.theme).toEqual(Theme);
        });

        it('for null', function() {
            let config = expandConfig('#test-container', {
                theme: null
            });
            expect(config.theme).toEqual(Theme);
        });
    });

    it('quill < module < theme < user', function() {
      let oldTheme = Theme.DEFAULTS.modules;
      let oldToolbar = Toolbar.DEFAULTS;
      Toolbar.DEFAULTS = {
        option: 2,
        module: true
      };
      Theme.DEFAULTS.modules = {
        toolbar: {
          option: 1,
          theme: true
        }
      };
      let config = expandConfig('#test-container', {
        modules: {
          toolbar: {
            option: 0,
            user: true
          }
        }
      });
      expect(config.modules.toolbar).toEqual({
        option: 0,
        module: true,
        theme: true,
        user: true
      });
      Theme.DEFAULTS.modules = oldTheme;
      Toolbar.DEFAULTS = oldToolbar;
    });

    it('toolbar default', function() {
      let config = expandConfig('#test-container', {
        modules: {
          toolbar: true
        }
      });
      expect(config.modules.toolbar).toEqual(Toolbar.DEFAULTS);
    });

    it('toolbar disabled', function() {
      let config = expandConfig('#test-container', {
        modules: {
          toolbar: false
        },
        theme: 'snow'
      });
      expect(config.modules.toolbar).toBe(undefined);
    });

    it('toolbar selector', function() {
      let config = expandConfig('#test-container', {
        modules: {
          toolbar: {
            container: '#test-container'
          }
        }
      });
      expect(config.modules.toolbar).toEqual({
        container: '#test-container',
        handlers: Toolbar.DEFAULTS.handlers
      });
    });

    it('toolbar container shorthand', function() {
      let config = expandConfig('#test-container', {
        modules: {
          toolbar: document.querySelector('#test-container')
        }
      });
      expect(config.modules.toolbar).toEqual({
        container: document.querySelector('#test-container'),
        handlers: Toolbar.DEFAULTS.handlers
      });
    });

    it('toolbar format array', function() {
      let config = expandConfig('#test-container', {
        modules: {
          toolbar: ['bold']
        }
      });
      expect(config.modules.toolbar).toEqual({
        container: ['bold'],
        handlers: Toolbar.DEFAULTS.handlers
      });
    });

    it('toolbar custom handler, default container', function() {
      let handler = function() {};  // eslint-disable-line func-style
      let config = expandConfig('#test-container', {
        modules: {
          toolbar: {
            handlers: {
              bold: handler
            }
          }
        }
      });
      expect(config.modules.toolbar.container).toEqual(null);
      expect(config.modules.toolbar.handlers.bold).toEqual(handler);
      expect(config.modules.toolbar.handlers.clean).toEqual(Toolbar.DEFAULTS.handlers.clean);
    });
  });

  describe('overload', function() {
    it('(index:number, length:number)', function() {
      let [index, length, formats, source] = overload(0, 1);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(index:number, length:number, format:string, value:boolean, source:string)', function() {
      let [index, length, formats, source] = overload(0, 1, 'bold', true, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(index:number, length:number, format:string, value:string, source:string)', function() {
      let [index, length, formats, source] = overload(0, 1, 'color', Quill.sources.USER, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(index:number, length:number, format:string, value:string)', function() {
      let [index, length, formats, source] = overload(0, 1, 'color', Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.API);
    });

    it('(index:number, length:number, format:object)', function() {
      let [index, length, formats, source] = overload(0, 1, { bold: true });
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(index:number, length:number, format:object, source:string)', function() {
      let [index, length, formats, source] = overload(0, 1, { bold: true }, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(index:number, length:number, source:string)', function() {
      let [index, length, formats, source] = overload(0, 1, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.USER);
    });

    it('(index:number, source:string)', function() {
      let [index, length, formats, source] = overload(0, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(0);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1));
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:string, value:boolean, source:string)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), 'bold', true, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, format:string, value:string, source:string)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), 'color', Quill.sources.API, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.API });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, format:string, value:string)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), 'color', Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ color: Quill.sources.USER });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:object)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), { bold: true });
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, format:object, source:string)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), { bold: true }, Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range, source:string)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1), Quill.sources.USER);
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.USER);
    });

    it('(range:range)', function() {
      let [index, length, formats, source] = overload(new Range(0, 1));
      expect(index).toBe(0);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number)', function() {
      let [index, length, formats, source] = overload(new Range(10, 1), 0);
      expect(index).toBe(10);
      expect(length).toBe(1);
      expect(formats).toEqual({});
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number, format:string, value:boolean)', function() {
      let [index, length, formats, source] = overload(new Range(10, 1), 0, 'bold', true);
      expect(index).toBe(10);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.API);
    });

    it('(range:range, dummy:number, format:object, source:string)', function() {
      let [index, length, formats, source] = overload(new Range(10, 1), 0, { bold: true }, Quill.sources.USER);
      expect(index).toBe(10);
      expect(length).toBe(1);
      expect(formats).toEqual({ bold: true });
      expect(source).toBe(Quill.sources.USER);
    });
  });

  describe('placeholder', function() {
    beforeEach(function() {
      this.initialize(HTMLElement, '<div><p></p></div>');
      this.quill = new Quill(this.container.firstChild, {
        'placeholder': 'a great day to be a placeholder'
      });
      this.original = this.quill.getContents();
    });

    it('blank editor', function() {
      expect(this.quill.root.dataset.placeholder).toEqual('a great day to be a placeholder');
      expect(this.quill.root.classList).toContain('ql-blank');
    });

    it('with text', function() {
      this.quill.setText('test');
      expect(this.quill.root.classList).not.toContain('ql-blank');
    });

    it('formatted line', function() {
      this.quill.formatLine(0, 1, 'list', 'ordered');
      expect(this.quill.root.classList).not.toContain('ql-blank');
    });
  });
});
