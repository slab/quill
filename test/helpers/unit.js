let $div = $('<div>').attr('id', 'test-container');
$(document.body).prepend($div);

beforeEach(function() {
  this.container = $div.html('<div></div>').get(0).firstChild;
  // Defining in a beforeAll does not work, seems this is cloned or something
  this.setContainer = (html, container = this.container) => {
    return container.innerHTML = html.replace(/\n\s*/g, '');
  };
});
