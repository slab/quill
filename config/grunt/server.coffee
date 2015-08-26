_ = require('lodash')
browserify = require('browserify')
coffeeify = require('coffeeify')
fs = require('fs')
harp = require('harp')
proxy = require('http-proxy')
stylify = require('stylify')
stylus = require('stylus')
watchify = require('watchify')


FAVICON = new Buffer('iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACf0lEQVR42r2XS2gTURSG04K2VReilorEECVKiJk8EYuurIgPEFddKW4El1J3FbRUEOzKKuhKdy4Uql0H0UVxoYIKkoWCrxaKz1qKTayNYv0O3IEhzNzecSYz8HNnJpPz3XPm3HPuxGIRHNlstqdQKBwul8tDpVLpDprg/BV63hJgPB7vAngU0HX0BtCSh76FCs7n89sBjqJZDfS343whFHCxWNyEsZvojwb8jok9YKw77tUDwzF6CtW8wPw2zwQvMN51+f3jf4MzmcwaDIxpPBb4S8Zd6JHHM9UgIa/q4OgqObFDQq+Z4G3fcLJ77TLwBSZ4gueSACaXmeRZv2FfidGHGo9+MO7N5XJbDOBLRKjoN+Eu69Y0Xu80haO3mGzzAz+I/np4Pk3YMwLnesoALv8ZMIYnk8lOTTLNCNyyrK2mcPQerTKeAA8PenhRQ70+4T95Vbv9rvcZF0MNPD/EmNDBmeB3qYDSF7geAb7fb+KdcTMM/CTjBtXVnMAv6BY6ThfcHLjUYvS1i1ejKjJPm+7PomP8rT2UJiPvygVekXbL+X3Ne37BcwfCaDRXmuCT6XR6vWwqDJdaRVZQkAl8cPZxIrKHe9cM4Z9RX5DwF5qMnlcygY+TpN1Bwz/sMPpEst6rEjqTUBpRKAmIscfK6C/G07LuNfCG5AsrY10ocGr6ahsoPZtxzsPjRcYbUglD3VwSxn12b0efXMBfVWdMtGRbLXs4j7o/Ltttrle07CNCdT57xyNldkSWUyqV6ojiI6YN2D17wyi5EIvyIPTnFHyOUG+LFA60X9a50pGo4ZZ8QCjvL0Ud9m675kvzCK2V+qh4F9Ez+Xqhkm2MRXz8AzAAXszjgRshAAAAAElFTkSuQmCC', 'base64')


browserifyOps =
  cache: {}
  extensions: ['.js', '.coffee']
  fullPaths: true
  packageCache: {}
  standalone: 'Quill'


bundle = (watcher) ->
  return watcher.bundle().on('error', (err) ->
    console.error(err.name, err.message)
  )

serve = (connect, req, res, next) ->
  watchers = connect.watchers
  if req.url.indexOf('/karma') == 0 or req.url.indexOf('/base') == 0
    return connect.karmaProxy.web(req, res)
  url = if req.url.indexOf('/develop') == 0 then req.url.slice('/develop'.length) else req.url
  switch url
    when '/quill.js'
      res.setHeader('Content-Type', 'application/javascript')
      bundle(watchers['src']).pipe(res)
    when '/test/quill.js'
      res.setHeader('Content-Type', 'application/javascript')
      bundle(watchers['test']).pipe(res)
    when '/quill.snow.css', '/quill.base.css'
      theme = url.slice(7, 11)
      res.setHeader('Content-Type', 'text/css')
      fs.readFile("./src/themes/#{theme}/#{theme}.styl", (err, data) ->
        s = stylus(data.toString())
        s.include("./src/themes/#{theme}")
        s.define('url', stylus.url())
        s.render((err, css) ->
          console.error(err.name, err.message) if err?
          res.end(css)
        )
      )
    when '/favicon.ico', '/favicon.png'
      res.setHeader('Content-Type', 'image/png')
      res.end(FAVICON)
    else
      next()


module.exports = (grunt) ->
  grunt.config('connect',
    options:
      onCreateServer: (server, connect, options) ->
        connect.watchers = _.reduce(['src', 'test'], (watchers, type) ->
          file = if type == 'src' then './src/index.coffee' else './test/quill.coffee'
          b = browserify(file, browserifyOps)
          watchers[type] = watchify(b)
          watchers[type].transform(coffeeify)
          watchers[type].transform(stylify)
          watchers[type].on('update', _.bind(bundle, watchers[type], watchers[type]))
          bundle(watchers[type])
          return watchers
        , {})
        connect.karmaProxy = proxy.createProxyServer({ target: "http://localhost:#{grunt.config('karmaPort')}" })
      middleware: (connect, options, middlewares) ->
        middlewares.push(serve.bind(this, connect))
        middlewares.push(harp.mount(__dirname + '/../..'))
        return middlewares
      debug: true
    server:
      options:
        port: grunt.config('port')
        useAvailablePort: true
  )

  grunt.event.once('connect.server.listening', (host, port) ->
    grunt.config('port', port)
  )
