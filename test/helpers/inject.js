let $div = $('<div>').attr('id', 'test-container');
$(document.body).prepend($div);

beforeEach(function() {
  this.container = $div.html('<div></div>').get(0).firstChild;
});
