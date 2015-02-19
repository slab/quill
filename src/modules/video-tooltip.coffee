Quill   = require('../quill')
Tooltip = require('./tooltip')
_       = Quill.require('lodash')
dom     = Quill.require('dom')
Delta   = Quill.require('delta')
Range   = Quill.require('range')


class VideoTooltip extends Tooltip
  @DEFAULTS:
    template:
     '<input class="input" type="textbox">
      <div class="preview">
        <span>Preview</span>
      </div>
      <a href="javascript:;" class="cancel">Cancel</a>
      <a href="javascript:;" class="insert">Insert</a>'

  constructor: (@quill, @options) ->
    @options = _.defaults(@options, Tooltip.DEFAULTS)
    super(@quill, @options)
    @preview = @container.querySelector('.preview')
    @textbox = @container.querySelector('.input')
    dom(@container).addClass('ql-video-tooltip')
    config =
      tag: 'IFRAME'
      attribute: 'src'

    @quill.addFormat('video', config)
    this.initListeners()

  initListeners: ->
    dom(@container.querySelector('.insert')).on('click', _.bind(this.insertVideo, this))
    dom(@container.querySelector('.cancel')).on('click', _.bind(this.hide, this))
    dom(@textbox).on('input', _.bind(this._preview, this))
    this.initTextbox(@textbox, this.insertVideo, this.hide)
    @quill.onModuleLoad('toolbar', (toolbar) =>
      toolbar.initFormat('video', _.bind(this._onToolbar, this))
    )

  insertVideo: ->
    url = this._normalizeURL(@textbox.value)
    @range = new Range(0, 0) unless @range?   # If we lost the selection somehow, just put image at beginning of document
    if @range
      @preview.innerHTML = '<span>Preview</span>'
      @textbox.value = ''
      index = @range.end
      @quill.insertEmbed(index, 'video', url, 'user')
      @quill.setSelection(index + 1, index + 1)
    this.hide()

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

  _preview: ->
    return unless this._matchVideoURL(@textbox.value)
    if @preview.firstChild.tagName == 'IMG'
      @preview.firstChild.setAttribute('src', @textbox.value)
    else
      img = document.createElement('img')
      img.setAttribute('src', @textbox.value)
      @preview.replaceChild(img, @preview.firstChild)

  _matchVideoURL: (url) ->
    return true
    # return /^https?:\/\/.+\.(jpe?g|gif|png)$/.test(url)

  _normalizeURL: (url) ->
    # For now identical to link-tooltip but will change when we allow data uri
    # url = 'http://' + url unless /^https?:\/\//.test(url)
    return url


Quill.registerModule('video-tooltip', VideoTooltip)
module.exports = VideoTooltip
