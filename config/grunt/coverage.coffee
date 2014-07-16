async = require('async')
fs = require('fs')
glob = require('glob')
istanbul = require('istanbul')
collector = new istanbul.Collector()
reporter = new istanbul.Reporter(null, '.coverage/merged')

module.exports = (grunt) ->
  grunt.registerTask('istanbul:instrument', ->
    grunt.util.spawn(
      cmd: './node_modules/.bin/istanbul'
      args: ['instrument', 'lib/', '-o', 'src/']
      opts:
        stdio: 'inherit'
    , this.async())
  )

  grunt.registerTask('istanbul:report', ->
    done = this.async()
    glob('.coverage/**/*.json', (er, files) ->
      async.each(files, (file, callback) ->
        fs.readFile(file, 'utf8', (err, data) ->
          collector.add(JSON.parse(data))
          callback()
        )
      , (err) ->
        reporter.add('html')
        reporter.write(collector, false, done)
      )
    )
  )
