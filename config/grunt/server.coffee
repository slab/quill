_ = require('lodash')
coffeeify = require('coffeeify')
fs = require('fs')
harp = require('harp')
stylus = require('stylus')
watchify = require('watchify')


bundle = (w) ->
  return w.bundle({ standalone: 'Quill' })

serve = (connect, req, res, next) ->
  watchers = connect.watchers
  switch req.url
    when '/quill.js'
      res.setHeader('Content-Type', 'application/javascript')
      bundle(watchers['src']).pipe(res)
    when '/test/quill.js'
      res.setHeader('Content-Type', 'application/javascript')
      bundle(watchers['test']).pipe(res)
    when '/quill.snow.css'
      res.setHeader('Content-Type', 'text/css')
      fs.readFile('./src/themes/snow/snow.styl', (err, data) ->
        s = stylus(data.toString())
        s.include('./src/themes/snow')
        s.define('url', stylus.url())
        s.render((err, css) ->
          res.write(css)
          res.end()
        )
      )
    else
      next()


module.exports = (grunt) ->
  grunt.config('connect',
    options:
      onCreateServer: (server, connect, options) ->
        connect.watchers = _.reduce(['src', 'test'], (watchers, type) ->
          file = if type == 'src' then './src/index.coffee' else './test/quill.coffee'
          w = watchify(file, { extensions: ['.js', '.coffee'] })
          watchers[type] = w
          w.require('./.build/lodash.js', { expose: 'lodash' })
          w.transform(coffeeify)
          w.on('update', bundle.bind(this, w))
          bundle(w) if options.keepalive
          return watchers
        , {})
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
    grunt.config.set('port', port)
  )
