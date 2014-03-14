_     = require('lodash')
_.str = require('underscore.string')


class ScribeDefaultTheme
  @OPTIONS: {}

  constructor: (@scribe, options) ->
    @editor = @scribe.editor
    @editorContainer = @editor.root
    @modules = {}
    _.each(options.modules, (option, name) =>
      this.addModule(name, option)
    )

  addModule: (name, options) ->
    className = _.str.capitalize(_.str.camelize(name))
    options = _.defaults(this.constructor.OPTIONS[name] or {}, options)
    @scribe.editor.logger.debug('Initializing module', name, options)
    @modules[name] = new @scribe.constructor.Module[className](@scribe, @editorContainer, options)
    @scribe.emit(@scribe.constructor.events.MODULE_INIT, name, @modules[name])
    return @modules[name]

  onModuleLoad: (name, callback) ->
    if (@modules[name]) then return callback(@modules[name])
    @scribe.on(@scribe.constructor.events.MODULE_INIT, (moduleName, module) ->
      callback(module) if moduleName == name
    )


module.exports = ScribeDefaultTheme
