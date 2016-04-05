(function() {
  let elem = document.createElement('div');
  elem.classList.toggle('test-class', false);
  if (elem.classList.contains('test-class')) {
    let _toggle = DOMTokenList.prototype.toggle;
    DOMTokenList.prototype.toggle = function(token, force) {
      if (arguments.length > 1 && !this.contains(token) === !force) {
        return force;
      } else {
        return _toggle.call(this, token);
      }
    };
  }
})();
