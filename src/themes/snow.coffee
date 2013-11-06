ScribeColorPicker = require('./color-picker')
ScribeDefaultTheme = require('./default')
ScribePicker = require('./picker')


class ScribeSnowTheme extends ScribeDefaultTheme
  constructor: (@editor) ->
    _.defaults(
      styles:
        'div.editor': { 'bottom': '15px', 'top': '15px' }
    , @editor.options.renderer)
    super

  extendModule: (name, options) ->
    switch name
      when 'attribution'  then return this.extendAttribution(options)
      when 'link-tooltip' then return this.extendLinkTooltip(options)
      when 'multi-cursor' then return this.extendMultiCursor(options)
      when 'toolbar'      then return this.extendToolbar(options)

  extendAttribution: (options) ->


  extendLinkTooltip: (options) ->
    @editor.renderer.addStyles(
      'a': { 'color': '#06c' }
      '#link-tooltip':
        'border': '1px solid #ccc'
        'box-shadow': '0px 0px 5px #ddd'
        'color': '#222'
      '#link-tooltip a':
        'color': '#06c'
      '#link-tooltip .input':
        'border': '1px solid #ccc'
        'margin': '0px'
        'padding': '3px'
    )

  extendMultiCursor: (options) ->
    options.template = 
     '<span class="cursor-flag">
        <span class="cursor-name"></span>
        <span class="cursor-triangle"></span>
      </span>
      <span class="cursor-caret"></span>'
    @editor.renderer.addStyles(
      '.cursor-name':
        'border-radius': '3px'
        'font-size': '11px'
        'font-family': 'Arial'
        'margin-left': '-50%'
        'padding': '4px 10px'
      '.cursor-triangle':
        'border-left': '4px solid transparent'
        'border-right': '4px solid transparent'
        'border-top': '4px solid transparent'
        'display': 'block'
        'height': '0px'
        'margin-bottom': '-1px'
        'margin-left': '-3px'
        'width': '0px'
      '.cursor.top > .cursor-flag': { 'bottom': '100%', 'top': 'auto' }
    )

  extendToolbar: (options) ->
    this.addStyleSheet('styles/snow.css')
    options.container = document.getElementById(options.container) if _.isString(options.container)
    _.each(options.container.querySelectorAll('.font-name, .font-size'), (select) ->
      picker = new ScribePicker(select)
    )
    _.each(options.container.querySelectorAll('.fore-color'), (select) ->
      picker = new ScribeColorPicker(select)
      console.log picker.container
      Scribe.DOM.addClass(picker.container.querySelector('.picker-label'), 'format-button')
    )
    

window.Scribe.Themes.Snow = ScribeSnowTheme
