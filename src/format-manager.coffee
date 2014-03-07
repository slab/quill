_            = require('lodash')
_.str        = require('underscore.string')
ScribeFormat = require('./format')


class ScribeFormatManager
  constructor: (@container, @options = {}) ->
    @formats = {}
    _.each(@options.formats, (formatName) =>
      className = _.str.classify(formatName)
      this.addFormat(formatName, new ScribeFormat[className](@container))
    )

  addFormat: (name, format) ->
    @formats[name] = format

  createFormatContainer: (name, value) ->
    if @formats[name]
      return @formats[name].createContainer(value)
    else
      return @container.ownerDocument.createElement('SPAN')

  getFormat: (container) ->
    names = []
    formats = []
    for name,format of @formats
      value = format.matchContainer(container)
      if value
        names.push(name)
        formats.push(value)
    switch names.length
      when 0 then return []
      when 1 then return [names[0], formats[0]]
      else return [names, formats]


module.exports = ScribeFormatManager
