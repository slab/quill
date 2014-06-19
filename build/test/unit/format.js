(function() {
  describe('Format', function() {
    var tests;
    beforeEach(function() {
      return this.container = $('#editor-container').html('').get(0);
    });
    tests = {
      tag: {
        format: new Quill.Format(document, Quill.Format.FORMATS.bold),
        existing: '<b>Text</b>',
        missing: 'Text',
        value: true
      },
      style: {
        format: new Quill.Format(document, Quill.Format.FORMATS.color),
        existing: '<span style="color: blue;">Text</span>',
        missing: 'Text',
        value: 'blue'
      },
      image: {
        format: new Quill.Format(document, Quill.Format.FORMATS.image),
        existing: '<img src="http://quilljs.com/images/cloud.png">',
        missing: 'Text',
        removed: Quill.DOM.EMBED_TEXT,
        value: 'http://quilljs.com/images/cloud.png'
      },
      link: {
        format: new Quill.Format(document, Quill.Format.FORMATS.link),
        existing: '<a href="http://quilljs.com">Text</a>',
        missing: 'Text',
        value: 'http://quilljs.com'
      },
      "class": {
        format: new Quill.Format(document, {
          "class": 'author-'
        }),
        existing: '<span class="author-jason">Text</span>',
        missing: 'Text',
        value: 'jason'
      },
      line: {
        format: new Quill.Format(document, Quill.Format.FORMATS.align),
        existing: '<p style="text-align: right;">Text</p>',
        missing: '<p>Text</p>',
        value: 'right'
      },
      complex: {
        format: new Quill.Format(document, Quill.Format.FORMATS.bold),
        existing: '<b><u><i>Text</i><s>Strike</s></u></b><i>Italic</i>',
        missing: '<u><i>Text</i><s>Strike</s></u><i>Italic</i>',
        value: true
      }
    };
    describe('match()', function() {
      _.each(tests, function(test, name) {
        it("" + name + " existing", function() {
          this.container.innerHTML = test.existing;
          return expect(test.format.match(this.container.firstChild)).toBe(true);
        });
        return it("" + name + " missing", function() {
          this.container.innerHTML = test.missing;
          return expect(test.format.match(this.container.firstChild)).toBe(false);
        });
      });
      it("bullet existing", function() {
        var format, li;
        this.container.innerHTML = '<ul><li>One</li><li>Two</li><li>Three</li></ul>';
        format = new Quill.Format(document, Quill.Format.FORMATS.bullet);
        li = this.container.firstChild.childNodes[1];
        return expect(format.match(li)).toBe(true);
      });
      it("bullet missing", function() {
        var format, li;
        this.container.innerHTML = '<ul><li>One</li></ul><p>Two</p><ul><li>Three</li></ul>';
        format = new Quill.Format(document, Quill.Format.FORMATS.bullet);
        li = this.container.firstChild.childNodes[1];
        return expect(format.match(li)).toBe(false);
      });
      return it('default', function() {
        var format;
        this.container.innerHTML = '<span style="font-size: 13px;">Text</span>';
        format = new Quill.Format(document, Quill.Format.FORMATS.color);
        return expect(format.match(this.container.firstChild)).toBe(false);
      });
    });
    describe('value()', function() {
      _.each(tests, function(test, name) {
        it("" + name + " existing", function() {
          this.container.innerHTML = test.existing;
          return expect(test.format.value(this.container.firstChild)).toEqual(test.value);
        });
        return it("" + name + " missing", function() {
          this.container.innerHTML = test.missing;
          return expect(test.format.value(this.container.firstChild)).toBe(void 0);
        });
      });
      it('default', function() {
        var format;
        this.container.innerHTML = '<span style="font-size: 13px;">Text</span>';
        format = new Quill.Format(document, Quill.Format.FORMATS.color);
        return expect(format.value(this.container.firstChild)).toBe(void 0);
      });
      return it('bullets', function() {
        var format, li;
        this.container.innerHTML = '<ul><li>One</li><li>Two</li><li>Three</li></ul>';
        format = new Quill.Format(document, Quill.Format.FORMATS.bullet);
        li = this.container.firstChild.childNodes[1];
        return expect(format.value(li)).toBe(true);
      });
    });
    describe('add()', function() {
      _.each(tests, function(test, name) {
        it("" + name + " add value", function() {
          this.container.innerHTML = test.missing;
          test.format.add(this.container.firstChild, test.value);
          return expect(this.container).toEqualHTML(test.added || test.existing);
        });
        it("" + name + " add value to exisitng", function() {
          this.container.innerHTML = test.existing;
          test.format.add(this.container.firstChild, test.value);
          return expect(this.container).toEqualHTML(test.existing);
        });
        it("" + name + " add falsy value to existing", function() {
          this.container.innerHTML = test.existing;
          test.format.add(this.container.firstChild, false);
          return expect(this.container).toEqualHTML(test.removed || test.missing);
        });
        return it("" + name + " add falsy value to missing", function() {
          this.container.innerHTML = test.missing;
          test.format.add(this.container.firstChild, false);
          return expect(this.container).toEqualHTML(test.missing);
        });
      });
      it('change value', function() {
        var format;
        this.container.innerHTML = '<span style="color: blue;">Text</span>';
        format = new Quill.Format(document, Quill.Format.FORMATS.color);
        format.add(this.container.firstChild, 'red');
        return expect(this.container).toEqualHTML('<span style="color: red;">Text</span>');
      });
      it('default value', function() {
        var format;
        this.container.innerHTML = '<span>Text</span>';
        format = new Quill.Format(document, Quill.Format.FORMATS.size);
        format.add(this.container.firstChild, Quill.Format.FORMATS.size["default"]);
        return expect(this.container).toEqualHTML('<span>Text</span>');
      });
      it('text node tag', function() {
        var format;
        this.container.innerHTML = 'Text';
        format = new Quill.Format(document, Quill.Format.FORMATS.bold);
        format.add(this.container.firstChild, true);
        return expect(this.container).toEqualHTML('<b>Text</b>');
      });
      it('text node style', function() {
        var format;
        this.container.innerHTML = 'Text';
        format = new Quill.Format(document, Quill.Format.FORMATS.size);
        format.add(this.container.firstChild, '18px');
        return expect(this.container).toEqualHTML('<span style="font-size: 18px;">Text</span>');
      });
      it('class over existing', function() {
        var format;
        this.container.innerHTML = '<span class="author-argo">Text</span>';
        format = new Quill.Format(document, {
          "class": 'author-'
        });
        format.add(this.container.firstChild, 'jason');
        return expect(this.container).toEqualHTML('<span class="author-jason">Text</span>');
      });
      return it('bullets', function() {
        var format, p;
        this.container.innerHTML = '<ul><li>One</li></ul><p>Two</p><ul><li>Three</li></ul>';
        format = new Quill.Format(document, Quill.Format.FORMATS.bullet);
        p = this.container.childNodes[1];
        format.add(p, true);
        return expect(this.container).toEqualHTML('<ul><li>One</li><li>Two</li><li>Three</li></ul>');
      });
    });
    describe('remove()', function() {
      return _.each(tests, function(test, name) {
        it("" + name + " existing", function() {
          this.container.innerHTML = test.existing;
          test.format.remove(this.container.firstChild);
          return expect(this.container).toEqualHTML(test.removed || test.missing);
        });
        return it("" + name + " missing", function() {
          this.container.innerHTML = test.missing;
          test.format.remove(this.container.firstChild);
          return expect(this.container).toEqualHTML(test.missing);
        });
      });
    });
    return it('bullets', function() {
      var format, li;
      this.container.innerHTML = '<ul><li>One</li><li>Two</li><li>Three</li></ul>';
      format = new Quill.Format(document, Quill.Format.FORMATS.bullet);
      li = this.container.firstChild.childNodes[1];
      format.remove(li);
      return expect(this.container).toEqualHTML('<ul><li>One</li></ul><p>Two</p><ul><li>Three</li></ul>');
    });
  });

}).call(this);
