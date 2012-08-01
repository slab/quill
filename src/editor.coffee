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
    # 1. Save selection
    # 2. Split text into lines
    # 3. Find node where it starts
    # 4. Insert text of first line
    # 5. Append <div> wrapped text for remaining lines
    # - Update local data structures?
    # - Apply attributes if applicable
    # 6. Restore selection

  deleteAt: (startIndex, length) ->    
    # 1. Save selection
    # 2. Find nodes in range
    # 3. For first and last node, delete text
    # 4. For remaining nodes, remove node
    # 5. For first and last node
    #     - If node is empty and selection is not on that node
    #         - Delete node, recursively for each parent
    #         - Might have helper that clears empty nodes
    # 6. Restore selection

  getAt: (startIndex, length) ->
    # - Returns array of {text: "", attr: {}}
    # 1. Get all nodes in the range
    # 2. For first and last, change the text
    # 3. Return array
    # - Helper to get nodes in given index range
    # - In the case of 0 lenght, text will always be "", but attributes should be properly applied

  getSelection: ->
    # 1. Ask rangy
    # 2. Create new selection object

  applyAttribute: (startIndex, length, attribute) ->
    if !_.isNumber(startIndex)
      selection = this.getSelection()
      startIndex = selection.getStartIndex()
      length = selection.getEndIndex() - startIndex

  on: (event, callback) ->
    # Text
    # - Every 500ms
    #     - normalizeHTML
    #     - Get changes from document
    #     - If any, trigger callback

    # Cursor
    # - Notifies of explicit change (typing does move the cursor but we are not going to fire?)
    # - Poll every 200ms (or 500ms?)
    # - Every click event, event key motion event (or every key event?), check
    #     - How do we know if cursor changed cuz of typing or left arrow? 
    #  #        - Both will move the cursor but we are only interested in latter

  off: (event, callback) ->


window.Tandem ||= {}
window.Tandem.Editor = Editor
