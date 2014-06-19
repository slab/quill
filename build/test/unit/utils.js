(function() {
  describe('Utils', function() {
    beforeEach(function() {
      return this.container = $('#editor-container').html('').get(0);
    });
    describe('convertFontSize()', function() {
      it('size to pixel', function() {
        return expect(Quill.Utils.convertFontSize(2)).toEqual('13px');
      });
      it('pixel to size', function() {
        return expect(Quill.Utils.convertFontSize('16px')).toEqual(3);
      });
      it('approx pixel to size', function() {
        return expect(Quill.Utils.convertFontSize('19px')).toEqual(5);
      });
      it('smaller than smallest', function() {
        return expect(Quill.Utils.convertFontSize(0)).toEqual('10px');
      });
      return it('larger than largest', function() {
        return expect(Quill.Utils.convertFontSize('52px')).toEqual(7);
      });
    });
    describe('getChildAtOffset()', function() {
      var length, tests;
      beforeEach(function() {
        return this.container.innerHTML = Quill.Normalizer.stripWhitespace('<span>111</span> <b>222</b> <br> <p> <span>3</span> <s>3</s> <span>3</span> </p> <i>444</i>');
      });
      length = 12;
      tests = {
        'first child': [2, 0],
        'last child': [10, 4],
        '0': [0, 0],
        'beyond node length': [16, 4],
        'child with children': [8, 3]
      };
      return _.each(tests, function(test, name) {
        var nodeIndex, offset;
        offset = test[0], nodeIndex = test[1];
        return it(name, function() {
          var child, childOffset, expectedOffset, _ref;
          _ref = Quill.Utils.getChildAtOffset(this.container, offset), child = _ref[0], childOffset = _ref[1];
          expect(child).toEqual(this.container.childNodes[nodeIndex]);
          expectedOffset = offset < length ? offset % 3 : 3;
          return expect(childOffset).toEqual(expectedOffset);
        });
      });
    });
    describe('getNextLineNode()', function() {
      it('iterate over standard lines', function() {
        var container, lineNode;
        container = $('#editor-container').html(Quill.Normalizer.stripWhitespace('<p id="line-1">Test</p> <p id="line-2"><br></p> <p id="line-3">Test</p>')).get(0);
        lineNode = container.firstChild;
        _.each([1, 2, 3], function(i) {
          var idIndex;
          idIndex = parseInt(lineNode.id.slice('line-'.length));
          expect(idIndex).toEqual(i);
          return lineNode = Quill.Utils.getNextLineNode(lineNode, container);
        });
        return expect(lineNode).toEqual(null);
      });
      it('iterate over lists', function() {
        var container, lineNode;
        container = $('#editor-container').html(Quill.Normalizer.stripWhitespace('<p id="line-1">Test</p> <ul> <li id="line-2">One</li> <li id="line-3">Two</li> </ul> <ol> <li id="line-4">One</li> <li id="line-5">Two</li> </ol>')).get(0);
        lineNode = container.firstChild;
        _.each([1, 2, 3, 4, 5], function(i) {
          var idIndex;
          idIndex = parseInt(lineNode.id.slice('line-'.length));
          expect(idIndex).toEqual(i);
          return lineNode = Quill.Utils.getNextLineNode(lineNode, container);
        });
        return expect(lineNode).toEqual(null);
      });
      return it('iterate with change', function() {
        var container, lineNode;
        container = $('#editor-container').html('<div id="line-1">One</div><p id="line-2">Two</p>').get(0);
        lineNode = container.firstChild;
        expect(lineNode.id).toEqual('line-1');
        Quill.DOM.switchTag(container.lastChild, 'div');
        lineNode = Quill.Utils.getNextLineNode(lineNode, container);
        expect(lineNode).not.toEqual(null);
        return expect(lineNode.id).toEqual('line-2');
      });
    });
    describe('getNodeLength()', function() {
      var tests;
      tests = {
        'element': {
          html: '<b>One</b>',
          length: 3
        },
        'text': {
          html: 'One',
          length: 3
        },
        'many nodes': {
          html: '<i><b><i>A</i>B<u>C<s>D</s></u></i>',
          length: 4
        },
        'ignore break': {
          html: '<b><i>A<br></i><br><s>B</s></b>',
          length: 2
        },
        'embed node': {
          html: '<img>',
          length: 1
        },
        'include embed': {
          html: '<b>Test<img>Test</b>',
          length: 9
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var length;
          this.container.innerHTML = test.html;
          length = Quill.Utils.getNodeLength(this.container.firstChild);
          return expect(length).toEqual(test.length);
        });
      });
    });
    describe('mergeNodes()', function() {
      it('merge nodes', function() {
        this.container.innerHTML = '<ul><li>One</li></ul><ul><li>Two</li></ul>';
        Quill.Utils.mergeNodes(this.container.firstChild, this.container.lastChild);
        return expect(this.container).toEqualHTML('<ul><li>One</li><li>Two</li></ul>');
      });
      it('merge and normalize', function() {
        this.container.innerHTML = '<span>One</span><span>Two</span>';
        expect(this.container.childNodes.length).toEqual(2);
        Quill.Utils.mergeNodes(this.container.firstChild, this.container.lastChild);
        expect(this.container).toEqualHTML('<span>OneTwo</span>');
        expect(this.container.childNodes.length).toEqual(1);
        return expect(this.container.firstChild.childNodes.length).toEqual(1);
      });
      return it('merge text nodes', function() {
        this.container.innerHTML = '';
        this.container.appendChild(document.createTextNode('One'));
        this.container.appendChild(document.createTextNode('Two'));
        expect(this.container.childNodes.length).toEqual(2);
        Quill.Utils.mergeNodes(this.container.firstChild, this.container.lastChild);
        expect(this.container).toEqualHTML('OneTwo');
        return expect(this.container.childNodes.length).toEqual(1);
      });
    });
    describe('splitAncestors()', function() {
      beforeEach(function() {
        return this.container.innerHTML = Quill.Normalizer.stripWhitespace('<div> <span>One</span> <b>Two</b> <div> <i>Three</i> <s>Four</s> <u>Five</u> </div> </div>');
      });
      it('single split', function() {
        var node, retNode;
        node = this.container.querySelector('b');
        retNode = Quill.Utils.splitAncestors(node, this.container);
        expect(this.container).toEqualHTML('<div> <span>One</span> </div> <div> <b>Two</b> <div> <i>Three</i> <s>Four</s> <u>Five</u> </div> </div>');
        return expect(retNode).toEqual(this.container.lastChild);
      });
      it('split multiple', function() {
        var node, retNode;
        node = this.container.querySelector('s');
        retNode = Quill.Utils.splitAncestors(node, this.container);
        expect(this.container).toEqualHTML('<div> <span>One</span> <b>Two</b> <div> <i>Three</i> </div> </div> <div> <div> <s>Four</s> <u>Five</u> </div> </div>');
        return expect(retNode).toEqual(this.container.lastChild);
      });
      it('split none', function() {
        var html, node, retNode;
        node = this.container.querySelector('span');
        html = this.container.innerHTML;
        retNode = Quill.Utils.splitAncestors(node, this.container);
        expect(this.container).toEqualHTML(html);
        return expect(retNode).toEqual(this.container.firstChild);
      });
      it('split parent', function() {
        var html, node, retNode;
        node = this.container.querySelector('i');
        html = this.container.innerHTML;
        retNode = Quill.Utils.splitAncestors(node, this.container);
        expect(this.container).toEqualHTML('<div> <span>One</span> <b>Two</b> </div> <div> <div> <i>Three</i> <s>Four</s> <u>Five</u> </div> </div>');
        return expect(retNode).toEqual(this.container.lastChild);
      });
      return it('split force', function() {
        var node, retNode;
        node = this.container.querySelector('span');
        retNode = Quill.Utils.splitAncestors(node, this.container, true);
        expect(this.container).toEqualHTML('<div> </div> <div> <span>One</span> <b>Two</b> <div> <i>Three</i> <s>Four</s> <u>Five</u> </div> </div>');
        return expect(retNode).toEqual(node.parentNode);
      });
    });
    return describe('splitNode()', function() {
      var tests;
      tests = {
        'unnecessary split before': {
          initial: '<b>Bold</b>',
          expected: '<b>Bold</b>',
          offset: 0,
          left: null,
          right: 'Bold',
          split: false
        },
        'unnecessary split after': {
          initial: '<b>Bold</b>',
          expected: '<b>Bold</b>',
          offset: 4,
          left: 'Bold',
          right: null,
          split: false
        },
        'text node': {
          initial: '<b>Bold</b>',
          expected: '<b>Bo</b><b>ld</b>',
          offset: 2,
          left: 'Bo',
          right: 'ld',
          split: true
        },
        'child nodes': {
          initial: '<b><i>Italic</i><s>Strike</s></b>',
          expected: '<b><i>Italic</i></b><b><s>Strike</s></b>',
          offset: 6,
          left: 'Italic',
          right: 'Strike',
          split: true
        },
        'child and text nodes': {
          initial: '<b><i>Italic</i></b>',
          expected: '<b><i>It</i></b><b><i>alic</i></b>',
          offset: 2,
          left: 'It',
          right: 'alic',
          split: true
        },
        'split deep nodes': {
          initial: '<b> <i> <s> <u>One</u> <u>Two</u> </s> <s>Three</s> </i> </b>',
          expected: '<b> <i> <s> <u>On</u> </s> </i> </b> <b> <i> <s> <u>e</u> <u>Two</u> </s> <s>Three</s> </i> </b>',
          offset: 2,
          left: 'On',
          right: 'eTwoThree',
          split: true
        },
        'force split': {
          initial: '<b>Bold</b>',
          expected: '<b>Bold</b><b></b>',
          offset: 4,
          left: 'Bold',
          right: '',
          split: true,
          force: true
        },
        'split image': {
          initial: '<img src="http://quilljs.com/images/cloud.png">',
          expected: '<img src="http://quilljs.com/images/cloud.png">',
          offset: 1,
          left: '!',
          right: null,
          split: false
        }
      };
      return _.each(tests, function(test, name) {
        return it(name, function() {
          var left, leftText, right, rightText, split, _ref;
          this.container.innerHTML = Quill.Normalizer.stripWhitespace(test.initial);
          _ref = Quill.Utils.splitNode(this.container.firstChild, test.offset, test.force), left = _ref[0], right = _ref[1], split = _ref[2];
          expect(this.container).toEqualHTML(test.expected);
          leftText = left ? Quill.DOM.getText(left) : null;
          rightText = right ? Quill.DOM.getText(right) : null;
          expect(leftText).toEqual(test.left);
          expect(rightText).toEqual(test.right);
          return expect(test.split).toEqual(split);
        });
      });
    });
  });

}).call(this);
