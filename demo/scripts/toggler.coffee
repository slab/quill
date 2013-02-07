# Purpose: Easy way to bind an element event to the toggling of a class of another element,
#          for example clicking on something toggles the active class of something else
#
# Usage: $("jqueryObj").toggler()
$.extend($.fn, {
  toggler: (method, others...) ->
    if (typeof method == 'object' || !method)
      methods.init.call(this, method)
    else
      $.error('You need to pass in an object or nothing to toggler')
    return this
})


DEFAULTS = {
  after: (event, hasClass) ->
  before: (event, willHaveClass) ->
  target: $()                      # elements that activate the context menu upon rightclick
  toggleClass: "active"
  toggleEvent: "click"
}


methods = {
  init: (options = {}) ->
    settings = $.extend({}, DEFAULTS, options)
    $(this).bind(settings.toggleEvent, (event) =>
      trigger = settings.before.call(this, event, !settings.target.hasClass(settings.toggleClass))
      if trigger != false
        settings.target.toggleClass(settings.toggleClass)
        settings.after.call(this, event, settings.target.hasClass(settings.toggleClass))
    )
}
