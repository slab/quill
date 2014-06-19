(function() {
  describe('DOM', function() {
    beforeEach(function() {
      return this.container = $('#editor-container').html('<div></div>').get(0).firstChild;
    });
    describe('classes', function() {
      afterEach(function() {
        return $(this.container).removeClass();
      });
      it('addClass()', function() {
        Quill.DOM.addClass(this.container, 'custom');
        return expect($(this.container).hasClass('custom')).toBe(true);
      });
      it('addClass() existing', function() {
        Quill.DOM.addClass(this.container, 'custom');
        Quill.DOM.addClass(this.container, 'custom');
        return expect($(this.container).attr('class')).toEqual('custom');
      });
      it('getClasses()', function() {
        var classes;
        $(this.container).addClass('custom');
        $(this.container).addClass('another');
        classes = Quill.DOM.getClasses(this.container).sort();
        expect(classes.length).toEqual(2);
        expect(classes[0]).toEqual('another');
        return expect(classes[1]).toEqual('custom');
      });
      it('hasClass()', function() {
        $(this.container).addClass('custom');
        return expect(Quill.DOM.hasClass(this.container, 'custom')).toBe(true);
      });
      it('removeClass()', function() {
        $(this.container).addClass('custom');
        Quill.DOM.removeClass(this.container, 'custom');
        return expect($(this.container).hasClass('custom')).toBe(false);
      });
      it('removeClass() nonexistent', function() {
        Quill.DOM.removeClass(this.container, 'custom');
        return expect(this.container.outerHTML).toEqualHTML('<div></div>');
      });
      return it('toggleClass()', function() {
        Quill.DOM.toggleClass(this.container, 'custom');
        expect($(this.container).hasClass('custom')).toBe(true);
        Quill.DOM.toggleClass(this.container, 'custom');
        return expect($(this.container).hasClass('custom')).toBe(false);
      });
    });
    describe('attributes', function() {
      beforeEach(function() {
        $(this.container).html('<div class="custom" style="color: red;"></div>');
        return this.node = this.container.firstChild;
      });
      it('getAttributes() none', function() {
        var attributes;
        $(this.container).html('<div></div>');
        this.node = this.container.firstChild;
        attributes = Quill.DOM.getAttributes(this.node);
        return expect(_.keys(attributes).length).toEqual(0);
      });
      it('getAttributes() multiple', function() {
        var attributes;
        attributes = Quill.DOM.getAttributes(this.node);
        expect(_.keys(attributes).length).toEqual(2);
        expect(attributes['class']).toEqual('custom');
        return expect(attributes['style'].toLowerCase()).toContain('color: red');
      });
      it('clearAttributes()', function() {
        Quill.DOM.clearAttributes(this.node);
        return expect(this.node.outerHTML).toEqualHTML('<div></div>');
      });
      it('clearAttributes() with exception', function() {
        Quill.DOM.clearAttributes(this.node, 'class');
        return expect(this.node.outerHTML).toEqualHTML('<div class="custom"></div>');
      });
      return it('setAttributes()', function() {
        var attributes;
        Quill.DOM.clearAttributes(this.node);
        attributes = {
          'class': 'test',
          'style': 'font-size: 13px;'
        };
        Quill.DOM.setAttributes(this.node, attributes);
        return expect(Quill.DOM.getAttributes(this.node)).toEqual(attributes);
      });
    });
    describe('styles', function() {
      var html, styles;
      html = '<span style="color: red; display: inline;">Test</span>';
      styles = {
        'color': 'red',
        'display': 'inline'
      };
      it('getStyles()', function() {
        var result;
        $(this.container).html(html);
        result = Quill.DOM.getStyles(this.container.firstChild);
        return expect(result).toEqual(styles);
      });
      return it('setStyles()', function() {
        $(this.container).html('<span>Test</span>');
        Quill.DOM.setStyles(this.container.firstChild, styles);
        return _.each(styles, (function(_this) {
          return function(value, name) {
            return expect(_this.container.firstChild.style[name]).toEqual(value);
          };
        })(this));
      });
    });
    describe('events', function() {
      describe('addEventListener()', function() {
        beforeEach(function() {
          $(this.container).html('<div><button type="button">Button</button></div>');
          return this.button = this.container.querySelector('button');
        });
        it('click', function(done) {
          Quill.DOM.addEventListener(this.button, 'click', _.partial(done, null));
          return $(this.button).trigger('click');
        });
        it('bubble', function(done) {
          Quill.DOM.addEventListener(this.button.parentNode, 'click', _.partial(done, null));
          return $(this.button).trigger('click');
        });
        return it('prevent bubble', function(done) {
          Quill.DOM.addEventListener(this.button, 'click', function() {
            _.defer(done);
            return false;
          });
          Quill.DOM.addEventListener(this.button.parentNode, 'click', function() {
            throw new Error('Bubble not prevented');
          });
          return $(this.button).trigger('click');
        });
      });
      return describe('triggerEvent()', function() {
        it('click', function() {
          $(this.container).html('<button type="button" onclick="window._triggerClick = true;">Button</button>');
          this.button = this.container.querySelector('button');
          expect(window._triggerClick).not.toBeTruthy();
          Quill.DOM.triggerEvent(this.button, 'click');
          expect(window._triggerClick).toBe(true);
          return window._triggerClick = void 0;
        });
        it('change', function(done) {
          var select;
          $(this.container).html('<select> <option value="one" selected>One</option> <option value="two">Two</option> </select>');
          select = this.container.querySelector('select');
          Quill.DOM.addEventListener(select, 'change', function() {
            expect(select.selectedIndex).toEqual(0);
            return done();
          });
          return Quill.DOM.triggerEvent(select, 'change');
        });
        return it('keydown', function(done) {
          $(this.container).html('<div contenteditable=true></div>');
          this.container.firstChild.focus();
          Quill.DOM.addEventListener(this.container.firstChild, 'keydown', function(event) {
            expect(event.key).toEqual('A');
            expect(event.altKey).not.toBeTruthy();
            expect(event.ctrlKey).not.toBeTruthy();
            expect(event.metaKey).toBeTruthy();
            expect(event.shiftKey).toBeTruthy();
            return done();
          });
          return Quill.DOM.triggerEvent(this.container.firstChild, 'keydown', {
            key: 'A',
            shiftKey: true,
            metaKey: true
          });
        });
      });
    });
    describe('text', function() {
      beforeEach(function() {
        return $(this.container).html('0<span>1</span><!-- Comment --><b><i>2</i></b>3<img><br>');
      });
      it('getText() from element', function() {
        return expect(Quill.DOM.getText(this.container)).toEqual('0123');
      });
      it('getText() from break', function() {
        return expect(Quill.DOM.getText(this.container.lastChild)).toEqual('');
      });
      it('getText() from comment', function() {
        return expect(Quill.DOM.getText(this.container.childNodes[2])).toEqual('');
      });
      it('getText() embed tag', function() {
        return expect(Quill.DOM.getText(this.container.querySelector('img'))).toEqual(Quill.DOM.EMBED_TEXT);
      });
      it('setText() element', function() {
        Quill.DOM.setText(this.container, 'test');
        return expect($(this.container).text()).toEqual('test');
      });
      it('setText() text node', function() {
        Quill.DOM.setText(this.container.firstChild, 'A');
        return expect($(this.container).text()).toEqual('A123');
      });
      return it('getTextNodes()', function() {
        var textNodes;
        textNodes = Quill.DOM.getTextNodes(this.container);
        return expect(textNodes.length).toEqual(4);
      });
    });
    describe('manipulation', function() {
      beforeEach(function() {
        return $(this.container).html('<div style="cursor: pointer">One</div><div><span>Two</span><b>Bold</b></div>');
      });
      it('moveChildren()', function() {
        Quill.DOM.moveChildren(this.container.firstChild, this.container.lastChild);
        return expect(this.container).toEqualHTML('<div style="cursor: pointer">One<span>Two</span><b>Bold</b></div><div></div>');
      });
      it('removeNode()', function() {
        Quill.DOM.removeNode(this.container.lastChild.firstChild);
        return expect(this.container).toEqualHTML('<div style="cursor: pointer">One</div><div><b>Bold</b></div>');
      });
      it('switchTag()', function() {
        Quill.DOM.switchTag(this.container.firstChild, 'span');
        return expect(this.container).toEqualHTML('<span style="cursor: pointer">One</span><div><span>Two</span><b>Bold</b></div>');
      });
      it('switchTag() to same', function() {
        var html;
        html = this.container.innerHTML;
        Quill.DOM.switchTag(this.container.firstChild, 'div');
        return expect(this.container).toEqualHTML(html);
      });
      it('switchTag() to void', function() {
        Quill.DOM.switchTag(this.container.lastChild, 'br');
        return expect(this.container).toEqualHTML('<div style="cursor: pointer">One</div><br>');
      });
      it('unwrap()', function() {
        Quill.DOM.unwrap(this.container.lastChild);
        return expect(this.container).toEqualHTML('<div style="cursor: pointer">One</div><span>Two</span><b>Bold</b>');
      });
      it('wrap()', function() {
        var wrapper;
        wrapper = this.container.ownerDocument.createElement('div');
        Quill.DOM.wrap(wrapper, this.container.firstChild);
        return expect(this.container).toEqualHTML('<div><div style="cursor: pointer">One</div></div><div><span>Two</span><b>Bold</b></div>');
      });
      return it('wrap() orphan node', function() {
        var node, wrapper;
        wrapper = this.container.ownerDocument.createElement('div');
        node = this.container.ownerDocument.createElement('span');
        Quill.DOM.wrap(wrapper, node);
        return expect(wrapper.outerHTML).toEqualHTML('<div><span></span></div>');
      });
    });
    describe('select', function() {
      beforeEach(function() {
        $(this.container).html('<select> <option value="one">One</option> <option value="two" selected>Two</option> <option value="three">Three</option> </select>');
        this.select = this.container.firstChild;
        return $(this.select).val('one');
      });
      it('getDefaultOption()', function() {
        return expect(Quill.DOM.getDefaultOption(this.select)).toEqual(this.select.children[1]);
      });
      it('resetSelect()', function() {
        expect($(this.select).val()).toEqual('one');
        Quill.DOM.resetSelect(this.select);
        return expect($(this.select).val()).toEqual('two');
      });
      it('selectOption() option', function() {
        Quill.DOM.selectOption(this.select, this.select.children[2]);
        return expect($(this.select).val()).toEqual('three');
      });
      it('selectOption() value', function() {
        Quill.DOM.selectOption(this.select, 'three');
        return expect($(this.select).val()).toEqual('three');
      });
      it('getSelectValue() option', function() {
        Quill.DOM.selectOption(this.select, this.select.children[2]);
        return expect(Quill.DOM.getSelectValue(this.select)).toEqual('three');
      });
      it('getSelectValue() value', function() {
        Quill.DOM.selectOption(this.select, 'three');
        return expect(Quill.DOM.getSelectValue(this.select)).toEqual('three');
      });
      return it('getSelectValue() blank', function() {
        Quill.DOM.selectOption(this.select, '');
        return expect(Quill.DOM.getSelectValue(this.select)).toEqual('');
      });
    });
    return describe('get nodes', function() {
      it('getChildNodes()', function() {
        var nodes;
        this.container.innerHTML = '<b>0</b><i>1</i><u>2</u><br>';
        nodes = Quill.DOM.getChildNodes(this.container);
        return expect(nodes.length).toEqual(4);
      });
      return it('getDescendants()', function() {
        var nodes;
        this.container.innerHTML = '<b>0</b><i><span>1</span><s>2</s></i><u>3</u><br>';
        nodes = Quill.DOM.getDescendants(this.container);
        return expect(nodes.length).toEqual(6);
      });
    });
  });

}).call(this);
