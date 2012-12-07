#= require diff_match_patch
#= require tandem

DIFF_DELETE = -1
DIFF_INSERT = 1
DIFF_EQUAL = 0

# Note: JetStates have precedence in the following order: Text > Cursor > Chat > Comment
# That means on an update message, text's update is always called before cursor's

class JetState
  @dmp: new diff_match_patch
  @CURSOR = "cursor"
  @TEXT = "text"
  @CHAT = "chat"
  @COMMENT = "comment"

  constructor: (delegate, client, initialState, sessionId) ->

  reset: (state) ->
    console.assert(false, "Should be implemented by decendents")

  localUpdate: (change) ->
    console.assert(false, "Should be implemented by decendents")

  remoteUpdate: (change, authorId) ->
    console.assert(false, "Should be implemented by decendents")

  takeoff: ->
    console.assert(false, "Should be implemented by decendents")

  land: ->
    console.assert(false, "Should be implemented by decendents")

  @applyDelta: (newDelta, insertFn, deleteFn, context = null) ->
    index = 0       # Stores where the last retain end was, so if we see another one, we know to delete
    offset = 0      # Tracks how many characters inserted to correctly offset new text
    for op in newDelta.ops
      authorId = if op.attributes? then op.attributes.authorId else 1
      if Tandem.Delta.isInsert(op)
        insertFn.call(context || insertFn, index + offset, op.value, authorId)
        offset += op.getLength()
      else if Tandem.Delta.isRetain(op)
        console.assert(op.start >= index, "Somehow op.start became smaller than index")
        if op.start > index
          deleteFn.call(context || deleteFn, index + offset, op.start + offset, authorId)
          offset -= (op.start - index)
        index = op.end
      else
        console.assert(false, "Unrecognized type in op", op)

    # If end of text was deleted
    if newDelta.endLength < newDelta.startLength + offset
      deleteFn.call(context || deleteFn, newDelta.endLength, newDelta.startLength + offset)
    return


class JetTextState extends JetState
  constructor: (@editor, @client, delta, @sessionId) ->
    delta.startLength = @editor.getLength()
    @type = JetState.TEXT
    @userId = @client.settings.userId
    this.reset(delta)

  reset: (delta) ->
    delta = if _.isString(delta) then Tandem.Delta.getInitial(delta) else Tandem.Delta.makeDelta(delta)
    delta.startLength = 1 if delta.startLength == 0
    @editor.applyDelta(delta)
    @arrived = delta
    @inFlight = Tandem.Delta.getIdentity(@arrived.endLength)
    @inLine = Tandem.Delta.getIdentity(@arrived.endLength)

  localUpdate: (delta) ->
    @inLine = @inLine.compose(delta)

  remoteUpdate: (delta, authorId) ->
    delta = Tandem.Delta.makeDelta(delta)
    delta.startLength = 1 if delta.startLength == 0
    flightDeltaFollows = delta.follows(@inFlight, false)
    textFollows = flightDeltaFollows.follows(@inLine, false)
    @arrived = @arrived.compose(delta)
    @inFlight = @inFlight.follows(delta, true)
    @inLine = @inLine.follows(flightDeltaFollows, true)
    @editor.applyDelta(textFollows)

  takeoff: ->
    console.assert(@inFlight?, "inFlight is", @inFlight, "at takeoff")
    console.assert(@inLine?, "inLine is", @inLine, "at takeoff")
    if (@inFlight.isIdentity() && !@inLine.isIdentity())
      @inFlight = @inLine
      @inLine = Tandem.Delta.getIdentity(@inFlight.endLength)
      return { change: @inFlight }
    return false

  land: ->
    @arrived = @arrived.compose(@inFlight)
    @inFlight = Tandem.Delta.getIdentity(@arrived.endLength)



class JetChatState extends JetState
  @COMPOSITION: "composition"
  @MAX_CHAT_HISTORY: 50

  constructor: (@chat, @client, @history, @sessionId) ->
    @type = JetState.CHAT
    $(@client).bind(JetChatState.COMPOSITION, (event, message) => this.remoteComposition.call(this, event, message))
    $(@client).bind(JetClient.LEAVE, (event, message) => this.chat.updateComposing("", message.userId))
    this.reset(@history)

  reset: (@history) ->
    @names = []
    @chat.clearMessages()
    for record in @history
      @chat.addMessage(record.text, record.authorId)

  localUpdate: (text) ->
    packet = @client.prepareChangePacket([{type: JetState.CHAT, change: text}])
    @client.send(packet)
    @history.push({text: text, authorId: @userId})
    @history.splice(0, 1) if @history.length > JetChatState.MAX_CHAT_HISTORY

  remoteUpdate: (text, authorId) ->
    @chat.addMessage(text, authorId)
    @history.push({text: text, authorId: authorId})
    @history.splice(0, 1) if @history.length > JetChatState.MAX_CHAT_HISTORY

  localComposition: (isComposing) ->
    @client.send({
      type: JetChatState.COMPOSITION
      composing: isComposing
    })

  remoteComposition: (event, message) ->
    @chat.updateComposing(message.composing, message.authorId)

  land: -> # Nothing to do

  takeoff: ->
    return false



# So other files can actually use this library
window.JetState = JetState if window?
window.JetTextState = JetTextState if window?
window.JetChatState = JetChatState if window?