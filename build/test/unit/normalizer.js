(function() {
  describe('Normalizer', function() {
    beforeEach(function() {
      return this.container = $('#editor-container').html('').get(0);
    });
    describe('handleBreaks()', function() {
      var tests;
      tests = {
        'Break in middle of line': {
          initial: '<p><b>One<br>Two</b></p>',
          expected: '<p><b>One<br></b></p><p><b>Two</b></p>'
        },
        'Break preceding line': {
          initial: '<p><b><br>One</b></p>',
          expected: '<p><b><br></b></p><p><b>One</b></p>',
          ieOmit: true
        },
        'Break after line': {
          initial: '<p><b>One<br></b></p>',
          expected: '<p><b>One<br></b></p>'
        }
      };
      return _.each(tests, function(test, name) {
        if (test.ieOmit && Quill.DOM.isIE(10)) {
          return;
        }
        return it(name, function() {
          var lineNode;
          this.container.innerHTML = test.initial;
          lineNode = Quill.Normalizer.handleBreaks(this.container.firstChild);
          expect(this.container).toEqualHTML(test.expected);
          return expect(lineNode).toEqual(this.container.firstChild);
        });
      });
    });
    describe('normalizeLine()', function() {
      var tests;
      tests = {
        'inline with text': {
          initial: '<span>What</span>Test',
          expected: '<p>WhatTest</p>'
        },
        'whitelist line node': {
          initial: '<div>Test</div>',
          expected: '<p>Test</p>'
        },
        'pull text node': {
          initial: '<div><div>AB<div>C</div></div></div>',
          expected: '<p>AB</p><div>C</div>'
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var lineNode;
          this.container.innerHTML = test.initial;
          lineNode = Quill.Normalizer.normalizeLine(this.container.firstChild);
          expect(this.container).toEqualHTML(test.expected);
          return expect(lineNode).toEqual(this.container.firstChild);
        });
      });
    });
    describe('normalizeNode()', function() {
      it('whitelist style and tag', function() {
        this.container.innerHTML = '<strong style="color: red; display: inline;">Test</strong>';
        Quill.Normalizer.normalizeNode(this.container.firstChild);
        return expect(this.container).toEqualHTML('<b style="color: red;">Test</b>');
      });
      it('convert size attribute', function() {
        this.container.innerHTML = '<font size="3">Test</font>';
        Quill.Normalizer.normalizeNode(this.container.firstChild);
        return expect(this.container).toEqualHTML('<span style="font-size: 16px;">Test</span>');
      });
      return it('text node', function() {
        this.container.innerHTML = 'Test';
        Quill.Normalizer.normalizeNode(this.container.firstChild);
        return expect(this.container).toEqualHTML('Test');
      });
    });
    describe('optimizeLine()', function() {
      var tests;
      tests = {
        'remove unneeded break': {
          initial: 'Test<br>',
          expected: 'Test'
        },
        'preserve span with attributes': {
          initial: '<span class="custom"><span id="span-1234">Test</span></span>',
          expected: '<span class="custom"><span id="span-1234">Test</span></span>'
        },
        'unwrap zero length nodes': {
          initial: '<b></b>',
          expected: ''
        },
        'unwrap eventually': {
          initial: '<b><i></i><s></s></b>',
          expected: ''
        },
        'unwrap break on empty line': {
          initial: '<b><i><br></i></b>',
          expected: '<br>'
        },
        'preserve break on empty line': {
          initial: '<b><i></i></b><br>',
          expected: '<br>'
        },
        'unwrap eventually with break': {
          initial: '<b><i></i><s><br></s></b>',
          expected: '<br>'
        },
        'merge similar nodes': {
          initial: '<b>A</b><b>B</b>',
          expected: '<b>AB</b>'
        },
        'merge similar span nodes': {
          initial: '<span style="color: red;">A</span><span style="color: red;">B</span>',
          expected: '<span style="color: red;">AB</span>'
        },
        'merge multiple criteria similar nodes': {
          initial: '<b style="color: red;">A</b><b style="color: red;">B</b>',
          expected: '<b style="color: red;">AB</b>'
        },
        'merge recursive': {
          initial: '<s><b>A</b></s><s><b>B</b></s>',
          expected: '<s><b>AB</b></s>'
        },
        'preserve close but not same nodes': {
          initial: '<b style="color: red;">A</b><b style="color: blue;">B</b>',
          expected: '<b style="color: red;">A</b><b style="color: blue;">B</b>'
        },
        'preserve similar images': {
          initial: '<img src="http://quilljs.com/images/cloud.png"><img src="http://quilljs.com/images/cloud.png">',
          expected: '<img src="http://quilljs.com/images/cloud.png"><img src="http://quilljs.com/images/cloud.png">'
        },
        'wrap orphaned text node': {
          initial: '<s><b>0</b></s><s><span>1</span></s>',
          expected: '<s><b>0</b><span>1</span></s>'
        },
        'merge text nodes': {
          initial: 'A <b></b> B.',
          expected: 'A  B.'
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          this.container.innerHTML = "<p>" + test.initial + "</p>";
          Quill.Normalizer.optimizeLine(this.container.firstChild);
          return expect(this.container.firstChild).toEqualHTML(test.expected);
        });
      });
    });
    describe('pullBlocks()', function() {
      var tests;
      tests = {
        'No children': {
          initial: '<div></div>',
          expected: '<div></div>'
        },
        'After block': {
          initial: '<div>One<div>Two</div>',
          expected: '<div>One</div><div>Two</div>'
        },
        'Middle block': {
          initial: '<div>One<div>Two</div>Three</div>',
          expected: '<div>One</div><div>Two</div><div>Three</div>'
        },
        'Inner block': {
          initial: '<div><div>Test</div><div>Another</div></div>',
          expected: '<div>Test</div><div><div>Another</div></div>'
        },
        'Inner deep block': {
          initial: '<div><div><div>Test</div></div></div>',
          expected: '<div>Test</div>'
        },
        'Inner deep recursive': {
          initial: '<div><div><div><div>Test<div>Test</div></div></div></div></div>',
          expected: '<div>Test</div><div>Test</div>'
        },
        'Continuous inlines': {
          initial: '<div>A<br>B<div>Inner</div></div>',
          expected: '<div>A<br>B</div><div>Inner</div>'
        },
        'Bullets': {
          initial: '<ul><li>One</li><li>Two</li></ul>',
          expected: '<ul><li>One</li><li>Two</li></ul>'
        },
        'Inner list': {
          initial: '<div><ul><li>One</li><li>Two</li></ul></div>',
          expected: '<ul><li>One</li><li>Two</li></ul>'
        },
        'Middle list': {
          initial: '<div>Test<ul><li>One</li><li>Two</li></ul>Test</div>',
          expected: '<div>Test</div><ul><li>One</li><li>Two</li></ul><div>Test</div>'
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var firstChild;
          this.container.innerHTML = test.initial;
          firstChild = this.container.firstChild;
          Quill.Normalizer.pullBlocks(firstChild);
          return expect(this.container).toEqualHTML(test.expected);
        });
      });
    });
    describe('stripComments()', function() {
      it('single line', function() {
        var html;
        html = '<p>Test</p><!-- Comment --><p>Test</p>';
        return expect(Quill.Normalizer.stripComments(html)).toEqual('<p>Test</p><p>Test</p>');
      });
      return it('multiple lines', function() {
        var html;
        html = "<p>Test</p>\n<!-- Comment -->\n<p>Test</p>";
        return expect(Quill.Normalizer.stripComments(html)).toEqual("<p>Test</p>\n\n<p>Test</p>");
      });
    });
    describe('stripWhitespace()', function() {
      var tests;
      tests = {
        'newlines': {
          initial: '<p>Test</p> <p> <br> </p>',
          expected: '<p>Test</p><p><br></p>'
        },
        'preceding and trailing spaces': {
          initial: '  <p></p>  ',
          expected: '<p></p>'
        },
        'inner spaces': {
          initial: '<p> <span> </span> <span>&nbsp; </span> </p>',
          expected: '<p><span></span><span>&nbsp; </span></p>'
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var strippedHTML;
          strippedHTML = Quill.Normalizer.stripWhitespace(test.initial);
          return expect(strippedHTML).toEqual(test.expected);
        });
      });
    });
    describe('whitelistStyles()', function() {
      var tests;
      tests = {
        'no styles': {
          initial: '<p></p>',
          expected: '<p></p>'
        },
        'no removal': {
          initial: '<p style="color: red;"></p>',
          expected: '<p style="color: red;"></p>'
        },
        'removal': {
          initial: '<p style="color: red; display: inline;"></p>',
          expected: '<p style="color: red;"></p>'
        },
        'complete removal': {
          initial: '<p style="display: inline; cursor: pointer;"></p>',
          expected: '<p></p>'
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          this.container.innerHTML = test.initial;
          Quill.Normalizer.whitelistStyles(this.container.firstChild);
          return expect(this.container).toEqualHTML(test.expected);
        });
      });
    });
    describe('whitelistTags()', function() {
      var tests;
      tests = {
        'not element': {
          initial: 'Test',
          expected: 'Test'
        },
        'no switch needed': {
          initial: '<b>Bold</b>',
          expected: '<b>Bold</b>'
        },
        'alias': {
          initial: '<strong>Bold</strong>',
          expected: '<b>Bold</b>'
        },
        'unwrap inline': {
          initial: '<abbr>A</abbr>',
          expected: 'A'
        },
        'switch block': {
          initial: '<h1>Test</h1>',
          expected: '<p>Test</p>'
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          this.container.innerHTML = test.initial;
          Quill.Normalizer.whitelistTags(this.container.firstChild);
          return expect(this.container).toEqualHTML(test.expected);
        });
      });
    });
    describe('wrapInline()', function() {
      var tests;
      tests = {
        'Wrap newline': {
          initial: ['<br>'],
          expected: ['<p><br></p>']
        },
        'Wrap text': {
          initial: ['One'],
          expected: ['<p>One</p>']
        },
        'Wrap multiple': {
          initial: ['<b>One</b>', '<s>Two</s>'],
          expected: ['<p><b>One</b><s>Two</s></p>']
        },
        'Wrap break and text': {
          initial: ['<br>One'],
          expected: ['<p><br>One</p>']
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          this.container.innerHTML = test.initial.join('');
          Quill.Normalizer.wrapInline(this.container.firstChild);
          return expect(this.container).toEqualHTML(test.expected);
        });
      });
    });
    return describe('unwrapText()', function() {
      var tests;
      tests = {
        'inner text': {
          initial: '<span><span>Inner</span>Test</span>',
          expected: 'InnerTest'
        },
        'multiple inner': {
          initial: '<span>Test<span>Test<span>Test</span></span></span>',
          expected: 'TestTestTest'
        },
        'dont unwrap': {
          initial: '<span class="custom">Test</span>',
          expected: '<span class="custom">Test</span>'
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          this.container.innerHTML = test.initial;
          Quill.Normalizer.unwrapText(this.container);
          return expect(this.container).toEqualHTML(test.expected);
        });
      });
    });
  });

}).call(this);
