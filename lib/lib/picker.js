var DOM, Normalizer, Picker, _;

_ = require('lodash');

DOM = require('../dom');

Normalizer = require('../normalizer');

Picker = (function() {
  Picker.TEMPLATE = '<span class="ql-picker-label"></span><span class="ql-picker-options"></span>';

  function Picker(select) {
    this.select = select;
    this.container = this.select.ownerDocument.createElement('span');
    this.buildPicker();
    DOM.addClass(this.container, 'ql-picker');
    this.select.style.display = 'none';
    this.select.parentNode.insertBefore(this.container, this.select);
    DOM.addEventListener(this.select.ownerDocument, 'click', (function(_this) {
      return function() {
        _this.close();
        return true;
      };
    })(this));
    DOM.addEventListener(this.label, 'click', (function(_this) {
      return function() {
        return _.defer(function() {
          return DOM.toggleClass(_this.container, 'ql-expanded');
        });
      };
    })(this));
    DOM.addEventListener(this.select, 'change', (function(_this) {
      return function() {
        var item, option;
        if (_this.select.selectedIndex > -1) {
          item = _this.container.querySelectorAll('.ql-picker-item')[_this.select.selectedIndex];
          option = _this.select.options[_this.select.selectedIndex];
        }
        _this.selectItem(item, false);
        return DOM.toggleClass(_this.label, 'ql-active', option !== DOM.getDefaultOption(_this.select));
      };
    })(this));
  }

  Picker.prototype.buildItem = function(picker, option, index) {
    var item;
    item = this.select.ownerDocument.createElement('span');
    item.setAttribute('data-value', option.getAttribute('value'));
    DOM.addClass(item, 'ql-picker-item');
    DOM.setText(item, DOM.getText(option));
    if (this.select.selectedIndex === index) {
      this.selectItem(item, false);
    }
    DOM.addEventListener(item, 'click', (function(_this) {
      return function() {
        _this.selectItem(item, true);
        return _this.close();
      };
    })(this));
    return item;
  };

  Picker.prototype.buildPicker = function() {
    var picker;
    _.each(DOM.getAttributes(this.select), (function(_this) {
      return function(value, name) {
        return _this.container.setAttribute(name, value);
      };
    })(this));
    this.container.innerHTML = Normalizer.stripWhitespace(Picker.TEMPLATE);
    this.label = this.container.querySelector('.ql-picker-label');
    picker = this.container.querySelector('.ql-picker-options');
    return _.each(this.select.options, (function(_this) {
      return function(option, i) {
        var item;
        item = _this.buildItem(picker, option, i);
        return picker.appendChild(item);
      };
    })(this));
  };

  Picker.prototype.close = function() {
    return DOM.removeClass(this.container, 'ql-expanded');
  };

  Picker.prototype.selectItem = function(item, trigger) {
    var selected, value;
    selected = this.container.querySelector('.ql-selected');
    if (selected != null) {
      DOM.removeClass(selected, 'ql-selected');
    }
    if (item != null) {
      value = item.getAttribute('data-value');
      DOM.addClass(item, 'ql-selected');
      DOM.setText(this.label, DOM.getText(item));
      DOM.selectOption(this.select, value, trigger);
      return this.label.setAttribute('data-value', value);
    } else {
      this.label.innerHTML = '&nbsp;';
      return this.label.removeAttribute('data-value');
    }
  };

  return Picker;

})();

module.exports = Picker;
