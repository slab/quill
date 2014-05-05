_       = require('lodash')
DOM     = require('../dom')
Tooltip = require('./tooltip')


class LinkTooltip extends Tooltip
  @DEFAULTS:
    styles:
      '.link-tooltip-container':
        'padding': '5px 10px'
      '.link-tooltip-container input.input':
        'width': '170px'
      '.link-tooltip-container input.input, .link-tooltip-container a.done, .link-tooltip-container.editing a.url, .link-tooltip-container.editing a.change':
        'display': 'none'
      '.link-tooltip-container.editing input.input, .link-tooltip-container.editing a.done':
        'display': 'inline-block'
    template:
     '<span class="title">Visit URL:&nbsp;</span>
      <a href="#" class="url" target="_blank" href="about:blank"></a>
      <input class="input" type="text">
      <span>&nbsp;&#45;&nbsp;</span>
      <a href="javascript:;" class="change">Change</a>
      <a href="javascript:;" class="done">Done</a>'

  constructor: (@quill, @options) ->
    @options.styles = _.defaults(@options.styles, Tooltip.DEFAULTS.styles)
    @options = _.defaults(@options, Tooltip.DEFAULTS)
    super(@quill, @options)
    DOM.addClass(@container, 'link-tooltip-container')
    @textbox = @container.querySelector('.input')
    @link = @container.querySelector('.url')
    this.initListeners()

  initListeners: ->
    @quill.on(@quill.constructor.events.SELECTION_CHANGE, (range) =>
      return unless range? and range.isCollapsed()
      anchor = this._findAnchor(range)
      if anchor
        this.setMode(anchor.href, false)
        this.show(anchor)
      else
        @range = null   # Prevent restoring selection to last saved
        this.hide()
    )
    DOM.addEventListener(@container.querySelector('.done'), 'click', _.bind(this.saveLink, this))
    DOM.addEventListener(@container.querySelector('.change'), 'click', =>
      this.setMode(@link.href, true)
    )
    this.initTextbox(@textbox, this.saveLink, this.hide)
    @quill.onModuleLoad('toolbar', (toolbar) =>
      toolbar.initFormat('link', _.bind(this._onToolbar, this))
    )

  saveLink: ->
    url = this._normalizeURL(@textbox.value)
    @quill.formatText(@range, 'link', url) if @range?
    this.setMode(url, false)

  setMode: (url, edit = false) ->
    if edit
      @textbox.value = url
      @textbox.focus()
      _.defer( =>
        @textbox.setSelectionRange(url.length, url.length)
      )
    else
      @link.href = url
      DOM.setText(@link, url)
    DOM.toggleClass(@container, 'editing', edit)

  _findAnchor: (range) ->
    [leaf, offset] = @quill.editor.doc.findLeafAt(Math.max(0, range.start - 1))
    node = leaf.node if leaf?
    while node?
      if node.tagName == 'A'
        this.setMode(node.href, false)
        this.show(node)
        return node
      else
        node = node.parentNode
    return null

  _onToolbar: (range, value) ->
    return unless range and !range.isCollapsed()
    if value
      this.setMode(this._suggestURL(range), true)
      nativeRange = @quill.editor.selection._getNativeRange()
      this.show(nativeRange)
    else
      @quill.formatText(range, 'link', false, 'user')

  _normalizeURL: (url) ->
    url = 'http://' + url unless /^https?:\/\//.test(url)
    return url

  _suggestURL: (range) ->
    text = @quill.getText(range)
    return this._normalizeURL(text)


module.exports = LinkTooltip
