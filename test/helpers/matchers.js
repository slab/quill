beforeEach(function() {
  jasmine.addMatchers({
    toEqualHTML: function() {
      return {
        compare: function(actual, expected, ignoreClassId) {
          let [div1, div2] = _.map([actual, expected], function(html) {
            if (html instanceof HTMLElement) {
              html = html.innerHTML;
            }
            let div = document.createElement('div');
            div.innerHTML = html.replace(/\n\s*/g, '');
            return div;
          });
          let ignoredAttributes = ['width', 'height'];
          if (ignoreClassId) {
            ignoredAttributes = ignoredAttributes.concat(['class', 'id']);
          }
          let message = compareNodes(div1, div2, ignoredAttributes)
          if (message != null) {
            console.error(div1.innerHTML);
            console.error(div2.innerHTML);
            return { pass: false, message: message };
          } else {
            return { pass: true, message: 'HTMLs equal' };
          }
        }
      };
    },

    toBeApproximately: function() {
      return {
        compare: function(actual, expected, tolerance) {
          let pass = Math.abs(actual - expected) <= tolerance;
          return {
            pass: pass,
            message: `${actual} is ${(pass ? '' : 'not')} approximately ${expected}`
          };
        }
      };
    }
  });
});


function compareNodes(node1, node2, ignoredAttributes = []) {
  let attr1, attr2, message, ref;
  if (node1.nodeType !== node2.nodeType) {
    return `Expected nodeType '${node1.nodeType}' to equal '${node2.nodeType}'`;
  }
  if (node1.nodeType === node1.ELEMENT_NODE) {
    if (node1.tagName !== node2.tagName) {
      return `Expected tagName '${node1.tagName}' to equal '${node2.tagName}'`;
    }
    let [attr1, attr2] = _.map([node1, node2], function(node) {
      return _.reduce(node.attributes, function(attr, elem) {
        if (ignoredAttributes.indexOf(elem.name) < 0) {
          attr[elem.name] = elem.name === 'style' ? elem.value.trim() : elem.value;
        }
        return attr;
      }, {});
    });
    if (!_.isEqual(attr1, attr2)) {
      return `Expected attributes ${jasmine.pp(attr1)} to equal ${jasmine.pp(attr2)}`;
    }
    if (node1.childNodes.length !== node2.childNodes.length) {
      return `Expected node childNodes length '#{node1.childNodes.length}' to equal '#{node2.childNodes.length}'`;
    }
    if (node1.childNodes.length === 0) return null;
    let message = '';
    if (_.any($(node1).contents(), function(child1, i) {
      message = compareNodes(child1, node2.childNodes[i], ignoredAttributes);
      return message;
    })) {
      return message;
    }
  } else if ($(node1).text() !== $(node2).text()) {
    return `Expected node text '#{$(node1).text()}' to equal '#{$(node2).text()}'`;
  }
  return null;
}
