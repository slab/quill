Quill   = require('../quill')
Tooltip = require('./tooltip')
_       = Quill.require('lodash')
dom     = Quill.require('dom')
Delta   = Quill.require('delta')
Range   = Quill.require('range')


class ImageTooltip extends Tooltip
  @DEFAULTS:
    template:
      '<input class="input" type="textbox">\
      <div class="preview">\
        <span>Preview</span>\
      </div>\
      <a href="javascript:;" class="cancel">Cancel</a>\
      <a href="javascript:;" class="insert">Insert</a>'

  constructor: (@quill, @options) ->
    @options = _.defaults(@options, Tooltip.DEFAULTS)
    super(@quill, @options)
    @preview = @container.querySelector('.preview')
    @textbox = @container.querySelector('.input')
    dom(@container).addClass('ql-image-tooltip')
    this.initListeners()

  initListeners: ->
    dom(@quill.root).on('focus', _.bind(this.hide, this))
    dom(@container.querySelector('.insert')).on('click', _.bind(this.insertImage, this))
    dom(@container.querySelector('.cancel')).on('click', _.bind(this.hide, this))
    dom(@textbox).on('input', _.bind(this._preview, this))
    this.initTextbox(@textbox, this.insertImage, this.hide)
    @quill.onModuleLoad('toolbar', (toolbar) =>
      @toolbar = toolbar
      toolbar.initFormat('image', _.bind(this._onToolbar, this))
    )

  insertImage: ->
    url = this._normalizeURL(@textbox.value)
    @preview.innerHTML = '<span>Preview</span>'
    @textbox.value = ''
    this.hide()
    range = @quill.getSelection()
    if range
      @quill.insertEmbed(range.start, 'image', url, 'user')
      @quill.setSelection(range.start + 1, range.start + 1)

  _onToolbar: (range, value) ->
    if value
      @textbox.value = 'http://' unless @textbox.value
      this.show()
      @textbox.focus()
      _.defer( =>
        @textbox.setSelectionRange(@textbox.value.length, @textbox.value.length)
      )
    else
      @quill.deleteText(range, 'user')
      @toolbar.setActive('image', false)

  _preview: ->
    return unless this._matchImageURL(@textbox.value)
    if @preview.firstChild.tagName == 'IMG'
      @preview.firstChild.setAttribute('src', @textbox.value)
    else
      img = document.createElement('img')
      img.setAttribute('src', @textbox.value)
      @preview.replaceChild(img, @preview.firstChild)

  _matchImageURL: (url) ->
    return /^https?:\/\/.+\.(jpe?g|gif|png)$/.test(url)

  _normalizeURL: (url) ->
    # For now identical to link-tooltip but will change when we allow data uri
    url = 'http://' + url unless /^https?:\/\//.test(url)
    return url


Quill.registerModule('image-tooltip', ImageTooltip)
module.exports = ImageTooltip
