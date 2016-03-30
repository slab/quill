import Delta from 'rich-text/lib/delta';
import Editor from 'quill/editor';
import Emitter from 'quill/emitter';
import Selection from 'quill/selection';
import Scroll from 'quill/blots/scroll';
import Quill from 'quill/quill';
import equal from 'deep-equal';


let div = document.createElement('div');
div.id = 'test-container';
document.body.appendChild(div);

let initialStates = {
  'empty':  {
    delta: new Delta().insert('\n'),
    html: '<p><br></p>'
  },
  'single line': {
    delta: new Delta().insert('Hello World!\n'),
    html: '<p>Hello World!</p>'
  },
  'multiple lines': {
    delta: new Delta().insert('Hello\n\nWorld!\n'),
    html: '<p>Hello</p><p><br></p><p>World!</p>'
  },
  'basic formats': {
    delta: new Delta().insert('Welcome').insert('\n', { header: 1 })
                      .insert('Hello\n')
                      .insert('World')
                      .insert('!', { bold: true })
                      .insert('\n'),
    html: [
      '<h1 id="welcome">Welcome</h1>',
      '<p>Hello</p>',
      '<p>World<strong>!</strong></p>'
    ].join('')
  }
};


beforeEach(function() {
  jasmine.addMatchers({
    toEqualHTML: function() {
      return { compare: compareHTML }
    },
    toBeApproximately: function() {
      return { compare: compareApproximately }
    }
  });

  div.innerHTML = '<div></div>';
  this.container = div.firstChild;
  this.initialize = initialize.bind(this);

  this.initialStates = initialStates;
});


function compareApproximately(actual, expected, tolerance) {
  let pass = Math.abs(actual - expected) <= tolerance;
  return {
    pass: pass,
    message: `${actual} is ${(pass ? '' : 'not')} approximately ${expected}`
  };
}

function compareHTML(actual, expected, ignoreClassId) {
  let [div1, div2] = [actual, expected].map(function(html) {
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

function compareNodes(node1, node2, ignoredAttributes = []) {
  let attr1, attr2, message, ref;
  if (node1.nodeType !== node2.nodeType) {
    return `Expected nodeType '${node1.nodeType}' to equal '${node2.nodeType}'`;
  }
  if (node1.nodeType === node1.ELEMENT_NODE) {
    if (node1.tagName !== node2.tagName) {
      return `Expected tagName '${node1.tagName}' to equal '${node2.tagName}'`;
    }
    let [attr1, attr2] = [node1, node2].map(function(node) {
      return [].reduce.call(node.attributes, function(attr, elem) {
        if (ignoredAttributes.indexOf(elem.name) < 0) {
          attr[elem.name] = elem.name === 'style' ? elem.value.trim() : elem.value;
        }
        return attr;
      }, {});
    });
    if (!equal(attr1, attr2)) {
      return `Expected attributes ${jasmine.pp(attr1)} to equal ${jasmine.pp(attr2)}`;
    }
    if (node1.childNodes.length !== node2.childNodes.length) {
      return `Expected node childNodes length '${node1.childNodes.length}' to equal '${node2.childNodes.length}'`;
    }
    if (node1.childNodes.length === 0) return null;
    let message = '';
    if ([].some.call(node1.childNodes, function(child1, i) {
      message = compareNodes(child1, node2.childNodes[i], ignoredAttributes);
      return message;
    })) {
      return message;
    }
  } else if (node1.data !== node2.data) {
    return `Expected node text '${node1.data}' to equal '${node2.data}'`;
  }
  return null;
}

function initialize(klass, html, container = this.container) {
  if (typeof html === 'object') {
    container.innerHTML = html.html;
  } else {
    container.innerHTML = html.replace(/\n\s*/g, '');
  }
  if (klass === HTMLElement) return container;
  if (klass === Quill) return new Quill(container);
  let emitter = new Emitter();
  let scroll = new Scroll(container, { emitter: emitter });
  if (klass === Scroll) return scroll;
  let editor = new Editor(scroll, emitter);
  if (klass === Editor) return editor;
  let selection = new Selection(scroll, emitter);
  if (klass === Selection) return selection;
  if (klass[0] === Editor && klass[1] === Selection) return [editor, selection];
}
