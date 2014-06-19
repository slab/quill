(function() {
  describe('Picker', function() {
    beforeEach(function() {
      this.container = $('#editor-container').html(Quill.Normalizer.stripWhitespace('<select title="Font" class="ql-font"> <option value="sans-serif" selected>Sans Serif</option> <option value="serif">Serif</option> <option value="monospace">Monospace</option> </select>')).get(0);
      this.select = this.container.querySelector('select');
      return this.picker = new Quill.Lib.Picker(this.select);
    });
    it('constructor', function() {
      return expect(this.container.querySelector('.ql-picker').outerHTML).toEqualHTML('<span title="Font" class="ql-font ql-picker"> <span data-value="sans-serif" class="ql-picker-label">Sans Serif</span> <span class="ql-picker-options"> <span data-value="sans-serif" class="ql-picker-item ql-selected">Sans Serif</span> <span data-value="serif" class="ql-picker-item">Serif</span> <span data-value="monospace" class="ql-picker-item">Monospace</span> </span> </span>');
    });
    it('expand/close', function(done) {
      var label, picker;
      label = this.container.querySelector('.ql-picker-label');
      picker = this.container.querySelector('.ql-picker');
      Quill.DOM.triggerEvent(label, 'click');
      return _.defer(function() {
        expect(Quill.DOM.hasClass(picker, 'ql-expanded')).toBe(true);
        Quill.DOM.triggerEvent(label, 'click');
        return _.defer(function() {
          expect(Quill.DOM.hasClass(picker, 'ql-expanded')).toBe(false);
          return done();
        });
      });
    });
    it('select picker item', function() {
      Quill.DOM.triggerEvent(this.container.querySelector('.ql-picker-options').lastChild, 'click');
      expect(Quill.DOM.getText(this.picker.label)).toEqual('Monospace');
      return _.each(this.container.querySelectorAll('.ql-picker-item'), function(item, i) {
        return expect(Quill.DOM.hasClass(item, 'ql-selected')).toBe(i === 2);
      });
    });
    it('select option', function() {
      Quill.DOM.selectOption(this.select, 'serif');
      expect(Quill.DOM.getText(this.picker.label)).toEqual('Serif');
      return _.each(this.container.querySelectorAll('.ql-picker-item'), function(item, i) {
        return expect(Quill.DOM.hasClass(item, 'ql-selected')).toBe(i === 1);
      });
    });
    return it('select option mixed', function() {
      Quill.DOM.selectOption(this.select, '');
      expect(Quill.DOM.getText(this.picker.label).trim()).toEqual('');
      return _.each(this.container.querySelectorAll('.ql-picker-item'), function(item, i) {
        return expect(Quill.DOM.hasClass(item, 'ql-selected')).toBe(false);
      });
    });
  });

}).call(this);
