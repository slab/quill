Quill   = require('../quill')
Tooltip = require('./tooltip')
_       = Quill.require('lodash')
dom     = Quill.require('dom')

class LinkTooltip extends Tooltip
  @DEFAULTS:
    maxLength: 50
    template:
     '<span class="title">Visit URL:&nbsp;</span>
      <a href="#" class="url" target="_blank" href="about:blank"></a>
      <input class="input" type="text">
      <span>&nbsp;&#45;&nbsp;</span>
      <a href="javascript:;" class="change">Change</a>
      <a href="javascript:;" class="remove">Remove</a>
      <a href="javascript:;" class="done">Done</a>'

  @hotkeys:
    LINK: { key: 'K', metaKey: true }

  constructor: (@quill, @options) ->
    @options = _.defaults(@options, Tooltip.DEFAULTS)
    super(@quill, @options)
    dom(@container).addClass('ql-link-tooltip')
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
      else if @container.style.left != Tooltip.HIDE_MARGIN
        @range = null   # Prevent restoring selection to last saved
        this.hide()
    )
    dom(@container.querySelector('.done')).on('click', _.bind(this.saveLink, this))
    dom(@container.querySelector('.remove')).on('click', =>
      this.removeLink(@range)
    )
    dom(@container.querySelector('.change')).on('click', =>
      this.setMode(@link.href, true)
    )
    this.initTextbox(@textbox, this.saveLink, this.hide)
    @quill.onModuleLoad('toolbar', (toolbar) =>
      @toolbar = toolbar
      toolbar.initFormat('link', _.bind(this._onToolbar, this))
    )
    @quill.onModuleLoad('keyboard', (keyboard) =>
      keyboard.addHotkey(LinkTooltip.hotkeys.LINK, _.bind(this._onKeyboard, this))
    )

  saveLink: ->
    url = this._normalizeURL(@textbox.value)
    if @range?
      end = @range.end
      if @range.isCollapsed()
        anchor = this._findAnchor(@range)
        anchor.href = url if anchor?
      else
        @quill.formatText(@range, 'link', url, 'user')
      @quill.setSelection(end, end)
    this.setMode(url, false)

  removeLink: (range) ->
    # Expand range to the entire leaf
    if range.isCollapsed()
      range = this._expandRange(range)
    this.hide()
    @quill.formatText(range, 'link', false, 'user')
    @toolbar.setActive('link', false) if @toolbar?

  setMode: (url, edit = false) ->
    if edit
      @textbox.value = url
      _.defer( =>
        # Setting value and immediately focusing doesn't work on Chrome
        @textbox.focus()
        @textbox.setSelectionRange(0, url.length)
      )
    else
      @link.href = url
      url = @link.href # read back the url for further normalization
      text = if url.length > @options.maxLength then url.slice(0, @options.maxLength) + '...' else url
      dom(@link).text(text)
    dom(@container).toggleClass('editing', edit)

  _findAnchor: (range) ->
    [leaf, offset] = @quill.editor.doc.findLeafAt(range.start, true)
    node = leaf.node if leaf?
    while node? and node != @quill.root
      return node if node.tagName == 'A'
      node = node.parentNode
    return null

  _expandRange: (range) ->
    [leaf, offset] = @quill.editor.doc.findLeafAt(range.start, true)
    start = range.start - offset
    end = start + leaf.length
    return { start, end }

  _onToolbar: (range, value) ->
    this._toggle(range, value)

  _onKeyboard: ->
    range = @quill.getSelection()
    this._toggle(range, !this._findAnchor(range))

  _toggle: (range, value) ->
    return unless range
    if !value
      this.removeLink(range)
    else if !range.isCollapsed()
      this.setMode(this._suggestURL(range), true)
      nativeRange = @quill.editor.selection._getNativeRange()
      this.show(nativeRange)

  _normalizeURL: (url) ->
    url = 'http://' + url unless /^(https?:\/\/|mailto:)/.test(url)
    return url

  _suggestURL: (range) ->
    text = @quill.getText(range)
    return this._normalizeURL(text)


Quill.registerModule('link-tooltip', LinkTooltip)
module.exports = LinkTooltip
