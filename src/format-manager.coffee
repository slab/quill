Scribe = require('./scribe')


class Scribe.FormatManager
  @DEFAULTS:
    formats: ['bold', 'italic', 'strike', 'underline', 'link', 'background', 'color', 'family', 'size']

  constructor: (@container, options) ->
    @options = _.defaults(options, Scribe.FormatManager.DEFAULTS)
    @formats = {}
    _.each(@options.formats, (formatName) =>
      className = formatName[0].toUpperCase() + formatName.slice(1)
      this.addFormat(formatName, new Scribe.Format[className](@container))
    )

  addFormat: (name, format) ->
    @formats[name] = format

  createFormatContainer: (name, value) ->
    if @formats[name]
      return @formats[name].createContainer(value)
    else
      return @container.ownerDocument.createElement('SPAN')

  getFormat: (container) ->
    for name,format of @formats
      value = format.matchContainer(container)
      return [name, value] if value
    return []


module.exports = Scribe
