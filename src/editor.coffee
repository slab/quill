#= require underscore

class Editor
  constructor: (@container) ->
    @container = document.getElementById(@container) if _.isString(@container)
    @body = this._createIframe(@container)

  _appendStyles: (document) ->
    head = document.getElementsByTagName('head')[0]
    style = document.createElement('style')
    style.type = 'text/css'
    css = "
      body { 
        font-family: 'Helvetica', 'Arial', san-serif;
        font-size: 13px;
        margin: 0px; 
        padding: 0px; 
      }
      a { text-decoration: underline }
      b { font-weight: bold }
      i { font-style: italic }
      s { text-decoration: line-through }
      u { text-decoration: underline }
    "
    if style.styleSheet?
      style.styleSheet.cssText = css
    else
      style.appendChild(document.createTextNode(css))
    head.appendChild(style)

  _createIframe: (parent) ->
    iframe = document.createElement('iframe')
    iframe.frameborder = 0
    iframe.height = '100%'
    iframe.width = '100%'
    parent.appendChild(iframe)
    this._appendStyles(iframe.contentWindow.document)
    body = iframe.contentWindow.document.body
    body.setAttribute('contenteditable', true)
    return body

  insertAt: (startIndex, text, attributes = {}) ->

  deleteAt: (startIndex, length) ->

  getAt: (startIndex, length) ->

  applyAttribute: (startIndex, length, attribute) ->

  on: (event, callback) ->

  off: (event, callback) ->


window.Tandem = {
  Editor: Editor
}
