#= require underscore

Stypi.events ||= {}

_.extend(Stypi.events,
  CLIENT_JOIN   : 'presence-client-join'
  CLIENT_LEAVE  : 'presence-client-leave'
  USER_JOIN     : 'presence-user-join'
  USER_LEAVE    : 'presence-user-leave'
)

Presence =
  COLORS: [
    "#33cc33"
    "#0099ff"
    "#ff00ff"
    "#ff9933"
    "#00ff99"
    "#3366ff"
    "#ff3399"
    "#ffff00"
    "#33cccc"
    "#9966ff"
    "#ff5050"
    "#99ff33"
  ]
  
  users: {}


  init: ->
    $(Stypi).on(Stypi.events.CLIENT_JOIN, (event, message) ->
      Presence.addUser(message.user)
    ).on(Stypi.events.CLIENT_LEAVE, (event, message) ->
      Presence.removeUser({id: message.userId})
    )

  addUser: (user) ->
    if @users[user.id]?
      @users[user.id].online += 1
    else
      @users[user.id] = user
    $(Stypi).trigger(Stypi.events.USER_JOIN, user) if @users[user.id].online == 1

  clearUsers: ->
    for id,user of @users
      $(Stypi).trigger(Stypi.events.USER_LEAVE, user)
    @users = {}

  getColorIndexForUser: (id) ->
    return parseInt(id.substring(24 - 6), 16) % Presence.COLORS.length

  getColorForUser: (id) ->
    return Presence.COLORS[this.getColorIndexForUser(id)]

  getUserName: (userId) ->
    if userId == Stypi.configs.userId
      return "me"
    else if @users[userId]? && (@users[userId].full_name || @users[userId].username)
      return @users[userId].full_name || @users[userId].username
    else
      # Mirrors method in user model
      return "User " + (parseInt(userId.substring(24 - 12), 16) % 1000000)

  removeUser: (user) ->
    if !@users[user.id]?
      console.warn "A nonexistent user left:", user
      return
    @users[user.id].online -= 1
    if @users[user.id].online <= 0
      $(Stypi).trigger(Stypi.events.USER_LEAVE, user)
      delete @users[user.id]

  setUsers: (users = {}) ->
    Stypi.Presence.clearUsers()
    for id,user of users
      Stypi.Presence.addUser(user)


Stypi.Presence = Presence
