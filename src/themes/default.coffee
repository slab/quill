stylesheets = {}


class ScribeDefaultTheme
  constructor: (@editor) ->

  addStyleSheet: (url) ->
    return if stylesheets[url]
    sheet = document.createElement('link')
    sheet.type = 'text/css'
    sheet.rel = 'stylesheet'
    sheet.href = url
    document.querySelector('head').appendChild(sheet)
    stylesheets[url] = true

  extendModule: (name, options) ->
  

module.exports = ScribeDefaultTheme
