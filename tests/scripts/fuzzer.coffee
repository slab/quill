ALPHABET = "abcdefghijklmnopqrstuvwxyz\n\n\n\n\n     ".split('')
NUM_OPERATIONS = 1000
attributes = _.extend({}, Tandem.Constants.SPAN_ATTRIBUTES, Tandem.Constants.TAG_ATTRIBUTES, Tandem.Constants.INDENT_ATTRIBUTES)
attributeKeys = _.keys(attributes)

getRandomLength = ->
  rand = Math.random()
  if rand < 0.1
    return 1
  else if rand < 0.6
    return Math.floor(Math.random() * 3)
  else if rand < 0.8
    return Math.floor(Math.random() * 5)
  else if rand < 0.9
    return Math.floor(Math.random() * 10)
  else
    return Math.floor(Math.random() * 50)

getRandomOperation = (editor) ->
  rand = Math.random()
  if rand < 0.2
    index = 0
  else if rand < 0.4
    index = editor.doc.length
  else
    index = Math.floor(Math.random() * editor.doc.length)
  length = getRandomLength() + 1
  rand = Math.random()
  if rand < 0.5
    return {op: 'insertAt', args: [index, getRandomString(length)]}
  length = Math.min(length, editor.doc.length - index)
  return null if length <= 0
  if rand < 0.75
    return {op: 'deleteAt', args: [index, length]}
  else
    attr = attributeKeys[Math.floor(Math.random() * attributeKeys.length)]
    value = attributes[attr][Math.floor(Math.random() * attributes[attr].length)]
    if attr == 'link' && value == true
      value = 'http://www.google.com'
    return {op: 'applyAttribute', args: [index, length, attr, value]}

getRandomString = (length) ->
  return _.map([0..(length - 1)], ->
    return ALPHABET[Math.floor(Math.random()*length)]
  ).join('')


$(document).ready( ->
  rangy.init()
  $editors = $('.editor-container')
  writer = new Tandem.Editor($editors.get(0))
  reader = new Tandem.Editor($editors.get(1))
  start = new Date()

  writer.on(Tandem.Editor.events.API_TEXT_CHANGE, (delta) ->
    reader.applyDelta(delta)
  )

  operationsLeft = NUM_OPERATIONS
  async.whilst( ->
    return operationsLeft > 0
  , (callback) ->
    operationsLeft -= 1
    _.defer( ->
      curHtml = writer.doc.root.innerHTML
      operation = getRandomOperation(writer)
      if operation?
        try
          writer[operation.op].apply(writer, operation.args)
        catch e
          console.error operation, curHtml
          callback(e)
          return
        writerDelta = writer.doc.toDelta()
        readerDelta = reader.doc.toDelta()
        if _.isEqual(writerDelta, readerDelta)
          callback(null)
        else
          console.error operation, curHtml
          console.error 'writer', writerDelta
          console.error 'reader', readerDelta
          callback('Editor diversion')
      else
        callback(null)
    )
  , (err) ->
    if err?
      console.error err
      console.error err.message if err.message?
      console.error err.stack if err.stack?
    else
      writerHtml = Tandem.Utils.cleanHtml(writer.doc.root.innerHTML)
      readerHtml = Tandem.Utils.cleanHtml(reader.doc.root.innerHTML)
      writerDelta = writer.getDelta()
      readerDelta = reader.getDelta()
      if writerHtml == readerHtml && _.isEqual(writerDelta, readerDelta)
        time = (new Date() - start) / 1000
        console.info "Fuzzing passed"
        console.info time, 'seconds'
        console.info (NUM_OPERATIONS / time).toPrecision(2), 'ops/sec'
      else
        console.error "Fuzzing failed", writer, reader
  )
)
