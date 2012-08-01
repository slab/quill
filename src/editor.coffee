#= require underscore
#= require document

class Editor
  constructor: (@container) ->
    @container = document.getElementById(@container) if _.isString(@container)
    @frameBody = this._createIframe(@container)
    @doc = new Tandem.Document(@frameBody)

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
    html = parent.innerHTML
    parent.innerHTML = ''
    iframe = document.createElement('iframe')
    iframe.frameborder = 0
    iframe.height = '100%'
    iframe.width = '100%'
    parent.appendChild(iframe)
    doc = iframe.contentWindow.document
    this._appendStyles(doc)
    doc.body.setAttribute('contenteditable', true)
    doc.body.innerHTML = html
    console.log doc.body.childNodes
    return doc

  insertAt: (startIndex, text, attributes = {}) ->

  deleteAt: (startIndex, length) ->

  getAt: (startIndex, length) ->

  getSelection: ->

  applyAttribute: (startIndex, length, attribute) ->
    if !_.isNumber(startIndex)
      selection = this.getSelection()
      startIndex = selection.getStartIndex()
      length = selection.getEndIndex() - startIndex

  on: (event, callback) ->

  off: (event, callback) ->


window.Tandem ||= {}
window.Tandem.Editor = Editor
