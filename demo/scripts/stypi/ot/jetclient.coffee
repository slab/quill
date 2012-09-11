#= require socket.io
#= require coffee/ot/jetstate
#= require coffee/network
#= require coffee/editor/presence

# TODO fix sendUpdate code diversion from update

class JetClient
  @DEFAULTS:
    latency: 0
    delegate: null
    resendInterval: 5000
    userId: Stypi.configs.userId

  # Socketio events
  @CONNECT        : "connect"
  @MESSAGE        : "message"
  @DISCONNECT     : "disconnect"
  @RECONNECT      : "reconnect"
  @RECONNECTING   : "reconnecting"

  # jetclient events
  @CONNECTED      : "connected"
  @DISCONNECTED   : "disconnected"
  @LEAVING        : "leaving"
  @LEFT           : "left"
  @WARNING        : "warning"

  # Node packet types
  @ACK:       "ack"
  @HANDSHAKE: "handshake"                       # We have joined
  @HANDSHAKE_RECONNECT: "handshake-reconnect"   # We lost connection, trying to reconnect
  @JOIN:      "user/join"                            # Another user has joined
  @LEAVE:     "user/leave"                           # Another user has left
  @SYNC:      "editor/sync"
  @UPDATE:    "editor/update"                          # Update to some jetstate

  constructor: (options = {}) ->
    @settings = $.extend({}, JetClient.DEFAULTS, options)
    @states = {}
    @status = JetClient.DISCONNECTED
    @inFlight = true
    if Stypi? && Stypi.utils? && Stypi.utils.inDevelopment()
      @packetHistory = {
        sent: []
        recieved: []
      }
    @network = Network
    @lastChangePacket = null
    if @settings.delegate?
      $(@settings.delegate).bind(JetClient.UPDATE, => 
        this.checkRunwayReady.call(this)
      )
    window.onbeforeunload = =>
      status = @status
      @status = JetClient.LEAVING
      setTimeout( =>
        @status = status if @status == JetClient.LEAVING
      , 5000)
      return if @inFlight then return "This document has unsaved changes." else undefined
    window.onunload = =>
      @status = JetClient.LEFT

  connect: (docId, @version = 0) ->
    this.initSocket(docId)
    @status = JetClient.CONNECTED
    this.sync()
    @docId = docId

  initSocket: (docId) ->
    if @docId?
      @network.off(@docId, JetClient.UPDATE)
      @network.off(@docId, JetClient.JOIN)
      @network.off(@docId, JetClient.LEAVE)

    @network.on(docId, JetClient.UPDATE, (packet, callback) =>
      this.remoteUpdate(packet)
    )
    @network.on(docId, JetClient.JOIN, (packet) =>
      this.remoteJoin(packet)
    )
    @network.on(docId, JetClient.LEAVE, (packet) =>
      this.remoteLeave(packet)
    )
    @network.on(docId, JetClient.RECONNECTING, (timeout, attempts) =>
      $(this).trigger(JetClient.DISCONNECT) if attempts == 1 && @status != JetClient.LEAVING && @status != JetClient.LEFT
    )
    @network.on(docId, JetClient.RECONNECT, (transport, attempts) =>
      $(this).trigger(JetClient.RECONNECT)
      @inFlight = false
      syncPacket = {type: JetClient.SYNC, version: @version}
      syncPacket['update'] = @lastChangePacket if @lastChangePacket?
      this.send(syncPacket, true, (response) => 
        this.syncCallback(response)
      )
    )

  sync: ->
    syncPacket = { type: "editor/sync", version: @version }
    this.send(syncPacket, true, (response) => 
      this.syncCallback(response)
    )

  addState: (state) ->
    console.assert(@states[state.type] == undefined, "Adding already existing state of type:", state.type)
    @states[state.type] = state

  whenConnected: (callback, params) ->
    if @status == JetClient.CONNECTED
      callback.call(this, params)
    else
      $(this).one(JetClient.CONNECTED, => 
        callback.call(this, params)
      )

  remoteJoin: (message) ->
    $(Stypi).trigger(Stypi.events.CLIENT_JOIN, message)

  remoteLeave: (message) ->
    $(Stypi).trigger(Stypi.events.CLIENT_LEAVE, message)

  # Handle update from server
  remoteUpdate: (message) ->
    if message.docId != @docId
      console.warn  "Got update with invalid docId", message.docId
      return
    console.assert(@version < message.version, "Version from server update #{message.version} is not newer than ours #{@version}!")
    @version = message.version
    # Assumes server sends changes in order they should be applied
    for change in message.changes
      console.assert(@states[change.type] != undefined, "remote updating state for something we are not tracking: " + change.type)
      @states[change.type].remoteUpdate(change.change, message.authorId)

  # If we can send a packet to server (and have a packet to send), send the packet
  checkRunwayReady: ->
    if @inFlight == false
      changes = []
      for type,state of @states
        ready = state.takeoff()
        changes.push({type: type, change: ready.change}) if ready
      if changes.length > 0
        this.sendUpdate(changes, (message) => 
          this.updateCallback(message)
        )
        @inFlight = true

  prepareChangePacket: (changes) ->
    return {
      type: JetClient.UPDATE
      version: @version
      changes: changes
      changeId: Math.floor(Math.random() * 4294967295)
    }

  syncCallback: (response) ->
    if !response.error? || response.error.length == 0
      if @states[JetState.TEXT]?
        @states[JetState.TEXT].reset("") if @version == 0
        for delta in response.deltas
          @states[JetState.TEXT].remoteUpdate(delta)
      Stypi.Presence.setUsers(response.users)
      state.land() for type,state of @states
      @version = response.version
      $(this).trigger(JetClient.CONNECTED)
      @inFlight = false
      this.checkRunwayReady()
    else
      console.warn(error) for error in response.error

  updateCallback: (message) ->
    if message.docId != @docId
      console.warn  "Got ack with invalid docId", message.docId
      return
    console.assert(@version < message.version || message.duplicate == true, "Version from server ack:#{message.version} is not newer than ours:#{@version}")
    @version = message.version
    if !message.duplicate
      state.land() for type,state of @states
    @inFlight = false
    @checkRunwayReady()

  # Helper for sending a generic packet
  send: (packet, priority, callback) ->
    if typeof priority != 'boolean'
      callback = priority
      priority = false
    console.assert(packet.type?, "Sending undefined packet type")
    @packetHistory.sent.push(packet) if Stypi? && Stypi.utils? && Stypi.utils.inDevelopment()
    setTimeout( =>
      retry = true
      while true
        try
          @network.send(@docId, packet.type, packet, priority, callback)
          break
        catch e
          break if retry == false
          retry = false
    , @settings.latency)

  # Creates update packet for changeset and sends, will resend until acknowledged
  sendUpdate: (changes, clientCallback) ->
    packet = @lastChangePacket = this.prepareChangePacket(changes)
    this.send(packet, (args...) =>
      @lastChangePacket = null
      clientCallback.apply(this, args)
    )

# So other files can actually use this library
window.JetClient = JetClient if window?
