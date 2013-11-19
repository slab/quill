class ScribeLogger
  constructor: (@editor, @logLevel) ->
    switch @logLevel
      when 'debug'  then @logLevel = 3
      when 'info'   then @logLevel = 2
      when 'warn'   then @logLevel = 1
      when 'error'  then @logLevel = 0
      when false    then @logLevel = -1

_.each(['error', 'warn', 'info', 'debug'], (level, index) ->
  ScribeLogger.prototype[level] = (args...) ->
    return unless console? and @logLevel >= index
    fn = if level == 'debug' then 'log' else level
    args.unshift(@editor.id) if @editor.constructor.editors.length > 1
    console[fn].apply(console, args)
)


module.exports = ScribeLogger
