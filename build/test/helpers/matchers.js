(function() {
  var compareNodes;

  compareNodes = function(node1, node2, ignoredAttributes) {
    var attr1, attr2, equal, _ref;
    if (ignoredAttributes == null) {
      ignoredAttributes = [];
    }
    if (node1.nodeType !== node2.nodeType) {
      return false;
    }
    if (Quill.DOM.isElement(node1)) {
      if (!Quill.DOM.isElement(node2)) {
        return false;
      }
      if (node1.tagName !== node2.tagName) {
        return false;
      }
      _ref = _.map([node1, node2], function(node) {
        var attr;
        attr = Quill.DOM.getAttributes(node);
        _.each(ignoredAttributes, function(name) {
          return delete attr[name];
        });
        if (attr.style != null) {
          attr.style = attr.style.trim();
        }
        return attr;
      }), attr1 = _ref[0], attr2 = _ref[1];
      if (!_.isEqual(attr1, attr2)) {
        return false;
      }
      if (node1.childNodes.length !== node2.childNodes.length) {
        return false;
      }
      equal = true;
      _.each(Quill.DOM.getChildNodes(node1), function(child1, i) {
        if (!compareNodes(child1, node2.childNodes[i], ignoredAttributes)) {
          equal = false;
          return false;
        }
      });
      return equal;
    } else {
      return Quill.DOM.getText(node1) === Quill.DOM.getText(node2);
    }
  };

  beforeEach(function() {
    var matchers;
    matchers = {
      toEqualDelta: function() {
        return {
          compare: function(actual, expected) {
            var message, pass;
            pass = actual.isEqual(expected);
            if (pass) {
              message = 'Deltas equal';
            } else {
              message = "Deltas unequal: \n" + (jasmine.pp(actual)) + "\n\n" + (jasmine.pp(expected)) + "\n";
            }
            return {
              message: message,
              pass: pass
            };
          }
        };
      },
      toEqualHTML: function() {
        return {
          compare: function(actual, expected, ignoreClassId) {
            var div1, div2, ignoredAttributes, message, pass, _ref;
            _ref = _.map([actual, expected], function(html) {
              var div;
              if (_.isArray(html)) {
                html = html.join('');
              }
              if (_.isElement(html)) {
                html = html.innerHTML;
              }
              div = document.createElement('div');
              div.innerHTML = Quill.Normalizer.stripWhitespace(html);
              return div;
            }), div1 = _ref[0], div2 = _ref[1];
            ignoredAttributes = ignoreClassId ? ['class', 'id'] : [];
            ignoredAttributes = ignoredAttributes.concat(['width', 'height']);
            pass = compareNodes(div1, div2, ignoredAttributes);
            if (pass) {
              message = 'HTMLs equal';
            } else {
              message = "HTMLs unequal: \n" + (jasmine.pp(div1.innerHTML)) + "\n\n" + (jasmine.pp(div2.innerHTML)) + "\n";
            }
            return {
              message: message,
              pass: pass
            };
          }
        };
      }
    };
    return jasmine.addMatchers(matchers);
  });

}).call(this);
