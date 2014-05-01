_       = require('lodash')
DOM     = require('../dom')
Tooltip = require('./tooltip')


class ImageTooltip extends Tooltip
  @DEFAULTS:
    styles:
      '.image-tooltip-container':
        'margin': '25px'
        'padding': '10px'
        'width': '300px'
      '.image-tooltip-container:after':
        'clear': 'both'
        'content': '""'
        'display': 'table'
      '.image-tooltip-container .preview':
        'margin': '10px 0px'
        'position': 'relative'
        'border': '1px dashed #000'
        'height': '200px'
      '.image-tooltip-container .preview span':
        'display': 'inline-block'
        'position': 'absolute'
        'text-align': 'center'
        'top': '40%'
        'width': '100%'
      '.image-tooltip-container img':
        'bottom': '0'
        'left': '0'
        'margin': 'auto'
        'max-height': '100%'
        'max-width': '100%'
        'position': 'absolute'
        'right': '0'
        'top': '0'
      '.image-tooltip-container .input':
        'box-sizing': 'border-box'
        'width': '100%'
      '.image-tooltip-container a':
        'border': '1px solid black'
        'box-sizing': 'border-box'
        'display': 'inline-block'
        'float': 'left'
        'padding': '5px'
        'text-align': 'center'
        'width': '50%'
    template:
     '<input class="input" type="textbox">
      <div class="preview">
        <span>Preview</span>
      </div>
      <a href="javascript:;" class="cancel">Cancel</a>
      <a href="javascript:;" class="insert">Insert</a>'

  constructor: (@quill, @options) ->
    @options.styles = _.defaults(@options.styles, Tooltip.DEFAULTS.styles)
    @options = _.defaults(@options, Tooltip.DEFAULTS)
    super(@quill, @options)
    @preview = @container.querySelector('.preview')
    @textbox = @container.querySelector('.input')
    DOM.addClass(@container, 'image-tooltip-container')
    this.initToolbar()
    this.initListeners()

  initListeners: ->
    DOM.addEventListener(@container.querySelector('.insert'), 'click', _.bind(this.insertImage, this))
    DOM.addEventListener(@container.querySelector('.cancel'), 'click', _.bind(this.hide, this))
    DOM.addEventListener(@textbox, 'input', =>
      if this._matchImageURL(@textbox.value)
        if @preview.firstChild.tagName == 'IMG'
          @preview.firstChild.setAttribute('src', @textbox.value)
        else
          img = @preview.ownerDocument.createElement('img')
          img.setAttribute('src', @textbox.value)
          @preview.replaceChild(img, @preview.firstChild)
    )
    this.initTextbox(@textbox, this.insertImage, this.hide)

  insertImage: ->
    url = this._normalizeURL(@textbox.value)
    if @range
      @preview.innerHTML = '<span>Preview</span>'
      @textbox.value = ''
      @quill.insertEmbed(@range.end, 'image', url, 'user')
      @quill.setSelection(@range.end + 1, @range.end + 1)
    this.hide()

  initToolbar: ->
    @quill.onModuleLoad('toolbar', (toolbar) =>
      toolbar.initFormat('image', 'click', (range, value) =>
        if value
          @textbox.value = 'http://' unless @textbox.value
          this.show()
          @textbox.focus()
          _.defer( =>
            @textbox.setSelectionRange(@textbox.value.length, @textbox.value.length)
          )
        else
          @quill.deleteText(range, 'user')
      )
    )

  _matchImageURL: (url) ->
    return /^https?:\/\/.+\.(jp?g|gif|png)$/.test(url)

  _normalizeURL: (url) ->
    # For now identical to link-tooltip but will change when we allow data uri
    url = 'http://' + url unless /^https?:\/\//.test(url)
    return url


module.exports = ImageTooltip
