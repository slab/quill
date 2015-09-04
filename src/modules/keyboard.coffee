Quill = require('../quill')
clone = require('clone')
equal = require('deep-equal')
dom   = Quill.require('dom')
Delta = Quill.require('delta')


coerce = (hotkey) ->
  switch typeof hotkey
    when 'string'
      if Keyboard.hotkeys[hotkey.toUpperCase()]?
        hotkey = clone(Keyboard.hotkeys[hotkey.toUpperCase()], false)
      else if hotkey.length == 1
        hotkey = { key: hotkey }
      else
        return null
    when 'number'
      hotkey = { key: hotkey }
    when 'object'
      hotkey = clone(hotkey, false)
    else
      return null
  if typeof hotkey.key == 'string'
    hotkey.key = hotkey.key.toUpperCase().charCodeAt(0)
  return hotkey

match = (e, hotkey) ->
  metaKey = if dom.isMac() then e.metaKey else e.metaKey or e.ctrlKey
  return false if hotkey.metaKey != metaKey && hotkey.metaKey != null
  return false if hotkey.shiftKey != e.shiftKey && hotkey.shiftKey != null
  return false if hotkey.altKey != e.altKey && hotkey.altKey != null
  return true


class Keyboard
  # TODO allow passing in hotkeys in options
  constructor: (@quill, options = {}) ->
    @hotkeys = {}
    @quill.root.addEventListener('keydown', (e) =>
      which = e.which || e.keyCode
      range = @quill.getSelection()
      prevent = (@hotkeys[which] || []).reduce((prevent, hotkey) =>
        [key, callback] = hotkey
        return prevent unless match(e, key)
        # Does not prevent following handlers from being called, just DOM event default
        return callback(range, key, e) || prevent
      , false)
      e.preventDefault() if prevent
    )

  addHotkey: (hotkeys, callback) ->
    hotkeys = [hotkeys] unless Array.isArray(hotkeys)
    hotkeys.forEach((hotkey) =>
      hotkey = coerce(hotkey)
      if !hotkey?
        return @quill.emit(Quill.events.DEBUG, 'Attempted to add invalid hotkey', hotkey)
      @hotkeys[hotkey.key] ?= []
      @hotkeys[hotkey.key].push([hotkey, callback])
    )

  removeHotkey: (hotkeys, callback) ->
    hotkeys = [hotkeys] unless Array.isArray(hotkeys)
    return hotkeys.reduce((removed, query) =>
      query = coerce(query)
      if query? && @hotkeys[query.key]?
        @hotkeys[query.key] = @hotkeys[query.key].filter((target) ->
          if equal(target[0], query) && (!callback? || callback == target[1])
            removed.push(target[1])
            return false
          return true
        )
      return removed
    , [])


Quill.registerModule('keyboard', Keyboard)
module.exports = Keyboard
