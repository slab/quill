# Not require.js
# Allows other source files to use require.js style but allow coverage tests to separate files

window.Scribe = {}

window.require = (module) ->
  switch module
    when './scribe'     then return window.Scribe
    when '../scribe'    then return window.Scribe
    when 'tandem-core'  then return window.Tandem
    else                     return null

window.module = {
  exports: {}
}
