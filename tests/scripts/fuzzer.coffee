ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('').concat(_.map([0..15], -> return "\n"))
NUM_OPERATIONS = 100

getRandomLength = ->
  rand = Math.random()
  if rand < 0.5
    return Math.floor(Math.random() * 10)
  else if rand < 0.7
    return Math.floor(Math.random() * 25)
  else if rand < 0.9
    return Math.floor(Math.random() * 50)
  else
    return Math.floor(Math.random() * 100)

getRandomOperation = (editor) ->
  index = Math.floor(Math.random() * (editor.doc.length + 1))
  length = getRandomLength() + 1
  rand = Math.random()
  if rand < 0.5
    return {op: 'insertAt', args: [index, getRandomString(length)]}
  length = Math.min(length, editor.doc.length - index)
  return null if length <= 0
  if rand < 0.75
    return {op: 'deleteAt', args: [index, length]}
  else
    attributes = ['bold', 'italic', 'strike', 'underline']
    attribute = attributes[Math.floor(Math.random() * attributes.length)]
    return {op: 'applyAttribute', args: [index, length, attribute, (Math.random() < 0.8)]}

getRandomString = (length) ->
  return _.map([0..(length - 1)], ->
    return ALPHABET[Math.floor(Math.random()*length)]
  ).join('')


$(document).ready( ->
  rangy.init()
  $editors = $('.editor-container')
  writer = new Tandem.Editor($editors.get(0))
  reader = new Tandem.Editor($editors.get(1))

  writer.on(writer.events.API_TEXT_CHANGE, (delta) ->
    reader.applyDelta(delta)
  )

  finishedFuzzing = _.after(NUM_OPERATIONS, ->
    _.defer( ->
      writerHtml = Tandem.Utils.cleanHtml(writer.doc.root.innerHTML)
      readerHtml = Tandem.Utils.cleanHtml(reader.doc.root.innerHTML)
      writerDelta = writer.getDelta()
      readerDelta = reader.getDelta()

      if writerHtml == readerHtml && _.isEqual(writerDelta, readerDelta)
        console.log "Fuzzing passed"
      else
        console.error "Fuzzing failed", writer, reader
    )
  )

  _.each([1..NUM_OPERATIONS], ->
    _.defer( ->
      operation = getRandomOperation(writer)
      if operation?
        writer[operation.op].apply(writer, operation.args)
      finishedFuzzing()
    )
  )
)
