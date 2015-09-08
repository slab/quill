module.exports =
  isIE: (target = [10, 11]) ->
    target = [target] unless Array.isArray(target)
    return target.indexOf(document.documentMode) > -1

  isIOS: ->
    return /iPhone|iPad/i.test(navigator.userAgent)

  isMac: ->
    return /Mac/i.test(navigator.platform)
