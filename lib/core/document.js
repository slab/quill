var Delta, Document, Format, Line, LinkedList, Normalizer, dom, _;

_ = require('lodash');

Delta = require('rich-text').Delta;

dom = require('../lib/dom');

Format = require('./format');

Line = require('./line');

LinkedList = require('../lib/linked-list');

Normalizer = require('../lib/normalizer');

Document = (function() {
  function Document(root, options) {
    this.root = root;
    if (options == null) {
      options = {};
    }
    this.formats = {};
    _.each(options.formats, _.bind(this.addFormat, this));
    this.setHTML(this.root.innerHTML);
  }

  Document.prototype.addFormat = function(name, config) {
    if (!_.isObject(config)) {
      config = Format.FORMATS[name];
    }
    if (this.formats[name] != null) {
      console.warn('Overwriting format', name, this.formats[name]);
    }
    return this.formats[name] = new Format(this.root.ownerDocument, config);
  };

  Document.prototype.appendLine = function(lineNode) {
    return this.insertLineBefore(lineNode, null);
  };

  Document.prototype.findLeafAt = function(index, inclusive) {
    var line, offset, _ref;
    _ref = this.findLineAt(index), line = _ref[0], offset = _ref[1];
    if (line != null) {
      return line.findLeafAt(offset, inclusive);
    } else {
      return [null, offset];
    }
  };

  Document.prototype.findLine = function(node) {
    var line;
    while ((node != null) && (dom.BLOCK_TAGS[node.tagName] == null)) {
      node = node.parentNode;
    }
    line = node != null ? this.lineMap[node.id] : null;
    if ((line != null ? line.node : void 0) === node) {
      return line;
    } else {
      return null;
    }
  };

  Document.prototype.findLineAt = function(index) {
    var curLine, length;
    if (!(this.lines.length > 0)) {
      return [null, index];
    }
    length = this.toDelta().length();
    if (index === length) {
      return [this.lines.last, this.lines.last.length];
    }
    if (index > length) {
      return [null, index - length];
    }
    curLine = this.lines.first;
    while (curLine != null) {
      if (index < curLine.length) {
        return [curLine, index];
      }
      index -= curLine.length;
      curLine = curLine.next;
    }
    return [null, index];
  };

  Document.prototype.insertLineBefore = function(newLineNode, refLine) {
    var line;
    line = new Line(this, newLineNode);
    if (refLine != null) {
      if (!dom(newLineNode.parentNode).isElement()) {
        this.root.insertBefore(newLineNode, refLine.node);
      }
      this.lines.insertAfter(refLine.prev, line);
    } else {
      if (!dom(newLineNode.parentNode).isElement()) {
        this.root.appendChild(newLineNode);
      }
      this.lines.append(line);
    }
    this.lineMap[line.id] = line;
    return line;
  };

  Document.prototype.mergeLines = function(line, lineToMerge) {
    if (lineToMerge.length > 1) {
      if (line.length === 1) {
        dom(line.leaves.last.node).remove();
      }
      _.each(dom(lineToMerge.node).childNodes(), function(child) {
        if (child.tagName !== dom.DEFAULT_BREAK_TAG) {
          return line.node.appendChild(child);
        }
      });
    }
    this.removeLine(lineToMerge);
    return line.rebuild();
  };

  Document.prototype.optimizeLines = function() {
    return _.each(this.lines.toArray(), function(line, i) {
      line.optimize();
      return true;
    });
  };

  Document.prototype.rebuild = function() {
    var lineNode, lines, _results;
    lines = this.lines.toArray();
    lineNode = this.root.firstChild;
    if ((lineNode != null) && (dom.LIST_TAGS[lineNode.tagName] != null)) {
      lineNode = lineNode.firstChild;
    }
    _.each(lines, (function(_this) {
      return function(line, index) {
        var newLine, _ref;
        while (line.node !== lineNode) {
          if (line.node.parentNode === _this.root || ((_ref = line.node.parentNode) != null ? _ref.parentNode : void 0) === _this.root) {
            lineNode = Normalizer.normalizeLine(lineNode);
            newLine = _this.insertLineBefore(lineNode, line);
            lineNode = dom(lineNode).nextLineNode(_this.root);
          } else {
            return _this.removeLine(line);
          }
        }
        if (line.outerHTML !== lineNode.outerHTML) {
          line.node = Normalizer.normalizeLine(line.node);
          line.rebuild();
        }
        return lineNode = dom(lineNode).nextLineNode(_this.root);
      };
    })(this));
    _results = [];
    while (lineNode != null) {
      lineNode = Normalizer.normalizeLine(lineNode);
      this.appendLine(lineNode);
      _results.push(lineNode = dom(lineNode).nextLineNode(this.root));
    }
    return _results;
  };

  Document.prototype.removeLine = function(line) {
    if (line.node.parentNode != null) {
      if (dom.LIST_TAGS[line.node.parentNode.tagName] && line.node.parentNode.childNodes.length === 1) {
        dom(line.node.parentNode).remove();
      } else {
        dom(line.node).remove();
      }
    }
    delete this.lineMap[line.id];
    return this.lines.remove(line);
  };

  Document.prototype.setHTML = function(html) {
    html = Normalizer.stripComments(html);
    html = Normalizer.stripWhitespace(html);
    this.root.innerHTML = html;
    this.lines = new LinkedList();
    this.lineMap = {};
    return this.rebuild();
  };

  Document.prototype.splitLine = function(line, offset) {
    var lineNode1, lineNode2, newLine, _ref;
    offset = Math.min(offset, line.length - 1);
    _ref = dom(line.node).split(offset, true), lineNode1 = _ref[0], lineNode2 = _ref[1];
    line.node = lineNode1;
    line.rebuild();
    newLine = this.insertLineBefore(lineNode2, line.next);
    newLine.formats = _.clone(line.formats);
    newLine.resetContent();
    return newLine;
  };

  Document.prototype.toDelta = function() {
    var delta, lines;
    lines = this.lines.toArray();
    delta = new Delta();
    lines.forEach(function(line) {
      return line.delta.ops.forEach(function(op) {
        return delta.push(op);
      });
    });
    return delta;
  };

  return Document;

})();

module.exports = Document;
