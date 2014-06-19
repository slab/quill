(function() {
  $(document.body).prepend(_.map(window.__html__, function(html) {
    return html;
  }).join(''));

}).call(this);
