$div = $('<div>').attr('id', 'test-container')
$(document.body).prepend($div)

beforeEach( ->
  @container = $div.html('<div></div>').get(0).firstChild
)
