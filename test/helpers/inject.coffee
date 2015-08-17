# Inject fixtures into DOM
html = _.map(window.__html__, (html) ->
  return html
).join('')

$div = $('<div>').attr('id', 'test-container')
$(document.body).prepend($div)

beforeEach( ->
  @container = $div.html('<div></div>').get(0).firstChild
)
