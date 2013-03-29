ALPHABET = "abcdefghijklmnopqrstuvwxyz\n\n\n\n\n\t\t\t   ".split('')
FORMATS = _.extend({}, Scribe.Constants.SPAN_FORMATS, Scribe.Constants.TAG_FORMATS)
NUM_OPERATIONS = 500

seed = Math.random()
console.info seed
Math.seedrandom(seed.toString())


$(document).ready( ->
  $editors = $('.editor-container')
  writer = new Scribe.Editor($editors.get(0))
  reader = new Scribe.Editor($editors.get(1))
  start = new Date()

  writer.on(Scribe.Editor.events.TEXT_CHANGE, (delta) ->
    reader.applyDelta(delta, false)
  )

  operationsLeft = NUM_OPERATIONS
  async.whilst( ->
    return operationsLeft > 0
  , (callback) ->
    operationsLeft -= 1
    _.defer( ->
      priorHTML = writer.root.innerHTML
      priorDelta = writer.getDelta()
      operation = Scribe.Debug.Test.getRandomOperation(writer, ALPHABET, FORMATS)
      if operation?
        try
          args = operation.args.concat([false])
          writer[operation.op].apply(writer, args)
          writerDelta = writer.getDelta()
          readerDelta = reader.getDelta()
          if writerDelta.isEqual(readerDelta)
            callback(null)
          else
            throw "Editor diversion after #{NUM_OPERATIONS - operationsLeft} operations"
        catch e
          console.error operation
          console.error 'Prior ', priorHTML
          console.error 'Writer', writer.root.innerHTML
          console.error 'Reader', reader.root.innerHTML
          console.error 'Prior ', priorDelta
          console.error 'Writer', writerDelta
          console.error 'Reader', readerDelta
          callback(e)
      else
        callback(null)
    )
  , (err) ->
    if err?
      console.error err
      console.error err.message if err.message?
      console.error err.stack if err.stack?
    else
      writerDelta = writer.getDelta()
      readerDelta = reader.getDelta()
      if writerDelta.isEqual(readerDelta)
        time = (new Date() - start) / 1000
        console.info "Fuzzing passed"
        console.info time, 'seconds'
        console.info (NUM_OPERATIONS / time).toPrecision(2), 'ops/sec'
      else
        console.error "Fuzzing failed", writer, reader
  )
)
