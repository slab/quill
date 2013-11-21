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
    if console[fn].apply?
      console[fn].apply(console, args)
    else
      switch args.length
        when 1 then console[fn](args[0])
        when 2 then console[fn](args[0], args[1])
        when 3 then console[fn](args[0], args[1], args[2])
        when 4 then console[fn](args[0], args[1], args[2], args[3])
        when 5 then console[fn](args[0], args[1], args[2], args[3], args[4])
        else        console[fn](args[0], args[1], args[2], args[3], args[4], args.slice(5))
)


module.exports = ScribeLogger
