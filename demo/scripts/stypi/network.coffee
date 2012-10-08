#= require async

# Manages network connections
#
# Creates socketio connection, reusable by many modules
# Handles configurations, authentication, and connectivity notifications


class Connection
  constructor: (@socket) ->
    @sendQueue = []
    @ready = false
    @stats = 
      sent      : {}
      recieved  : {}
      acked     : {}

  addStat: (type, route) ->
    @stats[type] = {} if !@stats[type]?
    @stats[type][route] = 0 if !@stats[type][route]?
    @stats[type][route] += 1

  setReady: ->
    async.until( =>
      return @sendQueue.length == 0
    , (callback) =>
      elem = @sendQueue.splice(0, 1)
      [route, packet, sendCallback] = elem[0]
      console.info "Sending from queue:", route, packet
      @socket.emit(route, packet, (args...) =>
        sendCallback.apply(this, args)
        callback()
      )
    , (err) => 
      @ready = true
    )

  send: (route, packet, priority, callback) ->
    if @ready
      console.info "Sending:", route, packet 
      @socket.emit(route, packet, callback)
    else
      console.info "Queued:", route, packet, priority
      if priority
        @sendQueue.unshift([route, packet, callback])
      else
        @sendQueue.push([route, packet, callback])



class NetworkClass
  @ACKED    : 'acked'
  @RECIEVED : 'recieved'
  @SENT     : 'sent'

  constructor: ->
    this.reset()

  authenticate: (docId) ->
    authPacket = 
      auth        : @auth
      docId       : docId
      referrer    : window.location.href      # In case access method is obscure url
      sessionId   : @sessionId
      userId      : @userId
    console.info "Connecting to", docId, authPacket
    if @connections[docId]?
      @connections[docId].socket.emit('auth', authPacket, (response) =>
        if !response.error || response.error.length == 0
          console.info "Connected!", response
          @connections[docId].setReady() if @connections[docId].ready == false
        else
          $(document).trigger("notify", ["error", "Could not access this document.", Infinity])
      )
    else
      console.warn "No connection to authenticate for docId", docId

  reset: ->
    @connections  = {}
    @unacked      = 0
    @auth         = Stypi.configs.auth
    @host         = Stypi.configs.nodeHost
    @sessionId    = Stypi.configs.sessionId
    @userId       = Stypi.configs.userId
    @options      = {
      'max reconnection attempts' : Infinity
      'reconnection limit'        : 30000
      'sync disconnect on unload' : false
      'secure'                    : true
      'port'                      : 443
      'force new connection'      : true
    }
    window.onunload = =>
      conn.socket.socket.disconnectSync() for conn in @connections

  getOrCreateConnection: (docId) ->
    if !@connections[docId]?
      socket = io.connect("https://#{@host}", @options)
      @connections[docId] = new Connection(socket)
      socket.on('reconnecting', =>
        @connections[docId].ready = false if  @connections[docId]?
      ).on('reconnect', =>
        this.authenticate(docId) if @connections[docId].ready == false
      )
      this.authenticate(docId)
    return @connections[docId]

  send: (docId, route, packet, priority, sendCallback) ->
    if typeof priority != 'boolean'
      sendCallback = priority
      priority = false
    connection = this.getOrCreateConnection(docId)
    connection.addStat(NetworkClass.SENT, route)
    @unacked += 1
    connection.send(route, packet, priority, (packet, callback) =>
      console.info "Callback", route, packet
      connection.addStat(NetworkClass.ACKED, route)
      @unacked -= 1
      sendCallback(packet, callback) if sendCallback?
    )

  on: (docId, route, onCallback) ->
    connection = this.getOrCreateConnection(docId)
    connection.socket.addListener(route, (args...) =>
      console.info "Got", route, args
      connection.addStat(NetworkClass.RECIEVED, route)
      onCallback.apply(this, args) if onCallback?
    )

  off: (docId, route) ->
    @connections[docId].socket.removeAllListeners(route) if @connections[docId]?



$(document).ready( ->
  window.NetworkClass = NetworkClass     # Necessary for tests to work
  window.Network = new NetworkClass()
)

