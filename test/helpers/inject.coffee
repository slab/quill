# Inject fixtures into DOM
$(document.body).prepend(_.map(window.__html__, (html) ->
  return html
).join(''))
