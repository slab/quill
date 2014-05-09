_       = require('lodash')
DOM     = require('../dom')
Tooltip = require('./tooltip')

class MarkupTooltip extends Tooltip
  @DEFAULTS:
    styles:
      '.markup-tooltip-container':
        'margin': '25px'
        'padding': '10px'
        'width': '500px'
      '.markup-tooltip-container:after':
        'clear': 'both'
        'content': '""'
        'display': 'table'
      '.markup-tooltip-container .input':
        'font-family': 'Courier New'
        'font-weight': 'bold'
        'height': '250px'
        'box-sizing': 'border-box'
        'width': '100%'
      '.markup-tooltip-container a':
        'border': '1px solid black'
        'box-sizing': 'border-box'
        'display': 'inline-block'
        'float': 'left'
        'padding': '5px'
        'text-align': 'center'
        'width': '50%'
    template:
     '<div class="markup-editor">
        <textarea class="input"></textarea>
      </div>
      <a href="javascript:;" class="cancel">Cancel</a>
      <a href="javascript:;" class="update">Insert</a>'

  constructor: (@quill, @options) ->
    @options.styles = _.defaults(@options.styles, Tooltip.DEFAULTS.styles)
    @options = _.defaults(@options, Tooltip.DEFAULTS)
    super(@quill, @options)
    @textbox = @container.querySelector('.input')
    DOM.addClass(@container, 'markup-tooltip-container')
    this.initListeners()

  initListeners: ->
    DOM.addEventListener(@container.querySelector('.update'), 'click', _.bind(this.updateMarkup, this))
    DOM.addEventListener(@container.querySelector('.cancel'), 'click', _.bind(this.hide, this))
    # this.initTextbox(@textbox, this.updateMarkup, this.hide)
    @quill.onModuleLoad('toolbar', (toolbar) =>
      toolbar.initFormat('markup', _.bind(this._onToolbar, this))
    )

  updateMarkup: ->
    @quill.setHTML(@textbox.value, Quill.sources.SILENT)
    this.hide()

  _onToolbar: (range, value) ->
    @textbox.value = @quill.getHTML();
    this.show()
    @textbox.focus()

module.exports = MarkupTooltip
