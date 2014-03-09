ScribeAuthorship  = require('../modules/authorship')
ScribeLinkTooltip = require('../modules/link-tooltip')
ScribeMultiCursor = require('../modules/multi-cursor')
ScribeToolbar     = require('../modules/toolbar')


class ScribeDefaultTheme
  @stylesheets: {}

  constructor: (@editor) ->

  addModule: (name, options) ->
    switch name
      when 'authorship'  then return new ScribeAuthorship(@editor, options)
      when 'link-tooltip' then return new ScribeLinkTooltip(@editor, options)
      when 'multi-cursor' then return new ScribeMultiCursor(@editor, options)
      when 'toolbar'      then return new ScribeToolbar(@editor, options)
      else return null


module.exports = ScribeDefaultTheme
