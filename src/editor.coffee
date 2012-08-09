#= require underscore
#= require document
#= require selection
#= require rangy-core
#= require eventemitter2

class TandemEditor extends EventEmitter2
  events: 
    API_TEXT_CHANGE       : 'api-text-change'
    USER_SELECTION_CHANGE : 'user-selection-change'
    USER_TEXT_CHANGE      : 'user-text-change'

  constructor: (@container) ->
    @container = document.getElementById(@container) if _.isString(@container)
    @iframe = this._createIframe(@container)
    @iframeDoc = @iframe.contentWindow.document
    @doc = new Tandem.Document(@iframeDoc.body)
    @ignoreDomChanges = false
    rangy.init()
    @currentSelection = this.getSelectionRange()
    # Normalize html
    this.initListeners()

  _appendStyles: (doc) ->
    head = doc.getElementsByTagName('head')[0]
    style = doc.createElement('style')
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
      style.appendChild(doc.createTextNode(css))
    head.appendChild(style)

  _createIframe: (parent) ->
    html = parent.innerHTML
    parent.innerHTML = ''
    iframe = document.createElement('iframe')
    iframe.frameborder = 0
    iframe.src = 'javascript:;'
    iframe.height = '100%'
    iframe.width = '100%'
    parent.appendChild(iframe)
    doc = iframe.contentWindow.document
    this._appendStyles(doc)
    doc.body.setAttribute('contenteditable', true)
    doc.body.innerHTML = html
    return iframe

  initListeners: ->
    @iframeDoc.body.addEventListener('DOMSubtreeModified', _.debounce( ->
      return if @ignoreDomChanges
      # Normalize
      # Detect changes
      # Callback
      console.log 'DOMSubtreeModified'
    , 100))
    checkSelectionChange = _.debounce( =>
      selection = this.getSelectionRange()
      if selection != @currentSelection && !selection.equals(@currentSelection)
        this.emit(this.events.USER_SELECTION_CHANGE, selection)
        @currentSelection = selection
    , 100)
    @iframeDoc.body.addEventListener('keyup', checkSelectionChange)
    @iframeDoc.body.addEventListener('click', checkSelectionChange)


  insertAt: (startIndex, text, attributes = {}) ->
    @ignoreDomChanges = true
    range = if _.isNumber(startIndex) then new Tandem.Range(this, startIndex, startIndex) else startIndex
    this.preserveSelection(range, text.length, ->

    )
    @ignoreDomChanges = false
    # 1. Save selection
    # 2. Split text into lines
    # 3. Find node where it starts
    # 4. Insert text of first line
    # 5. Append <div> wrapped text for remaining lines
    # - Update local data structures?
    # - Apply attributes if applicable
    # 6. Restore selection

  deleteAt: (startIndex, length) ->  
    @ignoreDomChanges = true
    range = if _.isNumber(startIndex) then new Tandem.Range(this, startIndex, startIndex + length) else startIndex
    this.preserveSelection(range, 0 - length, ->

    )
    @ignoreDomChanges = false
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

  getSelectionRange: ->
    return Tandem.Range.getCurrent(this)

  # applyAttribute: (TandemRange range, Object attribute) ->
  # applyAttribute: (Number startIndex, Number length, attribute) ->
  applyAttribute: (startIndex, length, attribute) ->
    @ignoreDomChanges = true
    range = if _.isNumber(startIndex) then new Tandem.Range(this, startIndex, startIndex + length) else startIndex
    this.preserveSelection(range, 0, =>
      range.splitEnds()
      _.each(range.groupNodesByLine(), (elems) =>
        return if elems.length == 0
        container = @iframeDoc.createElement('b')
        elems[0].parentNode.insertBefore(container, elems[0])
        _.each(elems, (elem) ->
          container.appendChild(elem)
        )
      )
    )
    @ignoreDomChanges = false
    
  preserveSelection: (modificationRange, charAdditions, fn) ->
    currentSelection = this.getSelectionRange()
    if currentSelection?
      selectionStartIndex = currentSelection.start.getIndex()
      selectionEndIndex = currentSelection.end.getIndex()
      fn()
      savedSelectionRange = new Tandem.Range(currentSelection.editor, selectionStartIndex, selectionEndIndex)
      rangySel = rangy.getIframeSelection(@iframe)
      range = savedSelectionRange.getRangy()
      rangySel.setSingleRange(range)
    else
      fn()


window.Tandem ||= {}
window.Tandem.Editor = TandemEditor
