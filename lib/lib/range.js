var Range, _;

_ = require('lodash');

Range = (function() {
  Range.compare = function(r1, r2) {
    if (r1 === r2) {
      return true;
    }
    if (!((r1 != null) && (r2 != null))) {
      return false;
    }
    return r1.equals(r2);
  };

  function Range(start, end) {
    this.start = start;
    this.end = end;
  }

  Range.prototype.equals = function(range) {
    if (range == null) {
      return false;
    }
    return this.start === range.start && this.end === range.end;
  };

  Range.prototype.shift = function(index, length) {
    var _ref;
    return _ref = _.map([this.start, this.end], function(pos) {
      if (index > pos) {
        return pos;
      }
      if (length >= 0) {
        return pos + length;
      } else {
        return Math.max(index, pos + length);
      }
    }), this.start = _ref[0], this.end = _ref[1], _ref;
  };

  Range.prototype.isCollapsed = function() {
    return this.start === this.end;
  };

  return Range;

})();

module.exports = Range;
