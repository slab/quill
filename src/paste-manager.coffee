class TandemPasteManager
  constructor: (@editor) ->
    @container = @editor.doc.root.ownerDocument.createElement('div')
    @container.id = 'paste-container'
    @container.setAttribute('contenteditable', true)
    @editor.renderer.addStyles(
      '#paste-container':
        'left': '-10000px'
        'position': 'fixed'
        'top': '50%'
    )
    @editor.doc.root.parentNode.appendChild(@container)
    this.initListeners()

  initListeners: ->
    @editor.doc.root.addEventListener('paste', =>
      @editor.selection.update()
      return unless @editor.selection.range?
      index = @editor.selection.range.start.getIndex()
      unless @editor.selection.range.isCollapsed()
        length = @editor.selection.range.end.getIndex() - index
        @editor.deleteAt(index, length)
        @editor.selection.update()
      docLength = @editor.doc.length
      nativeSel = @editor.selection.getNative()
      lineNode = @editor.doc.findLineNode(@editor.selection.range.start.leafNode)
      nextLineNode = lineNode.nextSibling
      @container.innerHTML = ""
      @container.appendChild(lineNode)
      @editor.selection.setRangeNative(nativeSel)
      @container.focus()
      _.defer( =>
        extNodes = _.clone(@container.querySelectorAll(".#{Tandem.Constants.SPECIAL_CLASSES.EXTERNAL}"))
        _.each(extNodes, (node) ->
          node.parentNode.removeChild(node) if node.parentNode?
        )
        removeStyles = (walker) ->
          walker.firstChild()
          walker.currentNode.removeAttribute('style')
          while walker.nextNode()
            walker.currentNode.removeAttribute('style')
        walker = @container.ownerDocument.createTreeWalker(@container, NodeFilter.SHOW_ELEMENT, null, false)
        removeStyles(walker)
        pastedLineNodes = _.clone(@container.childNodes)
        _.each(pastedLineNodes, (node) =>
          @editor.doc.root.insertBefore(node, nextLineNode)
        )
        @editor.update()
        @editor.doc.root.focus()
        lengthAdded = Math.max(0, @editor.doc.length - docLength)
        @editor.setSelection(new Tandem.Range(@editor, index + lengthAdded, index + lengthAdded))
      )
    )



window.Tandem ||= {}
window.Tandem.PasteManager = TandemPasteManager
