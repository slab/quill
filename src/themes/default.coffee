class ScribeDefaultTheme
  constructor: (@editor) ->

  addStyleSheet: (url) ->
    sheet = document.createElement('link')
    sheet.type = 'text/css'
    sheet.rel = 'stylesheet'
    sheet.href = url
    document.querySelector('head').appendChild(sheet)

  extendModule: (name, options) ->
  

module.exports = ScribeDefaultTheme
